// src/sections/Workshops.tsx
import React, { useEffect, useState } from 'react';
import { Check, Clock, MapPin, Users, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CONSTANTES — para adicionar um workshop, basta acrescentar um      */
/*  objeto à lista WORKSHOPS. Só title e track são obrigatórios; tudo  */
/*  o resto é opcional e o cartão/modal não mostra o que falta.        */
/* ------------------------------------------------------------------ */

type TrackKey = 'gestao' | 'engenharia' | 'design';

interface Facilitator {
  name: string;
  role?: string;
  avatar?: string;
}

interface Workshop {
  id: string;
  track: TrackKey;
  title: string;
  tagline?: string;            // frase de destaque (ex: a pergunta provocadora)
  description?: string[];      // um item por parágrafo; sem isto aparece "Mais detalhes em breve"
  learnings?: string[];        // "O que vai levar"
  audience?: string;
  level?: 'Iniciante' | 'Intermédio' | 'Avançado' | 'Todos os níveis';
  format?: string;             // ex: "Hands-on", "Masterclass"
  schedule?: string[];         // sessões (ex: Parte 1 / Parte 2)
  duration?: string;
  location?: string;
  capacity?: number;
  facilitators?: Facilitator[];
}

/** Identidade visual de cada trilha (alinhada com o Program.tsx) */
const TRACKS: Record<TrackKey, { label: string; text: string; border: string; bg: string }> = {
  gestao:     { label: 'Gestão & Liderança',          text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  engenharia: { label: 'Engenharia de Software',      text: 'text-sky-400',     border: 'border-sky-500/30',     bg: 'bg-sky-500/10' },
  design:     { label: 'Design, Produto & Discovery', text: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10' },
};

const PAGE_INTRO =
  'Sessões imersivas e práticas, em salas temáticas, durante a tarde do evento. As vagas são limitadas para garantir uma experiência participativa.';

const WORKSHOPS: Workshop[] = [
  {
    id: 'decoding-product',
    track: 'design',
    title: 'Decoding Product: The Immersive Lab',
    description: [
      'Mais detalhes sobre a dinâmica e os objetivos deste laboratório imersivo serão revelados em breve.',
    ],
    schedule: ['Horário a confirmar'],
    location: 'Sala a confirmar',
    facilitators: [{ name: 'Ricardo Fernandes' }],
  },
  {
    id: 'leadership-experiment',
    track: 'gestao',
    title: 'The Leadership Experiment',
    tagline: 'Você ainda sabe liderar quando a IA parece saber mais do que você?',
    description: [
      'Um experimento provocador sobre liderança, inteligência artificial e os mecanismos invisíveis que influenciam as nossas decisões. Prepare-se para questionar não apenas a technology, mas também a sua própria forma de liderar.',
    ],
    schedule: ['Horário a confirmar'],
    location: 'Sala a confirmar',
    facilitators: [{ name: 'Anthony Simões' }],
  },
  {
    id: 'ai-software-factory',
    track: 'engenharia',
    title: 'TugÁgil — AI Software Factory',
    description: [
      'Imagine uma fábrica de software onde agentes de inteligência artificial analisam requisitos, desenham soluções, escrevem código, executam testes e corrigem problemas. Se a IA pode realizar grande parte do trabalho, o que acontece com a engenharia de software e com o papel dos profissionais?',
      'Neste workshop imersivo, vamos explorar como funcionam os sistemas de desenvolvimento orientados por agentes de IA. Através de demonstrações ao vivo e desafios práticos, os participantes irão experimentar a construção de um pequeno produto, desde a especificação até à implementação e validação.',
      'Uma experiência para descobrir as possibilidades, limitações e novos desafios da engenharia de software na era da inteligência artificial.',
    ],
    schedule: ['Horário a confirmar'],
    location: 'Sala a confirmar',
    facilitators: [{ name: 'Matheus Haddad' }, { name: 'Fabio Castro' }],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENTES                                                        */
/* ------------------------------------------------------------------ */

const Avatar: React.FC<{ facilitator: Facilitator; size?: string }> = ({ facilitator, size = 'w-12 h-12' }) =>
  facilitator.avatar ? (
    <img
      src={facilitator.avatar}
      alt={facilitator.name}
      className={`${size} rounded-full object-cover border border-zinc-800 shrink-0`}
    />
  ) : (
    <div
      className={`${size} rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold font-sora shrink-0`}
    >
      {facilitator.name.charAt(0)}
    </div>
  );

/** Cartão pequeno: nome, horário, sala e facilitadores. Clica-se para abrir os detalhes. */
const WorkshopCard: React.FC<{ workshop: Workshop; onOpen: () => void }> = ({ workshop, onOpen }) => {
  const track = TRACKS[workshop.track];
  const isSchedulePending = workshop.schedule?.some(s => s.toLowerCase().includes('confirmar') || s.toLowerCase().includes('breve'));
  const isLocationPending = workshop.location?.toLowerCase().includes('confirmar') || workshop.location?.toLowerCase().includes('breve');

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group text-left bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      <span
        className={`self-start text-[11px] font-bold uppercase tracking-wider font-sora px-3 py-1 rounded-full border mb-5 ${track.text} ${track.border} ${track.bg}`}
      >
        {track.label}
      </span>

      <h2 className="text-xl font-black font-sora leading-tight text-white mb-5">{workshop.title}</h2>

      <div className="space-y-2 mb-6">
        {workshop.schedule && workshop.schedule.length > 0 && (
          <div className="flex items-start gap-2">
            <Clock size={16} className={`mt-0.5 shrink-0 ${isSchedulePending ? 'text-zinc-600' : 'text-emerald-400'}`} />
            <div>
              {workshop.schedule.map((s, i) => (
                <div key={i} className={`font-mono text-xs ${isSchedulePending ? 'text-zinc-500 italic' : 'text-zinc-300'}`}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
        {workshop.location && (
          <div className="flex items-center gap-2 text-sm font-jakarta">
            <MapPin size={16} className={`shrink-0 ${isLocationPending ? 'text-zinc-600' : 'text-emerald-400'}`} />
            <span className={isLocationPending ? 'text-zinc-500 italic' : 'text-zinc-400'}>
              {workshop.location}
            </span>
          </div>
        )}
      </div>

      {workshop.facilitators && workshop.facilitators.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-800 pt-4 mb-4">
          {workshop.facilitators.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Avatar facilitator={f} size="w-8 h-8 text-xs" />
              <span className="text-sm font-bold text-zinc-200 font-sora">{f.name}</span>
            </div>
          ))}
        </div>
      )}

      <span className={`mt-auto text-xs font-bold font-sora uppercase tracking-wider ${track.text} group-hover:underline underline-offset-4`}>
        Ver detalhes →
      </span>
    </button>
  );
};

/** Janela com a descrição completa, sem sair da página. */
const WorkshopModal: React.FC<{ workshop: Workshop; onClose: () => void }> = ({
  workshop,
  onClose,
}) => {
  const track = TRACKS[workshop.track];
  const isSchedulePending = workshop.schedule?.some(s => s.toLowerCase().includes('confirmar') || s.toLowerCase().includes('breve'));
  const isLocationPending = workshop.location?.toLowerCase().includes('confirmar') || workshop.location?.toLowerCase().includes('breve');

  // Fechar com Esc e bloquear o scroll da página por trás
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={workshop.title}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-[120] flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:bg-white hover:text-zinc-950 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-5 pr-12">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider font-sora px-3 py-1 rounded-full border ${track.text} ${track.border} ${track.bg}`}
            >
              {track.label}
            </span>
            {workshop.format && (
              <span className="text-[11px] font-bold uppercase tracking-wider font-sora px-3 py-1 rounded-full border border-zinc-800 text-zinc-400">
                {workshop.format}
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black font-sora leading-tight text-white mb-4">{workshop.title}</h2>

          {workshop.tagline && (
            <p className={`text-lg font-bold font-jakarta leading-snug mb-6 ${track.text}`}>{workshop.tagline}</p>
          )}

          {workshop.description && workshop.description.length > 0 ? (
            <div className="space-y-4 mb-8">
              {workshop.description.map((paragraph, i) => (
                <p key={i} className="text-base text-zinc-300 font-jakarta leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base text-zinc-500 font-jakarta italic mb-8">Mais detalhes em breve.</p>
          )}

          {workshop.learnings && workshop.learnings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sora mb-3">O que vai levar</h3>
              <ul className="space-y-2">
                {workshop.learnings.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 font-jakarta">
                    <Check size={16} className={`${track.text} mt-0.5 shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Informação prática */}
          <div className="space-y-3 border-t border-zinc-800 pt-6 mb-8">
            {workshop.schedule && workshop.schedule.length > 0 && (
              <div className="flex items-start gap-2 font-jakarta">
                <Clock size={16} className={`mt-0.5 shrink-0 ${isSchedulePending ? 'text-zinc-600' : 'text-emerald-400'}`} />
                <div>
                  {workshop.schedule.map((s, i) => (
                    <div key={i} className={`text-sm ${isSchedulePending ? 'text-zinc-500 italic' : 'text-zinc-300'}`}>
                      {s}
                    </div>
                  ))}
                  {workshop.duration && !isSchedulePending && (
                    <div className="text-xs text-zinc-500 mt-1">Duração total: {workshop.duration}</div>
                  )}
                </div>
              </div>
            )}
            {workshop.location && (
              <div className="flex items-center gap-2 text-sm font-jakarta">
                <MapPin size={16} className={`shrink-0 ${isLocationPending ? 'text-zinc-600' : 'text-emerald-400'}`} />
                <span className={isLocationPending ? 'text-zinc-500 italic' : 'text-zinc-400'}>
                  {workshop.location}
                </span>
              </div>
            )}
            {(workshop.audience || workshop.level || workshop.capacity) && (
              <div className="flex items-start gap-2 text-sm text-zinc-400 font-jakarta">
                <Users size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {[
                    workshop.audience,
                    workshop.level && `Nível: ${workshop.level}`,
                    workshop.capacity && `${workshop.capacity} vagas`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </div>
            )}
          </div>

          {/* Facilitadores */}
          {workshop.facilitators && workshop.facilitators.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sora">
                {workshop.facilitators.length > 1 ? 'Facilitadores' : 'Facilitador'}
              </h3>
              {workshop.facilitators.map((f, i) => (
                <div key={i} className="flex items-center gap-4 bg-zinc-900/30 border border-zinc-900 rounded-xl p-3">
                  <Avatar facilitator={f} />
                  <div>
                    <h4 className="text-base font-bold text-zinc-200 font-sora">{f.name}</h4>
                    {f.role && <p className="text-sm text-zinc-500 font-jakarta">{f.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const WorkshopsPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = WORKSHOPS.find((w) => w.id === selectedId) ?? null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 font-jakarta">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* CABEÇALHO */}
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">Workshops</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 font-sora tracking-tight">Aprenda fazendo</h1>
          <p className="text-zinc-400 mt-4 text-base font-jakarta max-w-2xl">{PAGE_INTRO}</p>
        </div>

        {/* GRELHA DE CARTÕES (adapta-se automaticamente a novos workshops) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHOPS.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} onOpen={() => setSelectedId(workshop.id)} />
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES DO WORKSHOP */}
      {selected && (
        <WorkshopModal
          workshop={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};