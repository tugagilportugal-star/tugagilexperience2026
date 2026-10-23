// src/sections/Agenda.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  isBreak?: boolean;
  isPending?: boolean;
  description?: string; // Adicionado para o modal de detalhes
}

export const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon'>('morning');
  const [selectedWorkshop, setSelectedWorkshop] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Bloquear scroll do fundo quando o modal estiver aberto
  useEffect(() => {
    if (selectedWorkshop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWorkshop]);

  // --- CRONOGRAMA DA MANHÃ ---
  const morningSchedule: ScheduleItem[] = [
    { time: "08:30 - 09:00", title: "Check-in e receção",  isBreak: true },
    { time: "09:00 - 09:10", title: "Abertura TugÁgil",  },
    { time: "09:10 - 09:20", title: "ISLA — Boas-vindas",  },
    { time: "09:20 - 10:00", title: "Talk 1", speaker: "A confirmar",  isPending: true },
    { time: "10:05 - 10:45", title: "Liderança Adaptativa", speaker: "Bianca Peixoto",  },
    { time: "10:45 - 11:05", title: "☕ Coffee Break", location: "Área de Convivência", isBreak: true },
    { time: "11:05 - 11:10", title: "Regresso",  isBreak: true },
    { time: "11:10 - 11:50", title: "Product Management na era dos agentes: menos backlog, mais decisões", speaker: "Pedro Oliveira",  },
    { time: "11:55 - 12:35", title: "Painel — IA, Equipas e Negócio: Como Garantir Valor Quando Tudo Acelerou?", speaker: "Eduardo Espinheira, Milena Maganin",  },
    { time: "12:35 - 13:00", title: "Perguntas, síntese e fecho da manhã",  },
    { time: "13:00 - 14:15", title: "🍽️ Almoço e Networking", isBreak: true },
  ];

  // --- CRONOGRAMA DA TARDE: AUDITÓRIO ---
  const afternoonMainStage: ScheduleItem[] = [
    { time: "14:15 - 14:20", title: "Regresso ao auditório", isBreak: true },
    { time: "14:20 - 14:40", title: "O Custo de Ignorar o Sistema", speaker: "Fábio Perrotta" },
    { time: "14:45 - 15:05", title: "Desconstruindo com IA: E se o maior problema não for a tecnologia?", speaker: "Luciano Alves" },
    { time: "15:10 - 15:30", title: "Talk 6", speaker: "A confirmar", isPending: true },
    { time: "15:35 - 15:55", title: "O futuro é de segunda mão: como a tecnologia está a reinventar o valor daquilo que já existe", speaker: "Silas Moreira" },
    { time: "16:00 - 16:20", title: "Quiet Bravery: The Leadership Growth No One Sees Until It Blossoms", speaker: "Filipa Gomes" },
    { time: "16:25 - 16:45", title: "Talk 9", speaker: "A confirmar", isPending: true },
    { time: "16:50 - 17:20", title: "Sessão de encerramento" },
    { time: "17:20 - 17:30", title: "Encerramento TugÁgil" },
  ];

  // --- CRONOGRAMA DA TARDE: WORKSHOPS ---
  const afternoonWorkshops: ScheduleItem[] = [
    { 
      time: "14:30 - 17:00", 
      title: "Decoding Product: The Immersive Lab", 
      speaker: "Ricardo Fernandes e Manuel Pimenta", 
      location: "Sala a confirmar",
      description: "Uma experiência prática em formato de simulação de crise. Em equipa, assumes o comando de uma força de intervenção para investigar a cena do crime, analisar evidências reais (métricas, transcrições, emails) e interrogar stakeholders com agendas próprias."
    },
    { 
      time: "14:30 - 17:00", 
      title: "The Leadership Experiment", 
      speaker: "Anthony Simões", 
      location: "Sala a confirmar",
      description: "Um experimento provocador sobre liderança, inteligência artificial e os mecanismos invisíveis que influenciam as nossas decisões. Prepare-se para questionar não apenas a tecnologia, mas também a sua própria forma de liderar."
    },
    { 
      time: "14:30 - 17:00", 
      title: "AI Software Factory", 
      speaker: "Matheus Haddad e Fábio Castro", 
      location: "Sala a confirmar",
      description: "Vamos explorar como funcionam os sistemas de desenvolvimento orientados por agentes de IA. Através de demonstrações ao vivo e desafios práticos, os participantes irão experimentar a construção de um pequeno produto, desde a especificação até à validação."
    },
  ];

  // Componente auxiliar para renderizar um item da agenda
  const AgendaItemRow: React.FC<{ item: ScheduleItem; showLocation?: boolean }> = ({ item, showLocation = true }) => {
    const isPending = item.isPending || item.title.includes('A confirmar') || item.speaker?.includes('A confirmar');
    
    return (
      <div className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-4 border-b border-zinc-800 last:border-0 ${item.isBreak ? 'opacity-70' : ''}`}>
        <div className="sm:w-32 shrink-0">
          <span className="text-sm font-mono font-bold text-emerald-400">{item.time}</span>
        </div>
        <div className="flex-1">
          <h4 className={`text-base font-bold font-sora leading-snug ${isPending ? 'text-zinc-500 italic' : 'text-white'}`}>
            {item.title}
          </h4>
          
          {/* 👇 MELHORIA DE VISIBILIDADE: Nomes mais claros (zinc-200) */}
          {item.speaker && !isPending && (
            <p className="text-sm text-zinc-200 font-jakarta mt-1 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item.speaker}
            </p>
          )}
          {isPending && item.speaker && (
             <p className="text-sm text-zinc-500 font-jakarta mt-1 italic flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> {item.speaker}
            </p>
          )}
          
          {/* 👇 MELHORIA DE VISIBILIDADE: Locais mais claros (zinc-400) */}
          {showLocation && item.location && (
            <p className="text-sm text-zinc-400 font-jakarta mt-1.5 flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-zinc-500" /> {item.location}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 font-jakarta">
      
      {/* Navbar Simplificada */}
      <nav className="fixed top-0 left-0 right-0 bg-[#060a07]/95 backdrop-blur-md border-b border-zinc-900 h-20 flex items-center px-6 z-[100]">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white font-bold text-sm font-sora transition-colors">
          <ArrowLeft size={18} /> Voltar ao Site
        </Link>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">Agenda Detalhada</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 font-sora tracking-tight">Cronograma do Evento</h1>
        </div>

        {/* Abas Manhã / Tarde */}
        <div className="flex gap-8 mb-12 border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setActiveTab('morning')}
            className={`pb-2 text-xl font-bold transition-all font-sora ${activeTab === 'morning' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Manhã
          </button>
          <button 
            onClick={() => setActiveTab('afternoon')}
            className={`pb-2 text-xl font-bold transition-all font-sora ${activeTab === 'afternoon' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Tarde
          </button>
        </div>

        {/* CONTEÚDO MANHÃ */}
        {activeTab === 'morning' && (
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
              <MapPin size={18} className="text-emerald-400" />
              <h3 className="text-lg font-bold font-sora text-white">Auditório Principal</h3>
            </div>
            <div className="space-y-2">
              {morningSchedule.map((item, index) => (
                <AgendaItemRow key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO TARDE (Layout em 2 Colunas) */}
        {activeTab === 'afternoon' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Coluna 1: Auditório */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
                <MapPin size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold font-sora text-white">Auditório Principal</h3>
              </div>
              <div className="space-y-2">
                {afternoonMainStage.map((item, index) => (
                  <AgendaItemRow key={index} item={item} showLocation={false} />
                ))}
              </div>
            </div>

            {/* Coluna 2: Workshops (AGORA CLICÁVEIS) */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
                <MapPin size={18} className="text-sky-400" />
                <h3 className="text-lg font-bold font-sora text-white">Workshops em Paralelo</h3>
              </div>
              <div className="space-y-4">
                {afternoonWorkshops.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWorkshop(item)}
                    className="w-full text-left bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-sky-500/50 hover:bg-zinc-900 transition-all group"
                  >
                    <span className="text-sm font-mono font-bold text-sky-400 block mb-2">{item.time}</span>
                    <h4 className="text-base font-bold font-sora text-white leading-snug mb-2 group-hover:text-sky-100 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-zinc-200 font-jakarta flex items-center gap-1.5 mb-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> {item.speaker}
                    </p>
                    {item.location && (
                      <p className="text-sm text-zinc-400 font-jakarta flex items-center gap-1.5 font-medium">
                        <MapPin size={14} className="text-zinc-500" /> {item.location}
                      </p>
                    )}
                    <span className="text-xs font-bold text-sky-400 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver detalhes <ArrowRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODAL DE DETALHES DO WORKSHOP */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedWorkshop(null)} />
          
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button
              type="button"
              onClick={() => setSelectedWorkshop(null)}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-[120] flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:bg-white hover:text-zinc-950 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto p-6 md:p-8">
              <span className="text-sm font-mono font-bold text-sky-400 block mb-3">{selectedWorkshop.time}</span>
              <h2 className="text-2xl md:text-3xl font-black font-sora text-white leading-tight mb-4">
                {selectedWorkshop.title}
              </h2>
              
              <div className="space-y-3 mb-6">
                <p className="text-base text-zinc-200 font-jakarta font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" /> {selectedWorkshop.speaker}
                </p>
                {selectedWorkshop.location && (
                  <p className="text-sm text-zinc-400 font-jakarta flex items-center gap-2">
                    <MapPin size={16} className="text-zinc-500" /> {selectedWorkshop.location}
                  </p>
                )}
              </div>

              {selectedWorkshop.description && (
                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-sora mb-3">Sobre a sessão</h3>
                  <p className="text-base text-zinc-300 font-jakarta leading-relaxed">
                    {selectedWorkshop.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};