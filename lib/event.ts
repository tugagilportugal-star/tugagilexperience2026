import type { SupabaseClient } from '@supabase/supabase-js';

// Evento servido por este site. Definido por ambiente na Vercel (EVENT_SLUG);
// sem variável, assume o TugÁgil Experience 2026.
export const EVENT_SLUG = (process.env.EVENT_SLUG || 'tugagil-experience-2026').trim();

export type EventRow = {
  id: string;
  slug: string;
  name: string;
  starts_on: string | null;
  venue: string | null;
};

let cached: EventRow | null = null;

// Devolve o evento atual (com cache por instância da função). Lança erro se não existir.
export async function getCurrentEvent(supabase: SupabaseClient): Promise<EventRow> {
  if (cached) return cached;

  const { data, error } = await supabase
    .from('events')
    .select('id, slug, name, starts_on, venue')
    .eq('slug', EVENT_SLUG)
    .single();

  if (error || !data) {
    throw new Error(`Evento "${EVENT_SLUG}" não encontrado na tabela events.`);
  }

  cached = data as EventRow;
  return cached;
}
