-- =====================================================================
-- Vários eventos na mesma base (RSG Lisbon 2026, TugÁgil Experience 2026, ...)
-- Correr uma vez no SQL Editor do Supabase (test e prod). É idempotente.
--
-- Cada lote, workshop, encomenda, bilhete, cupão e lead passa a pertencer a
-- um evento (event_id). O site público usa a variável EVENT_SLUG para saber
-- qual é o seu evento; o admin escolhe o evento num seletor.
--
-- Dados existentes: o que foi criado antes de 2026-06-01 fica no RSG Lisbon
-- 2026 (evento a 21/05/2026); o que foi criado depois fica no TugÁgil
-- Experience 2026. Workshops são sempre do Experience.
-- =====================================================================

-- 1) Tabela de eventos ---------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text        not null unique,
  name        text        not null,
  starts_on   date,
  venue       text,
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

insert into public.events (slug, name, starts_on, venue) values
  ('rsg-lisbon-2026',          'RSG Lisbon 2026',          '2026-05-21', 'Auditório Alto dos Moinhos, Lisboa'),
  ('tugagil-experience-2026',  'TugÁgil Experience 2026',  '2026-11-21', 'ISLA Gaia, Vila Nova de Gaia')
on conflict (slug) do nothing;

-- 2) event_id nas tabelas do evento + preenchimento dos dados existentes ----
do $$
declare
  v_rsg uuid := (select id from public.events where slug = 'rsg-lisbon-2026');
  v_exp uuid := (select id from public.events where slug = 'tugagil-experience-2026');
  t text;
  has_created_at boolean;
begin
  foreach t in array array['ticket_types', 'orders', 'tickets', 'discount_coupons', 'leads', 'workshops'] loop
    execute format(
      'alter table public.%I add column if not exists event_id uuid references public.events(id)', t);
    execute format(
      'create index if not exists %I on public.%I (event_id)', t || '_event_id_idx', t);

    if t = 'workshops' then
      execute format('update public.%I set event_id = %L where event_id is null', t, v_exp);
      continue;
    end if;

    select exists (
      select 1 from information_schema.columns
       where table_schema = 'public' and table_name = t and column_name = 'created_at'
    ) into has_created_at;

    if has_created_at then
      execute format(
        'update public.%I set event_id = case when created_at < %L then %L::uuid else %L::uuid end where event_id is null',
        t, '2026-06-01', v_rsg, v_exp);
    else
      execute format('update public.%I set event_id = %L where event_id is null', t, v_rsg);
    end if;
  end loop;
end $$;

-- Bilhetes seguem sempre o evento da sua encomenda (corrige diferenças de data)
update public.tickets t
   set event_id = o.event_id
  from public.orders o
 where t.order_id = o.id
   and t.event_id is distinct from o.event_id;

-- 3) Obrigatório daqui para a frente (leads pode ficar sem evento) --------
alter table public.ticket_types     alter column event_id set not null;
alter table public.workshops        alter column event_id set not null;
alter table public.orders           alter column event_id set not null;
alter table public.tickets          alter column event_id set not null;
alter table public.discount_coupons alter column event_id set not null;

-- 3b) Um lote ativo por EVENTO (antes: um lote ativo na tabela inteira) ----
drop index if exists public.ticket_types_single_active_true;
create unique index if not exists ticket_types_single_active_per_event
  on public.ticket_types (event_id)
  where active is true;

-- 4) consume_ticket_type: rotação de lotes só dentro do mesmo evento ------
-- Antes: ao esgotar um lote, desativava TODOS os lotes ativos da base e podia
-- ativar um lote de outro evento. Agora tudo fica restrito ao event_id do lote.
create or replace function public.consume_ticket_type(p_ticket_type_id uuid, p_qty integer default 1)
 returns jsonb
 language plpgsql
as $function$
declare
  cur record;
  new_sold int;
  next_id uuid;
begin
  -- lock do lote atual para evitar corrida
  select *
    into cur
  from public.ticket_types
  where id = p_ticket_type_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'ticket_type_not_found');
  end if;

  new_sold := coalesce(cur.quantity_sold, 0) + coalesce(p_qty, 1);

  update public.ticket_types
  set quantity_sold = new_sold,
      active = case
        when coalesce(cur.quantity_total, 0) > 0 and new_sold >= coalesce(cur.quantity_total, 0)
          then false
        else cur.active
      end
  where id = cur.id;

  -- se esgotou, ativa o próximo lote do MESMO evento por sort_order
  if coalesce(cur.quantity_total, 0) > 0 and new_sold >= coalesce(cur.quantity_total, 0) then
    select tt.id
      into next_id
    from public.ticket_types tt
    where tt.id <> cur.id
      and tt.event_id = cur.event_id
      and coalesce(tt.quantity_total, 0) > coalesce(tt.quantity_sold, 0)
    order by
      tt.sort_order asc nulls last,
      tt.created_at asc
    limit 1;

    if next_id is not null then
      update public.ticket_types set active = false where active is true and event_id = cur.event_id;
      update public.ticket_types set active = true where id = next_id;
    end if;
  end if;

  return jsonb_build_object(
    'ok', true,
    'current_id', cur.id,
    'event_id', cur.event_id,
    'new_sold', new_sold,
    'sold_out', (coalesce(cur.quantity_total, 0) > 0 and new_sold >= coalesce(cur.quantity_total, 0)),
    'next_id', next_id
  );
end;
$function$;

-- 5) Confirmação: contagens por evento -----------------------------------
select e.name,
  (select count(*) from public.ticket_types     x where x.event_id = e.id) as lotes,
  (select count(*) from public.workshops        x where x.event_id = e.id) as workshops,
  (select count(*) from public.orders           x where x.event_id = e.id) as encomendas,
  (select count(*) from public.tickets          x where x.event_id = e.id) as bilhetes,
  (select count(*) from public.discount_coupons x where x.event_id = e.id) as cupoes,
  (select count(*) from public.leads            x where x.event_id = e.id) as leads
from public.events e
order by e.starts_on;
