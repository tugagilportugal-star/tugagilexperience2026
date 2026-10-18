import type { SupabaseClient } from '@supabase/supabase-js';
import { getCurrentEvent, type EventRow } from './event.js';

// Remetente de todos os emails. Definido por ambiente na Vercel (RESEND_FROM);
// o domínio tem de estar verificado no Resend.
export const EMAIL_FROM =
  (process.env.RESEND_FROM || '').trim() || 'TugÁgil Experience 2026 <rsg@rsglisbon.com>';

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://experience.tugagil.com').replace(/\/+$/, '');

// Escapar texto vindo do utilizador ou da BD antes de o inserir em HTML de email
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Dados do evento para os templates (nome, data por extenso, local)
export type EmailEvent = {
  name: string;
  dateLabel: string;
  venue: string;
};

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function toEmailEvent(ev: Pick<EventRow, 'name' | 'starts_on' | 'venue'>): EmailEvent {
  let dateLabel = '';
  if (ev.starts_on) {
    const [y, m, d] = ev.starts_on.split('-').map(Number);
    if (y && m && d) dateLabel = `${d} de ${MESES[m - 1]} de ${y}`;
  }
  return { name: ev.name, dateLabel, venue: ev.venue || '' };
}

// Evento de uma encomenda (por event_id) ou, sem id, o evento atual do site
export async function getEmailEvent(supabase: SupabaseClient, eventId?: string | null): Promise<EmailEvent> {
  if (eventId) {
    const { data } = await supabase
      .from('events')
      .select('name, starts_on, venue')
      .eq('id', eventId)
      .maybeSingle();
    if (data) return toEmailEvent(data);
  }
  return toEmailEvent(await getCurrentEvent(supabase));
}
