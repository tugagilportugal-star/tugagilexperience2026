import type { SupabaseClient } from '@supabase/supabase-js';
import { EVENT_SLUG } from './event.js';

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

// Dados do evento para os templates (nome, data por extenso, horário, local, link de calendário)
export type EmailEvent = {
  name: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  calendarUrl: string;
};

export const EMPTY_EMAIL_EVENT: EmailEvent = {
  name: 'TugÁgil Experience', dateLabel: '', timeLabel: '', venue: '', calendarUrl: '',
};

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// "09:00:00" → { label: "9h00", compact: "090000" }
function parseTime(t: unknown) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t || ''));
  if (!m) return null;
  return { label: `${Number(m[1])}h${m[2]}`, compact: `${m[1].padStart(2, '0')}${m[2]}00` };
}

// Colunas lidas com select('*'): start_time/end_time podem ainda não existir na BD
function toEmailEvent(ev: Record<string, any>): EmailEvent {
  let dateLabel = '';
  let datePart = '';
  if (ev.starts_on) {
    const [y, m, d] = String(ev.starts_on).split('-').map(Number);
    if (y && m && d) {
      dateLabel = `${d} de ${MESES[m - 1]} de ${y}`;
      datePart = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    }
  }

  const start = parseTime(ev.start_time);
  const end = parseTime(ev.end_time);
  const timeLabel = start && end ? `${start.label} às ${end.label}` : start ? `A partir das ${start.label}` : '';
  const venue = String(ev.venue || '');

  // Link "Adicionar ao Google Calendar", na hora de Lisboa
  let calendarUrl = '';
  if (datePart && start && end) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: String(ev.name || ''),
      dates: `${datePart}T${start.compact}/${datePart}T${end.compact}`,
      ctz: 'Europe/Lisbon',
      location: venue,
      details: SITE_URL,
    });
    calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  return { name: String(ev.name || EMPTY_EMAIL_EVENT.name), dateLabel, timeLabel, venue, calendarUrl };
}

// Evento de uma encomenda (por event_id) ou, sem id, o evento atual do site
export async function getEmailEvent(supabase: SupabaseClient, eventId?: string | null): Promise<EmailEvent> {
  const query = supabase.from('events').select('*');
  const { data, error } = eventId
    ? await query.eq('id', eventId).maybeSingle()
    : await query.eq('slug', EVENT_SLUG).maybeSingle();

  if (error || !data) {
    throw new Error(`Evento não encontrado (${eventId || EVENT_SLUG}).`);
  }
  return toEmailEvent(data);
}
