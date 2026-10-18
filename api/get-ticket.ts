// api/get-ticket.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const TICKET_FIELDS = 'id,name,price,currency,active,quantity_total,quantity_sold,sort_order,workshop_price';

const WORKSHOP_FIELDS =
  'id,title,short_description,description,takeaways,facilitator_name,facilitator_role,' +
  'facilitator_bio,facilitator_photo_url,image_url,starts_at,ends_at,room,level,capacity,sold,sort_order';

type WorkshopRow = {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  takeaways: string[];
  facilitator_name: string | null;
  facilitator_role: string | null;
  facilitator_bio: string | null;
  facilitator_photo_url: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  room: string | null;
  level: string | null;
  capacity: number;
  sold: number;
  sort_order: number;
};

// Workshops ativos com vagas restantes. Nunca falha o pedido: sem workshops, devolve [].
async function getWorkshops() {
  const { data, error } = await supabase
    .from('workshops')
    .select(WORKSHOP_FIELDS)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('⚠️ Erro ao ler workshops:', error.message);
    return [];
  }

  return ((data || []) as unknown as WorkshopRow[]).map(({ sold, ...w }) => {
    const remaining = Math.max(0, Number(w.capacity) - Number(sold));
    return { ...w, remaining, sold_out: remaining === 0 };
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const id = String(req.query.id || '').trim();

    // Se vier ID -> devolve aquele lote (mantém compatibilidade)
    if (id) {
      const { data, error } = await supabase
        .from('ticket_types')
        .select(TICKET_FIELDS)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ message: 'Ticket type não encontrado.' });
      }

      return res.status(200).json({ ...data, workshops: await getWorkshops() });
    }

    // Se NÃO vier ID -> devolve o lote ativo com menor sort_order (lote atual)
    const { data: activeTicket, error: activeErr } = await supabase
      .from('ticket_types')
      .select(TICKET_FIELDS)
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (activeErr) {
      return res.status(500).json({ message: activeErr.message });
    }

    if (!activeTicket) {
      return res.status(404).json({ message: 'Nenhum lote ativo disponível.' });
    }

    return res.status(200).json({ ...activeTicket, workshops: await getWorkshops() });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}
