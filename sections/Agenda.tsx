// sections/Agenda.tsx
import React, { useState } from 'react';
import { Navbar } from '../components/NavBar';
import { TicketPurchaseModal } from '../components/TicketPurchaseModal';
import { X } from 'lucide-react';

interface AgendaItem {
  time: string;
  category: string;
  title: string;
  speaker: string;
  role: string;
  avatar: string;
}

export const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon'>('morning');
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);

  const morningHighlights: AgendaItem[] = [
    {
      time: "09h10 - 10h00",
      category: "Abertura",
      title: "Opening Keynote: O Presente e Futuro da Agilidade (Placeholder)",
      speaker: "TBD",
      role: "Role Keynote Speaker (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "10h00 - 10h40",
      category: "Gestão & Liderança",
      title: "Como Liderar Equipas Autónomas sem Perder o Alinhamento Estratégico (Placeholder)",
      speaker: "TBD",
      role: "Role Leadership Expert (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "11h10 - 12h00",
      category: "Engenharia de Software",
      title: "Práticas Modernas de Engenharia de Software no Contexto Ágil (Placeholder)",
      speaker: "TBD",
      role: "Role Software Engineering Expert (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const afternoonHighlights: AgendaItem[] = [
    {
      time: "14h10 - 16h30",
      category: "Comunidade",
      title: "7 talks da Comunidade (Placeholder)",
      speaker: "Vários Palestrantes da Comunidade",
      role: "Casos Reais e Partilha Prática de Experiências",
      avatar: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "17h00 - 18h00",
      category: "Debate Aberto",
      title: "Fishbowl: O Futuro da Agilidade em Portugal (Placeholder)",
      speaker: "TBD",
      role: "Moderador e Participantes da Comunidade (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "18h00 - 19h00",
      category: "Encerramento",
      title: "Closing Keynote: Agility Beyond 2026 (Placeholder)",
      speaker: "TBD",
      role: "Role Keynote Speaker (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 font-jakarta">
      <Navbar onOpenTicketModal={() => setTicketModalOpen(true)} />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">Agenda Completa</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 font-sora tracking-tight">Cronograma de Dia Inteiro</h1>
        </div>

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

        <div className="relative border-l border-zinc-800 ml-4 pl-6 md:pl-10 space-y-12">
          {(activeTab === 'morning' ? morningHighlights : afternoonHighlights).map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#0A5C36] border-4 border-zinc-950 z-10" />
              <div className="flex flex-wrap gap-2 items-center text-sm font-bold uppercase tracking-wider mb-2 font-sora">
                <span className="text-emerald-400 font-mono">{item.time}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{item.category}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-sora leading-tight mb-4">{item.title}</h3>
              <div className="flex items-center gap-4 bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 max-w-md backdrop-blur-sm">
                <img src={item.avatar} alt={item.speaker} className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
                <div>
                  <h4 className="text-base font-bold text-zinc-200 font-sora">{item.speaker}</h4>
                  <p className="text-sm text-zinc-500 font-jakarta">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-white font-sora">Gostou da programação?</h4>
            <p className="text-sm text-zinc-400 font-jakarta mt-1">Garanta já o seu lugar na primeira edição do TugÁgil Experience.</p>
          </div>
          <button 
            onClick={() => setTicketModalOpen(true)}
            className="bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 whitespace-nowrap"
          >
            Garantir Bilhete
          </button>
        </div>
      </div>

      {/* Modal de Compra de Tickets */}
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