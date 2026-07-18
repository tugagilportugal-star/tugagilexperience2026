// src/sections/Program.tsx
import React, { useState } from 'react';

interface ProgramItem {
  time: string;
  title: string;
  location: string;
  description?: string;
}

interface ProgramProps {
  onOpenTicketModal: () => void;
}

export const Program: React.FC<ProgramProps> = ({ onOpenTicketModal }) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'community' | 'workshops'>('morning');

  // Programações extraídas do material enviado
  const morningSchedule: ProgramItem[] = [
    { time: "08h00 - 09h00", title: "Credenciamento, recepção dos participantes e networking inicial", location: "Área de recepção / coffee-break" },
    { time: "09h00 - 09h10", title: "Abertura oficial do evento", location: "Auditório Principal" },
    { time: "09h10 - 10h00", title: "Keynote de abertura", location: "Auditório Principal" },
    { time: "10h00 - 10h40", title: "Palestra: Gestão e Liderança Ágil", location: "Auditório Principal" },
    { time: "10h40 - 11h10", title: "Coffee-break e networking", location: "Área de coffee-break" },
    { time: "11h10 - 12h00", title: "Palestra: Engenharia de Software e Agilidade", location: "Auditório Principal" },
    { time: "12h00 - 12h50", title: "Palestra: Design, Produto e Experiência do Usuário", location: "Auditório Principal" },
    { time: "12h50 - 13h00", title: "Encaminhamentos para almoço e programação da tarde", location: "Auditório Principal" },
    { time: "13h00 - 14h00", title: "Almoço e networking livre", location: "Área de alimentação" },
  ];

  const communitySchedule: ProgramItem[] = [
    { time: "14h00 - 14h10", title: "Abertura da trilha da comunidade", location: "Auditório Principal" },
    { time: "14h10 - 16h30", title: "7 Talks Curtas da Comunidade (20 min cada sem perguntas)", location: "Auditório Principal", description: "Experiências e cases reais apresentados pela comunidade ágil de Portugal." },
    { time: "16h30 - 17h00", title: "Coffee-break e networking", location: "Área de coffee-break" },
    { time: "17h00 - 18h00", title: "Fishbowl: O futuro da Agilidade em Portugal", location: "Auditório Principal", description: "Discussão aberta e dinâmica com toda a comunidade." },
    { time: "18h00 - 19h00", title: "Keynote de encerramento & Encerramento do evento", location: "Auditório Principal" },
  ];

  const workshopsSchedule = [
    {
      room: "Sala #1 — Gestão & Liderança",
      items: [
        { time: "14h00 - 16h30", title: "Masterclass / Workshop (Parte 1)", location: "Sala #1" },
        { time: "16h30 - 16h45", title: "Coffee-break", location: "Sala #1" },
        { time: "17h00 - 18h00", title: "Masterclass / Workshop (Parte 2)", location: "Sala #1" }
      ]
    },
    {
      room: "Sala #2 — Engenharia de Software",
      items: [
        { time: "14h00 - 16h30", title: "Masterclass / Workshop (Parte 1)", location: "Sala #2" },
        { time: "16h30 - 16h45", title: "Coffee-break", location: "Sala #2" },
        { time: "17h00 - 18h00", title: "Masterclass / Workshop (Parte 2)", location: "Sala #2" }
      ]
    },
    {
      room: "Sala #3 — Design, Produto & Discovery",
      items: [
        { time: "14h00 - 16h30", title: "Masterclass / Workshop (Parte 1)", location: "Sala #3" },
        { time: "16h30 - 16h45", title: "Coffee-break", location: "Sala #3" },
        { time: "17h00 - 18h00", title: "Masterclass / Workshop (Parte 2)", location: "Sala #3" }
      ]
    }
  ];

  return (
    <section id="program" className="bg-zinc-950 text-white py-24 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Cabeçalho da Secção */}
        <div className="text-center mb-16">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest">Cronograma Oficial</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2">Programação do Evento</h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            Escolha as suas atividades e monte a sua agenda personalizada.
          </p>
        </div>

        {/* Abas Selecionadoras */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button 
            onClick={() => setActiveTab('morning')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'morning' ? 'bg-[#0A5C36] text-white shadow-lg shadow-emerald-900/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            Manhã (Auditório)
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'community' ? 'bg-[#0A5C36] text-white shadow-lg shadow-emerald-900/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            Tarde (Comunidade)
          </button>
          <button 
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'workshops' ? 'bg-[#0A5C36] text-white shadow-lg shadow-emerald-900/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            Tarde (Workshops Paralelos)
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
          {/* Manhã e Tarde Comunidade */}
          {(activeTab === 'morning' || activeTab === 'community') && (
            <div className="space-y-8">
              {(activeTab === 'morning' ? morningSchedule : communitySchedule).map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 pb-8 border-b border-zinc-800/80 last:border-b-0 last:pb-0">
                  <div className="md:w-32 flex-shrink-0">
                    <span className="inline-block bg-zinc-800 text-zinc-300 font-mono text-sm px-3 py-1 rounded-lg">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D3122A]"></span> {item.location}
                    </p>
                    {item.description && (
                      <p className="text-zinc-500 text-sm mt-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Abas de Workshops Paralelos */}
          {activeTab === 'workshops' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {workshopsSchedule.map((track, trackIdx) => (
                <div key={trackIdx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#D3122A] border-b border-zinc-800 pb-3 mb-6">
                      {track.room}
                    </h3>
                    <div className="space-y-6">
                      {track.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex flex-col gap-2">
                          <span className="text-xs font-mono text-[#0A5C36] font-semibold">{item.time}</span>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-zinc-800/50">
                    <span className="text-xs text-zinc-500">Localização: {track.items[0].location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};