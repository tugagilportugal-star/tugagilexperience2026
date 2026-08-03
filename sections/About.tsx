// sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative bg-zinc-950 text-white py-24 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        
        {/* Layout Editorial Alinhado à Esquerda */}
        <div className="max-w-3xl text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-3">
            O Encontro da Comunidade Ágil
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight font-sora mb-6">
            Mais do que um evento, uma experiência de conexão real.
          </h2>
          
          <p className="text-zinc-300 text-lg font-jakarta leading-relaxed mb-6 font-medium">
            A agilidade vive da proximidade. O TugÁgil Experience 2026 foi desenhado para ser o ponto de encontro da partilha de experiências, networking e dos debates que transformam as organizações no Norte de Portugal.
          </p>
          
          <p className="text-zinc-400 text-base font-jakarta leading-relaxed">
            Acolhido nas instalações do ISLA Gaia, vamos reunir profissionais e líderes das áreas de gestão, engenharia de software, design e produto para um dia inteiro de inspiração e aprendizagem aplicada.
          </p>
        </div>

        {/* Imagem Panorâmica Limpa (Sem recortes de IA ou carnaval) */}
        <div className="w-full h-96 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl mt-12">
          <img 
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
            alt="Vila Nova de Gaia" 
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
};