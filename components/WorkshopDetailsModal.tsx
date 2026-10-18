import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';

export type WorkshopData = {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  takeaways: string[] | null;
  facilitator_name: string | null;
  facilitator_role: string | null;
  facilitator_bio: string | null;
  facilitator_photo_url: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  room: string | null;
  level: string | null;
  capacity: number | null;
  remaining: number | null;
  sold_out: boolean;
};

type WorkshopDetailsModalProps = {
  workshop: WorkshopData;
  tag: string;               // ex.: "Workshop A"
  accent: string;            // cor de topo do cartão
  priceLabel: string;        // ex.: "45,00 €"
  participantLabel: string;  // ex.: "Participante 2"
  available: number | null;  // vagas disponíveis para este participante (null = sem limite)
  isSelected: boolean;
  soldOut: boolean;
  onChoose: () => void;
  onRemove: () => void;
  onClose: () => void;
};

// Aceita "14:00", "14:00:00" ou um timestamp ISO; devolve "HH:MM" (hora de Lisboa)
const formatTime = (value: string | null): string | null => {
  if (!value) return null;
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' }).format(d);
};

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]!.toUpperCase()).join('');

export const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({
  workshop: w, tag, accent, priceLabel, participantLabel, available, isSelected, soldOut,
  onChoose, onRemove, onClose,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Esc fecha só este pop-up (captura + stopPropagation para não fechar o modal de compra).
  // Ao fechar, devolve o foco ao cartão que o abriu.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      previouslyFocused?.focus?.();
    };
  }, []);

  const start = formatTime(w.starts_at);
  const end = formatTime(w.ends_at);
  const schedule = start && end ? `${start}–${end}` : start || end;

  const spots = soldOut
    ? 'Esgotado'
    : available == null
      ? null
      : w.capacity != null ? `${available} de ${w.capacity}` : `${available}`;

  const meta = [
    { k: 'Horário', v: schedule },
    { k: 'Sala', v: w.room },
    { k: 'Nível', v: w.level },
    { k: 'Vagas', v: spots },
  ].filter((m): m is { k: string; v: string } => !!m.v);

  const takeaways = (w.takeaways || []).filter(t => t && t.trim());
  const titleId = `ws-details-title-${w.id}`;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(4,14,18,0.62)]"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="w-full max-w-xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left font-jakarta">

        {/* Topo: imagem do workshop ou placeholder colorido */}
        <div className="relative h-40 sm:h-44 shrink-0 flex items-end px-6 py-5 text-white" style={{ backgroundColor: accent }}>
          {w.image_url ? (
            <>
              <img src={w.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0"
              style={{ background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.10) 0 14px, rgba(255,255,255,0) 14px 28px)' }} />
          )}
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar detalhes"
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex flex-col gap-1 pr-10">
            <span className="font-sora font-extrabold text-xs tracking-widest uppercase">{tag}</span>
            <span id={titleId} className="font-sora text-xl sm:text-2xl font-bold leading-tight">{w.title}</span>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          {/* Facilitador */}
          {w.facilitator_name && (
            <div className="flex gap-3.5 items-center">
              {w.facilitator_photo_url ? (
                <img src={w.facilitator_photo_url} alt={w.facilitator_name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 bg-gray-100" />
              ) : (
                <span className="w-14 h-14 rounded-full bg-[#e6eef2] text-brand-darkBlue flex items-center justify-center font-sora font-bold shrink-0">
                  {initials(w.facilitator_name)}
                </span>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-gray-800">{w.facilitator_name}</span>
                {w.facilitator_role && <span className="text-sm text-gray-600">{w.facilitator_role}</span>}
                {w.facilitator_bio && <span className="text-xs text-gray-500 leading-relaxed">{w.facilitator_bio}</span>}
              </div>
            </div>
          )}

          {/* Horário / Sala / Nível / Vagas */}
          {meta.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {meta.map(m => (
                <div key={m.k} className="bg-[#f4f7f8] rounded-lg px-3 py-2.5 flex flex-col gap-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500">{m.k}</span>
                  <span className="text-sm font-bold text-gray-800">{m.v}</span>
                </div>
              ))}
            </div>
          )}

          {(w.description || w.short_description) && (
            <div className="flex flex-col gap-1.5">
              <span className="font-sora font-bold text-brand-darkBlue">Sobre o workshop</span>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{w.description || w.short_description}</p>
            </div>
          )}

          {takeaways.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-sora font-bold text-brand-darkBlue">O que vais levar</span>
              <ul className="flex flex-col gap-2">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-sm text-gray-700">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={3} style={{ color: accent }} aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rodapé: preço + acções */}
        <div className="border-t border-gray-200 px-6 py-4 bg-[#f8fafb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Adicional ao bilhete · {participantLabel}</span>
            <span className="font-sora text-xl font-extrabold text-brand-darkBlue">+ {priceLabel}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={onClose}
              className="min-h-[44px] px-4 rounded-lg border border-gray-300 bg-white font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2">
              Voltar
            </button>
            {isSelected ? (
              <button type="button" onClick={onRemove}
                className="min-h-[44px] px-4 rounded-lg border-2 border-brand-darkBlue bg-white font-bold text-brand-darkBlue hover:bg-[#f4f8fa] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2">
                Remover escolha
              </button>
            ) : soldOut ? (
              <button type="button" disabled
                className="min-h-[44px] px-4 rounded-lg bg-gray-300 font-bold text-gray-600 cursor-not-allowed">
                Esgotado
              </button>
            ) : (
              <button type="button" onClick={onChoose}
                className="min-h-[44px] px-5 rounded-lg bg-brand-orange hover:brightness-95 font-sora font-bold text-[#1f1306] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2">
                Escolher este workshop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
