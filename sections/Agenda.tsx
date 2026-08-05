// sections/Agenda.tsx
import React, { useState } from 'react';
import { TicketPurchaseModal } from '../components/TicketPurchaseModal';
import { X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgendaItem {
  time: string;
  category: string;
  title: string;
  location: string | false;
  speaker?: string;
  role?: string;
  avatar?: string;
  isBreak?: boolean;
}

export const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon'>('morning');
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);

  // CRONOGRAMA DA MANHÃ (Com coffee breaks e salas do documento original) [0.1]
  const morningSchedule: AgendaItem[] = [
    { time: "08h00 - 09h00", category: "Receção", title: "Credenciação & Networking Inicial", location: false, isBreak: true },
    { time: "09h00 - 09h10", category: "Abertura", title: "Abertura Oficial", location: "Auditório Principal" },
    { time: "09h10 - 10h00", category: "Keynote", title: "Opening Keynote: O Presente e Futuro da Agilidade (MUDAR)", location: "Auditório Principal", speaker: "Palestrante Convidado", role: "Keynote Speaker", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
    { time: "10h00 - 10h40", category: "Gestão & Liderança", title: "Liderança Ágil e Cultura Organizacional (MUDAR)", location: "Auditório Principal", speaker: "Especialista Convidado", role: "Agile Leadership Director", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { time: "10h40 - 11h10", category: "Coffee Break", title: "Coffee-Break & Networking", location: "Área Coffee Break", isBreak: true },
    { time: "11h10 - 12h00", category: "Engenharia de Software", title: "Práticas de Engenharia e Agilidade (MUDAR)", location: "Auditório Principal", speaker: "Tech Lead Convidado", role: "Principal Architect", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { time: "12h00 - 12h50", category: "Design & Produto", title: "Palestra: UX, Product Discovery e Centralidade no Utilizador (MUDAR)", location: "Auditório Principal", speaker: "Product Designer Convidado", role: "Head of Product Design", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    { time: "12h50 - 13h00", category: "Encerramento Manhã", title: "Encerramento Parte da Manhã", location: "Auditório Principal" },
    { time: "13h00 - 14h00", category: "Almoço", title: "Almoço Livre", location: false, isBreak: true }
  ];

  // TRILHAS DA TARDE (Side-by-side / Paralelas) [0.1]
  const afternoonTracks = [
    {
      name: "Auditório: Talks Comunidade",
      location: "Auditório Principal",
      items: [
        { time: "14h00 - 14h10", title: "Abertura da Trilha da Comunidade" },
        { time: "14h10 - 16h30", title: "7 Talks Curtas da Comunidade (Cases e experiências reais - A detalhar talks e horários)" },
        { time: "16h30 - 17h00", title: "Coffee-break e Networking" },
        { time: "17h00 - 18h00", title: "Fishbowl: O Futuro da Agilidade em Portugal" },
      ]
    },
    {
      name: "Sala #1 (Gestão & Liderança)",
      location: "Sala Temática 1",
      items: [
        { time: "14h00 - 16h30", title: "Masterclass: Transformação de Liderança (Parte 1)" },
        { time: "16h30 - 16h45", title: "Coffee-break na sala" },
        { time: "17h00 - 18h00", title: "Masterclass: Transformação de Liderança (Parte 2)" },
      ]
    },
    {
      name: "Sala #2 (Engenharia de Software)",
      location: "Sala Temática 2",
      items: [
        { time: "14h00 - 16h30", title: "Workshop: Arquitetura Ágil & Clean Code (Parte 1)" },
        { time: "16h30 - 16h45", title: "Coffee-break na sala" },
        { time: "17h00 - 18h00", title: "Workshop: Arquitetura Ágil & Clean Code (Parte 2)" },
      ]
    },
    {
      name: "Sala #3 (Design & Produto)",
      location: "Sala Temática 3",
      items: [
        { time: "14h00 - 16h30", title: "Workshop: Product Discovery Prático (Parte 1)" },
        { time: "16h30 - 16h45", title: "Coffee-break na sala" },
        { time: "17h00 - 18h00", title: "Workshop: Product Discovery Prático (Parte 2)" },
      ]
    }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 font-jakarta">
      
      {/* 1. BARRA DE NAVEGAÇÃO SIMPLIFICADA (Voltar ao site + Comprar Bilhete) */}
      <nav className="fixed top-0 left-0 right-0 bg-[#060a07]/95 backdrop-blur-md border-b border-zinc-900 h-20 flex items-center justify-between px-6 z-[100]">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white font-bold text-sm font-sora">
          <ArrowLeft size={18} /> Voltar ao Site
        </Link>
        <button 
          onClick={() => setTicketModalOpen(true)}
          className="px-6 py-2.5 rounded-lg bg-[#0A5C36] hover:bg-[#08482b] text-white font-bold text-xs uppercase tracking-wider transition-all font-sora"
        >
          Comprar Bilhete
        </button>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">Agenda Detalhada</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 font-sora tracking-tight">Cronograma de Dia Inteiro</h1>
        </div>

        {/* Abas */}
        <div className="flex gap-4 mb-12 border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setActiveTab('morning')}
            className={`pb-2 text-xl font-bold transition-all ${activeTab === 'morning' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'}`}
          >
            Manhã
          </button>
          <button 
            onClick={() => setActiveTab('afternoon')}
            className={`pb-2 text-xl font-bold transition-all ${activeTab === 'afternoon' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'}`}
          >
            Tarde
          </button>
        </div>

        {/* CONTEÚDO MANHÃ (Focado na legibilidade) */}
        {activeTab === 'morning' && (
          <div className="relative border-l border-zinc-800 ml-4 pl-6 md:pl-10 space-y-12">
            {morningSchedule.map((item, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-950 z-10 ${item.isBreak ? 'bg-zinc-700' : 'bg-[#0A5C36]'}`} />
                <div className="flex flex-wrap gap-2 items-center text-sm font-bold uppercase tracking-wider mb-2 font-sora">
                  <span className="text-emerald-400 font-mono">{item.time}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{item.category}</span>
                </div>
                <h3 className={`text-2xl md:text-3xl font-black font-sora leading-tight mb-2 ${item.isBreak ? 'text-zinc-400' : 'text-white'}`}>{item.title}</h3>
                <p className="text-sm text-zinc-500 font-jakarta flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item.location}
                </p>
                {item.speaker && (
                  <div className="flex items-center gap-4 bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 mt-4 max-w-md backdrop-blur-sm">
                    <img src={item.avatar} alt={item.speaker} className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
                    <div>
                      <h4 className="text-base font-bold text-zinc-200 font-sora">{item.speaker}</h4>
                      <p className="text-sm text-zinc-500 font-jakarta">{item.role}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CONTEÚDO TARDE (Paralelas) */}
        {activeTab === 'afternoon' && (
          <div className="space-y-16">
            
            {/* Texto de apoio */}
            <p className="text-zinc-400 text-sm md:text-base font-jakarta">
              As atividades na parte da tarde acontecem em simultâneo. Pode optar por assistir às apresentações curtas no Auditório Principal ou participar num dos Workshops práticos nas salas temáticas.
            </p>

            {/* Grid de Atividades Paralelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {afternoonTracks.map((track, trackIdx) => (
                <div key={trackIdx} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start border-b border-zinc-800 pb-3 mb-6">
                      <h3 className="text-lg font-black text-white font-sora">{track.name}</h3>
                    </div>
                    <p className="text-xs text-emerald-400 font-bold uppercase mb-6 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {track.location}
                    </p>
                    <div className="space-y-6">
                      {track.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-zinc-500">{item.time}</span>
                          <h4 className="text-sm font-bold text-zinc-200 leading-tight">{item.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Encerramento Geral e Happy Hour */}
            <div className="relative border-l border-zinc-800 ml-4 pl-6 md:pl-10 space-y-12">
              <div className="relative">
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#0A5C36] border-4 border-zinc-950 z-10" />
                <div className="flex flex-wrap gap-2 items-center text-sm font-bold uppercase tracking-wider mb-2 font-sora">
                  <span className="text-emerald-400 font-mono">18h00 - 19h00</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">Encerramento</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black font-sora leading-tight mb-2">Keynote de Encerramento e Happy Hour final</h3>
                <p className="text-sm text-zinc-500 font-jakarta flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Auditório Principal & Área de Convivência
                </p>
              </div>
            </div>

          </div>
        )}

        {/* CTA Final */}
        <div className="mt-16 p-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-white font-sora">Bilhetes Disponíveis</h4>
            <p className="text-sm text-zinc-400 font-jakarta mt-1">Garanta já a sua presença na primeira edição do TugÁgil Experience.</p>
          </div>
          <button 
            onClick={() => setTicketModalOpen(true)}
            className="bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 whitespace-nowrap"
          >
            Garantir Bilhete
          </button>
        </div>
      </div>

      {/* MODAL DE COMPRA */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setTicketModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={() => setTicketModalOpen(false)} className="absolute top-4 right-4 z-[120] flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-500 hover:bg-[#060a07] hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="overflow-y-auto p-6 md:p-8 w-full">
              <TicketPurchaseModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};