import type { VercelRequest } from '@vercel/node';
import type { SupabaseClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type OrderEventCheck = {
  ok: boolean;
  status?: number;
  message?: string;
  event?: { id: string; slug: string; name: string };
};

// Ações do admin sobre uma encomenda (fatura, estorno, nota de crédito, reenvio de email):
// exigem ?event_id=<uuid> e só atuam se a encomenda pertencer a esse evento.
export async function checkOrderInEvent(
  req: VercelRequest,
  supabase: SupabaseClient,
  orderId: string
): Promise<OrderEventCheck> {
  const raw = (req.query as any)?.event_id;
  const eventId = String(Array.isArray(raw) ? raw[0] : raw || '').trim();

  if (!eventId) return { ok: false, status: 400, message: 'event_id obrigatório: escolhe o evento a administrar.' };
  if (!UUID_RE.test(eventId)) return { ok: false, status: 400, message: 'event_id inválido (tem de ser um uuid).' };

  const { data: event } = await supabase
    .from('events')
    .select('id, slug, name')
    .eq('id', eventId)
    .maybeSingle();

  if (!event) return { ok: false, status: 400, message: 'Evento inexistente para o event_id indicado.' };

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (!order) return { ok: false, status: 404, message: `Encomenda não encontrada no evento ${event.name}.` };

  return { ok: true, event };
}
