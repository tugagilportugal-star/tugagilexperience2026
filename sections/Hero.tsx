// sections/Hero.tsx
import React from 'react';
import { ASSETS } from '../config';

interface HeroProps {
  onOpenTicketModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTicketModal }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#060a07] overflow-hidden">
      
      {/* Imagem de Fundo Ajustada (Mais Clara e Brilhante) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.HERO_BG} 
          alt="TugÁgil Experience Background" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Degradé mais suave para dar brilho à imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a07] via-[#060a07]/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        
        {/* Linha de Detalhes Superior (Sem Bullets, Minimalista) */}
        <div className="text-xs md:text-sm font-extrabold text-zinc-100 uppercase tracking-widest mb-6 font-sora">
          1ª Edição Presencial • Outubro 2026 • ISLA Gaia
        </div>

        {/* Título Principal Impactante */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-none mb-6">
          TugÁgil <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">Experience</span>
        </h1>

        {/* Subtítulo Curto e Direto */}
        <p className="text-xl md:text-3xl text-zinc-200 max-w-3xl mb-12 font-bold tracking-tight font-sora">
          Inovação, Tecnologia e Produto
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button 
            onClick={onOpenTicketModal} 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-lg shadow-emerald-500/20"
          >
            Comprar Bilhete
          </button>
          <a 
            href="#program" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold transition-all backdrop-blur-sm text-center"
          >
            Ver Agenda
          </a>
        </div>
      </div>
    </section>
  );
};