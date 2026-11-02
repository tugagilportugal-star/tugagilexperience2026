-- =====================================================================
-- Cupão usado em cada order
-- Correr uma vez no SQL Editor do Supabase. É idempotente.
--
-- Até aqui o cupão só ficava nos metadados da sessão do Stripe (e, para
-- cupões single_use, em discount_coupons.used_by_order_id). Passa a ficar
-- também na própria order, para qualquer tipo de cupão.
--   coupon_id             → discount_coupons.id (sem FK: o cupão pode ser apagado)
--   coupon_code           → código tal como foi aplicado
--   coupon_discount_cents → desconto total da order, em cêntimos
-- As orders antigas são preenchidas a partir do Stripe pelo admin
-- (POST /api/admin/backfill-coupons).
-- =====================================================================

alter table public.orders
  add column if not exists coupon_id uuid,
  add column if not exists coupon_code text,
  add column if not exists coupon_discount_cents integer;

create index if not exists orders_coupon_code_idx
  on public.orders (coupon_code)
  where coupon_code is not null;
