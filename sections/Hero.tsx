// src/sections/Hero.tsx
import React from 'react';
import { ASSETS } from '../config';

interface HeroProps {
  onOpenTicketModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTicketModal }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Imagem de Fundo com Overlay Escuro */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.HERO_BG} 
          alt="TugÁgil Experience Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        {/* Badge do Evento */}
        <span className="inline-block bg-[#D3122A] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          1ª Edição • Presencial
        </span>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          TugÁgil <span className="text-[#0A5C36]">Experience</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-zinc-300 mb-6">
          Gaia 2026
        </h2>

        {/* Subtítulo / Trilhas */}
        <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mb-8 font-medium leading-relaxed">
          Agilidade ⚪ Liderança ⚪ Engenharia ⚪ Design
        </p>

        {/* Caixa de Detalhes (Data, Hora e Local) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-4xl w-full mb-10 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Quando</span>
            <span className="text-base font-semibold text-white">Outubro de 2026</span>
            <span className="text-sm text-zinc-400">08h00</span>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-zinc-800 py-4 md:py-0">
            <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Onde</span>
            <span className="text-base font-semibold text-white">ISLA Gaia</span>
            <span className="text-sm text-zinc-400">Vila Nova de Gaia, Portugal</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Público-alvo</span>
            <span className="text-base font-semibold text-white">Profissionais & Líderes</span>
            <span className="text-sm text-zinc-400">Tecnologia, Gestão, Produto</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button 
            onClick={onOpenTicketModal} 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#0A5C36] hover:bg-[#08482b] text-white font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-lg shadow-emerald-900/20"
          >
            Comprar Bilhete
          </button>
          <a 
            href="#program" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold transition-all text-center"
          >
            Ver Programa
          </a>
        </div>
      </div>
    </section>
  );
};