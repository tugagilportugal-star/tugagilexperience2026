// sections/Hero.tsx
import React from 'react';
import { ASSETS } from '../config';

interface HeroProps {
  onOpenTicketModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTicketModal }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050806] overflow-hidden">
      
      {/* 1. Imagem de Fundo de Alta Resolução */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.HERO_BG} 
          alt="TugÁgil Experience Background" 
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-[#050806]/85 to-transparent" />
      </div>

      {/* 2. Grelha Técnica Subtil (Preenche o vazio no Desktop de forma ultra-elegante) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* 3. Luzes Ambientais de Palco */}
      <div className="absolute top-1/4 left-1/4 w-80 h-84 bg-[#0A5C36]/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D3122A]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        
        {/* Badge Minimalista */}
        <div className="text-xs md:text-sm font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 font-sora">
          1ª Edição Presencial • Outubro 2026 • ISLA Gaia
        </div>

        {/* Título Principal com Tipografia Sora e Gradiente Metálico */}
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 tracking-tighter leading-none mb-6 font-sora">
          TugÁgil <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">Experience</span>
        </h1>

        {/* A Nova Tagline Proposta (Aumentada para preencher o ecrã) [0.1] */}
        <p className="text-lg md:text-2xl text-zinc-300 max-w-3xl mb-12 font-bold tracking-tight leading-relaxed font-jakarta">
          O maior ponto de encontro do Norte para inspirar e conectar inovação, tecnologia e produto.
        </p>

        {/* Botão de Alta Conversão Único */}
        <div className="w-full max-w-xs">
          <button 
            onClick={onOpenTicketModal} 
            className="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-base tracking-wider uppercase transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-lg shadow-emerald-500/20 font-sora"
          >
            Comprar Bilhete
          </button>
        </div>
      </div>

      {/* Indicador de Rolar a Página (Preenche o vazio no fundo no desktop) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 z-10">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sora">Rolar para explorar</span>
        <div className="w-1.5 h-6 bg-zinc-800 rounded-full relative overflow-hidden">
          <div className="w-full h-2 bg-emerald-500 rounded-full absolute top-1 animate-[bounce_1.5s_infinite]" />
        </div>
      </div>

    </section>
  );
};