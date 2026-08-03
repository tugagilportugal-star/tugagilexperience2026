// sections/Program.tsx
import React from 'react';

interface AgendaItem {
  time: string;
  category: string;
  title: string;
  speaker: string;
  role: string;
  avatar: string;
}

export const Program: React.FC = () => {
  // Dados simulados da programação do material [0.1]
  const morningHighlights: AgendaItem[] = [
    {
      time: "09h10 - 10h00",
      category: "Abertura",
      title: "Opening Keynote",
      speaker: "TBD",
      role: "Keynote Speaker",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "10h00 - 10h40",
      category: "Gestão & Liderança",
      title: "Como Liderar Equipas Autónomas sem Perder o Alinhamento Estratégico (título sugestivo)",
      speaker: "TBD",
      role: "Agile Leader & Transformation Director (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      time: "11h10 - 12h00",
      category: "Engenharia de Software",
      title: "Práticas Modernas de Engenharia de Software no Contexto Ágil (título sugestivo)",
      speaker: "TBD",
      role: "Principal Tech Lead / Software Architect (Placeholder)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="program" className="bg-[#060a07] text-white py-24 border-t border-zinc-900/60">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Cabeçalho */}
        <div className="text-left mb-16">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">
            Destaques da Agenda
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 font-sora tracking-tight">
            Programa da Manhã
          </h2>
          <p className="text-zinc-400 mt-4 text-base font-jakarta max-w-xl">
            Uma base voltada para toda comunidade no Auditório Principal, abrindo espaço para aprofundamento à tarde.
          </p>
        </div>

        {/* Lista de Fluxo Vertical Humana */}
        <div className="relative border-l border-zinc-800 ml-4 pl-6 md:pl-10 space-y-12">
          {morningHighlights.map((item, index) => (
            <div key={index} className="relative">
              
              {/* Ponto indicador na linha vertical */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#0A5C36] border-4 border-[#060a07] z-10" />

              {/* Bloco de Horário e Categoria */}
              <div className="flex flex-wrap gap-2 items-center text-xs font-bold uppercase tracking-wider mb-2 font-sora">
                <span className="text-emerald-400 font-mono">{item.time}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{item.category}</span>
              </div>

              {/* Título da Palestra */}
              <h3 className="text-xl md:text-2xl font-bold text-white font-sora leading-tight mb-4">
                {item.title}
              </h3>

              {/* Avatar e Informação do Palestrante Placeholder */}
              <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3 max-w-md backdrop-blur-sm">
                <img 
                  src={item.avatar} 
                  alt={item.speaker} 
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 font-sora">{item.speaker}</h4>
                  <p className="text-xs text-zinc-500 font-jakarta">{item.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Nota sobre as salas da tarde */}
        <div className="mt-16 p-6 bg-gradient-to-r from-zinc-900 to-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-white font-sora">E no período da tarde?</h4>
            <p className="text-sm text-zinc-400 font-jakarta mt-1">
              3 trilhas paralelas com 3 masterclasses e 7 Talks da Comunidade [0.1]!
            </p>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-zinc-700 font-sora whitespace-nowrap">
            Explorar Workshops da Tarde
          </button>
        </div>

      </div>
    </section>
  );
};