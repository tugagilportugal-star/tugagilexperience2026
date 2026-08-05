// sections/Hero.tsx
import React from 'react';
import { ASSETS } from '../config';

interface HeroProps {
  onOpenTicketModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTicketModal }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#060a07] overflow-hidden">
      
      {/* Imagem de Fundo Clara */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ASSETS.HERO_BG} 
          alt="TugÁgil Experience Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a07] via-[#060a07]/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        
        <div className="text-xs md:text-sm font-extrabold text-zinc-100 uppercase tracking-widest mb-6 font-sora">
          1ª Edição Presencial • Outubro 2026 • Vila Nova de Gaia
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-none mb-6">
          TugÁgil <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">Experience</span>
        </h1>

        <p className="text-xl md:text-3xl text-zinc-200 max-w-3xl mb-12 font-bold tracking-tight font-sora">
          Inovação, Tecnologia e Produto
        </p>

        {/* Foco num único CTA de alta conversão */}
        <div className="w-full max-w-md">
          <button 
            onClick={onOpenTicketModal} 
            className="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#0A5C36] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shadow-lg shadow-emerald-500/20"
          >
            Comprar Bilhete
          </button>
        </div>
      </div>
    </section>
  );
};