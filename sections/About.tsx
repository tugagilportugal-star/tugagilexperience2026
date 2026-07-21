// src/sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative min-h-[85vh] flex items-center bg-zinc-950 py-24 overflow-hidden border-t border-zinc-900">
      
      {/* Imagem de Fundo Imersiva (Vila Nova de Gaia) [0.1] */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.GAIA_BG} 
          alt="Vila Nova de Gaia" 
          className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
        />
        {/* Degradé preto elegante para garantir legibilidade absoluta em qualquer ecrã */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
        <div className="max-w-2xl">
          
          {/* Tag Minimalista */}
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
            TugÁgil Experience • Gaia 2026
          </span>
          
          {/* Título Editorial Gigante */}
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight font-sora mb-8">
            A primeira edição presencial na região Norte.
          </h2>
          
          {/* Textos Corridos de Alto Impacto */}
          <p className="text-zinc-200 text-lg md:text-xl font-jakarta leading-relaxed mb-6 font-medium">
            A agilidade acontece na partilha genuína de experiências, no networking real e nas conversas que desafiam o status quo das organizações [0.1].
          </p>
          
          <p className="text-zinc-400 text-base font-jakarta leading-relaxed">
            Acolhido nas modernas instalações do <strong className="text-white font-semibold">ISLA Gaia</strong>, o TugÁgil Experience reúne líderes, engenheiros, designers e gestores de produto para um dia focado em inspiração estratégica e transformação aplicada [0.1].
          </p>

        </div>
      </div>
    </section>
  );
};