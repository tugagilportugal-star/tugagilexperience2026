-- =====================================================================
-- Workshops adicionais ao bilhete (TugÁgil Experience 2026)
-- Correr uma vez no SQL Editor do Supabase. É idempotente: pode ser
-- corrido de novo sem duplicar nada.
--
-- Regras:
--  * Cada participante (ticket) pode ter no máximo 1 workshop (ou nenhum).
--  * Cada workshop tem capacidade própria.
--  * O preço do workshop é definido por lote (ticket_types.workshop_price)
--    e é igual para todos os workshops dentro do mesmo lote.
-- =====================================================================

-- 1) Tabela de workshops ------------------------------------------------
create table if not exists public.workshops (
  id                 uuid primary key default gen_random_uuid(),
  title              text        not null,
  short_description  text,                         -- texto curto do cartão
  description        text,                         -- "Sobre o workshop" no pop-up
  takeaways          text[]      not null default '{}', -- "O que vais levar"
  facilitator_name   text,
  facilitator_role   text,                         -- cargo · empresa
  facilitator_bio    text,
  facilitator_photo_url text,
  image_url          text,                         -- imagem de topo do pop-up
  starts_at          text,                         -- ex.: '14:00'
  ends_at            text,                         -- ex.: '17:30'
  room               text,
  level              text,                         -- ex.: 'Intermédio'
  capacity           integer     not null check (capacity >= 0),
  sold               integer     not null default 0 check (sold >= 0),
  active             boolean     not null default true,
  sort_order         integer     not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Só a API (service role) acede; o browser nunca lê esta tabela diretamente.
alter table public.workshops enable row level security;

-- 2) Preço do workshop por lote (em cêntimos, como ticket_types.price) ---
alter table public.ticket_types
  add column if not exists workshop_price integer not null default 0
  check (workshop_price >= 0);

-- 3) Workshop escolhido por participante -------------------------------
alter table public.tickets
  add column if not exists workshop_id uuid references public.workshops(id) on delete set null;

create index if not exists tickets_workshop_id_idx on public.tickets (workshop_id);

-- 4) Descontar vagas de forma atómica ----------------------------------
-- Chamado pelo webhook depois do pagamento confirmado. Como o pagamento já
-- aconteceu, nunca falha por falta de vagas: incrementa sempre e devolve
-- over_capacity = true para o webhook alertar os admins.
create or replace function public.consume_workshop(p_workshop_id uuid, p_qty integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.workshops%rowtype;
begin
  if p_qty is null or p_qty <= 0 then
    raise exception 'p_qty must be positive';
  end if;

  update public.workshops
     set sold = sold + p_qty,
         updated_at = now()
   where id = p_workshop_id
  returning * into v_row;

  if not found then
    raise exception 'workshop % not found', p_workshop_id;
  end if;

  return jsonb_build_object(
    'workshop_id',   v_row.id,
    'sold',          v_row.sold,
    'capacity',      v_row.capacity,
    'remaining',     greatest(v_row.capacity - v_row.sold, 0),
    'over_capacity', v_row.sold > v_row.capacity
  );
end;
$$;

-- A função só deve ser chamada pela API (service role).
revoke all on function public.consume_workshop(uuid, integer) from public, anon, authenticated;
grant execute on function public.consume_workshop(uuid, integer) to service_role;
