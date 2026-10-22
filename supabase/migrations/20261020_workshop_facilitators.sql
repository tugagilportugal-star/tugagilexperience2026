-- =====================================================================
-- Workshops com vários facilitadores
-- Correr uma vez no SQL Editor do Supabase. É idempotente: pode ser
-- corrido de novo sem duplicar nada.
--
-- Cada workshop passa a ter uma lista `facilitators` (jsonb):
--   [{ "name": "...", "role": "...", "bio": "...", "photo_url": "..." }, ...]
-- As colunas antigas facilitator_* ficam na tabela (não são apagadas),
-- mas a aplicação deixa de as usar.
-- =====================================================================

alter table public.workshops
  add column if not exists facilitators jsonb not null default '[]'::jsonb;

-- Copiar o facilitador único que já existia para a nova lista
update public.workshops
   set facilitators = jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
         'name',      facilitator_name,
         'role',      facilitator_role,
         'bio',       facilitator_bio,
         'photo_url', facilitator_photo_url
       )))
 where facilitators = '[]'::jsonb
   and nullif(trim(facilitator_name), '') is not null;
