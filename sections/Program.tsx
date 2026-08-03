// sections/Program.tsx
import React, { useState } from 'react';

interface AgendaItem {
  time: string;
  category: string;
  title: string;
  speaker: string;
  role: string;
  avatar: string;
}

interface ProgramProps {
  onOpenTicketModal: () => void;
}

export const Program: React.FC<ProgramProps> = ({ onOpenTicketModal }) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon'>('morning');

  const morningHighlights: AgendaItem[] = [
    {
      time: "09h10 - 10h00",
      category: "Abertura",
      title: "Keynote Abertura",
      speaker: "A Confirmar",
      role: "Keynote Speaker",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "10h00 - 10h40",
      category: "Gestão & Liderança",
      title: "Como Liderar Equipas Autónomas sem Perder o Alinhamento Estratégico (título sugestivo)",
      speaker: "A Confirmar",
      role: "Agile Leader & Transformation Director (placeholder)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "11h10 - 12h00",
      category: "Engenharia de Software",
      title: "Práticas Modernas de Engenharia de Software no Contexto Ágil (título sugestivo)",
      speaker: "A Confirmar",
      role: "Principal Tech Lead / Software Architect (placeholder)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const afternoonHighlights: AgendaItem[] = [
    {
      time: "14h10 - 16h30",
      category: "Comunidade",
      title: "7 Talks Curtas da Comunidade Ágil de Portugal (título sugestivo)",
      speaker: "Vários Palestrantes da Comunidade",
      role: "Casos Reais e Partilha Prática de Experiências (placeholder)",
      avatar: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "17h00 - 18h00",
      category: "Debate Aberto",
      title: "Fishbowl: O Futuro da Agilidade em Portugal (título sugestivo)",
      speaker: "Participação Aberta ao Público (título sugestivo)",
      role: "Painel de Discussão Dinâmico (placeholder)",
      avatar: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "18h00 - 19h00",
      category: "Encerramento",
      title: "Keynote Encerramento (título sugestivo)",
      speaker: "Keynote Convidado (A Confirmar)",
      role: "Fecho de Alta Inspiração e Motivação (placeholder)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="program" className="bg-zinc-950 text-white py-24 border-t border-zinc-900/60">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Cabeçalho */}
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">
            Cronograma do Evento
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 font-sora tracking-tight">
            Programa Oficial
          </h2>
        </div>

        {/* Selecionador de Período (Manhã / Tarde) */}
        <div className="flex gap-4 mb-12 border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setActiveTab('morning')}
            className={`pb-2 text-lg font-bold transition-all ${activeTab === 'morning' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'}`}
          >
            Manhã (Auditório)
          </button>
          <button 
            onClick={() => setActiveTab('afternoon')}
            className={`pb-2 text-lg font-bold transition-all ${activeTab === 'afternoon' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'}`}
          >
            Tarde (Auditório & Salas)
          </button>
        </div>

        {/* Lista de Fluxo Vertical */}
        <div className="relative border-l border-zinc-800 ml-4 pl-6 md:pl-10 space-y-12">
          {(activeTab === 'morning' ? morningHighlights : afternoonHighlights).map((item, index) => (
            <div key={index} className="relative">
              
              {/* Indicador Visual */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#0A5C36] border-4 border-zinc-950 z-10" />

              <div className="flex flex-wrap gap-2 items-center text-xs font-bold uppercase tracking-wider mb-2 font-sora">
                <span className="text-emerald-400 font-mono">{item.time}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{item.category}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white font-sora leading-tight mb-4">
                {item.title}
              </h3>

              <div className="flex items-center gap-4 bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 max-w-md backdrop-blur-sm">
                <img 
                  src={item.avatar} 
                  alt={item.speaker} 
                  className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 font-sora">{item.speaker}</h4>
                  <p className="text-xs text-zinc-500 font-jakarta">{item.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Botão de Compra Integrado à Agenda */}
        <div className="mt-16 p-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-white font-sora">Gostou da programação?</h4>
            <p className="text-sm text-zinc-400 font-jakarta mt-1">
              Garanta o seu lugar na primeira edição do TugÁgil Experience em Gaia.
            </p>
          </div>
          <button 
            onClick={onOpenTicketModal}
            className="bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 whitespace-nowrap"
          >
            Garantir Bilhete
          </button>
        </div>

      </div>
    </section>
  );
};