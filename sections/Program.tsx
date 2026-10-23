// src/sections/Program.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Linkedin, Sparkles, UserCircle2, ArrowRight } from 'lucide-react';

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
            <div key={idx} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-4">Trilha {idx + 1}</span>
              <h3 className="text-xl font-bold font-sora text-white mb-4">{track.title}</h3>
              <p className="text-sm text-zinc-400 font-jakarta leading-relaxed">{track.desc}</p>
            </div>
          ))}
        </div>

        {/* Botão para a Página da Agenda */}
        {/* CTA PARA A AGENDA */}
        <div className="mt-20 mb-12 flex flex-col items-center">
          <Link
            to="/agenda"
            className="group relative inline-flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-[#0A5C36] to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1"
          >
            <span className="text-xl font-black tracking-tight font-sora">Explorar Agenda Completa</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D3122A] transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};