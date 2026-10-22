import React, { useEffect, useRef, useState } from 'react';
import { Download, Pencil, Plus, Power, Send, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { WorkshopFacilitator, workshopFacilitators, facilitatorNames } from './WorkshopDetailsModal';

type LeadStatus = 'Pending' | 'InProgress' | 'Completed' | 'Deleted';

type LeadRow = {
  id: string;
  created_at?: string | null;
  type?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  message?: string | null;
  portfolio?: string | null;
  status?: LeadStatus | string | null;
};

type TicketTypeRow = {
  id: string;
  name: string;
  price: number;
  workshop_price?: number | null;
  currency: string;
  quantity_total: number | null;
  quantity_sold: number | null;
  active: boolean | null;
  sort_order: number | null;
  created_at?: string | null;
};

type OrderRow = {
  id: string;
  created_at?: string | null;
  stripe_session_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  customer_country?: string | null;
  customer_tax_id?: string | null;
  total_amount?: number | null;
  include_recording?: boolean | null;
  status?: string | null;
  invoice_id?: string | null;
  invoice_number?: string | null;
  credit_note_id?: string | null;
  credit_note_number?: string | null;
  credit_note_motivo?: string | null;
  original_invoice_id?: string | null;
  original_invoice_number?: string | null;
  refunded_at?: string | null;
  is_duplicate?: boolean | null;
  is_test?: boolean | null;
  credit_note_ref?: string | null;
};

type TicketRow = {
  id: string;
  created_at?: string | null;
  order_id?: string | null;
  ticket_type_id?: string | null;
  attendee_name?: string | null;
  attendee_email?: string | null;
  attendee_first_name?: string | null;
  attendee_last_name?: string | null;
  attendee_country?: string | null;
  attendee_job_function?: string | null;
  attendee_job_function_other?: string | null;
  attendee_nif?: string | null;
  attendee_company?: string | null;
  attendee_job_title?: string | null;
  attendee_tshirt?: string | null;
  sa_data_sharing_consent?: boolean | null;
  sa_marketing_consent?: boolean | null;
  privacy_consent?: boolean | null;
  checked_in?: boolean | null;
  check_in_at?: string | null;
  workshop_id?: string | null;
};

type WorkshopRow = {
  id: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  takeaways?: string[] | null;
  facilitators?: WorkshopFacilitator[] | null;
  image_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  room?: string | null;
  level?: string | null;
  capacity: number;
  sold: number;
  remaining?: number;
  active: boolean | null;
  sort_order: number | null;
  created_at?: string | null;
};

type CouponRow = {
  id: string;
  code: string;
  email?: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  recording_only: boolean;
  single_use: boolean;
  active: boolean;
  expires_at?: string | null;
  created_at?: string | null;
  used_at?: string | null;
  used_by_order_id?: string | null;
};

type AuditLogRow = {
  id: string;
  created_at: string;
  admin_email: string;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  details?: any;
};

type AdminRole = 'superadmin' | 'edit' | 'view';
type AdminUserInfo = { email: string; name: string | null; role: AdminRole };
type AdminUserRow = { email: string; name: string | null; role: AdminRole; active: boolean; created_at?: string | null };

type AdminTab = 'leads' | 'ticketTypes' | 'workshops' | 'orders' | 'tickets' | 'coupons' | 'logs' | 'adminUsers';

type TicketTypeForm = {
  name: string;
  price: string;
  workshop_price: string;
  currency: string;
  quantity_total: string;
  sort_order: string;
  active: boolean;
};

type WorkshopForm = {
  title: string;
  short_description: string;
  description: string;
  takeaways: string;
  facilitators: FacilitatorForm[];
  image_url: string;
  starts_at: string;
  ends_at: string;
  room: string;
  level: string;
  capacity: string;
  sort_order: string;
  active: boolean;
};

const STATUS_OPTIONS: LeadStatus[] = ['Pending', 'InProgress', 'Completed'];

function safe(val: unknown) {
  return val === null || val === undefined ? '' : String(val);
}

function formatDatePt(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('pt-PT');
}


function formatMoneyEURFromCents(cents?: number | null) {
  if (cents === null || cents === undefined || Number.isNaN(Number(cents))) return '';
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(cents) / 100);
}

function emptyTicketTypeForm(): TicketTypeForm {
  return {
    name: '',
    price: '',
    workshop_price: '0',
    currency: 'eur',
    quantity_total: '',
    sort_order: '0',
    active: true,
  };
}

function toTicketTypeForm(row: TicketTypeRow): TicketTypeForm {
  return {
    name: row.name ?? '',
    price: String(row.price != null ? (row.price / 100).toFixed(2) : ''),
    workshop_price: String(((row.workshop_price ?? 0) / 100).toFixed(2)),
    currency: row.currency ?? 'eur',
    quantity_total: String(row.quantity_total ?? 0),
    sort_order: String(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

// Modais do admin: o painel rola por dentro e o cabeçalho (título + X) e o
// rodapé (botões) ficam fixos. As margens negativas compensam o p-6 do painel.
const MODAL_PANEL = 'max-h-[90vh] overflow-y-auto overscroll-contain';
// -top-6 / -bottom-6: o sticky conta a partir do padding do painel (p-6); sem isto o
// cabeçalho desce 24px e tapa as etiquetas dos primeiros campos (e o rodapé sobe 24px)
const MODAL_HEAD = 'sticky -top-6 z-10 bg-white -mx-6 -mt-6 px-6 pt-6';
const MODAL_FOOT = 'sticky -bottom-6 z-10 bg-white -mx-6 -mb-6 px-6 pb-6 pt-4 mt-4 border-t border-gray-100';

type FacilitatorForm = {
  name: string;
  role: string;
  bio: string;
  photo_url: string;
};

function emptyFacilitatorForm(): FacilitatorForm {
  return { name: '', role: '', bio: '', photo_url: '' };
}

function emptyWorkshopForm(): WorkshopForm {
  return {
    title: '',
    short_description: '',
    description: '',
    takeaways: '',
    facilitators: [emptyFacilitatorForm()],
    image_url: '',
    starts_at: '',
    ends_at: '',
    room: '',
    level: '',
    capacity: '',
    sort_order: '0',
    active: true,
  };
}

function toWorkshopForm(row: WorkshopRow): WorkshopForm {
  return {
    title: row.title ?? '',
    short_description: row.short_description ?? '',
    description: row.description ?? '',
    takeaways: (row.takeaways ?? []).join('\n'),
    facilitators: (row.facilitators ?? []).length
      ? (row.facilitators ?? []).map((f) => ({
          name: f.name ?? '',
          role: f.role ?? '',
          bio: f.bio ?? '',
          photo_url: f.photo_url ?? '',
        }))
      : [emptyFacilitatorForm()],
    image_url: row.image_url ?? '',
    starts_at: row.starts_at ?? '',
    ends_at: row.ends_at ?? '',
    room: row.room ?? '',
    level: row.level ?? '',
    capacity: String(row.capacity ?? 0),
    sort_order: String(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function formatWorkshopSchedule(row?: Pick<WorkshopRow, 'starts_at' | 'ends_at'> | null) {
  if (!row) return '';
  if (row.starts_at && row.ends_at) return `${row.starts_at}–${row.ends_at}`;
  return row.starts_at || row.ends_at || '';
}

function attendeeDisplayName(t: TicketRow) {
  return safe(t.attendee_name) || `${safe(t.attendee_first_name)} ${safe(t.attendee_last_name)}`.trim();
}

const MOTIVOS_ESTORNO = ['Estorno por desistência da compra', 'Erro no valor faturado'];

// ── Eventos ──────────────────────────────────────────────────────────────
// O admin trabalha sempre sobre UM evento escolhido explicitamente. Todos os
// pedidos aos recursos do evento levam ?event_id= e o backend recusa sem ele.
type EventRow = {
  id: string;
  slug: string;
  name: string;
  starts_on: string | null;
  venue: string | null;
};

const SELECTED_EVENT_STORAGE_KEY = 'admin.selectedEventId';

function readStoredEventId(): string | null {
  try {
    return window.localStorage.getItem(SELECTED_EVENT_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function writeStoredEventId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(SELECTED_EVENT_STORAGE_KEY, id);
    else window.localStorage.removeItem(SELECTED_EVENT_STORAGE_KEY);
  } catch {
    // localStorage indisponível (modo privado, etc.): a escolha fica só em memória
  }
}

type EventColor = { band: string; chip: string; dot: string };

// Cores fixas para os eventos conhecidos; os restantes recebem uma cor estável derivada do slug.
const EVENT_COLOR_PALETTE: EventColor[] = [
  { band: 'bg-emerald-700 text-white', chip: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600' },
  { band: 'bg-amber-500 text-gray-900', chip: 'bg-amber-50 text-amber-900 border-amber-300', dot: 'bg-amber-500' },
  { band: 'bg-fuchsia-700 text-white', chip: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300', dot: 'bg-fuchsia-600' },
  { band: 'bg-sky-700 text-white', chip: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-600' },
  { band: 'bg-rose-700 text-white', chip: 'bg-rose-50 text-rose-800 border-rose-300', dot: 'bg-rose-600' },
  { band: 'bg-indigo-700 text-white', chip: 'bg-indigo-50 text-indigo-800 border-indigo-300', dot: 'bg-indigo-600' },
];

const KNOWN_EVENT_COLOR_INDEX: Record<string, number> = {
  'tugagil-experience-2026': 0,
  'rsg-lisbon-2026': 1,
};

function eventColor(ev: Pick<EventRow, 'slug'>): EventColor {
  const known = KNOWN_EVENT_COLOR_INDEX[ev.slug];
  if (known !== undefined) return EVENT_COLOR_PALETTE[known];
  let hash = 0;
  for (const ch of ev.slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return EVENT_COLOR_PALETTE[hash % EVENT_COLOR_PALETTE.length];
}

// starts_on vem como 'AAAA-MM-DD' (date): formata sem passar por fusos horários
function formatEventDate(value?: string | null) {
  if (!value) return 'sem data';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : value;
}

function withEventId(path: string, eventId: string) {
  return `${path}${path.includes('?') ? '&' : '?'}event_id=${encodeURIComponent(eventId)}`;
}

const TAB_TITLES: Record<AdminTab, string> = {
  leads: 'Leads',
  ticketTypes: 'Lotes',
  workshops: 'Workshops',
  orders: 'Encomendas',
  tickets: 'Bilhetes (Participantes)',
  coupons: 'Cupões',
  logs: 'Logs',
  adminUsers: 'Utilizadores',
};

export const AdminView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<AdminTab>('tickets');

  const [data, setData] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [ticketTypes, setTicketTypes] = useState<TicketTypeRow[]>([]);
  const [loadingTicketTypes, setLoadingTicketTypes] = useState(false);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [sendingInvoiceEmail, setSendingInvoiceEmail] = useState<string | null>(null);
  const [invoiceEmailMsg, setInvoiceEmailMsg] = useState<{ orderId: string; ok: boolean; text: string } | null>(null);
  const [invoiceError, setInvoiceError] = useState<{ orderId: string; msg: string } | null>(null);
  const [invoiceModal, setInvoiceModal] = useState<{
    orderId: string;
    customerName: string;
    customerEmail: string;
    form: { country: string; nif: string };
  } | null>(null);
  const [savingInvoiceModal, setSavingInvoiceModal] = useState(false);
  const [invoiceModalError, setInvoiceModalError] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState<'ticket' | 'invoice' | null>(null);
  const [resendMsg, setResendMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
  const [ticketModalTab, setTicketModalTab] = useState<'ticket' | 'pagamento'>('ticket');
  const [creditNoteModal, setCreditNoteModal] = useState<{ orderId: string; orderLabel: string } | null>(null);
  const [creditNoteMotivo, setCreditNoteMotivo] = useState('');
  const [creditNoteCustom, setCreditNoteCustom] = useState('');
  const [generatingCreditNote, setGeneratingCreditNote] = useState(false);
  const [creditNoteError, setCreditNoteError] = useState<string | null>(null);
  const [refundModal, setRefundModal] = useState<{ orderId: string; orderLabel: string; hasCreditNote: boolean } | null>(null);
  const [refundMotivo, setRefundMotivo] = useState('');
  const [refundCustom, setRefundCustom] = useState('');
  const [markingRefund, setMarkingRefund] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const [showHidden, setShowHidden] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState<{ orderId: string; currentRef: string; isDuplicate: boolean; markType: 'duplicate' | 'test' } | null>(null);
  const [duplicateCreditNoteRef, setDuplicateCreditNoteRef] = useState('');
  const [markingDuplicate, setMarkingDuplicate] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [loadingCoupons, setLoadingCoupons] = useState(false)

  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [adminUsers, setAdminUsers] = useState<AdminUserRow[]>([]);
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);
  const [adminUserForm, setAdminUserForm] = useState({ email: '', name: '', role: 'view' as AdminRole });
  const [savingAdminUser, setSavingAdminUser] = useState(false);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRow | null>(null);
  const [savingCoupon, setSavingCoupon] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: '',
    email: '',
    discount_type: 'percent' as 'percent' | 'amount',
    discount_percent: '10',
    discount_amount: '',
    recording_only: false,
    single_use: true,
    active: true,
    expires_at: '',
  });

  const [session, setSession] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUserInfo | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [isTicketTypeModalOpen, setIsTicketTypeModalOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState<TicketTypeRow | null>(null);
  const [ticketTypeForm, setTicketTypeForm] = useState<TicketTypeForm>(emptyTicketTypeForm());
  const [savingTicketType, setSavingTicketType] = useState(false);

  const [workshops, setWorkshops] = useState<WorkshopRow[]>([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(false);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopRow | null>(null);
  const [workshopForm, setWorkshopForm] = useState<WorkshopForm>(emptyWorkshopForm());
  const [savingWorkshop, setSavingWorkshop] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  // Evento a administrar. eventIdRef é atualizado de imediato ao trocar, para que
  // respostas de pedidos feitos para o evento anterior sejam descartadas.
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => readStoredEventId());
  const eventIdRef = useRef<string | null>(selectedEventId);
  const currentEvent = events.find((ev) => ev.id === selectedEventId) || null;
  const currentEventName = currentEvent?.name ?? '';

  const token = session?.access_token ?? null;
  const authHeader = token ? `Bearer ${token}` : null;
  const canEdit = adminUser?.role === 'edit' || adminUser?.role === 'superadmin';
  const isSuperAdmin = adminUser?.role === 'superadmin';

  // "Enviar para produção": só aparece no admin de teste, para superadmin, quando o servidor está configurado
  const [promoteAvailable, setPromoteAvailable] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [promoteMsg, setPromoteMsg] = useState<string | null>(null);

  // Limpa TODOS os dados ligados ao evento (listas, seleções, modais e mensagens)
  function clearEventData() {
    setData([]);
    setSelected(null);
    setTicketTypes([]);
    setOrders([]);
    setSelectedOrder(null);
    setTickets([]);
    setSelectedTicket(null);
    setCoupons([]);
    setWorkshops([]);
    setSelectedWorkshopId(null);
    setLoading(false);
    setLoadingTicketTypes(false);
    setLoadingOrders(false);
    setLoadingTickets(false);
    setLoadingCoupons(false);
    setLoadingWorkshops(false);
    setInvoiceModal(null);
    setInvoiceError(null);
    setInvoiceEmailMsg(null);
    setInvoiceModalError(null);
    setResendMsg(null);
    setCreditNoteModal(null);
    setCreditNoteError(null);
    setRefundModal(null);
    setRefundError(null);
    setDuplicateModal(null);
    setDuplicateError(null);
    setCouponModalOpen(false);
    setEditingCoupon(null);
    setIsTicketTypeModalOpen(false);
    setEditingTicketType(null);
    setTicketTypeForm(emptyTicketTypeForm());
    setIsWorkshopModalOpen(false);
    setEditingWorkshop(null);
    setWorkshopForm(emptyWorkshopForm());
    setUpdatingId(null);
    setError(null);
  }

  function selectEvent(id: string | null) {
    eventIdRef.current = id;
    clearEventData();
    setSelectedEventId(id);
    writeStoredEventId(id);
  }

  async function fetchEvents() {
    if (!authHeader) return;
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const res = await fetch('/api/admin/events', { headers: { Authorization: authHeader } });
      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }
      const json = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(json)) {
        setEventsError(json?.message || 'Falha ao carregar eventos');
        return;
      }
      const rows = json as EventRow[];
      setEvents(rows);
      // Repõe a escolha guardada; se o evento já não existir, obriga a escolher de novo
      const wanted = eventIdRef.current ?? readStoredEventId();
      if (wanted && rows.some((ev) => ev.id === wanted)) {
        if (eventIdRef.current !== wanted) {
          eventIdRef.current = wanted;
          setSelectedEventId(wanted);
        }
      } else if (wanted) {
        selectEvent(null);
      }
    } catch {
      setEventsError('Erro inesperado ao carregar eventos');
    } finally {
      setLoadingEvents(false);
    }
  }

  // true se a resposta ainda corresponde ao evento selecionado (senão é descartada)
  function isCurrentEvent(eventId: string) {
    return eventIdRef.current === eventId;
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadAdminUser(session.access_token);
      } else {
        setAdminUser(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadAdminUser(accessToken: string) {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin?route=me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data);
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
      } else {
        setAuthError('O teu email não tem acesso ao admin. Contacta o administrador.');
        await supabase.auth.signOut();
      }
    } catch {
      setAuthError('Erro de ligação ao verificar acesso.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setAuthError(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
  }

  async function fetchLogs() {
    if (!authHeader) return;
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin?route=audit-log', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) setLogs(await res.json());
    } finally {
      setLoadingLogs(false);
    }
  }

  async function fetchAdminUsers() {
    if (!authHeader) return;
    setLoadingAdminUsers(true);
    try {
      const res = await fetch('/api/admin?route=admin-users', { headers: { Authorization: authHeader } });
      if (res.ok) setAdminUsers(await res.json());
    } finally {
      setLoadingAdminUsers(false);
    }
  }

  async function saveAdminUser(e: React.FormEvent) {
    e.preventDefault();
    if (!authHeader) return;
    const email = adminUserForm.email.trim().toLowerCase();
    if (!email) return;
    setSavingAdminUser(true);
    try {
      const res = await fetch('/api/admin?route=admin-users', {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: adminUserForm.name.trim() || null, role: adminUserForm.role }),
      });
      if (res.ok) {
        setAdminUserForm({ email: '', name: '', role: 'view' });
        await fetchAdminUsers();
      } else {
        const json = await res.json().catch(() => null);
        setError(json?.message || 'Erro ao adicionar utilizador.');
      }
    } catch {
      setError('Erro ao adicionar utilizador.');
    } finally {
      setSavingAdminUser(false);
    }
  }

  async function updateAdminUserRole(email: string, role: AdminRole) {
    if (!authHeader) return;
    const res = await fetch(`/api/admin?route=admin-users/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) await fetchAdminUsers();
    else { const j = await res.json().catch(() => null); setError(j?.message || 'Erro ao atualizar role.'); }
  }

  async function toggleAdminUserActive(email: string, active: boolean) {
    if (!authHeader) return;
    const res = await fetch(`/api/admin?route=admin-users/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (res.ok) await fetchAdminUsers();
    else { const j = await res.json().catch(() => null); setError(j?.message || 'Erro ao atualizar estado.'); }
  }

  async function deleteAdminUser(email: string) {
    if (!authHeader) return;
    if (!confirm(`Remover o acesso de ${email}?`)) return;
    const res = await fetch(`/api/admin?route=admin-users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    });
    if (res.ok) await fetchAdminUsers();
    else { const j = await res.json().catch(() => null); setError(j?.message || 'Erro ao remover utilizador.'); }
  }

  async function fetchLeads() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoading(true);
    try {
      const res = await fetch(withEventId('/api/admin/leads', eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao carregar leads');
        return;
      }

      const rows = (await res.json()) as LeadRow[];
      if (!isCurrentEvent(eventId)) return;
      setData(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar leads');
    } finally {
      if (isCurrentEvent(eventId)) setLoading(false);
    }
  }

  async function fetchCoupons() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoadingCoupons(true);

    try {
      const res = await fetch(withEventId('/api/admin/coupons', eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      const data = await res.json();
      if (!isCurrentEvent(eventId)) return;

      if (res.ok) {
        setCoupons(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        setError(data?.error || data?.message || 'Erro ao carregar coupons.');
      }
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar coupons.');
    } finally {
      if (isCurrentEvent(eventId)) setLoadingCoupons(false);
    }
  }

  async function fetchTicketTypes() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoadingTicketTypes(true);
    try {
      const res = await fetch(withEventId('/api/admin/ticket-types', eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao carregar lotes');
        return;
      }

      const rows = (await res.json()) as TicketTypeRow[];
      if (!isCurrentEvent(eventId)) return;
      setTicketTypes(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar lotes');
    } finally {
      if (isCurrentEvent(eventId)) setLoadingTicketTypes(false);
    }
  }

  async function fetchOrders() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(withEventId(`/api/admin/orders?_=${Date.now()}`, eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao carregar pagamentos');
        return;
      }

      const rows = (await res.json()) as OrderRow[];
      if (!isCurrentEvent(eventId)) return;
      setOrders(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar pagamentos');
    } finally {
      if (isCurrentEvent(eventId)) setLoadingOrders(false);
    }
  }

  async function resendEmail(orderId: string, type: 'ticket' | 'invoice') {
    if (!authHeader) return;
    setResendingEmail(type);
    setResendMsg(null);
    try {
      const res = await fetch(withEventId('/api/admin/resend-email', eventIdRef.current || ''), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, type }),
      });
      const json = await res.json();
      setResendMsg({ ok: res.ok, text: json.message || (res.ok ? 'Enviado!' : 'Erro desconhecido') });
    } catch (e: any) {
      setResendMsg({ ok: false, text: e?.message || 'Erro de rede' });
    } finally {
      setResendingEmail(null);
    }
  }

  function openInvoiceModal(order: OrderRow, ticket?: TicketRow | null) {
    setInvoiceModal({
      orderId: order.id,
      customerName: order.customer_name || '',
      customerEmail: order.customer_email || '',
      form: {
        country: order.customer_country || 'PT',
        nif: ticket?.attendee_nif || '',
      },
    });
    setInvoiceModalError(null);
  }

  async function confirmInvoiceModal() {
    if (!invoiceModal || !authHeader) return;
    setSavingInvoiceModal(true);
    setInvoiceModalError(null);
    const { orderId, form } = invoiceModal;
    setInvoiceModal(null);
    try {
      await generateInvoice(orderId, { customer_country: form.country, attendee_nif: form.nif });
    } catch (e: any) {
      setInvoiceModalError(e?.message || 'Erro de rede');
    } finally {
      setSavingInvoiceModal(false);
    }
  }

  async function generateInvoice(orderId: string, overrides?: { customer_country?: string; attendee_nif?: string }) {
    if (!authHeader) return;
    setGeneratingInvoice(orderId);
    setInvoiceError(null);
    try {
      const res = await fetch(withEventId('/api/admin/invoice', eventIdRef.current || ''), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, ...overrides }),
      });
      const json = await res.json();
      if (!res.ok) {
        setInvoiceError({ orderId, msg: json.message || 'Erro desconhecido' });
      } else {
        setOrders(prev => prev.map(o =>
          o.id === orderId
            ? { ...o, invoice_id: json.invoiceId ?? null, invoice_number: json.invoiceNumber ?? null }
            : o
        ));
      }
    } catch (e: any) {
      setInvoiceError({ orderId, msg: e?.message || 'Erro de rede' });
    } finally {
      setGeneratingInvoice(null);
    }
  }

  async function sendInvoiceEmail(orderId: string) {
    if (!authHeader) return;
    setSendingInvoiceEmail(orderId);
    setInvoiceEmailMsg(null);
    try {
      const res = await fetch(withEventId('/api/admin/resend-email', eventIdRef.current || ''), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, type: 'invoice' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setInvoiceEmailMsg({ orderId, ok: false, text: json.message || 'Erro desconhecido' });
      } else {
        setInvoiceEmailMsg({ orderId, ok: true, text: 'Email com fatura enviado!' });
      }
    } catch (e: any) {
      setInvoiceEmailMsg({ orderId, ok: false, text: e?.message || 'Erro de rede' });
    } finally {
      setSendingInvoiceEmail(null);
    }
  }

  async function generateCreditNote(orderId: string, motivo: string) {
    if (!authHeader) return;
    setGeneratingCreditNote(true);
    setCreditNoteError(null);
    try {
      const res = await fetch(withEventId('/api/admin/credit-note', eventIdRef.current || ''), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, motivo }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCreditNoteError(json.message || 'Erro desconhecido');
      } else {
        setCreditNoteModal(null);
        setCreditNoteMotivo('');
        setCreditNoteCustom('');
        await fetchOrders();
        await fetchTickets();
      }
    } catch (e: any) {
      setCreditNoteError(e?.message || 'Erro de rede');
    } finally {
      setGeneratingCreditNote(false);
    }
  }

  async function markAsRefunded(orderId: string, motivo?: string) {
    if (!authHeader) return;
    setMarkingRefund(true);
    setRefundError(null);
    try {
      const body: Record<string, unknown> = { order_id: orderId };
      if (motivo) body.motivo = motivo;
      const res = await fetch(withEventId('/api/admin/refund', eventIdRef.current || ''), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setRefundError(json.message || 'Erro ao marcar estorno');
      } else {
        setRefundModal(null);
        setRefundMotivo('');
        setRefundCustom('');
        await fetchOrders();
        await fetchTickets();
      }
    } catch (e: any) {
      setRefundError(e?.message || 'Erro de rede');
    } finally {
      setMarkingRefund(false);
    }
  }

  async function markOrderAsDuplicate(orderId: string, markType: 'duplicate' | 'test', active: boolean, creditNoteRef: string) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setMarkingDuplicate(true);
    setDuplicateError(null);
    try {
      const body: Record<string, unknown> = { id: orderId };
      if (markType === 'duplicate') {
        body.is_duplicate = active;
        body.credit_note_ref = active ? (creditNoteRef || null) : null;
        if (active) body.is_test = false;
      } else {
        body.is_test = active;
        if (active) body.is_duplicate = false;
      }
      const res = await fetch(withEventId('/api/admin/orders', eventId), {
        method: 'PATCH',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setDuplicateError(json.message || 'Erro ao guardar');
        return;
      }
      setDuplicateModal(null);
      setDuplicateCreditNoteRef('');
      await fetchOrders();
    } catch (e: any) {
      setDuplicateError(e?.message || 'Erro de rede');
    } finally {
      setMarkingDuplicate(false);
    }
  }

  async function fetchTickets() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoadingTickets(true);
    try {
      const res = await fetch(withEventId(`/api/admin/tickets?_=${Date.now()}`, eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao carregar tickets');
        return;
      }

      const rows = (await res.json()) as TicketRow[];
      if (!isCurrentEvent(eventId)) return;
      setTickets(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar tickets');
    } finally {
      if (isCurrentEvent(eventId)) setLoadingTickets(false);
    }
  }

  async function patchStatus(id: string, status: LeadStatus) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setUpdatingId(id);

    try {
      const res = await fetch(withEventId(`/api/admin/leads/${encodeURIComponent(id)}`, eventId), {
        method: 'PATCH',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao atualizar status');
        return;
      }

      if (!isCurrentEvent(eventId)) return;
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      setError(null);
    } catch {
      setError('Erro inesperado ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function softDeleteLead(id: string) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    if (!confirm(`Deseja marcar este lead do evento "${currentEventName}" como Deleted?`)) return;

    setUpdatingId(id);
    try {
      const res = await fetch(withEventId(`/api/admin/leads/${encodeURIComponent(id)}`, eventId), {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao marcar como Deleted');
        return;
      }

      if (!isCurrentEvent(eventId)) return;
      setData((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
      setError(null);
    } catch {
      setError('Erro inesperado ao marcar como Deleted');
    } finally {
      setUpdatingId(null);
    }
  }

  function openCreateTicketTypeModal() {
    setEditingTicketType(null);
    setTicketTypeForm(emptyTicketTypeForm());
    setIsTicketTypeModalOpen(true);
    setError(null);
  }

  function openEditTicketTypeModal(row: TicketTypeRow) {
    setEditingTicketType(row);
    setTicketTypeForm(toTicketTypeForm(row));
    setIsTicketTypeModalOpen(true);
    setError(null);
  }

  function closeTicketTypeModal() {
    if (savingTicketType) return;
    setIsTicketTypeModalOpen(false);
    setEditingTicketType(null);
    setTicketTypeForm(emptyTicketTypeForm());
  }

  function updateTicketTypeForm<K extends keyof TicketTypeForm>(key: K, value: TicketTypeForm[K]) {
    setTicketTypeForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetCouponForm() {
    setEditingCoupon(null);
    setCouponForm({
      code: '',
      email: '',
      discount_type: 'percent',
      discount_percent: '10',
      discount_amount: '',
      recording_only: false,
      single_use: true,
      active: true,
      expires_at: '',
    });
  }

  function openCreateCoupon() {
    resetCouponForm();
    setCouponModalOpen(true);
  }

  function openEditCoupon(row: CouponRow) {
    setEditingCoupon(row);
    const hasAmount = row.discount_amount != null;
    setCouponForm({
      code: row.code || '',
      email: row.email || '',
      discount_type: hasAmount ? 'amount' : 'percent',
      discount_percent: row.discount_percent != null ? String(row.discount_percent) : '10',
      discount_amount: hasAmount ? String(row.discount_amount! / 100) : '',
      recording_only: Boolean(row.recording_only),
      single_use: Boolean(row.single_use),
      active: Boolean(row.active),
      expires_at: row.expires_at ? row.expires_at.slice(0, 10) : '',
    });
    setCouponModalOpen(true);
  }

  async function saveCoupon() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;

    try {
      setSavingCoupon(true);

      const payload = {
        ...(editingCoupon ? { id: editingCoupon.id } : {}),
        code: couponForm.code,
        email: couponForm.email || null,
        discount_percent: couponForm.discount_type === 'percent' ? Number(couponForm.discount_percent) : null,
        discount_amount: couponForm.discount_type === 'amount' ? couponForm.discount_amount : null,
        recording_only: couponForm.recording_only,
        single_use: couponForm.single_use,
        active: couponForm.active,
        expires_at: couponForm.expires_at || null,
      };

      const res = await fetch(withEventId('/api/admin/coupons', eventId), {
        method: editingCoupon ? 'PATCH' : 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(data?.error || 'Erro ao guardar coupon.');
        return;
      }

      setCouponModalOpen(false);
      resetCouponForm();
      fetchCoupons();
      setError(null);
    } catch {
      setError('Erro ao guardar coupon.');
    } finally {
      setSavingCoupon(false);
    }
  }

  async function deleteCoupon(row: CouponRow) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    const id = row.id;

    const confirmed = window.confirm(`Tem a certeza que quer apagar o coupon "${row.code}" do evento "${currentEventName}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(withEventId('/api/admin/coupons', eventId), {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(data?.error || 'Erro ao apagar coupon.');
        return;
      }

      fetchCoupons();
      setError(null);
    } catch {
      setError('Erro ao apagar coupon.');
    }
  }

  async function toggleCouponActive(row: CouponRow) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    if (row.active && !confirm(`Desativar o coupon "${row.code}" do evento "${currentEventName}"?`)) return;

    try {
      const res = await fetch(withEventId('/api/admin/coupons', eventId), {
        method: 'PATCH',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: row.id,
          active: !row.active,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(data?.error || 'Erro ao alterar estado do coupon.');
        return;
      }

      fetchCoupons();
      setError(null);
    } catch {
      setError('Erro ao alterar estado do coupon.');
    }
  }

  async function saveTicketType(e: React.FormEvent) {
    e.preventDefault();
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;

    const priceEuros = Number(ticketTypeForm.price.replace(',', '.'));
    const price = Math.round(priceEuros * 100);
    const workshopPriceEuros = Number((ticketTypeForm.workshop_price || '0').replace(',', '.'));
    const workshopPrice = Math.round(workshopPriceEuros * 100);
    const quantityTotal = Number(ticketTypeForm.quantity_total);
    const sortOrder = Number(ticketTypeForm.sort_order);

    if (!ticketTypeForm.name.trim()) {
      setError('Nome do lote é obrigatório');
      return;
    }

    if (!Number.isFinite(priceEuros) || priceEuros < 0) {
      setError('Preço inválido');
      return;
    }

    if (!Number.isFinite(workshopPriceEuros) || workshopPriceEuros < 0) {
      setError('Preço do workshop inválido');
      return;
    }

    if (!Number.isInteger(quantityTotal) || quantityTotal < 0) {
      setError('Quantidade total inválida');
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError('Ordem inválida');
      return;
    }

    // Activating: check if another lote is already active
    if (ticketTypeForm.active) {
      const currentActive = ticketTypes.find(t => t.active && t.id !== editingTicketType?.id);
      if (currentActive) {
        const confirmed = confirm(
          `Evento "${currentEventName}": o lote "${currentActive.name}" está ativo e será desativado para ativar "${ticketTypeForm.name.trim()}". Continuar?`
        );
        if (!confirmed) return;

        try {
          const deactivateRes = await fetch(withEventId(`/api/admin/ticket-types/${encodeURIComponent(currentActive.id)}`, eventId), {
            method: 'PATCH',
            headers: { Authorization: authHeader!, 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: false }),
          });
          if (!deactivateRes.ok) {
            const json = await deactivateRes.json().catch(() => null);
            setError(json?.message || 'Falha ao desativar lote atual');
            return;
          }
        } catch {
          setError('Erro ao desativar lote atual');
          return;
        }
      }
    }

    setSavingTicketType(true);

    try {
      const payload = {
        name: ticketTypeForm.name.trim(),
        price,
        workshop_price: workshopPrice,
        currency: ticketTypeForm.currency.trim().toLowerCase() || 'eur',
        quantity_total: quantityTotal,
        sort_order: sortOrder,
        active: ticketTypeForm.active,
      };

      const url = withEventId(
        editingTicketType
          ? `/api/admin/ticket-types/${encodeURIComponent(editingTicketType.id)}`
          : '/api/admin/ticket-types',
        eventId
      );

      const method = editingTicketType ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(json?.message || 'Falha ao guardar lote');
        return;
      }

      await fetchTicketTypes();
      closeTicketTypeModal();
      setError(null);
    } catch {
      setError('Erro inesperado ao guardar lote');
    } finally {
      setSavingTicketType(false);
    }
  }

  async function archiveTicketType(row: TicketTypeRow) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    if (!confirm(`Deseja desativar o lote "${row.name}" do evento "${currentEventName}"?`)) return;

    setUpdatingId(row.id);

    try {
      const res = await fetch(withEventId(`/api/admin/ticket-types/${encodeURIComponent(row.id)}`, eventId), {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(json?.message || 'Falha ao desativar lote');
        return;
      }

      await fetchTicketTypes();
      setError(null);
    } catch {
      setError('Erro inesperado ao desativar lote');
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleTicketTypeActive(row: TicketTypeRow) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;

    if (row.active && !confirm(`Desativar o lote "${row.name}" do evento "${currentEventName}"?`)) return;

    // Activating: check if another lote is already active
    if (!row.active) {
      const currentActive = ticketTypes.find(t => t.active && t.id !== row.id);
      if (currentActive) {
        const confirmed = confirm(
          `Evento "${currentEventName}": o lote "${currentActive.name}" está ativo e será desativado para ativar "${row.name}". Continuar?`
        );
        if (!confirmed) return;

        // Deactivate current active first
        setUpdatingId(row.id);
        try {
          const deactivateRes = await fetch(withEventId(`/api/admin/ticket-types/${encodeURIComponent(currentActive.id)}`, eventId), {
            method: 'PATCH',
            headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: false }),
          });
          if (!deactivateRes.ok) {
            const json = await deactivateRes.json().catch(() => null);
            setError(json?.message || 'Falha ao desativar lote atual');
            setUpdatingId(null);
            return;
          }
        } catch {
          setError('Erro ao desativar lote atual');
          setUpdatingId(null);
          return;
        }
      }
    }

    setUpdatingId(row.id);

    try {
      const res = await fetch(withEventId(`/api/admin/ticket-types/${encodeURIComponent(row.id)}`, eventId), {
        method: 'PATCH',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !row.active }),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(json?.message || 'Falha ao alterar estado do lote');
        return;
      }

      await fetchTicketTypes();
      setError(null);
    } catch {
      setError('Erro inesperado ao alterar estado do lote');
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Workshops ──────────────────────────────────────────────────────────
  async function fetchWorkshops() {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    setLoadingWorkshops(true);
    try {
      const res = await fetch(withEventId(`/api/admin/workshops?_=${Date.now()}`, eventId), {
        headers: { Authorization: authHeader },
      });
      if (!isCurrentEvent(eventId)) return;

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError('Falha ao carregar workshops');
        return;
      }

      const rows = (await res.json()) as WorkshopRow[];
      if (!isCurrentEvent(eventId)) return;
      setWorkshops(Array.isArray(rows) ? rows : []);
      setError(null);
    } catch {
      if (isCurrentEvent(eventId)) setError('Erro inesperado ao carregar workshops');
    } finally {
      if (isCurrentEvent(eventId)) setLoadingWorkshops(false);
    }
  }

  function openCreateWorkshopModal() {
    setEditingWorkshop(null);
    setWorkshopForm(emptyWorkshopForm());
    setIsWorkshopModalOpen(true);
    setError(null);
  }

  function openEditWorkshopModal(row: WorkshopRow) {
    setEditingWorkshop(row);
    setWorkshopForm(toWorkshopForm(row));
    setIsWorkshopModalOpen(true);
    setError(null);
  }

  function closeWorkshopModal() {
    if (savingWorkshop) return;
    setIsWorkshopModalOpen(false);
    setEditingWorkshop(null);
    setWorkshopForm(emptyWorkshopForm());
  }

  function updateWorkshopForm<K extends keyof WorkshopForm>(key: K, value: WorkshopForm[K]) {
    setWorkshopForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateFacilitator(index: number, key: keyof FacilitatorForm, value: string) {
    setWorkshopForm((prev) => ({
      ...prev,
      facilitators: prev.facilitators.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    }));
  }

  function addFacilitator() {
    setWorkshopForm((prev) => ({ ...prev, facilitators: [...prev.facilitators, emptyFacilitatorForm()] }));
  }

  function removeFacilitator(index: number) {
    setWorkshopForm((prev) => ({ ...prev, facilitators: prev.facilitators.filter((_, i) => i !== index) }));
  }

  async function saveWorkshop(e: React.FormEvent) {
    e.preventDefault();
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;

    const capacity = Number(workshopForm.capacity);
    const sortOrder = Number(workshopForm.sort_order);

    if (!workshopForm.title.trim()) {
      setError('Título do workshop é obrigatório');
      return;
    }

    if (workshopForm.capacity.trim() === '' || !Number.isInteger(capacity) || capacity < 0) {
      setError('Capacidade inválida');
      return;
    }

    if (editingWorkshop && capacity < Number(editingWorkshop.sold ?? 0)) {
      setError(`A capacidade não pode ser inferior às vagas já vendidas (${editingWorkshop.sold})`);
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError('Ordem inválida');
      return;
    }

    setSavingWorkshop(true);

    try {
      const payload = {
        title: workshopForm.title.trim(),
        short_description: workshopForm.short_description,
        description: workshopForm.description,
        takeaways: workshopForm.takeaways
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean),
        facilitators: workshopForm.facilitators.filter((f) => f.name.trim()),
        image_url: workshopForm.image_url,
        starts_at: workshopForm.starts_at,
        ends_at: workshopForm.ends_at,
        room: workshopForm.room,
        level: workshopForm.level,
        capacity,
        sort_order: sortOrder,
        active: workshopForm.active,
      };

      const url = withEventId(
        editingWorkshop
          ? `/api/admin/workshops/${encodeURIComponent(editingWorkshop.id)}`
          : '/api/admin/workshops',
        eventId
      );

      const res = await fetch(url, {
        method: editingWorkshop ? 'PATCH' : 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(json?.message || 'Falha ao guardar workshop');
        return;
      }

      await fetchWorkshops();
      closeWorkshopModal();
      setError(null);
    } catch {
      setError('Erro inesperado ao guardar workshop');
    } finally {
      setSavingWorkshop(false);
    }
  }

  async function toggleWorkshopActive(row: WorkshopRow) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    if (row.active && !confirm(`Desativar o workshop "${row.title}" do evento "${currentEventName}"?`)) return;
    setUpdatingId(row.id);

    try {
      const res = await fetch(withEventId(`/api/admin/workshops/${encodeURIComponent(row.id)}`, eventId), {
        method: 'PATCH',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !row.active }),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        await supabase.auth.signOut();
        setAdminUser(null);
        setError('Sessão expirada. Por favor volta a entrar.');
        return;
      }

      if (!res.ok) {
        setError(json?.message || 'Falha ao alterar estado do workshop');
        return;
      }

      await fetchWorkshops();
      setError(null);
    } catch {
      setError('Erro inesperado ao alterar estado do workshop');
    } finally {
      setUpdatingId(null);
    }
  }

  // Inscritos por workshop: tickets válidos (sem testes/duplicados e sem order estornada) com workshop_id
  function getWorkshopAttendees(workshopId?: string | null) {
    const ordersById = new Map(orders.map((o) => [o.id, o]));
    return tickets
      .filter((t) => {
        if (!t.workshop_id) return false;
        if (workshopId && t.workshop_id !== workshopId) return false;
        const o = t.order_id ? ordersById.get(t.order_id) : undefined;
        return Boolean(o) && !o!.is_duplicate && !o!.is_test && !o!.refunded_at;
      })
      .sort((a, b) => attendeeDisplayName(a).localeCompare(attendeeDisplayName(b), 'pt-PT'));
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Invalida pedidos em curso e limpa todos os dados do evento
    eventIdRef.current = null;
    clearEventData();
    setAdminUser(null);
    setSession(null);
    setEvents([]);
    setLogs([]);
    setAdminUsers([]);
    resetCouponForm();
    setTab('tickets');
    // A escolha guardada (localStorage) é reposta por fetchEvents no próximo login
    setSelectedEventId(null);
  };

  // Lista de eventos (para a faixa e para o ecrã de escolha)
  useEffect(() => {
    if (!adminUser) return;
    fetchEvents();
  }, [adminUser?.email]);

  useEffect(() => {
    setPromoteAvailable(false);
    if (!adminUser || !authHeader || adminUser.role !== 'superadmin') return;
    fetch('/api/admin/promote', { headers: { Authorization: authHeader } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setPromoteAvailable(Boolean(json?.available)))
      .catch(() => setPromoteAvailable(false));
  }, [adminUser?.email, adminUser?.role]);

  // Copia registos deste evento para a base de produção (cria ou atualiza; vendas/usos não são copiados)
  async function promoteToProd(table: 'ticket-types' | 'workshops' | 'coupons', what: string, ids?: string[]) {
    const eventId = eventIdRef.current;
    if (!authHeader || !eventId) return;
    if (!confirm(`Enviar ${what} do evento "${currentEventName}" para PRODUÇÃO?\n\nO que já existir lá com o mesmo nome é atualizado; vendas e usos de produção ficam como estão.`)) return;

    setPromoting(ids?.length === 1 ? ids[0] : table);
    setPromoteMsg(null);
    try {
      const res = await fetch(withEventId('/api/admin/promote', eventId), {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, ids }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.message || 'Falha ao enviar para produção');
        return;
      }
      const results: Array<{ label: string; status: string; message?: string }> = json?.results || [];
      const failed = results.filter((r) => r.status === 'erro');
      const ok = results.filter((r) => r.status !== 'erro');
      if (ok.length) setPromoteMsg(`Enviado para produção: ${ok.map((r) => `${r.label} (${r.status})`).join(', ')}`);
      if (failed.length) setError(`Não enviado: ${failed.map((r) => `${r.label}: ${r.message}`).join(' · ')}`);
    } catch {
      setError('Erro inesperado ao enviar para produção');
    } finally {
      setPromoting(null);
    }
  }

  // Dados do separador atual, sempre do evento selecionado (nada é pedido sem evento)
  useEffect(() => {
    if (!adminUser) return;
    if (tab === 'logs') { fetchLogs(); return; }
    if (tab === 'adminUsers') { fetchAdminUsers(); return; }
    if (!currentEvent || eventIdRef.current !== currentEvent.id) return;
    if (tab === 'leads') fetchLeads();
    if (tab === 'ticketTypes') fetchTicketTypes();
    if (tab === 'workshops') { fetchWorkshops(); fetchTickets(); fetchOrders(); }
    if (tab === 'orders') { fetchOrders(); fetchTickets(); }
    if (tab === 'tickets') { fetchTickets(); fetchOrders(); fetchWorkshops(); fetchTicketTypes(); }
    if (tab === 'coupons') fetchCoupons();
  }, [adminUser?.email, tab, currentEvent?.id]);

  function downloadCsv() {
    if (!currentEvent) return;
    const evName = currentEvent.name;
    const evSlug = currentEvent.slug;
    const today = new Date().toISOString().slice(0, 10);
    const escape = (v: unknown) => {
      const s = safe(v).replace(/\r?\n/g, ' ').trim();
      if (s.includes('"') || s.includes(',') || s.includes(';')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    // Todas as exportações levam a coluna "evento" (primeira) e o slug do evento no nome do ficheiro
    const csvLines = (headers: string[], rows: unknown[][]) => [
      ['evento', ...headers].join(','),
      ...rows.map((row) => [evName, ...row].map((v) => escape(v)).join(',')),
    ];
    const rowsFrom = (headers: string[], list: unknown[]) =>
      list.map((row) => headers.map((h) => (row as any)[h]));

    if (tab === 'ticketTypes') {
      const headers = [
        'id',
        'sort_order',
        'name',
        'price',
        'workshop_price',
        'currency',
        'quantity_total',
        'quantity_sold',
        'active',
        'created_at',
      ];

      const lines = csvLines(headers, rowsFrom(headers, ticketTypes));

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-types-${evSlug}-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (tab === 'workshops') {
      // Exporta os inscritos (do workshop selecionado ou de todos), útil para check-in nas salas
      const workshopsById = new Map(workshops.map((w) => [w.id, w]));
      const headers = ['workshop', 'horario', 'sala', 'nome', 'email', 'empresa', 'checked_in', 'ticket_id'];
      const rows = getWorkshopAttendees(selectedWorkshopId)
        .slice()
        .sort((a, b) =>
          (workshopsById.get(a.workshop_id!)?.sort_order ?? 0) - (workshopsById.get(b.workshop_id!)?.sort_order ?? 0)
        )
        .map((t) => {
          const w = workshopsById.get(t.workshop_id!);
          return [
            w?.title ?? t.workshop_id,
            formatWorkshopSchedule(w),
            w?.room,
            attendeeDisplayName(t),
            t.attendee_email,
            t.attendee_company,
            t.checked_in ? 'sim' : 'não',
            t.id,
          ];
        });

      const lines = csvLines(headers, rows);

      const selectedTitle = selectedWorkshopId ? workshopsById.get(selectedWorkshopId)?.title : null;
      const slug = selectedTitle
        ? selectedTitle.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'todos';

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workshop-inscritos-${evSlug}-${slug}-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (tab === 'orders') {
      const headers = [
        'id',
        'created_at',
        'status',
        'total_amount',
        'customer_name',
        'customer_email',
        'customer_country',
        'customer_nif',
        'invoice_id',
        'is_duplicate',
        'credit_note_ref',
      ];

      const exportRows = showHidden ? orders : orders.filter(o => !o.is_duplicate && !o.is_test);
      const lines = csvLines(headers, rowsFrom(headers, exportRows));

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${evSlug}-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (tab === 'tickets') {
      const headers = [
        'id',
        'created_at',
        'order_id',
        'ticket_type_id',
        'attendee_name',
        'attendee_email',
        'attendee_first_name',
        'attendee_last_name',
        'attendee_country',
        'attendee_job_function',
        'attendee_job_function_other',
        'attendee_nif',
        'attendee_company',
        'attendee_job_title',
        'attendee_tshirt',
        'sa_data_sharing_consent',
        'sa_marketing_consent',
        'privacy_consent',
        'checked_in',
        'check_in_at',
        'workshop_id',
      ];

      const exportTickets = showHidden ? tickets : tickets.filter(t => { const o = orders.find(ord => ord.id === t.order_id); return !o?.is_duplicate && !o?.is_test; });
      const lines = csvLines(headers, rowsFrom(headers, exportTickets));

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${evSlug}-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (tab === 'coupons') {
      const headers = [
        'id',
        'created_at',
        'code',
        'email',
        'discount_percent',
        'single_use',
        'active',
        'used_at',
        'used_by_order_id',
      ];

      const lines = csvLines(headers, rowsFrom(headers, coupons));

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coupons-${evSlug}-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const headers = [
      'id',
      'created_at',
      'type',
      'name',
      'email',
      'phone',
      'company',
      'role',
      'portfolio',
      'status',
      'message',
    ];

    const lines = csvLines(headers, rowsFrom(headers, data));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${evSlug}-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Admin</h2>
              <p className="text-sm text-gray-500">Acesso restrito</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {authError && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {authError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition"
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.8 7.2v6h7.8c4.5-4.2 7.4-10.4 7.4-17.5z"/><path fill="#34A853" d="M24 48c6.5 0 12-2.2 16-5.9l-7.8-6c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.7 14.6 48 24 48z"/><path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5v-6.2H2.4C.9 16.6 0 20.2 0 24s.9 7.4 2.4 10.7l8.1-6.2z"/><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.3 30.4 0 24 0 14.6 0 6.4 5.3 2.4 13.3l8.1 6.2C12.4 13.7 17.7 9.5 24 9.5z"/></svg>
            Entrar com Google
          </button>

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-2xl bg-gray-100 text-gray-600 font-semibold py-3 text-sm hover:bg-gray-200"
          >
            Voltar ao site
          </button>
        </div>
      </div>
    );
  }

  // ── Escolha obrigatória do evento (antes de mostrar qualquer dado) ─────
  if (!currentEvent) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Escolhe o evento</h2>
              <p className="text-sm text-gray-500">
                Todos os dados do admin (lotes, workshops, encomendas, bilhetes, cupões e leads) são de um único evento.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {eventsError && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {eventsError}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loadingEvents && events.length === 0 ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-brand-darkBlue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-600 mb-4">Não há eventos disponíveis.</p>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => {
                const color = eventColor(ev);
                return (
                  <button
                    key={ev.id}
                    onClick={() => selectEvent(ev.id)}
                    className={`w-full text-left rounded-2xl border-2 px-5 py-4 hover:shadow-md transition ${color.chip}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${color.dot}`} />
                      <span className="text-lg font-black">{ev.name}</span>
                    </div>
                    <div className="text-sm mt-1 ml-6 opacity-80">
                      {formatEventDate(ev.starts_on)}{ev.venue ? ` · ${ev.venue}` : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              onClick={fetchEvents}
              disabled={loadingEvents}
              className="flex-1 rounded-2xl bg-gray-100 text-gray-700 font-semibold py-3 text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              {loadingEvents ? 'A carregar…' : 'Recarregar eventos'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 rounded-2xl bg-gray-100 text-gray-700 font-semibold py-3 text-sm hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ev: EventRow = currentEvent;
  const evColor = eventColor(ev);
  const evDateLabel = formatEventDate(ev.starts_on);
  const isEventTab = tab !== 'logs' && tab !== 'adminUsers';
  // Indicação do evento nos formulários e confirmações
  const eventTag = (
    <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${evColor.chip}`}>
      <span className={`w-2 h-2 rounded-full ${evColor.dot}`} />
      Evento: {ev.name}
    </div>
  );

  // ── Dashboard stats (tickets tab) ──────────────────────────────────────
  const validOrderIds = new Set(
    orders.filter(o => !o.is_duplicate && !o.is_test).map(o => o.id)
  );
  const validTickets = tickets.filter(t => t.order_id && validOrderIds.has(t.order_id));
  const totalTicketsSold = validTickets.length;
  const totalRevenueCents = orders
    .filter(o => validOrderIds.has(o.id))
    .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const totalRecordingTickets = validTickets.filter(t => orders.find(o => o.id === t.order_id)?.include_recording).length;
  const ticketsPerOrder = tickets.reduce((acc, t) => {
    if (t.order_id) acc[t.order_id] = (acc[t.order_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const perLote = ticketTypes
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(tt => {
      const sold = validTickets.filter(t => t.ticket_type_id === tt.id).length;
      const capacity = tt.quantity_total ?? 0;
      return { id: tt.id, name: tt.name, sold, capacity };
    })
    .filter(lt => lt.capacity > 0 || lt.sold > 0);

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-4 rounded-3xl bg-gray-50 shadow-2xl overflow-hidden flex flex-col">
        {/* Faixa do evento: sempre visível, cor própria por evento */}
        <div className={`shrink-0 px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap ${evColor.band}`}>
          <div className="text-sm">
            A administrar: <strong className="text-base font-black">{ev.name}</strong>
            <span className="opacity-80"> · {evDateLabel}{ev.venue ? ` · ${ev.venue}` : ''}</span>
          </div>
          <button
            onClick={() => selectEvent(null)}
            className="rounded-xl bg-white/90 hover:bg-white text-gray-900 px-4 py-1.5 text-sm font-bold"
          >
            Trocar evento
          </button>
        </div>

        <header className="bg-white border-b px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{ev.name}</h1>
            <p className="text-sm text-gray-500">Painel de administração</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {canEdit && tab === 'ticketTypes' && (
              <button
                onClick={openCreateTicketTypeModal}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-darkBlue text-white px-4 py-2 text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                Novo lote
              </button>
            )}

            {canEdit && tab === 'workshops' && (
              <button
                onClick={openCreateWorkshopModal}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-darkBlue text-white px-4 py-2 text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                Novo workshop
              </button>
            )}

            {canEdit && tab === 'coupons' && (
              <button
                onClick={openCreateCoupon}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-darkBlue text-white px-4 py-2 text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                Novo coupon
              </button>
            )}

            {(tab === 'orders' || tab === 'tickets') && (
              <button
                onClick={() => setShowHidden(v => !v)}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${showHidden ? 'bg-red-100 text-red-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {showHidden ? 'Ocultar testes/duplicados' : 'Mostrar testes/duplicados'}
              </button>
            )}

            {promoteAvailable && (tab === 'ticketTypes' || tab === 'workshops' || tab === 'coupons') && (
              <button
                onClick={() => {
                  if (tab === 'ticketTypes') promoteToProd('ticket-types', 'todos os lotes');
                  if (tab === 'workshops') promoteToProd('workshops', 'todos os workshops');
                  if (tab === 'coupons') promoteToProd('coupons', 'todos os coupons');
                }}
                disabled={promoting !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 text-sm font-bold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Enviar tudo para produção
              </button>
            )}

            {isEventTab && (
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            )}

            <button
              onClick={() => {
                if (tab === 'leads') fetchLeads();
                if (tab === 'ticketTypes') fetchTicketTypes();
                if (tab === 'workshops') { fetchWorkshops(); fetchTickets(); fetchOrders(); }
                if (tab === 'orders') { fetchOrders(); fetchTickets(); }
                if (tab === 'tickets') { fetchTickets(); fetchOrders(); fetchWorkshops(); fetchTicketTypes(); }
                if (tab === 'coupons') fetchCoupons();
                if (tab === 'logs') fetchLogs();
                if (tab === 'adminUsers') fetchAdminUsers();
              }}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-bold"
            >
              Recarregar
            </button>

            {adminUser?.role === 'superadmin' && (
              <button
                onClick={() => setTab('logs')}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'logs' ? 'bg-brand-darkBlue text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Logs
              </button>
            )}

            {adminUser?.role === 'superadmin' && (
              <button
                onClick={() => setTab('adminUsers')}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'adminUsers' ? 'bg-brand-darkBlue text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Utilizadores
              </button>
            )}

            <button
              onClick={handleLogout}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-bold"
            >
              Logout
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        <div className="bg-white border-b px-6">
          <div className="flex gap-2 py-3 flex-wrap">
            {[
              { key: 'leads', label: 'Leads' },
              { key: 'ticketTypes', label: 'Lotes (Tickets)' },
              { key: 'workshops', label: 'Workshops' },
              { key: 'orders', label: 'Orders (Pagamentos)' },
              { key: 'tickets', label: 'Tickets (Participantes)' },
              { key: 'coupons', label: 'Coupons' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as AdminTab)}
                className={`px-4 py-2 rounded-xl text-sm font-black ${tab === item.key
                  ? 'bg-brand-darkBlue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2 flex-wrap">
            {isEventTab && <span className={`w-3 h-3 rounded-full ${evColor.dot}`} />}
            {TAB_TITLES[tab]}
            <span className="text-gray-500 font-bold">
              · {isEventTab ? ev.name : 'todos os eventos'}
            </span>
          </h2>

          {promoteMsg && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              <span className="flex-1">{promoteMsg}</span>
              <button
                type="button"
                onClick={() => setPromoteMsg(null)}
                aria-label="Fechar mensagem"
                className="text-green-600 hover:text-green-800 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* Erro fixo por cima de tudo (incluindo pop-ups abertos), até ser fechado */}
          {error && (
            <div
              role="alert"
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-[min(640px,calc(100%-2rem))] flex items-start gap-3 rounded-2xl bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 shadow-xl"
            >
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Fechar mensagem de erro"
                className="text-red-500 hover:text-red-700 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {tab === 'ticketTypes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total de lotes"
                  value={String(ticketTypes.length)}
                />
                <StatCard
                  label="Lotes ativos"
                  value={String(ticketTypes.filter((t) => t.active).length)}
                />
                <StatCard
                  label="Bilhetes vendidos"
                  value={String(ticketTypes.reduce((sum, t) => sum + Number(t.quantity_sold ?? 0), 0))}
                />
                <StatCard
                  label="Disponíveis"
                  value={String(
                    ticketTypes.reduce(
                      (sum, t) =>
                        sum + Math.max(0, Number(t.quantity_total ?? 0) - Number(t.quantity_sold ?? 0)),
                      0
                    )
                  )}
                />
              </div>

              <div className="overflow-x-auto rounded-3xl bg-white border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <Th>Ordem</Th>
                      <Th>Lote</Th>
                      <Th>Preço</Th>
                      <Th>Workshop</Th>
                      <Th>Total</Th>
                      <Th>Vendidos</Th>
                      <Th>Disponíveis</Th>
                      <Th>Estado</Th>
                      <Th>Ações</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTicketTypes ? (
                      <tr>
                        <Td colSpan={9}>A carregar lotes…</Td>
                      </tr>
                    ) : ticketTypes.length === 0 ? (
                      <tr>
                        <Td colSpan={9}>Sem lotes cadastrados.</Td>
                      </tr>
                    ) : (
                      ticketTypes.map((row) => {
                        const sold = Number(row.quantity_sold ?? 0);
                        const total = Number(row.quantity_total ?? 0);
                        const available = Math.max(0, total - sold);

                        return (
                          <tr key={row.id} className="border-t">
                            <Td>{safe(row.sort_order)}</Td>
                            <Td>
                              <div className="font-bold text-gray-900">{row.name}</div>
                              <div className="text-xs text-gray-500">{row.currency?.toUpperCase()}</div>
                            </Td>
                            <Td>{formatMoneyEURFromCents(row.price)}</Td>
                            <Td>{formatMoneyEURFromCents(row.workshop_price ?? 0)}</Td>
                            <Td>{total}</Td>
                            <Td>{sold}</Td>
                            <Td>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${available > 0
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                                  }`}
                              >
                                {available}
                              </span>
                            </Td>
                            <Td>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${row.active
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                                  }`}
                              >
                                {row.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </Td>
                            <Td>
                              {canEdit && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditTicketTypeModal(row)}
                                    className="inline-flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    Editar
                                  </button>

                                  <button
                                    onClick={() => toggleTicketTypeActive(row)}
                                    disabled={updatingId === row.id}
                                    className="inline-flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2 disabled:opacity-50"
                                  >
                                    <Power className="w-4 h-4" />
                                    {row.active ? 'Desativar' : 'Ativar'}
                                  </button>

                                  <button
                                    onClick={() => archiveTicketType(row)}
                                    disabled={updatingId === row.id}
                                    className="inline-flex items-center gap-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remover
                                  </button>

                                  {promoteAvailable && (
                                    <button
                                      onClick={() => promoteToProd('ticket-types', `o lote "${row.name}"`, [row.id])}
                                      disabled={promoting !== null}
                                      className="inline-flex items-center gap-1 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-2 disabled:opacity-50"
                                    >
                                      <Send className="w-4 h-4" />
                                      {promoting === row.id ? 'A enviar…' : 'Produção'}
                                    </button>
                                  )}
                                </div>
                              )}
                            </Td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'workshops' && (() => {
            const allAttendees = getWorkshopAttendees(null);
            const attendeesCount = allAttendees.reduce((acc, t) => {
              acc[t.workshop_id!] = (acc[t.workshop_id!] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            const selectedWorkshop = workshops.find((w) => w.id === selectedWorkshopId) || null;
            const selectedAttendees = selectedWorkshop
              ? allAttendees.filter((t) => t.workshop_id === selectedWorkshop.id)
              : [];
            const loadingAttendees = loadingTickets || loadingOrders;

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard label="Total de workshops" value={String(workshops.length)} />
                  <StatCard label="Workshops ativos" value={String(workshops.filter((w) => w.active).length)} />
                  <StatCard
                    label="Vagas vendidas"
                    value={String(workshops.reduce((sum, w) => sum + Number(w.sold ?? 0), 0))}
                  />
                  <StatCard
                    label="Vagas disponíveis"
                    value={String(
                      workshops.reduce(
                        (sum, w) => sum + Math.max(0, Number(w.capacity ?? 0) - Number(w.sold ?? 0)),
                        0
                      )
                    )}
                  />
                </div>

                <div className="overflow-x-auto rounded-3xl bg-white border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <Th>Ordem</Th>
                        <Th>Workshop</Th>
                        <Th>Facilitador</Th>
                        <Th>Horário</Th>
                        <Th>Sala</Th>
                        <Th>Vendidas / Capacidade</Th>
                        <Th>Inscritos</Th>
                        <Th>Estado</Th>
                        <Th>Ações</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingWorkshops ? (
                        <tr>
                          <Td colSpan={9}>A carregar workshops…</Td>
                        </tr>
                      ) : workshops.length === 0 ? (
                        <tr>
                          <Td colSpan={9}>Sem workshops criados.</Td>
                        </tr>
                      ) : (
                        workshops.map((row) => {
                          const sold = Number(row.sold ?? 0);
                          const capacity = Number(row.capacity ?? 0);
                          const full = capacity > 0 && sold >= capacity;
                          const isSelected = selectedWorkshopId === row.id;

                          return (
                            <tr
                              key={row.id}
                              className={`border-t hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50/60' : ''}`}
                              onClick={() => setSelectedWorkshopId(isSelected ? null : row.id)}
                            >
                              <Td>{safe(row.sort_order)}</Td>
                              <Td>
                                <div className="font-bold text-gray-900">{row.title}</div>
                                {row.level && <div className="text-xs text-gray-500">{row.level}</div>}
                              </Td>
                              <Td>
                                {workshopFacilitators(row).length ? workshopFacilitators(row).map((f, i) => (
                                  <div key={i} className={i > 0 ? 'mt-1' : undefined}>
                                    <div>{f.name}</div>
                                    {f.role && <div className="text-xs text-gray-500">{f.role}</div>}
                                  </div>
                                )) : '—'}
                              </Td>
                              <Td>{formatWorkshopSchedule(row) || '—'}</Td>
                              <Td>{safe(row.room) || '—'}</Td>
                              <Td>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${full
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                >
                                  {sold} / {capacity}
                                </span>
                                {sold > capacity && (
                                  <div className="text-xs text-red-600 font-bold mt-1">Acima da capacidade</div>
                                )}
                              </Td>
                              <Td>{loadingAttendees ? '…' : (attendeesCount[row.id] ?? 0)}</Td>
                              <Td>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${row.active
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                  {row.active ? 'Ativo' : 'Inativo'}
                                </span>
                              </Td>
                              <Td>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => setSelectedWorkshopId(isSelected ? null : row.id)}
                                    className="inline-flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2"
                                  >
                                    {isSelected ? 'Fechar inscritos' : 'Ver inscritos'}
                                  </button>
                                  {canEdit && (
                                    <>
                                      <button
                                        onClick={() => openEditWorkshopModal(row)}
                                        className="inline-flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2"
                                      >
                                        <Pencil className="w-4 h-4" />
                                        Editar
                                      </button>

                                      <button
                                        onClick={() => toggleWorkshopActive(row)}
                                        disabled={updatingId === row.id}
                                        className="inline-flex items-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2 disabled:opacity-50"
                                      >
                                        <Power className="w-4 h-4" />
                                        {row.active ? 'Desativar' : 'Ativar'}
                                      </button>

                                      {promoteAvailable && (
                                        <button
                                          onClick={() => promoteToProd('workshops', `o workshop "${row.title}"`, [row.id])}
                                          disabled={promoting !== null}
                                          className="inline-flex items-center gap-1 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-2 disabled:opacity-50"
                                        >
                                          <Send className="w-4 h-4" />
                                          {promoting === row.id ? 'A enviar…' : 'Produção'}
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </Td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedWorkshop ? (
                  <div className="rounded-3xl bg-white border p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">Inscritos · {selectedWorkshop.title}</h3>
                        <p className="text-sm text-gray-500">
                          {[formatWorkshopSchedule(selectedWorkshop), selectedWorkshop.room, facilitatorNames(selectedWorkshop)]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>{selectedAttendees.length}</strong> inscrito{selectedAttendees.length === 1 ? '' : 's'}
                          {' · '}
                          <strong>{selectedAttendees.filter((t) => t.checked_in).length}</strong> com check-in
                        </p>
                      </div>
                      <button
                        onClick={downloadCsv}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-bold"
                      >
                        <Download className="w-4 h-4" />
                        Exportar inscritos
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                          <tr>
                            <Th>#</Th>
                            <Th>Nome</Th>
                            <Th>Email</Th>
                            <Th>Empresa</Th>
                            <Th>Check-in</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingAttendees ? (
                            <tr>
                              <Td colSpan={5}>A carregar inscritos…</Td>
                            </tr>
                          ) : selectedAttendees.length === 0 ? (
                            <tr>
                              <Td colSpan={5}>Sem inscritos neste workshop.</Td>
                            </tr>
                          ) : (
                            selectedAttendees.map((t, idx) => (
                              <tr
                                key={t.id}
                                className="border-t hover:bg-gray-50 cursor-pointer"
                                onClick={() => { setSelectedTicket(t); setTicketModalTab('ticket'); }}
                              >
                                <Td>{idx + 1}</Td>
                                <Td>{attendeeDisplayName(t) || '—'}</Td>
                                <Td>{safe(t.attendee_email) || '—'}</Td>
                                <Td>{safe(t.attendee_company) || '—'}</Td>
                                <Td>{t.checked_in ? `Sim · ${formatDatePt(t.check_in_at)}` : 'Não'}</Td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : workshops.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Seleciona um workshop para ver a lista de inscritos. O botão “Exportar” no topo exporta os inscritos de todos os workshops.
                  </p>
                )}
              </div>
            );
          })()}

          {tab === 'leads' && (
            <div className="overflow-x-auto rounded-3xl bg-white border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Data</Th>
                    <Th>Tipo</Th>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Telefone</Th>
                    <Th>Empresa</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <Td colSpan={8}>A carregar…</Td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <Td colSpan={8}>Sem leads.</Td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelected(row)}
                      >
                        <Td>{formatDatePt(row.created_at)}</Td>
                        <Td>{safe(row.type)}</Td>
                        <Td>{safe(row.name)}</Td>
                        <Td>{safe(row.email)}</Td>
                        <Td>{safe(row.phone)}</Td>
                        <Td>{safe(row.company)}</Td>
                        <Td>
                          {canEdit ? (
                            <select
                              value={safe(row.status)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                patchStatus(row.id, e.target.value as LeadStatus);
                              }}
                              disabled={updatingId === row.id}
                              className="rounded-xl border border-gray-300 px-2 py-1"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{safe(row.status)}</span>
                          )}
                        </Td>
                        <Td>
                          {canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                softDeleteLead(row.id);
                              }}
                              className="text-red-600 font-bold"
                              disabled={updatingId === row.id}
                            >
                              Deleted
                            </button>
                          )}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'orders' && (
            <div className="overflow-x-auto rounded-3xl bg-white border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Data</Th>
                    <Th>Cliente</Th>
                    <Th>Email</Th>
                    <Th>Total</Th>
                    <Th>Estado</Th>
                    <Th>Fatura</Th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <Td colSpan={6}>A carregar orders…</Td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <Td colSpan={6}>Sem orders.</Td>
                    </tr>
                  ) : (
                    orders.filter(o => showHidden || (!o.is_duplicate && !o.is_test)).map((row) => (
                      <tr key={row.id} className={`border-t hover:bg-gray-50 cursor-pointer ${(row.is_duplicate || row.is_test) ? 'opacity-50' : ''}`} onClick={() => setSelectedOrder(row)}>
                        <Td>{formatDatePt(row.created_at)}</Td>
                        <Td>
                          {safe(row.customer_name)}
                          {row.is_duplicate && <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">DUP</span>}
                          {row.is_test && <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">TESTE</span>}
                        </Td>
                        <Td>{safe(row.customer_email)}</Td>
                        <Td>{formatMoneyEURFromCents(row.total_amount)}</Td>
                        <Td>{safe(row.status)}</Td>
                        <Td>
                          {row.invoice_id
                            ? <span className="text-green-600 font-medium">{row.invoice_number || row.invoice_id}</span>
                            : <span className="text-orange-500">Pendente</span>}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'tickets' && !loadingTickets && !loadingOrders && tickets.length > 0 && (
            <div className="bg-white rounded-3xl border p-5 space-y-5">
              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Bilhetes vendidos', value: String(totalTicketsSold) },
                  { label: 'Receita total', value: formatMoneyEURFromCents(totalRevenueCents) },
                  { label: 'Acessos vídeo', value: String(totalRecordingTickets) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-gray-50 border px-4 py-3">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-2xl font-black text-[#003F59]">{value}</div>
                  </div>
                ))}
              </div>
              {/* Per-lote bars */}
              {perLote.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Por lote</div>
                  <div className="space-y-2.5">
                    {perLote.map(({ id, name, sold, capacity }) => {
                      const pct = capacity > 0 ? Math.min((sold / capacity) * 100, 100) : 0;
                      const full = pct >= 100;
                      return (
                        <div key={id} className="flex items-center gap-3 text-sm">
                          <div className="w-36 text-gray-600 truncate shrink-0 text-right">{name}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${full ? 'bg-red-500' : 'bg-[#003F59]'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="w-20 text-gray-700 font-medium shrink-0">
                            {sold}{capacity > 0 ? ` / ${capacity}` : ''}
                            {full && <span className="ml-1 text-xs text-red-500 font-bold">CHEIO</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'tickets' && (
            <div className="overflow-x-auto rounded-3xl bg-white border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Data</Th>
                    <Th>Participante</Th>
                    <Th>Empresa / Cargo</Th>
                    <Th>NIF</Th>
                    <Th>T-Shirt</Th>
                    <Th>Consentimentos</Th>
                    <Th>Pagamento / Fatura</Th>
                    <Th>Check-in</Th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTickets ? (
                    <tr>
                      <Td colSpan={8}>A carregar tickets…</Td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <Td colSpan={8}>Sem tickets.</Td>
                    </tr>
                  ) : (
                    tickets.filter(t => { const o = orders.find(ord => ord.id === t.order_id); return showHidden || (!o?.is_duplicate && !o?.is_test); }).map((row) => {
                      const order = orders.find(o => o.id === row.order_id);
                      const isDuplicate = Boolean(order?.is_duplicate);
                      const isTest = Boolean(order?.is_test);
                      return (
                        <tr key={row.id} className={`border-t hover:bg-gray-50 cursor-pointer ${(isDuplicate || isTest) ? 'opacity-50' : ''}`} onClick={() => { setSelectedTicket(row); setTicketModalTab('ticket'); }}>
                          <Td>{formatDatePt(row.created_at)}</Td>
                          <Td>
                            <div className="font-medium text-gray-900">
                              {safe(row.attendee_name) ||
                                `${safe(row.attendee_first_name)} ${safe(row.attendee_last_name)}`.trim() ||
                                '—'}
                              {isDuplicate && <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">DUP</span>}
                              {isTest && <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">TESTE</span>}
                            </div>
                            <div className="text-xs text-gray-500">{safe(row.attendee_email) || '—'}</div>
                            <div className="text-xs text-gray-500">{safe(row.attendee_country) || '—'}</div>
                            {row.workshop_id && (
                              <div className="text-xs text-blue-700 mt-0.5">
                                Workshop: {workshops.find(w => w.id === row.workshop_id)?.title || '—'}
                              </div>
                            )}
                          </Td>
                          <Td>
                            <div>{safe(row.attendee_company) || '—'}</div>
                            <div className="text-xs text-gray-500">{safe(row.attendee_job_title) || '—'}</div>
                            <div className="text-xs text-gray-500">
                              {safe(row.attendee_job_function) || '—'}
                              {row.attendee_job_function_other ? ` · ${safe(row.attendee_job_function_other)}` : ''}
                            </div>
                          </Td>
                          <Td>{safe(row.attendee_nif) || '—'}</Td>
                          <Td>{safe(row.attendee_tshirt) || '—'}</Td>
                          <Td>
                            <div className="text-xs text-gray-700">
                              <div>Dados SA: {row.sa_data_sharing_consent ? '✔' : '—'}</div>
                              <div>Marketing SA: {row.sa_marketing_consent ? '✔' : '—'}</div>
                              <div>Privacidade: {row.privacy_consent ? '✔' : '—'}</div>
                            </div>
                          </Td>
                          <Td>
                            {order ? (
                              <div className="space-y-1">
                                <div className="text-xs text-gray-500">
                                  {formatMoneyEURFromCents(
                                    order.total_amount != null && (ticketsPerOrder[order.id] ?? 1) > 1
                                      ? Math.round(order.total_amount / (ticketsPerOrder[order.id] ?? 1))
                                      : order.total_amount
                                  )}
                                  {(ticketsPerOrder[order.id] ?? 1) > 1 && (
                                    <span className="ml-1 text-gray-400">(order: {formatMoneyEURFromCents(order.total_amount)})</span>
                                  )}
                                </div>
                                {order.invoice_id
                                  ? <>
                                      <span className="text-xs text-green-600 font-medium">{order.invoice_number || order.invoice_id}</span>
                                      {order.credit_note_id && (
                                        <div className="text-xs text-orange-600 font-medium">NC: {order.credit_note_number || order.credit_note_id}</div>
                                      )}
                                      {isSuperAdmin && (
                                        <div>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); sendInvoiceEmail(order.id); }}
                                            disabled={sendingInvoiceEmail === order.id}
                                            className="text-xs px-2 py-0.5 rounded bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
                                          >
                                            {sendingInvoiceEmail === order.id ? 'A enviar…' : 'Enviar Email'}
                                          </button>
                                          {invoiceEmailMsg?.orderId === order.id && (
                                            <div className={`text-xs mt-0.5 ${invoiceEmailMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                                              {invoiceEmailMsg.text}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  : isSuperAdmin
                                    ? (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); openInvoiceModal(order, row); }}
                                        disabled={generatingInvoice === order.id}
                                        className="text-xs px-2 py-0.5 rounded bg-[#003F59] text-white hover:bg-[#005580] disabled:opacity-50"
                                      >
                                        {generatingInvoice === order.id ? 'A gerar…' : 'Gerar Fatura'}
                                      </button>
                                    )
                                    : <span className="text-xs text-orange-500">Pendente</span>
                                }
                                {invoiceError?.orderId === order.id && (
                                  <div className="text-xs text-red-600 max-w-xs break-words">{invoiceError.msg}</div>
                                )}
                              </div>
                            ) : '—'}
                          </Td>
                          <Td>{row.checked_in ? `Sim · ${formatDatePt(row.check_in_at)}` : 'Não'}</Td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'coupons' && (
            <div className="overflow-x-auto rounded-3xl bg-white border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Código</Th>
                    <Th>Email</Th>
                    <Th>Desconto</Th>
                    <Th>Gravação</Th>
                    <Th>Single Use</Th>
                    <Th>Ativo</Th>
                    <Th>Válido até</Th>
                    <Th>Usado em</Th>
                    <Th>Data de uso</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCoupons ? (
                    <tr>
                      <Td colSpan={10}>A carregar coupons…</Td>
                    </tr>
                  ) : coupons.length === 0 ? (
                    <tr>
                      <Td colSpan={10}>Sem coupons.</Td>
                    </tr>
                  ) : (
                    coupons.map((row) => (
                      <tr key={row.id} className="border-t">
                        <Td>{row.code}</Td>
                        <Td>{row.email || '—'}</Td>
                        <Td>
                          {row.discount_amount != null
                            ? `-€${(row.discount_amount / 100).toFixed(2)}`
                            : row.discount_percent != null
                            ? `-${row.discount_percent}%`
                            : '—'}
                        </Td>
                        <Td>{row.recording_only ? 'Sim' : 'Não'}</Td>
                        <Td>{row.single_use ? 'Sim' : 'Não'}</Td>
                        <Td>{row.active ? 'Ativo' : 'Inativo'}</Td>
                        <Td>
                          {row.expires_at
                            ? (() => {
                                const expiry = new Date(row.expires_at);
                                expiry.setHours(23, 59, 59, 999);
                                return (
                                  <span className={expiry < new Date() ? 'text-red-500 font-medium' : ''}>
                                    {new Date(row.expires_at!).toLocaleDateString('pt-PT')}
                                  </span>
                                );
                              })()
                            : '—'}
                        </Td>
                        <Td>{row.used_by_order_id || '—'}</Td>
                        <Td>{row.used_at ? formatDatePt(row.used_at) : '—'}</Td>
                        <Td>
                          {canEdit && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditCoupon(row)}
                                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1 text-xs font-bold"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => toggleCouponActive(row)}
                                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1 text-xs font-bold"
                              >
                                {row.active ? 'Desativar' : 'Ativar'}
                              </button>

                              <button
                                onClick={() => deleteCoupon(row)}
                                className="rounded-lg bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 text-xs font-bold"
                              >
                                Apagar
                              </button>

                              {promoteAvailable && (
                                <button
                                  onClick={() => promoteToProd('coupons', `o coupon "${row.code}"`, [row.id])}
                                  disabled={promoting !== null}
                                  className="rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-1 text-xs font-bold disabled:opacity-50"
                                >
                                  {promoting === row.id ? 'A enviar…' : 'Produção'}
                                </button>
                              )}
                            </div>
                          )}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'logs' && (
            <div className="overflow-x-auto rounded-3xl bg-white border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Data</Th>
                    <Th>Admin</Th>
                    <Th>Ação</Th>
                    <Th>Entidade</Th>
                    <Th>ID</Th>
                    <Th>Detalhes</Th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLogs ? (
                    <tr><Td colSpan={6}>A carregar logs…</Td></tr>
                  ) : logs.length === 0 ? (
                    <tr><Td colSpan={6}>Sem registos.</Td></tr>
                  ) : (
                    logs.map((row) => (
                      <tr key={row.id} className="border-t">
                        <Td>{formatDatePt(row.created_at)}</Td>
                        <Td>{row.admin_email}</Td>
                        <Td><span className="font-mono bg-gray-100 px-1 rounded">{row.action}</span></Td>
                        <Td>{row.entity_type || '—'}</Td>
                        <Td><span className="font-mono text-xs text-gray-500">{row.entity_id || '—'}</span></Td>
                        <Td>
                          {row.details ? (
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap max-w-xs">{JSON.stringify(row.details, null, 2)}</pre>
                          ) : '—'}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'adminUsers' && (
            <div className="space-y-6">
              <form onSubmit={saveAdminUser} className="bg-white rounded-3xl border p-6">
                <h3 className="font-bold text-gray-800 mb-4">Adicionar utilizador</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="email"
                    placeholder="Email Google"
                    value={adminUserForm.email}
                    onChange={e => setAdminUserForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nome (opcional)"
                    value={adminUserForm.name}
                    onChange={e => setAdminUserForm(f => ({ ...f, name: e.target.value }))}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  />
                  <select
                    value={adminUserForm.role}
                    onChange={e => setAdminUserForm(f => ({ ...f, role: e.target.value as AdminRole }))}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  >
                    <option value="view">View</option>
                    <option value="edit">Edit</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={savingAdminUser}
                  className="mt-3 rounded-xl bg-brand-darkBlue text-white px-5 py-2 text-sm font-bold disabled:opacity-50"
                >
                  {savingAdminUser ? 'A guardar...' : 'Adicionar'}
                </button>
              </form>

              <div className="overflow-x-auto rounded-3xl bg-white border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <Th>Email</Th>
                      <Th>Nome</Th>
                      <Th>Role</Th>
                      <Th>Estado</Th>
                      <Th>Ações</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAdminUsers ? (
                      <tr><Td colSpan={5}>A carregar...</Td></tr>
                    ) : adminUsers.length === 0 ? (
                      <tr><Td colSpan={5}>Sem utilizadores.</Td></tr>
                    ) : (
                      adminUsers.map(u => (
                        <tr key={u.email} className="border-t">
                          <Td>{u.email}</Td>
                          <Td>{u.name || '—'}</Td>
                          <Td>
                            <select
                              value={u.role}
                              disabled={u.email === adminUser?.email}
                              onChange={e => updateAdminUserRole(u.email, e.target.value as AdminRole)}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                            >
                              <option value="view">View</option>
                              <option value="edit">Edit</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                          </Td>
                          <Td>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${u.active ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                              {u.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </Td>
                          <Td>
                            <div className="flex gap-2">
                              {u.email !== adminUser?.email && (
                                <>
                                  <button
                                    onClick={() => toggleAdminUserActive(u.email, !u.active)}
                                    className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1 text-xs font-bold"
                                  >
                                    {u.active ? 'Desativar' : 'Ativar'}
                                  </button>
                                  <button
                                    onClick={() => deleteAdminUser(u.email)}
                                    className="rounded-lg bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 text-xs font-bold"
                                  >
                                    Remover
                                  </button>
                                </>
                              )}
                            </div>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {selectedOrder && (() => {
          const orderTicket = tickets.find(t => t.order_id === selectedOrder.id);
          return (
            <div
              className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center p-4"
            >
              <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${MODAL_PANEL}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`${MODAL_HEAD} pb-4 flex justify-between items-center`}>
                  <h3 className="text-lg font-bold text-[#003F59]">Detalhes da Order</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                {eventTag}
                {selectedOrder.is_duplicate && (
                  <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs">
                    <span className="font-bold text-red-700">Duplicado</span>
                    {selectedOrder.credit_note_ref && <span className="text-gray-600 ml-2">NC: {selectedOrder.credit_note_ref}</span>}
                  </div>
                )}
                <dl className="space-y-2 text-sm">
                  {[
                    ['Data', formatDatePt(selectedOrder.created_at)],
                    ['Cliente', selectedOrder.customer_name || '—'],
                    ['Email', selectedOrder.customer_email || '—'],
                    ['NIF', orderTicket?.attendee_nif || '—'],
                    ['País', selectedOrder.customer_country || '—'],
                    ['Total', formatMoneyEURFromCents(selectedOrder.total_amount)],
                    ['Estado', selectedOrder.status || '—'],
                    ['Nº Fatura', selectedOrder.invoice_number || selectedOrder.invoice_id || 'Pendente'],
                    ['Stripe Session', selectedOrder.stripe_session_id || '—'],
                    ['ID', selectedOrder.id],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="w-28 text-gray-500 shrink-0">{label}</dt>
                      <dd className="text-gray-900 break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
                {canEdit && (
                  <div className={`${MODAL_FOOT} flex flex-col gap-2`}>
                    {selectedOrder.is_duplicate ? (
                      <button
                        onClick={() => { setDuplicateCreditNoteRef(selectedOrder.credit_note_ref || ''); setDuplicateError(null); setDuplicateModal({ orderId: selectedOrder.id, currentRef: selectedOrder.credit_note_ref || '', isDuplicate: true, markType: 'duplicate' }); setSelectedOrder(null); }}
                        className="w-full py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                      >Editar / Anular Duplicado</button>
                    ) : selectedOrder.is_test ? (
                      <button
                        onClick={() => { setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: selectedOrder.id, currentRef: '', isDuplicate: true, markType: 'test' }); setSelectedOrder(null); }}
                        className="w-full py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                      >Editar / Anular Teste</button>
                    ) : (
                      <>
                        <button
                          onClick={() => { setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: selectedOrder.id, currentRef: '', isDuplicate: false, markType: 'duplicate' }); setSelectedOrder(null); }}
                          className="w-full py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
                        >Marcar como Duplicado</button>
                        <button
                          onClick={() => { setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: selectedOrder.id, currentRef: '', isDuplicate: false, markType: 'test' }); setSelectedOrder(null); }}
                          className="w-full py-2 rounded-lg border border-purple-300 text-purple-600 text-sm font-medium hover:bg-purple-50"
                        >Marcar como Teste</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {selectedTicket && (() => {
          const ticketOrder = orders.find(o => o.id === selectedTicket.order_id);
          return (
            <div
              className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center p-4"
            >
              <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${MODAL_PANEL}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`${MODAL_HEAD} pb-4 flex justify-between items-center`}>
                  <h3 className="text-lg font-bold text-[#003F59]">Detalhes do Ticket</h3>
                  <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                {eventTag}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  {(['ticket', 'pagamento'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTicketModalTab(tab)}
                      className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                        ticketModalTab === tab
                          ? 'border-[#003F59] text-[#003F59]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'ticket' ? 'Ticket' : 'Pagamento'}
                    </button>
                  ))}
                </div>

                {/* Tab: Ticket */}
                {ticketModalTab === 'ticket' && (
                  <dl className="space-y-2 text-sm">
                    {([
                      ['Data', formatDatePt(selectedTicket.created_at)],
                      ['Nome', selectedTicket.attendee_name || `${selectedTicket.attendee_first_name || ''} ${selectedTicket.attendee_last_name || ''}`.trim() || '—'],
                      ['Email', selectedTicket.attendee_email || '—'],
                      ['País', selectedTicket.attendee_country || '—'],
                      ['NIF', selectedTicket.attendee_nif || '—'],
                      ['Empresa', selectedTicket.attendee_company || '—'],
                      ['Cargo', selectedTicket.attendee_job_title || '—'],
                      ['Função', selectedTicket.attendee_job_function
                        ? selectedTicket.attendee_job_function + (selectedTicket.attendee_job_function_other ? ` · ${selectedTicket.attendee_job_function_other}` : '')
                        : '—'],
                      ['T-Shirt', selectedTicket.attendee_tshirt || '—'],
                      ['Workshop', (() => {
                        if (!selectedTicket.workshop_id) return 'Sem workshop';
                        const w = workshops.find(ws => ws.id === selectedTicket.workshop_id);
                        if (!w) return selectedTicket.workshop_id;
                        return [w.title, formatWorkshopSchedule(w), w.room].filter(Boolean).join(' · ');
                      })()],
                      ['Dados SA', selectedTicket.sa_data_sharing_consent ? 'Sim' : 'Não'],
                      ['Marketing SA', selectedTicket.sa_marketing_consent ? 'Sim' : 'Não'],
                      ['Privacidade', selectedTicket.privacy_consent ? 'Sim' : 'Não'],
                      ['Check-in', selectedTicket.checked_in ? `Sim · ${formatDatePt(selectedTicket.check_in_at)}` : 'Não'],
                      ['ID', selectedTicket.id],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="flex gap-2">
                        <dt className="w-28 text-gray-500 shrink-0">{label}</dt>
                        <dd className="text-gray-900 break-all">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Tab: Pagamento */}
                {ticketModalTab === 'pagamento' && (
                  <dl className="space-y-2 text-sm">
                    {([
                      ['Data Pagamento', ticketOrder ? formatDatePt(ticketOrder.created_at) : '—'],
                      ['Nome (Stripe)', ticketOrder?.customer_name || '—'],
                      ['Email (Stripe)', ticketOrder?.customer_email || '—'],
                      ['País (Stripe)', ticketOrder?.customer_country || '—'],
                      ...(ticketOrder?.customer_tax_id ? [['NIF / Tax ID', ticketOrder.customer_tax_id] as [string, string]] : []),
                      ['Total', ticketOrder ? formatMoneyEURFromCents(ticketOrder.total_amount) : '—'],
                      ['Gravações', ticketOrder?.include_recording ? 'Sim' : 'Não'],
                      ['Estado', ticketOrder?.status || '—'],
                      ...(ticketOrder?.original_invoice_number || ticketOrder?.original_invoice_id
                        ? [['Fatura Anulada', ticketOrder.original_invoice_number || ticketOrder.original_invoice_id || '—'] as [string, string]]
                        : []),
                      ...(ticketOrder?.credit_note_number || ticketOrder?.credit_note_id
                        ? [['Nota de Crédito', ticketOrder.credit_note_number || ticketOrder.credit_note_id || '—'] as [string, string]]
                        : []),
                      [
                        ticketOrder?.original_invoice_id ? 'Nova Fatura' : ticketOrder?.credit_note_id ? 'Fatura Anulada' : 'Nº Fatura',
                        ticketOrder?.invoice_number || ticketOrder?.invoice_id || 'Pendente'
                      ],
                      ...(ticketOrder?.refunded_at
                        ? [['Estornado em', new Date(ticketOrder.refunded_at).toLocaleDateString('pt-PT')] as [string, string]]
                        : []),
                      ['Stripe Session', ticketOrder?.stripe_session_id || '—'],
                      ['Order ID', ticketOrder?.id || '—'],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="flex gap-2">
                        <dt className="w-36 text-gray-500 shrink-0">{label}</dt>
                        <dd className="text-gray-900 break-all">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {isSuperAdmin && ticketOrder && (!ticketOrder.invoice_id || (ticketOrder.credit_note_id && !ticketOrder.original_invoice_id)) && (
                  <div className="mt-4">
                    <button
                      onClick={() => { openInvoiceModal(ticketOrder, selectedTicket); setSelectedTicket(null); }}
                      disabled={generatingInvoice === ticketOrder.id}
                      className="w-full py-2 rounded-lg bg-[#003F59] text-white text-sm font-medium hover:bg-[#005580] disabled:opacity-50"
                    >
                      {generatingInvoice === ticketOrder.id ? 'A gerar fatura…' : 'Gerar Fatura'}
                    </button>
                    {invoiceError?.orderId === ticketOrder.id && (
                      <p className="text-red-600 text-xs mt-2">{invoiceError.msg}</p>
                    )}
                  </div>
                )}
                {isSuperAdmin && ticketOrder?.invoice_id && !ticketOrder.credit_note_id && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        setCreditNoteMotivo('');
                        setCreditNoteCustom('');
                        setCreditNoteError(null);
                        setCreditNoteModal({
                          orderId: ticketOrder.id,
                          orderLabel: ticketOrder.invoice_number || ticketOrder.invoice_id || ticketOrder.id,
                        });
                      }}
                      className="w-full py-2 rounded-lg border border-orange-400 text-orange-600 text-sm font-medium hover:bg-orange-50"
                    >
                      Emitir Nota de Crédito
                    </button>
                  </div>
                )}
                {ticketOrder?.credit_note_id && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                    <div className="font-semibold text-orange-700">Nota de Crédito Emitida</div>
                    <div><span className="text-gray-500">Nº:</span> {ticketOrder.credit_note_number || ticketOrder.credit_note_id}</div>
                    {ticketOrder.credit_note_motivo && <div><span className="text-gray-500">Motivo:</span> {ticketOrder.credit_note_motivo}</div>}
                  </div>
                )}
                {isSuperAdmin && ticketOrder?.invoice_id && !ticketOrder.refunded_at && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        setRefundError(null);
                        setRefundMotivo('');
                        setRefundCustom('');
                        setRefundModal({
                          orderId: ticketOrder.id,
                          orderLabel: ticketOrder.invoice_number || ticketOrder.invoice_id || ticketOrder.id,
                          hasCreditNote: !!ticketOrder.credit_note_id,
                        });
                      }}
                      className="w-full py-2 rounded-lg border border-red-400 text-red-600 text-sm font-medium hover:bg-red-50"
                    >
                      Emitir Estorno
                    </button>
                  </div>
                )}
                {ticketOrder?.refunded_at && (
                  <p className="mt-3 text-xs text-center text-gray-500">
                    Estornado em <span className="font-medium text-gray-700">{new Date(ticketOrder.refunded_at).toLocaleDateString('pt-PT')}</span>
                  </p>
                )}
                {ticketOrder && (
                  <div className="mt-4 border-t pt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reenviar Emails</p>
                    <button
                      onClick={() => { setResendMsg(null); resendEmail(ticketOrder.id, 'ticket'); }}
                      disabled={resendingEmail !== null}
                      className="w-full py-2 rounded-lg border border-sky-400 text-sky-600 text-sm font-medium hover:bg-sky-50 disabled:opacity-50"
                    >
                      {resendingEmail === 'ticket' ? 'A enviar…' : '✉️ Reenviar Bilhete'}
                    </button>
                    {ticketOrder.invoice_id && (
                      <button
                        onClick={() => { setResendMsg(null); resendEmail(ticketOrder.id, 'invoice'); }}
                        disabled={resendingEmail !== null}
                        className="w-full py-2 rounded-lg border border-sky-400 text-sky-600 text-sm font-medium hover:bg-sky-50 disabled:opacity-50"
                      >
                        {resendingEmail === 'invoice' ? 'A enviar…' : '🧾 Enviar Fatura'}
                      </button>
                    )}
                    {resendMsg && (
                      <p className={`text-xs mt-1 text-center ${resendMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                        {resendMsg.text}
                      </p>
                    )}
                  </div>
                )}
                {canEdit && ticketOrder && (
                  <div className={MODAL_FOOT}>
                    {ticketOrder.is_duplicate ? (
                      <div className="space-y-2">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-gray-700">
                          <div className="font-bold text-red-700 mb-1">Marcado como Duplicado</div>
                          {ticketOrder.credit_note_ref && <div><span className="text-gray-500">NC: </span>{ticketOrder.credit_note_ref}</div>}
                        </div>
                        <button
                          onClick={() => { setSelectedTicket(null); setDuplicateCreditNoteRef(ticketOrder.credit_note_ref || ''); setDuplicateError(null); setDuplicateModal({ orderId: ticketOrder.id, currentRef: ticketOrder.credit_note_ref || '', isDuplicate: true, markType: 'duplicate' }); }}
                          className="w-full py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                        >
                          Editar / Anular Duplicado
                        </button>
                      </div>
                    ) : ticketOrder.is_test ? (
                      <div className="space-y-2">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-gray-700">
                          <div className="font-bold text-purple-700 mb-1">Marcado como Teste</div>
                        </div>
                        <button
                          onClick={() => { setSelectedTicket(null); setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: ticketOrder.id, currentRef: '', isDuplicate: true, markType: 'test' }); }}
                          className="w-full py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                        >
                          Editar / Anular Teste
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => { setSelectedTicket(null); setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: ticketOrder.id, currentRef: '', isDuplicate: false, markType: 'duplicate' }); }}
                          className="w-full py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
                        >
                          Marcar como Duplicado
                        </button>
                        <button
                          onClick={() => { setSelectedTicket(null); setDuplicateCreditNoteRef(''); setDuplicateError(null); setDuplicateModal({ orderId: ticketOrder.id, currentRef: '', isDuplicate: false, markType: 'test' }); }}
                          className="w-full py-2 rounded-lg border border-purple-300 text-purple-600 text-sm font-medium hover:bg-purple-50"
                        >
                          Marcar como Teste
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {invoiceModal && (
          <div
            className="fixed inset-0 z-[215] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-1 flex justify-between items-center`}>
                <h3 className="text-lg font-bold text-[#003F59]">Dados da Fatura</h3>
                <button onClick={() => setInvoiceModal(null)} disabled={savingInvoiceModal} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {eventTag}
              <p className="text-xs text-gray-400 mb-4">Verifica os dados antes de gerar. Nome e email não são editáveis.</p>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Nome do cliente</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 select-none">{invoiceModal.customerName || '—'}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Email (destino da fatura)</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 select-none">{invoiceModal.customerEmail || '—'}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">País <span className="text-xs text-[#003F59] font-normal">(código ISO, ex: PT)</span></label>
                  <input
                    type="text"
                    value={invoiceModal.form.country}
                    onChange={(e) => setInvoiceModal(m => m ? { ...m, form: { ...m.form, country: e.target.value.toUpperCase().slice(0, 2) } } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003F59]"
                    placeholder="PT"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">NIF / Número Fiscal</label>
                  <input
                    type="text"
                    value={invoiceModal.form.nif}
                    onChange={(e) => setInvoiceModal(m => m ? { ...m, form: { ...m.form, nif: e.target.value } } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003F59]"
                    placeholder="NIF ou número fiscal"
                  />
                </div>
              </div>
              <div className={MODAL_FOOT}>
                {invoiceModalError && (
                  <p className="text-red-600 text-xs mb-3 break-words">{invoiceModalError}</p>
                )}
                <button
                  onClick={confirmInvoiceModal}
                  disabled={savingInvoiceModal}
                  className="w-full py-2 rounded-lg bg-[#003F59] text-white text-sm font-medium hover:bg-[#005580] disabled:opacity-50"
                >
                  {savingInvoiceModal ? 'A guardar e gerar…' : 'Confirmar e Gerar Fatura'}
                </button>
              </div>
            </div>
          </div>
        )}

        {creditNoteModal && (
          <div
            className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-4 flex justify-between items-center`}>
                <h3 className="text-lg font-bold text-[#003F59]">Nota de Crédito</h3>
                <button onClick={() => setCreditNoteModal(null)} disabled={generatingCreditNote} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {eventTag}
              <p className="text-sm text-gray-500 mb-4">
                Fatura: <span className="font-medium text-gray-700">{creditNoteModal.orderLabel}</span>
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Motivo</p>
                {['Troca / inclusão de NIF', 'Correção de dados do cliente', 'Estorno por desistência da compra', 'Erro no valor faturado', 'Outro'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="motivo"
                      value={opt}
                      checked={creditNoteMotivo === opt}
                      onChange={() => setCreditNoteMotivo(opt)}
                    />
                    {opt}
                  </label>
                ))}
                {creditNoteMotivo === 'Outro' && (
                  <textarea
                    className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    rows={2}
                    placeholder="Descreve o motivo…"
                    value={creditNoteCustom}
                    onChange={(e) => setCreditNoteCustom(e.target.value)}
                  />
                )}
              </div>
              <div className={MODAL_FOOT}>
                {creditNoteError && (
                  <p className="text-red-600 text-xs mb-3 break-words">{creditNoteError}</p>
                )}
                <button
                  onClick={() => {
                    const motivo = creditNoteMotivo === 'Outro' ? creditNoteCustom.trim() : creditNoteMotivo;
                    if (!motivo) return;
                    generateCreditNote(creditNoteModal.orderId, motivo);
                  }}
                  disabled={generatingCreditNote || !creditNoteMotivo || (creditNoteMotivo === 'Outro' && !creditNoteCustom.trim())}
                  className="w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {generatingCreditNote ? 'A emitir…' : 'Confirmar Nota de Crédito'}
                </button>
              </div>
            </div>
          </div>
        )}

        {refundModal && (
          <div
            className="fixed inset-0 z-[220] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-4 flex justify-between items-center`}>
                <h3 className="text-lg font-bold text-[#003F59]">Emitir Estorno</h3>
                <button onClick={() => { setRefundModal(null); setRefundError(null); }} disabled={markingRefund} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {eventTag}
              <p className="text-sm text-gray-500 mb-3">
                Fatura: <span className="font-medium text-gray-700">{refundModal.orderLabel}</span>
              </p>
              {!refundModal.hasCreditNote && (
                <div className="mb-4">
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    Não existe nota de crédito para esta fatura. Será criada automaticamente ao validar o estorno no Stripe.
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Motivo da nota de crédito</p>
                  <div className="space-y-2">
                    {[...MOTIVOS_ESTORNO, 'Outro'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="refundMotivo"
                          value={opt}
                          checked={refundMotivo === opt}
                          onChange={() => setRefundMotivo(opt)}
                        />
                        {opt}
                      </label>
                    ))}
                    {refundMotivo === 'Outro' && (
                      <textarea
                        className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={2}
                        placeholder="Descreve o motivo…"
                        value={refundCustom}
                        onChange={(e) => setRefundCustom(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                O sistema irá validar que o estorno foi efetuado no Stripe antes de registar.
              </div>
              <div className={MODAL_FOOT}>
                {refundError && (
                  <p className="text-red-600 text-xs mb-3 break-words">{refundError}</p>
                )}
                <button
                  onClick={() => {
                    const motivo = refundMotivo === 'Outro' ? refundCustom.trim() : refundMotivo;
                    markAsRefunded(refundModal.orderId, !refundModal.hasCreditNote ? motivo : undefined);
                  }}
                  disabled={markingRefund || (!refundModal.hasCreditNote && (!refundMotivo || (refundMotivo === 'Outro' && !refundCustom.trim())))}
                  className="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {markingRefund ? 'A validar no Stripe…' : 'Validar e Registar Estorno'}
                </button>
              </div>
            </div>
          </div>
        )}

        {duplicateModal && (
          <div
            className="fixed inset-0 z-[220] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-4 flex justify-between items-center`}>
                <h3 className="text-lg font-bold text-[#003F59]">
                  {duplicateModal.isDuplicate
                    ? (duplicateModal.markType === 'test' ? 'Editar Teste' : 'Editar Duplicado')
                    : (duplicateModal.markType === 'test' ? 'Marcar como Teste' : 'Marcar como Duplicado')}
                </h3>
                <button onClick={() => setDuplicateModal(null)} disabled={markingDuplicate} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {eventTag}
              <p className="text-sm text-gray-500 mb-4">
                Este registo será ocultado dos relatórios por defeito.
              </p>
              {duplicateModal.markType === 'duplicate' && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referência Nota de Crédito</label>
                  <input
                    type="text"
                    placeholder="ex: FR BILL/33"
                    value={duplicateCreditNoteRef}
                    onChange={e => setDuplicateCreditNoteRef(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm mb-4"
                  />
                </>
              )}
              {duplicateError && <p className="text-red-600 text-xs mb-3">{duplicateError}</p>}
              <div className={`${MODAL_FOOT} flex gap-2`}>
                {duplicateModal.isDuplicate && (
                  <button
                    onClick={() => markOrderAsDuplicate(duplicateModal.orderId, duplicateModal.markType, false, '')}
                    disabled={markingDuplicate}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    {duplicateModal.markType === 'test' ? 'Anular Teste' : 'Anular Duplicado'}
                  </button>
                )}
                <button
                  onClick={() => markOrderAsDuplicate(duplicateModal.orderId, duplicateModal.markType, true, duplicateCreditNoteRef)}
                  disabled={markingDuplicate}
                  className={`flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 ${duplicateModal.markType === 'test' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {markingDuplicate ? 'A guardar…' : duplicateModal.isDuplicate ? 'Guardar' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {couponModalOpen && (
          <div
            className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-6 flex items-start justify-between gap-4`}>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {editingCoupon ? 'Editar coupon' : 'Novo coupon'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Defina código, email opcional, desconto e estado.
                  </p>
                  {eventTag}
                </div>

                <button
                  onClick={() => {
                    setCouponModalOpen(false);
                    resetCouponForm();
                  }}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Código
                  </div>
                  <input
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                    placeholder="Ex: EXP20"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Email
                  </div>
                  <input
                    value={couponForm.email}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                    placeholder="Opcional"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Tipo de desconto
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCouponForm({ ...couponForm, discount_type: 'percent' })}
                      className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-bold ${couponForm.discount_type === 'percent' ? 'border-brand-darkBlue bg-brand-darkBlue text-white' : 'border-gray-300 text-gray-700'}`}
                    >
                      Percentagem (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponForm({ ...couponForm, discount_type: 'amount' })}
                      className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-bold ${couponForm.discount_type === 'amount' ? 'border-brand-darkBlue bg-brand-darkBlue text-white' : 'border-gray-300 text-gray-700'}`}
                    >
                      Valor fixo (€)
                    </button>
                  </div>
                </div>

                {couponForm.discount_type === 'percent' ? (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                      Desconto (%)
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={couponForm.discount_percent}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, discount_percent: e.target.value })
                      }
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                      Valor de desconto (€)
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={couponForm.discount_amount}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, discount_amount: e.target.value })
                      }
                      placeholder="Ex: 10.00"
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={couponForm.recording_only}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, recording_only: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">Só para gravação</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={couponForm.single_use}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, single_use: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">Single use</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={couponForm.active}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, active: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">Ativo</span>
                </label>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    Válido até <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={couponForm.expires_at}
                      onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })}
                      className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                    />
                    {couponForm.expires_at && (
                      <button
                        type="button"
                        onClick={() => setCouponForm({ ...couponForm, expires_at: '' })}
                        className="rounded-2xl border border-gray-300 px-3 text-gray-400 hover:text-gray-600 hover:border-gray-400"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${MODAL_FOOT} flex justify-end gap-3`}>
                <button
                  onClick={() => {
                    setCouponModalOpen(false);
                    resetCouponForm();
                  }}
                  className="rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCoupon}
                  disabled={savingCoupon}
                  className="rounded-xl bg-brand-darkBlue text-white px-4 py-2 text-sm font-bold disabled:opacity-60"
                >
                  {savingCoupon ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-6 flex items-start justify-between gap-4`}>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Lead</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDatePt(selected.created_at)} • {safe(selected.type)}
                  </p>
                  {eventTag}
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Field label="Nome" value={safe(selected.name)} />
                <Field label="Email" value={safe(selected.email)} />
                <Field label="Telefone" value={safe(selected.phone)} />
                <Field label="Empresa" value={safe(selected.company)} />
                <Field label="Cargo" value={safe(selected.role)} />
                <Field label="Portfólio" value={safe(selected.portfolio)} />
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                  Mensagem
                </div>
                <div className="rounded-2xl bg-gray-50 border px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {safe(selected.message) || '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        {isTicketTypeModalOpen && (
          <div
            className="fixed inset-0 z-[220] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-6 flex items-start justify-between gap-4`}>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {editingTicketType ? 'Editar lote' : 'Novo lote'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Gere os lotes de bilhetes disponíveis para venda
                  </p>
                  {eventTag}
                </div>

                <button
                  onClick={closeTicketTypeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveTicketType} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome do lote"
                    value={ticketTypeForm.name}
                    onChange={(value) => updateTicketTypeForm('name', value)}
                    placeholder="Ex.: Early Bird"
                  />

                  <Input
                    label="Preço (€)"
                    value={ticketTypeForm.price}
                    onChange={(value) => updateTicketTypeForm('price', value.replace(/[^0-9.,]/g, ''))}
                    placeholder="42,80"
                  />

                  <Input
                    label="Preço do workshop por pessoa neste lote (€)"
                    value={ticketTypeForm.workshop_price}
                    onChange={(value) => updateTicketTypeForm('workshop_price', value.replace(/[^0-9.,]/g, ''))}
                    placeholder="0,00"
                  />

                  <Input
                    label="Moeda"
                    value={ticketTypeForm.currency}
                    onChange={(value) => updateTicketTypeForm('currency', value)}
                    placeholder="eur"
                  />

                  <Input
                    label="Quantidade de bilhetes neste lote"
                    type="number"
                    value={ticketTypeForm.quantity_total}
                    onChange={(value) => updateTicketTypeForm('quantity_total', value)}
                    placeholder="100"
                  />

                  <Input
                    label="Ordem"
                    type="number"
                    value={ticketTypeForm.sort_order}
                    onChange={(value) => updateTicketTypeForm('sort_order', value)}
                    placeholder="0"
                  />

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3 w-full">
                      <input
                        type="checkbox"
                        checked={ticketTypeForm.active}
                        onChange={(e) => updateTicketTypeForm('active', e.target.checked)}
                      />
                      <span className="font-medium text-gray-800">Lote ativo</span>
                    </label>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  A quantidade é só de bilhetes. As vagas de cada workshop definem-se no separador <strong>Workshops</strong> (campo Capacidade) e valem para o evento inteiro, em todos os lotes. Aqui define-se apenas o preço do workshop para quem compra neste lote.
                </p>

                {editingTicketType && (
                  <div className="rounded-2xl bg-gray-50 border px-4 py-3 text-sm text-gray-600">
                    Vendidos: <strong>{editingTicketType.quantity_sold ?? 0}</strong>
                  </div>
                )}

                <div className={`${MODAL_FOOT} flex justify-end gap-3`}>
                  <button
                    type="button"
                    onClick={closeTicketTypeModal}
                    className="rounded-2xl bg-gray-100 text-gray-800 px-5 py-3 font-bold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={savingTicketType}
                    className="rounded-2xl bg-brand-darkBlue text-white px-5 py-3 font-bold disabled:opacity-50"
                  >
                    {savingTicketType ? 'A guardar...' : editingTicketType ? 'Guardar alterações' : 'Criar lote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isWorkshopModalOpen && (
          <div
            className="fixed inset-0 z-[220] bg-black/40 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl ${MODAL_PANEL}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${MODAL_HEAD} pb-6 flex items-start justify-between gap-4`}>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {editingWorkshop ? 'Editar workshop' : 'Novo workshop'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Workshops opcionais que decorrem em simultâneo (um por participante)
                  </p>
                  {eventTag}
                </div>

                <button
                  onClick={closeWorkshopModal}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveWorkshop} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Título"
                      value={workshopForm.title}
                      onChange={(value) => updateWorkshopForm('title', value)}
                      placeholder="Ex.: Facilitação de retrospetivas"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Descrição curta (cartão)"
                      value={workshopForm.short_description}
                      onChange={(value) => updateWorkshopForm('short_description', value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Textarea
                      label="Sobre o workshop"
                      value={workshopForm.description}
                      onChange={(value) => updateWorkshopForm('description', value)}
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Textarea
                      label="O que vais levar (um item por linha)"
                      value={workshopForm.takeaways}
                      onChange={(value) => updateWorkshopForm('takeaways', value)}
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Facilitadores</div>
                    {workshopForm.facilitators.map((f, i) => (
                      <div key={i} className="rounded-2xl border border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-700">Facilitador {i + 1}</span>
                          {workshopForm.facilitators.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFacilitator(i)}
                              className="inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" /> Remover
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input label="Nome" value={f.name} onChange={(value) => updateFacilitator(i, 'name', value)} />
                          <Input label="Cargo · Empresa" value={f.role} onChange={(value) => updateFacilitator(i, 'role', value)} />
                          <div className="md:col-span-2">
                            <Textarea label="Bio" value={f.bio} onChange={(value) => updateFacilitator(i, 'bio', value)} rows={3} />
                          </div>
                          <div className="md:col-span-2">
                            <Input
                              label="URL da foto"
                              value={f.photo_url}
                              onChange={(value) => updateFacilitator(i, 'photo_url', value)}
                              placeholder="https://…"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFacilitator}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" /> Adicionar facilitador
                    </button>
                  </div>

                  <Input
                    label="URL da imagem do workshop"
                    value={workshopForm.image_url}
                    onChange={(value) => updateWorkshopForm('image_url', value)}
                    placeholder="https://…"
                  />

                  <Input
                    label="Início"
                    value={workshopForm.starts_at}
                    onChange={(value) => updateWorkshopForm('starts_at', value)}
                    placeholder="14:00"
                  />

                  <Input
                    label="Fim"
                    value={workshopForm.ends_at}
                    onChange={(value) => updateWorkshopForm('ends_at', value)}
                    placeholder="17:30"
                  />

                  <Input
                    label="Sala"
                    value={workshopForm.room}
                    onChange={(value) => updateWorkshopForm('room', value)}
                  />

                  <Input
                    label="Nível"
                    value={workshopForm.level}
                    onChange={(value) => updateWorkshopForm('level', value)}
                    placeholder="Ex.: Intermédio"
                  />

                  <Input
                    label="Capacidade"
                    type="number"
                    value={workshopForm.capacity}
                    onChange={(value) => updateWorkshopForm('capacity', value)}
                    placeholder="30"
                  />

                  <Input
                    label="Ordem"
                    type="number"
                    value={workshopForm.sort_order}
                    onChange={(value) => updateWorkshopForm('sort_order', value)}
                    placeholder="0"
                  />

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3 w-full">
                      <input
                        type="checkbox"
                        checked={workshopForm.active}
                        onChange={(e) => updateWorkshopForm('active', e.target.checked)}
                      />
                      <span className="font-medium text-gray-800">Workshop ativo</span>
                    </label>
                  </div>
                </div>

                {editingWorkshop && (
                  <div className="rounded-2xl bg-gray-50 border px-4 py-3 text-sm text-gray-600">
                    Vagas vendidas: <strong>{editingWorkshop.sold ?? 0}</strong>
                    {' · '}
                    Disponíveis: <strong>{Math.max(0, Number(editingWorkshop.capacity ?? 0) - Number(editingWorkshop.sold ?? 0))}</strong>
                  </div>
                )}

                <div className={`${MODAL_FOOT} flex justify-end gap-3`}>
                  <button
                    type="button"
                    onClick={closeWorkshopModal}
                    className="rounded-2xl bg-gray-100 text-gray-800 px-5 py-3 font-bold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={savingWorkshop}
                    className="rounded-2xl bg-brand-darkBlue text-white px-5 py-3 font-bold disabled:opacity-50"
                  >
                    {savingWorkshop ? 'A guardar...' : editingWorkshop ? 'Guardar alterações' : 'Criar workshop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-bold text-gray-700">{children}</th>;
}

function Td({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <td className="px-4 py-3 text-gray-800 align-top" colSpan={colSpan}>
      {children}
    </td>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white border p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-gray-900">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <div className="rounded-2xl bg-gray-50 border px-4 py-3 text-sm text-gray-800">{value || '—'}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}
