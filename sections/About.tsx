// sections/About.tsx
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative min-h-[90vh] flex items-center bg-zinc-950 py-24 overflow-hidden border-t border-zinc-900">
      
      {/* Imagem de Fundo (Vila Nova de Gaia) em Ecrã Inteiro */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
          alt="Vila Nova de Gaia" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        {/* Gradiente escuro para garantir leitura perfeita do texto por cima */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
        <div className="max-w-2xl">
          
          {/* Tag Minimalista */}
          <span className="text-[#D3122A] text-sm font-bold uppercase tracking-widest font-sora block mb-4">
            TugÁgil Experience • Outubro de 2026
          </span>
          
          {/* Título Editorial Gigante */}
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-8">
            A agilidade <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">vive da ligação.</span>
          </h2>
          
          {/* Textos Corridos de Alto Impacto (Aumentados para melhor legibilidade) */}
          <p className="text-zinc-200 text-lg md:text-xl font-jakarta leading-relaxed mb-6 font-medium">
            A agilidade não se lê em manuais; vive-se no terreno. O TugÁgil Experience 2026 nasce para ser o espaço de ligação, networking e partilha que a comunidade da tecnologia e produto no Norte merece.
          </p>
          
          <p className="text-zinc-400 text-base md:text-lg font-jakarta leading-relaxed">
            Acolhido nas instalações do ISLA Gaia, vamos reunir profissionais de engenharia de software, design, liderança e gestão de produto para um dia focado em casos práticos e transformação de impacto nas organizações.
          </p>

        </div>
      </div>
    </section>
  );
};