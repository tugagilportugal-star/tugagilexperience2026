import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken, logAction, canEdit } from '../../lib/admin/auth.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeCode(code: string) {
  return String(code || '').trim().toUpperCase();
}

function normalizeEmail(email?: string | null) {
  const value = String(email || '').trim().toLowerCase();
  return value || null;
}

// =========================
// EVENTO (obrigatório: ?event_id=<uuid>; nunca se usa event_id do body)
// =========================
type AdminEvent = { id: string; slug: string; name: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveEvent(req: VercelRequest): Promise<{ event: AdminEvent } | { error: string }> {
  const raw = (req.query as any).event_id;
  const eventId = String(Array.isArray(raw) ? raw[0] ?? '' : raw ?? '').trim();

  if (!eventId) return { error: 'event_id obrigatório: escolhe o evento a administrar.' };
  if (!UUID_RE.test(eventId)) return { error: 'event_id inválido (tem de ser um uuid).' };

  const { data, error } = await supabase
    .from('events')
    .select('id, slug, name')
    .eq('id', eventId)
    .maybeSingle();

  if (error) return { error: `Não foi possível validar o evento: ${error.message}` };
  if (!data) return { error: 'Evento inexistente para o event_id indicado.' };
  return { event: data as AdminEvent };
}

// Identificação do evento nos detalhes do registo de auditoria
function eventLog(event: AdminEvent) {
  return { event_id: event.id, event_slug: event.slug, event_name: event.name };
}

const NOT_IN_EVENT = 'Cupão não encontrado neste evento.';

function parseBody(req: VercelRequest) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await verifyAdminToken(req.headers.authorization || '');
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    // Sem evento válido não se lê nem se escreve nada.
    const resolved = await resolveEvent(req);
    if ('error' in resolved) {
      return res.status(400).json({ error: resolved.error, message: resolved.error });
    }
    const event = resolved.event;

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
      const {
        code,
        email,
        discount_percent,
        discount_amount,
        recording_only = false,
        single_use = true,
        active = true,
        expires_at,
      } = parseBody(req) || {};

      const normalizedCode = normalizeCode(code);
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedCode) {
        return res.status(400).json({ error: 'Código é obrigatório.' });
      }

      const hasPercent = discount_percent !== undefined && discount_percent !== '' && discount_percent !== null;
      const hasAmount = discount_amount !== undefined && discount_amount !== '' && discount_amount !== null;

      if (!hasPercent && !hasAmount) {
        return res.status(400).json({ error: 'Indica desconto em % ou valor fixo (€).' });
      }

      let discountPercent: number | null = null;
      let discountAmountCents: number | null = null;

      if (hasPercent) {
        discountPercent = Number(discount_percent);
        if (!Number.isFinite(discountPercent) || discountPercent < 1 || discountPercent > 100) {
          return res.status(400).json({ error: 'Desconto (%) deve estar entre 1 e 100.' });
        }
      }
      if (hasAmount) {
        discountAmountCents = Math.round(Number(discount_amount) * 100);
        if (!Number.isFinite(discountAmountCents) || discountAmountCents < 1) {
          return res.status(400).json({ error: 'Valor de desconto deve ser positivo.' });
        }
      }

      const { data, error } = await supabase
        .from('discount_coupons')
        .insert({
          code: normalizedCode,
          email: normalizedEmail,
          discount_percent: discountPercent,
          discount_amount: discountAmountCents,
          recording_only: Boolean(recording_only),
          single_use: Boolean(single_use),
          active: Boolean(active),
          expires_at: expires_at || null,
          event_id: event.id,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await logAction(admin.email, 'criar_cupao', 'coupon', data.id, { ...eventLog(event), code: data.code });
      return res.status(201).json(data);
    }

    if (req.method === 'PATCH') {
      if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
      const {
        id,
        code,
        email,
        discount_percent,
        discount_amount,
        recording_only,
        single_use,
        active,
        expires_at,
      } = parseBody(req) || {};

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório.' });
      }

      const payload: Record<string, unknown> = {};

      if (code !== undefined) payload.code = normalizeCode(code);
      if (email !== undefined) payload.email = normalizeEmail(email);
      if (discount_percent !== undefined) {
        if (discount_percent === null || discount_percent === '') {
          payload.discount_percent = null;
        } else {
          const discount = Number(discount_percent);
          if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
            return res.status(400).json({ error: 'Desconto (%) deve estar entre 1 e 100.' });
          }
          payload.discount_percent = discount;
        }
      }
      if (discount_amount !== undefined) {
        if (discount_amount === null || discount_amount === '') {
          payload.discount_amount = null;
        } else {
          const amountCents = Math.round(Number(discount_amount) * 100);
          if (!Number.isFinite(amountCents) || amountCents < 1) {
            return res.status(400).json({ error: 'Valor de desconto deve ser positivo.' });
          }
          payload.discount_amount = amountCents;
        }
      }
      if (recording_only !== undefined) payload.recording_only = Boolean(recording_only);
      if (single_use !== undefined) payload.single_use = Boolean(single_use);
      if (active !== undefined) payload.active = Boolean(active);
      if (expires_at !== undefined) payload.expires_at = expires_at || null;

      const { data: before } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('id', id)
        .eq('event_id', event.id)
        .maybeSingle();

      if (!before) {
        return res.status(404).json({ error: NOT_IN_EVENT, message: NOT_IN_EVENT });
      }

      const { data, error } = await supabase
        .from('discount_coupons')
        .update(payload)
        .eq('id', id)
        .eq('event_id', event.id)
        .select()
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!data) {
        return res.status(404).json({ error: NOT_IN_EVENT, message: NOT_IN_EVENT });
      }

      const changedKeys = Object.keys(payload);
      const beforeSnapshot = Object.fromEntries(changedKeys.map(k => [k, (before as any)?.[k]]));
      await logAction(admin.email, 'editar_cupao', 'coupon', data.id, { ...eventLog(event), code: before?.code, before: beforeSnapshot, after: payload });
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
      const { id } = parseBody(req) || {};

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório.' });
      }

      const { data: before } = await supabase
        .from('discount_coupons')
        .select('code')
        .eq('id', id)
        .eq('event_id', event.id)
        .maybeSingle();

      if (!before) {
        return res.status(404).json({ error: NOT_IN_EVENT, message: NOT_IN_EVENT });
      }

      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', id)
        .eq('event_id', event.id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await logAction(admin.email, 'eliminar_cupao', 'coupon', id, { ...eventLog(event), code: before.code });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
