// src/sections/Hero.tsx
import React from 'react';
import { ASSETS } from '../config';

interface HeroProps {
  onOpenTicketModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTicketModal }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#060a07] overflow-hidden">
      
      {/* Imagem de Fundo com Maior Visibilidade */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.HERO_BG} 
          alt="TugÁgil Experience Background" 
          className="w-full h-full object-cover opacity-40 mix-blend-lighten"
        />
        {/* Gradientes de cor de fundo para criar profundidade e conexão */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060a07]/80 to-[#060a07]" />
      </div>

      {/* Luzes de Palco Ambientais (Glowing Lights) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0A5C36]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#D3122A]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(10,92,54,0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        
        {/* Linha Minimalista de Detalhes do Topo */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm font-semibold text-zinc-300 tracking-wider uppercase mb-8">
          <span className="text-[#D3122A] font-bold">1ª Edição - Presencial</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 hidden sm:inline-block"></span>
          <span>Outubro de 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 hidden sm:inline-block"></span>
          <span className="text-emerald-400">ISLA Gaia • Vila Nova de Gaia, Portugal</span>
        </div>

        {/* Título Principal com Gradiente Energético */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-none mb-6">
          TugÁgil <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">Experience</span>
        </h1>

        {/* Subtítulo Dinâmico das Trilhas */}
        <p className="text-xl md:text-3xl text-zinc-300 max-w-3xl mb-4 font-bold tracking-tight">
          Agilidade, Liderança, Engenharia e Design
        </p>
        
        <p className="text-sm md:text-lg text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed">
          O ponto de encontro na região Norte de Portugal para profissionais e líderes que desenham o futuro da inovação, tecnologia e produto nas organizações.
        </p>

        {/* Botões de Ação com Efeito Glow no Principal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button 
            onClick={onOpenTicketModal} 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
          >
            Comprar Bilhete
          </button>
          <a 
            href="#program" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 font-semibold transition-all backdrop-blur-sm text-center"
          >
            Ver Agenda
          </a>
        </div>
      </div>
    </section>
  );
};