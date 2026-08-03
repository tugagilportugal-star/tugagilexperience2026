// sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative bg-[#060a07] text-white py-24 overflow-hidden border-t border-zinc-900/60">
      
      {/* Luz ambiental de fundo suave */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#0A5C36]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Coluna da Esquerda: O Conceito Editorial */}
          <div className="lg:col-span-6">
            <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-3">
              1ª Edição Presencial • Gaia 2026 [0.1]
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight font-sora mb-6">
              A agilidade no terreno <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">acontece na ligação.</span>
            </h2>
            
            <p className="text-zinc-300 text-lg font-jakarta leading-relaxed mb-6">
              A agilidade não se lê em manuais; vive-se no terreno. O **TugÁgil Experience 2026** nasce para ser o espaço de ligação, networking e partilha pragmática que a comunidade da tecnologia e produto no Norte merece [0.1].
            </p>
            
            <p className="text-zinc-400 text-base font-jakarta leading-relaxed mb-8">
              Nas salas e auditório do <strong className="text-white font-semibold">ISLA Gaia</strong>, vamos reunir profissionais de engenharia de software, design, liderança e gestão de produto para um dia focado em casos práticos e transformação de impacto.
            </p>

            <a 
              href="#program" 
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
            >
              Confira a agenda do evento 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Coluna da Direita: Colagem Editorial de Fotos (Human Focus) [1.2.7] */}
          <div className="lg:col-span-6 relative h-[450px] w-full mt-8 lg:mt-0 flex items-center justify-center">
            
            {/* Foto de Fundo: Vila Nova de Gaia (Placeholder) */}
            <div className="absolute top-0 left-4 w-72 h-56 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <img 
                src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80" 
                alt="Vila Nova de Gaia Skyline" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                Vila Nova de Gaia
              </div>
            </div>

            {/* Foto da Frente: A Equipa TugÁgil (Human Connection) [0.3] */}
            <div className="absolute bottom-4 right-4 w-80 h-64 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
              <img 
                src={ASSETS.GROUP_PHOTO_BG} 
                alt="Equipa TugÁgil" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-3 bg-emerald-950/90 border border-emerald-500/30 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Comunidade de Práticas [0.2]
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};