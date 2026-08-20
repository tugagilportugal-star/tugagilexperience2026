// src/sections/Program.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Program: React.FC = () => {
  const tracks = [
    {
      title: "Gestão & Liderança",
      desc: "Liderança adaptativa, cultura organizacional de alta performance, métricas e o papel das lideranças na agilidade em escala."
    },
    {
      title: "Engenharia de Software",
      desc: "Práticas modernas de desenvolvimento, DevOps, arquitetura e qualidade técnica que aceleram a entrega de valor."
    },
    {
      title: "Design, Produto & Discovery",
      desc: "UX/UI, técnicas de product discovery, estratégia de produto e metodologias para criar produtos centrados no utilizador."
    }
  ];

  return (
    <section id="program" className="bg-[#060a07] text-white py-24 border-t border-zinc-900/60">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-left mb-16">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">
            Áreas Foco
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 font-sora tracking-tight">
            Macro Temas 2026
          </h2>
          <p className="text-zinc-400 mt-4 text-base font-jakarta max-w-xl">
            As sessões e workshops cobrem os três pilares essenciais para a transformação e sucesso das organizações.
          </p>
        </div>

        {/* Grid de Trilhas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tracks.map((track, idx) => (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-4">Trilha {idx+1}</span>
              <h3 className="text-xl font-bold font-sora text-white mb-4">{track.title}</h3>
              <p className="text-sm text-zinc-400 font-jakarta leading-relaxed">{track.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};