// Cupão aplicado numa compra, lido dos metadados da sessão do Stripe
// (escritos em api/checkout.ts). Usado pelo webhook ao gravar a order e
// pelo preenchimento das orders antigas no admin.

export type OrderCoupon = {
  coupon_id: string | null;
  coupon_code: string;
  coupon_discount_cents: number | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function couponFromSessionMetadata(
  meta: Record<string, string | undefined> | null | undefined,
): OrderCoupon | null {
  if (!meta) return null;
  const code = String(meta.coupon_code || '').trim().toUpperCase();
  if (!code) return null;

  const id = String(meta.coupon_id || '').trim();

  // Desconto = preço sem cupão - preço pago. O cupão só se aplica ao bilhete,
  // por isso os workshops entram dos dois lados e anulam-se.
  // Sessões antigas sem original_price/final_price ficam sem valor.
  let discount: number | null = null;
  const original = Number(meta.original_price);
  const final = Number(meta.final_price);
  if (meta.original_price && meta.final_price && Number.isFinite(original) && Number.isFinite(final)) {
    const qty = Number(meta.participants_count || 1) || 1;
    const workshops = String(meta.ws || '').split(',').filter(s => s.trim()).length;
    const workshopPrice = Number(meta.workshop_price || 0) || 0;
    discount = Math.max(0, original * qty + workshopPrice * workshops - final);
  }

  return {
    coupon_id: UUID_RE.test(id) ? id : null,
    coupon_code: code,
    coupon_discount_cents: discount,
  };
}
