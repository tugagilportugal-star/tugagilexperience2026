import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getCurrentEvent } from '../lib/event.js';
import { EMAIL_FROM, escapeHtml } from '../lib/email.js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const ADMIN_EMAIL = 'tugagilportugal@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const resend = new Resend(RESEND_API_KEY);

// Tipos de formulário que este endpoint trata (os restantes são rejeitados)
const ALLOWED_TYPES = [
  'Patrocínios e Parcerias',
  'Apoiadores',
  'Priority List Sold Out',
  'Lista de Interessados',
];

// Validação simples de email (sem espaços, um @, domínio com ponto)
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_FIELD = 1000;

// Campo de texto opcional: string aparada até ao limite, ou null. Outros tipos → erro.
function optionalText(value: unknown, max: number): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return undefined;
  const v = value.trim();
  if (v.length > max) return undefined;
  return v || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
    const type = typeof body.type === 'string' ? body.type : '';

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ ok: false, message: 'Tipo de formulário inválido.' });
    }

    const name = optionalText(body.name, MAX_NAME);
    const email = optionalText(body.email, MAX_EMAIL);
    if (!name) {
      return res.status(400).json({ ok: false, message: `Nome obrigatório (máx. ${MAX_NAME} caracteres).` });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ ok: false, message: 'Email inválido.' });
    }

    const phone = optionalText(body.phone, MAX_FIELD);
    const company = optionalText(body.company, MAX_FIELD);
    const role = optionalText(body.role, MAX_FIELD);
    const message = optionalText(body.message, MAX_FIELD);
    const expectations = optionalText(body.expectations, MAX_FIELD);
    if ([phone, company, role, message, expectations].some(v => v === undefined)) {
      return res.status(400).json({ ok: false, message: `Campos inválidos (máx. ${MAX_FIELD} caracteres cada).` });
    }

    // 1. Salvar no Supabase (com o evento deste site; se não o encontrar, grava sem evento)
    let eventId: string | null = null;
    let eventName = 'TugÁgil Experience';
    try {
      const ev = await getCurrentEvent(supabase);
      eventId = ev.id;
      if (ev.name) eventName = ev.name;
    } catch (e: any) {
      console.error('⚠️ Lead sem evento:', e?.message);
    }
    await supabase.from('leads').insert({
      type, name, email, phone, company, role, message: message || expectations || null,
      ...(eventId ? { event_id: eventId } : {}),
    });

    // 2. Definir o E-mail (ao utilizador só vai o nome, escapado — nada de texto livre do pedido)
    const safeName = escapeHtml(name);
    const safeEvent = escapeHtml(eventName);
    let userSubject = '';
    let userHtml = '';

    if (type === 'Patrocínios e Parcerias') {
        userSubject = `Interesse em Patrocínio - ${eventName}`;
        userHtml = `<p>Olá ${safeName}, obrigado pelo contacto sobre parcerias!</p>`;
    } else if (type === 'Priority List Sold Out' || type === 'Lista de Interessados') {
        userSubject = `Estás na Priority List! ${eventName}`;
        userHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h2 style="color:#003F59;">Olá, ${safeName}!</h2>
          <p style="font-size:16px;color:#3c4858;">Ficaste registado(a) na <strong>Priority List</strong> do ${safeEvent}.</p>
          <p style="font-size:16px;color:#3c4858;">Serás um dos primeiros a ser avisado(a) em caso de desistências ou novas vagas.</p>
          <p style="font-size:14px;color:#888;">Dúvidas? Responde a este email.</p>
        </div>`;
    } else {
        // Outros tipos de lead — email genérico sem bilhete
        userSubject = `Recebemos a tua mensagem – ${eventName}`;
        userHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h2 style="color:#003F59;">Olá, ${safeName}!</h2>
          <p style="font-size:16px;color:#3c4858;">Recebemos a tua mensagem e entraremos em contacto em breve.</p>
        </div>`;
    }

    // 3. Enviar
    const emailPromises = [
      resend.emails.send({ from: EMAIL_FROM, to: email, subject: userSubject, html: userHtml })
    ];

    if (type !== 'Lista de Interessados') {
      emailPromises.push(
        resend.emails.send({ from: EMAIL_FROM, to: ADMIN_EMAIL, subject: `${type}: ${name}`, html: `<p>Nova submissão de ${safeName} (${escapeHtml(email)})</p>` })
      );
    }

    await Promise.allSettled(emailPromises);
    return res.status(200).json({ ok: true });

  } catch (error: any) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
