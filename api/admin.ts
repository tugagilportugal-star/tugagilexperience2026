import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken, logAction, canEdit } from '../lib/admin/auth.js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function getRouteParts(req: VercelRequest): string[] {
  const q = (req.query as any).route;
  if (!q) return [];

  const rawParts = Array.isArray(q) ? q : [q];

  return rawParts
    .flatMap((part) => String(part).split('/'))
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseBody(req: VercelRequest) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

function normalizeTicketTypeInput(body: any, partial = false) {
  const next: Record<string, unknown> = {};

  if (!partial || body?.name !== undefined) {
    const name = String(body?.name ?? '').trim();
    if (!name) {
      return { error: 'name obrigatório' };
    }
    next.name = name;
  }

  if (!partial || body?.price !== undefined) {
    const price = Number(body?.price);
    if (!Number.isFinite(price) || price < 0) {
      return { error: 'price inválido' };
    }
    next.price = price;
  }

  // Preço do workshop neste lote (cêntimos). Opcional: se não vier no POST fica o default 0 da BD.
  if (body?.workshop_price !== undefined) {
    const workshopPrice = Number(body?.workshop_price ?? 0);
    if (!Number.isInteger(workshopPrice) || workshopPrice < 0) {
      return { error: 'workshop_price inválido' };
    }
    next.workshop_price = workshopPrice;
  }

  if (!partial || body?.currency !== undefined) {
    const currency = String(body?.currency ?? 'eur').trim().toLowerCase();
    if (!currency) {
      return { error: 'currency obrigatória' };
    }
    next.currency = currency;
  }

  if (!partial || body?.quantity_total !== undefined) {
    const quantityTotal = Number(body?.quantity_total);
    if (!Number.isInteger(quantityTotal) || quantityTotal < 0) {
      return { error: 'quantity_total inválido' };
    }
    next.quantity_total = quantityTotal;
  }

  if (!partial || body?.active !== undefined) {
    next.active = Boolean(body?.active);
  }

  if (!partial || body?.sort_order !== undefined) {
    const sortOrder = Number(body?.sort_order ?? 0);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return { error: 'sort_order inválido' };
    }
    next.sort_order = sortOrder;
  }

  return { data: next };
}

const WORKSHOP_TEXT_FIELDS = [
  'short_description',
  'description',
  'image_url',
  'starts_at',
  'ends_at',
  'room',
  'level',
] as const;

function normalizeTakeaways(value: unknown): string[] | null {
  if (value === null || value === undefined) return [];
  // Aceita array de strings ou texto com um item por linha
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/\r?\n/)
      : null;
  if (!raw) return null;
  if (raw.some((item) => typeof item !== 'string')) return null;
  return raw.map((item) => String(item).trim()).filter(Boolean);
}

const FACILITATOR_FIELDS = ['name', 'role', 'bio', 'photo_url'] as const;

// Lista de facilitadores; ignora entradas sem nome
function normalizeFacilitators(value: unknown): Record<string, string>[] | null {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) return null;
  if (value.some((item) => !item || typeof item !== 'object')) return null;
  return value
    .map((item: any) => {
      const f: Record<string, string> = {};
      for (const field of FACILITATOR_FIELDS) {
        const v = item[field] == null ? '' : String(item[field]).trim();
        if (v) f[field] = v;
      }
      return f;
    })
    .filter((f) => f.name);
}

// Nunca aceita `sold` do cliente: é gerido pelo sistema (consume_workshop).
function normalizeWorkshopInput(body: any, partial = false) {
  const next: Record<string, unknown> = {};

  if (!partial || body?.title !== undefined) {
    const title = String(body?.title ?? '').trim();
    if (!title) {
      return { error: 'title obrigatório' };
    }
    next.title = title;
  }

  for (const field of WORKSHOP_TEXT_FIELDS) {
    if (body?.[field] !== undefined) {
      const value = body[field] === null ? '' : String(body[field]).trim();
      next[field] = value || null;
    }
  }

  if (!partial || body?.takeaways !== undefined) {
    const takeaways = normalizeTakeaways(body?.takeaways);
    if (!takeaways) {
      return { error: 'takeaways inválido' };
    }
    next.takeaways = takeaways;
  }

  if (!partial || body?.facilitators !== undefined) {
    const facilitators = normalizeFacilitators(body?.facilitators);
    if (!facilitators) {
      return { error: 'facilitators inválido' };
    }
    next.facilitators = facilitators;
  }

  if (!partial || body?.capacity !== undefined) {
    const capacity = Number(body?.capacity);
    if (body?.capacity === null || body?.capacity === '' || !Number.isInteger(capacity) || capacity < 0) {
      return { error: 'capacity inválida' };
    }
    next.capacity = capacity;
  }

  if (!partial || body?.active !== undefined) {
    next.active = body?.active === undefined ? true : Boolean(body?.active);
  }

  if (!partial || body?.sort_order !== undefined) {
    const sortOrder = Number(body?.sort_order ?? 0);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return { error: 'sort_order inválido' };
    }
    next.sort_order = sortOrder;
  }

  return { data: next };
}

function withWorkshopRemaining(row: any) {
  const capacity = Number(row?.capacity ?? 0);
  const sold = Number(row?.sold ?? 0);
  return { ...row, remaining: Math.max(0, capacity - sold) };
}

// =========================
// EVENTO (obrigatório nos recursos ligados a evento)
// =========================
type AdminEvent = {
  id: string;
  slug: string;
  name: string;
  starts_on: string | null;
  venue: string | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Recursos cujos dados pertencem a um evento: exigem ?event_id=<uuid>.
const EVENT_SCOPED_RESOURCES = new Set(['leads', 'ticket-types', 'workshops', 'orders', 'tickets']);

// Lê ?event_id= e confirma que o evento existe. Nunca usa event_id do body.
async function resolveEvent(req: VercelRequest): Promise<{ event: AdminEvent } | { error: string }> {
  const raw = (req.query as any).event_id;
  const eventId = String(Array.isArray(raw) ? raw[0] ?? '' : raw ?? '').trim();

  if (!eventId) {
    return { error: 'event_id obrigatório: escolhe o evento a administrar.' };
  }
  if (!UUID_RE.test(eventId)) {
    return { error: 'event_id inválido (tem de ser um uuid).' };
  }

  const { data, error } = await supabase
    .from('events')
    .select('id, slug, name, starts_on, venue')
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

const NOT_IN_EVENT = 'Registo não encontrado neste evento.';

// Base de produção, só para "Enviar para produção". As variáveis PROD_* existem
// apenas no ambiente Preview da Vercel; em produção (ou se apontarem para a
// própria base) o envio fica indisponível.
function prodSupabase() {
  const url = process.env.PROD_SUPABASE_URL;
  const key = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === process.env.SUPABASE_URL) return null;
  return createClient(url, key);
}

// key: coluna usada para encontrar o registo em produção quando o id não existe lá.
// counters: colunas de vendas/uso que nunca são copiadas (ficam as de produção).
const PROMOTE_TABLES: Record<string, { table: string; key: string; counters: string[] }> = {
  'ticket-types': { table: 'ticket_types', key: 'name', counters: ['quantity_sold'] },
  workshops: { table: 'workshops', key: 'title', counters: ['sold'] },
  coupons: { table: 'discount_coupons', key: 'code', counters: ['used_at', 'used_by_order_id'] },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const admin = await verifyAdminToken(req.headers.authorization || '');
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  const parts = getRouteParts(req);
  const resource = parts[0] || '';
  const id = parts[1] || null;

  try {
    // =========================
    // EVENTS (lista para o seletor do admin)
    // =========================
    if (resource === 'events') {
      if (req.method !== 'GET' || id) return res.status(405).json({ message: 'Method not allowed' });
      const { data, error } = await supabase
        .from('events')
        .select('id, slug, name, starts_on, venue')
        .order('starts_on', { ascending: false, nullsFirst: false });
      if (error) return res.status(500).json({ message: error.message });
      return res.status(200).json(data || []);
    }

    // Recursos ligados a evento: sem evento válido não se lê nem se escreve nada.
    let event: AdminEvent | null = null;
    if (EVENT_SCOPED_RESOURCES.has(resource)) {
      const resolved = await resolveEvent(req);
      if ('error' in resolved) return res.status(400).json({ message: resolved.error });
      event = resolved.event;
    }

    // =========================
    // LEADS
    // =========================
    if (resource === 'leads' && event) {
      if (req.method === 'GET' && !id) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('event_id', event.id)
          .neq('status', 'Deleted')
          .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json(data || []);
      }

      if (req.method === 'PATCH' && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const body = parseBody(req);
        const status = body?.status;

        if (!status) {
          return res.status(400).json({ message: 'status obrigatório' });
        }

        const { data: before } = await supabase
          .from('leads').select('status').eq('id', id).eq('event_id', event.id).maybeSingle();
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        const { data, error } = await supabase
          .from('leads')
          .update({ status })
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });
        await logAction(admin.email, 'atualizar_lead', 'lead', id, { ...eventLog(event), before: { status: before?.status }, after: { status } });
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE' && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });

        const { data: before } = await supabase
          .from('leads').select('status').eq('id', id).eq('event_id', event.id).maybeSingle();
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        const { data, error } = await supabase
          .from('leads')
          .update({ status: 'Deleted' })
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });
        await logAction(admin.email, 'eliminar_lead', 'lead', id, { ...eventLog(event), before: { status: before?.status }, after: { status: 'Deleted' } });
        return res.status(200).json(data);
      }

      return res.status(405).json({ message: 'Method not allowed' });
    }

    // =========================
    // TICKET TYPES (LOTES)
    // =========================
    if (resource === 'ticket-types' && event) {
      if (req.method === 'GET' && !id) {
        const { data, error } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('event_id', event.id)
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json(data || []);
      }

      if (req.method === 'POST' && !id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const body = parseBody(req);
        const normalized = normalizeTicketTypeInput(body, false);

        if ('error' in normalized) {
          return res.status(400).json({ message: normalized.error });
        }

        // event_id vem sempre do query param (nunca do body)
        const payload = {
          ...normalized.data,
          quantity_sold: 0,
          event_id: event.id,
        };

        const { data, error } = await supabase
          .from('ticket_types')
          .insert(payload)
          .select()
          .single();

        if (error) return res.status(500).json({ message: error.message });
        await logAction(admin.email, 'criar_lote', 'ticket_type', data.id, { ...eventLog(event), name: data.name });
        return res.status(200).json(data);
      }

      if (req.method === 'PATCH' && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const body = parseBody(req);
        const normalized = normalizeTicketTypeInput(body, true);

        if ('error' in normalized) {
          return res.status(400).json({ message: normalized.error });
        }

        const { data: before, error: beforeError } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('id', id)
          .eq('event_id', event.id)
          .maybeSingle();

        if (beforeError) return res.status(500).json({ message: beforeError.message });
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        if (normalized.data.quantity_total !== undefined) {
          const sold = Number(before?.quantity_sold ?? 0);
          const total = Number(normalized.data.quantity_total);
          if (total < sold) {
            return res.status(400).json({
              message: 'quantity_total não pode ser inferior à quantidade já vendida',
            });
          }
        }

        const { data, error } = await supabase
          .from('ticket_types')
          .update(normalized.data)
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });

        const changedKeys = Object.keys(normalized.data);
        const beforeSnapshot = Object.fromEntries(changedKeys.map(k => [k, (before as any)?.[k]]));
        await logAction(admin.email, 'editar_lote', 'ticket_type', id, { ...eventLog(event), name: before?.name, before: beforeSnapshot, after: normalized.data });
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE' && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });

        const { data: before } = await supabase
          .from('ticket_types').select('name, active').eq('id', id).eq('event_id', event.id).maybeSingle();
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        const { data, error } = await supabase
          .from('ticket_types')
          .update({ active: false })
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });
        await logAction(admin.email, 'desativar_lote', 'ticket_type', id, { ...eventLog(event), name: before?.name, before: { active: before?.active }, after: { active: false } });
        return res.status(200).json(data);
      }

      return res.status(405).json({ message: 'Method not allowed' });
    }

    // =========================
    // WORKSHOPS
    // =========================
    if (resource === 'workshops' && event) {
      if (req.method === 'GET' && !id) {
        const { data, error } = await supabase
          .from('workshops')
          .select('*')
          .eq('event_id', event.id)
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json((data || []).map(withWorkshopRemaining));
      }

      if (req.method === 'POST' && !id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const body = parseBody(req);
        const normalized = normalizeWorkshopInput(body, false);

        if ('error' in normalized) {
          return res.status(400).json({ message: normalized.error });
        }

        const { data, error } = await supabase
          .from('workshops')
          .insert({ ...normalized.data, sold: 0, event_id: event.id })
          .select()
          .single();

        if (error) return res.status(500).json({ message: error.message });
        await logAction(admin.email, 'criar_workshop', 'workshop', data.id, { ...eventLog(event), title: data.title });
        return res.status(200).json(withWorkshopRemaining(data));
      }

      if ((req.method === 'PATCH' || req.method === 'PUT') && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const body = parseBody(req);
        const normalized = normalizeWorkshopInput(body, true);

        if ('error' in normalized) {
          return res.status(400).json({ message: normalized.error });
        }

        if (Object.keys(normalized.data).length === 0) {
          return res.status(400).json({ message: 'Nada para atualizar' });
        }

        const { data: before, error: beforeError } = await supabase
          .from('workshops')
          .select('*')
          .eq('id', id)
          .eq('event_id', event.id)
          .maybeSingle();

        if (beforeError) return res.status(500).json({ message: beforeError.message });
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        if (normalized.data.capacity !== undefined) {
          const sold = Number(before?.sold ?? 0);
          const capacity = Number(normalized.data.capacity);
          if (capacity < sold) {
            return res.status(400).json({
              message: 'capacity não pode ser inferior às vagas já vendidas',
            });
          }
        }

        const { data, error } = await supabase
          .from('workshops')
          .update({ ...normalized.data, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });

        const changedKeys = Object.keys(normalized.data);
        const beforeSnapshot = Object.fromEntries(changedKeys.map(k => [k, (before as any)?.[k]]));
        await logAction(admin.email, 'editar_workshop', 'workshop', id, { ...eventLog(event), title: before?.title, before: beforeSnapshot, after: normalized.data });
        return res.status(200).json(withWorkshopRemaining(data));
      }

      if (req.method === 'DELETE' && id) {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });

        const { data: before } = await supabase
          .from('workshops').select('title, active').eq('id', id).eq('event_id', event.id).maybeSingle();
        if (!before) return res.status(404).json({ message: NOT_IN_EVENT });

        const { data, error } = await supabase
          .from('workshops')
          .update({ active: false, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });
        await logAction(admin.email, 'desativar_workshop', 'workshop', id, { ...eventLog(event), title: before?.title, before: { active: before?.active }, after: { active: false } });
        return res.status(200).json(withWorkshopRemaining(data));
      }

      return res.status(405).json({ message: 'Method not allowed' });
    }

    // =========================
    // ORDERS
    // =========================
    if (resource === 'orders' && event) {
      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('event_id', event.id)
          .order('created_at', { ascending: false })
          .limit(2000);
        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json(data || []);
      }

      if (req.method === 'PATCH') {
        if (!canEdit(admin.role)) return res.status(403).json({ message: 'Sem permissão de edição.' });
        const { id, is_duplicate, is_test, credit_note_ref } = parseBody(req) || {};
        if (!id) return res.status(400).json({ message: 'ID é obrigatório.' });

        const payload: Record<string, unknown> = {};
        if (is_duplicate !== undefined) payload.is_duplicate = Boolean(is_duplicate);
        if (is_test !== undefined) payload.is_test = Boolean(is_test);
        if (credit_note_ref !== undefined) payload.credit_note_ref = credit_note_ref || null;

        const { data, error } = await supabase
          .from('orders')
          .update(payload)
          .eq('id', id)
          .eq('event_id', event.id)
          .select()
          .maybeSingle();
        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: NOT_IN_EVENT });
        await logAction(admin.email, 'marcar_duplicado', 'order', id, { ...eventLog(event), ...payload });
        return res.status(200).json(data);
      }

      return res.status(405).json({ message: 'Method not allowed' });
    }

    // =========================
    // TICKETS
    // =========================
    if (resource === 'tickets' && event) {
      if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
      }

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false })
        .limit(2000);

      if (error) return res.status(500).json({ message: error.message });
      return res.status(200).json(data || []);
    }

    // =========================
    // PROMOTE (copiar lotes/workshops/cupões da base de teste para produção)
    // =========================
    if (resource === 'promote') {
      const prod = prodSupabase();

      if (req.method === 'GET') {
        return res.status(200).json({ available: Boolean(prod) && admin.role === 'superadmin' });
      }
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
      if (admin.role !== 'superadmin') return res.status(403).json({ message: 'Só superadmin pode enviar para produção.' });
      if (!prod) return res.status(400).json({ message: 'Envio para produção não está configurado neste ambiente.' });

      const resolved = await resolveEvent(req);
      if ('error' in resolved) return res.status(400).json({ message: resolved.error });
      const testEvent = resolved.event;

      const body = parseBody(req);
      const spec = PROMOTE_TABLES[String(body?.table ?? '')];
      if (!spec) return res.status(400).json({ message: 'table inválida (ticket-types, workshops ou coupons).' });
      const ids: string[] | null = Array.isArray(body?.ids) ? body.ids.map(String) : null;

      // Evento correspondente em produção (os uuids diferem entre bases; o slug é o mesmo)
      const { data: prodEvent, error: prodEventError } = await prod
        .from('events').select('id').eq('slug', testEvent.slug).maybeSingle();
      if (prodEventError) return res.status(500).json({ message: `Produção: ${prodEventError.message}` });
      if (!prodEvent) {
        return res.status(400).json({ message: `O evento "${testEvent.name}" (slug ${testEvent.slug}) não existe na base de produção.` });
      }

      let query = supabase.from(spec.table).select('*').eq('event_id', testEvent.id);
      if (ids) query = query.in('id', ids);
      const { data: rows, error: rowsError } = await query;
      if (rowsError) return res.status(500).json({ message: rowsError.message });
      if (!rows || rows.length === 0) return res.status(404).json({ message: 'Nada para enviar.' });

      // Lotes ativos por último: a produção só aceita um lote ativo por evento
      rows.sort((a: any, b: any) => Number(Boolean(a.active)) - Number(Boolean(b.active)));

      const results: Array<{ id: string; label: string; status: 'criado' | 'atualizado' | 'erro'; message?: string }> = [];

      for (const row of rows as any[]) {
        const label = String(row[spec.key] ?? row.id);
        const payload: Record<string, unknown> = { ...row, event_id: prodEvent.id };
        for (const col of ['id', 'created_at', 'updated_at', ...spec.counters]) delete payload[col];
        if (spec.table === 'workshops') payload.updated_at = new Date().toISOString();

        // Mesmo id (enviado antes) ou, se não houver, mesmo nome/título/código no evento
        let { data: existing } = await prod
          .from(spec.table).select('id').eq('id', row.id).eq('event_id', prodEvent.id).maybeSingle();
        if (!existing) {
          ({ data: existing } = await prod
            .from(spec.table).select('id').eq('event_id', prodEvent.id).eq(spec.key, row[spec.key]).limit(1).maybeSingle());
        }

        const { error } = existing
          ? await prod.from(spec.table).update(payload).eq('id', existing.id)
          : await prod.from(spec.table).insert({ ...payload, id: row.id });

        if (error) {
          const message = error.code === '23505' && spec.table === 'ticket_types'
            ? 'Já existe outro lote ativo em produção; desativa-o primeiro.'
            : error.message;
          results.push({ id: row.id, label, status: 'erro', message });
        } else {
          results.push({ id: row.id, label, status: existing ? 'atualizado' : 'criado' });
        }
      }

      const details = {
        ...eventLog(testEvent),
        table: spec.table,
        results: results.map(({ label, status, message }) => ({ label, status, message })),
      };
      await logAction(admin.email, 'enviar_para_producao', spec.table, ids?.length === 1 ? ids[0] : undefined, details);
      const { error: prodLogError } = await prod.from('admin_audit_log').insert({
        admin_email: admin.email,
        action: 'recebido_de_teste',
        entity_type: spec.table,
        entity_id: ids?.length === 1 ? ids[0] : null,
        details,
      });
      if (prodLogError) console.error('[promote] failed to write prod audit log:', prodLogError.message);

      return res.status(200).json({ results });
    }

    // =========================
    // ME
    // =========================
    if (resource === 'me') {
      if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
      return res.status(200).json(admin);
    }

    // =========================
    // AUDIT LOG (superadmin only)
    // =========================
    if (resource === 'audit-log') {
      if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
      if (admin.role !== 'superadmin') return res.status(403).json({ message: 'Sem permissão.' });
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return res.status(500).json({ message: error.message });
      return res.status(200).json(data || []);
    }

    // =========================
    // ADMIN USERS (superadmin only)
    // =========================
    if (resource === 'admin-users') {
      if (admin.role !== 'superadmin') return res.status(403).json({ message: 'Sem permissão.' });

      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, name, role, active, created_at')
          .order('created_at', { ascending: true });
        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json(data || []);
      }

      if (req.method === 'POST') {
        const body = parseBody(req);
        const email = String(body?.email || '').trim().toLowerCase();
        const name = String(body?.name || '').trim() || null;
        const role = body?.role;
        if (!email) return res.status(400).json({ message: 'email obrigatório.' });
        if (!['superadmin', 'edit', 'view'].includes(role)) return res.status(400).json({ message: 'role inválido.' });
        const { data, error } = await supabase
          .from('admin_users')
          .insert({ email, name, role, active: true })
          .select()
          .single();
        if (error) return res.status(500).json({ message: error.message });
        await logAction(admin.email, 'criar_admin', 'admin_user', email, { name, role });
        return res.status(200).json(data);
      }

      if (req.method === 'PATCH' && id) {
        const body = parseBody(req);
        const payload: Record<string, unknown> = {};
        if (body?.role !== undefined) {
          if (!['superadmin', 'edit', 'view'].includes(body.role)) return res.status(400).json({ message: 'role inválido.' });
          payload.role = body.role;
        }
        if (body?.active !== undefined) payload.active = Boolean(body.active);
        if (body?.name !== undefined) payload.name = String(body.name).trim() || null;
        const { data: before } = await supabase.from('admin_users').select('role, active, name').eq('email', id).single();
        const { data, error } = await supabase
          .from('admin_users')
          .update(payload)
          .eq('email', id)
          .select()
          .single();
        if (error) return res.status(500).json({ message: error.message });
        const changedKeys = Object.keys(payload);
        const beforeSnapshot = Object.fromEntries(changedKeys.map(k => [k, (before as any)?.[k]]));
        await logAction(admin.email, 'editar_admin', 'admin_user', id, { before: beforeSnapshot, after: payload });
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE' && id) {
        if (id === admin.email) return res.status(400).json({ message: 'Não podes remover a tua própria conta.' });
        const { data: before } = await supabase.from('admin_users').select('email, role').eq('email', id).single();
        const { error } = await supabase.from('admin_users').delete().eq('email', id);
        if (error) return res.status(500).json({ message: error.message });
        await logAction(admin.email, 'remover_admin', 'admin_user', id, { email: before?.email, role: before?.role });
        return res.status(200).json({ ok: true });
      }

      return res.status(405).json({ message: 'Method not allowed' });
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Internal error' });
  }
}