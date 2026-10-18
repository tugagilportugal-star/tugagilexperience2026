import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getCurrentEvent } from '../lib/event.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

type CouponRow = {
  id: string;
  code: string;
  email: string | null;
  active: boolean;
  discount_percent: number | null;
  discount_amount: number | null;
  recording_only: boolean;
  single_use: boolean;
};

type WorkshopRow = {
  id: string;
  title: string;
  capacity: number;
  sold: number;
  active: boolean;
};

// Stripe exige pelo menos 30 min; damos 31 para margem.
const CHECKOUT_EXPIRES_SECONDS = 31 * 60;

// Cupão válido = ativo, do código/email indicados e do evento deste site
async function findValidCoupon(code: string, email: string, eventId: string): Promise<CouponRow | null> {
  const normalizedCode = code.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedCode) return null;

  if (normalizedEmail) {
    const { data: emailCoupon } = await supabase
      .from('discount_coupons')
      .select('id, code, email, active, discount_percent, discount_amount, recording_only, single_use')
      .eq('code', normalizedCode)
      .eq('email', normalizedEmail)
      .eq('event_id', eventId)
      .eq('active', true)
      .maybeSingle();

    if (emailCoupon) return emailCoupon;
  }

  const { data: genericCoupon } = await supabase
    .from('discount_coupons')
    .select('id, code, email, active, discount_percent, discount_amount, recording_only, single_use')
    .eq('code', normalizedCode)
    .is('email', null)
    .eq('event_id', eventId)
    .eq('active', true)
    .maybeSingle();

  return genericCoupon || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { ticketTypeId, participants, shared } = req.body;

    if (!ticketTypeId || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'Dados obrigatórios em falta.' });
    }

    const quantity = participants.length;
    if (quantity > 5) return res.status(400).json({ message: 'Máximo de 5 bilhetes por compra.' });

    // Só se vendem lotes do evento deste site; lote de outro evento = indisponível
    const currentEvent = await getCurrentEvent(supabase);

    const { data: ticketType, error } = await supabase
      .from('ticket_types').select('*')
      .eq('id', ticketTypeId)
      .eq('event_id', currentEvent.id)
      .maybeSingle();

    if (error || !ticketType || !ticketType.active) {
      return res.status(404).json({ message: 'Bilhete indisponível ou esgotado.' });
    }

    const truncate = (val: unknown, max = 100) => String(val || '').trim().slice(0, max);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate all participant emails
    for (const p of participants) {
      const email = truncate(p.email, 254);
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: `Email inválido: ${p.email}` });
      }
    }

    // Workshop por participante (opcional, no máximo 1 por pessoa)
    const workshopIds: string[] = participants.map((p: any) => String(p?.workshop_id || '').trim());
    const requestedPerWorkshop = new Map<string, number>();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    for (const wsId of workshopIds) {
      if (wsId && !uuidRegex.test(wsId)) return res.status(400).json({ message: 'Workshop inválido.' });
      if (wsId) requestedPerWorkshop.set(wsId, (requestedPerWorkshop.get(wsId) || 0) + 1);
    }

    const workshopsById = new Map<string, WorkshopRow>();
    if (requestedPerWorkshop.size > 0) {
      const workshopPrice = Number(ticketType.workshop_price || 0);
      if (!(workshopPrice > 0)) {
        return res.status(400).json({ message: 'Os workshops ainda não estão disponíveis para este lote.' });
      }

      const { data: workshops, error: wsErr } = await supabase
        .from('workshops')
        .select('id, title, capacity, sold, active')
        .eq('event_id', currentEvent.id)
        .in('id', [...requestedPerWorkshop.keys()]);

      if (wsErr) return res.status(500).json({ message: 'Erro ao validar workshops.' });

      for (const w of (workshops || []) as WorkshopRow[]) workshopsById.set(w.id, w);

      for (const [wsId, requested] of requestedPerWorkshop) {
        const w = workshopsById.get(wsId);
        if (!w || !w.active) {
          return res.status(400).json({ message: 'Workshop indisponível.' });
        }
        const remaining = Math.max(0, w.capacity - w.sold);
        if (requested > remaining) {
          return res.status(409).json({
            message: remaining === 0
              ? `O workshop "${w.title}" está esgotado.`
              : `O workshop "${w.title}" só tem ${remaining} vaga(s).`,
          });
        }
      }
    }

    const couponCode = String(shared?.coupon_code || '').trim().toUpperCase();
    const billingNif = truncate(shared?.billing_nif, 20);
    const billingName = truncate(shared?.billing_name, 100);
    const billingEmail = truncate(shared?.billing_email, 254);
    const billingNameType = String(shared?.billing_name_type || 'participant'); // 'participant' | 'company'
    const saDataSharingConsent = Boolean(shared?.sa_data_sharing_consent);
    const privacyConsent = Boolean(shared?.privacy_consent);

    // Billing email: use explicit billing_email if provided, else first participant
    const firstEmail = truncate(participants[0].email, 254);
    const stripeEmail = (billingEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) ? billingEmail : firstEmail;

    // Pré-criar Customer no Stripe para pré-preencher nome no Checkout
    let stripeCustomerId: string | undefined;
    if (billingName) {
      const customer = await stripe.customers.create({
        name: billingName,
        email: stripeEmail,
        metadata: { billing_name_type: billingNameType },
      });
      stripeCustomerId = customer.id;
    }

    const originalPrice = Number(ticketType.price);
    const workshopPrice = Number(ticketType.workshop_price || 0);
    let finalTicketPrice = originalPrice;
    let appliedCoupon: CouponRow | null = null;

    // Cupões aplicam-se só ao bilhete (nunca ao workshop)
    if (couponCode) {
      appliedCoupon = await findValidCoupon(couponCode, firstEmail, currentEvent.id);
      if (!appliedCoupon) return res.status(400).json({ message: 'Cupão inválido para este email.' });
      // Cupões de gravação deixaram de ter efeito: a gravação já não é vendida
      if (appliedCoupon.recording_only) return res.status(400).json({ message: 'Este cupão já não é válido.' });

      if (appliedCoupon.discount_amount != null) {
        finalTicketPrice = Math.max(0, originalPrice - appliedCoupon.discount_amount);
      } else if (appliedCoupon.discount_percent != null) {
        finalTicketPrice = Math.round(originalPrice * (100 - appliedCoupon.discount_percent) / 100);
      }
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${currentEvent.name} - ${ticketType.name}`,
            description: appliedCoupon && !appliedCoupon.recording_only
              ? `Bilhete de acesso ao evento. Cupão ${appliedCoupon.code} aplicado.`
              : 'Bilhete de acesso ao evento.',
          },
          unit_amount: finalTicketPrice,
        },
        quantity,
      },
    ];

    for (const [wsId, count] of requestedPerWorkshop) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Workshop: ${workshopsById.get(wsId)!.title}`,
            description: 'Workshop da tarde (adicional ao bilhete).',
          },
          unit_amount: workshopPrice,
        },
        quantity: count,
      });
    }
    const workshopsCount = workshopIds.filter(Boolean).length;

    // Encode participants as p_0, p_1, ... in metadata (max 500 chars each)
    // Nome completo num só campo (nm). Clientes antigos ainda mandam first_name/last_name.
    // Sem T-shirt (deixou de ser pedida). Pior caso sem escapes: 485 caracteres.
    const META_VALUE_MAX = 500;
    const participantsMeta: Record<string, string> = {};
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const fields: Record<string, string | boolean> = {
        nm: truncate(p.name, 100) || truncate(`${truncate(p.first_name)} ${truncate(p.last_name)}`, 100),
        em: truncate(p.email, 100),
        co: truncate(p.country, 30),
        cp: truncate(p.company, 60),
        jf: truncate(p.job_function, 40),
        jo: truncate(p.job_function_other, 40),
        iy: truncate(p.industry, 50),
        mc: Boolean(p.sa_marketing_consent),
      };
      // Rede de segurança: aspas/barras/caracteres de controlo ocupam mais no JSON.
      // Se passar do limite do Stripe, encurta primeiro os campos menos importantes.
      let json = JSON.stringify(fields);
      for (const key of ['jo', 'iy', 'jf', 'cp', 'co', 'nm']) {
        if (json.length <= META_VALUE_MAX) break;
        const val = String(fields[key]);
        fields[key] = val.slice(0, Math.max(0, val.length - (json.length - META_VALUE_MAX)));
        json = JSON.stringify(fields);
      }
      participantsMeta[`p_${i}`] = json;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Se pré-criámos um Customer, usamo-lo para pré-preencher nome; senão só o email
      ...(stripeCustomerId
        ? { customer: stripeCustomerId, customer_update: { name: 'auto', address: 'auto' } }
        : { customer_email: stripeEmail }),
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      metadata: {
        billing_name_type: billingNameType,
        event_id: String(currentEvent.id),
        ticket_type_id: String(ticketType.id),
        participants_count: String(quantity),
        ...participantsMeta,
        billing_nif: billingNif,
        billing_name: billingName,
        billing_email: billingEmail,
        sa_data_sharing_consent: String(saDataSharingConsent),
        privacy_consent: String(privacyConsent),
        coupon_id: appliedCoupon?.id || '',
        coupon_code: appliedCoupon?.code || '',
        coupon_discount_percent: appliedCoupon?.discount_percent != null ? String(appliedCoupon.discount_percent) : '',
        coupon_discount_amount: appliedCoupon?.discount_amount != null ? String(appliedCoupon.discount_amount) : '',
        coupon_recording_only: appliedCoupon ? String(appliedCoupon.recording_only) : '',
        coupon_single_use: appliedCoupon ? String(appliedCoupon.single_use) : '',
        include_recording: 'false',
        // Workshop de cada participante, pela mesma ordem de p_0, p_1, ... (vazio = sem workshop)
        ws: workshopIds.join(','),
        workshop_price: String(workshopPrice),
        original_price: String(originalPrice),
        final_price: String(finalTicketPrice * quantity + workshopPrice * workshopsCount),
      },
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRES_SECONDS,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true#ticket-form`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}