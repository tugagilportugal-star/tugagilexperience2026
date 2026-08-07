// sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';

export const About: React.FC = () => {
  return (
    <>
      {/* Estilo CSS embutido seguro para o Ticker */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}} />

      {/* 1. FAIXA VERDE ROTACIONADA (Ticker Dinâmico) */}
      <div className="relative w-full overflow-hidden my-16 z-20">
        <div className="bg-[#0A5C36] py-4 border-y border-emerald-500/20 transform -rotate-2 scale-105 shadow-xl shadow-black/40">
          <div className="animate-marquee gap-10 text-xs md:text-sm font-black tracking-[0.2em] text-emerald-100 font-sora uppercase">
            <span>PORTUGAL 2026 • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
            <span>PORTUGAL 2026 • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
          </div>
        </div>
      </div>


      {/* 2. SECÇÃO ABOUT: A COMUNIDADE (Fundo Sólido, Sem Imagem no Fundo, Foco nas Pessoas) */}
      <section className="relative bg-[#050806] text-white py-24 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Texto Editorial da Comunidade (Títulos verdes, texto branco) [0.2] */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
                A Nossa Jornada
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-sora mb-12">
                A ligação que<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">transforma ideias.</span>
              </h2>
              
              <div className="space-y-10 font-jakarta">
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">A Origem</h3>
                  <p className="text-zinc-100 text-base md:text-lg mt-2 leading-relaxed">
                    Nascemos em março de 2022 para fortalecer a agilidade em Portugal. Criámos um espaço seguro de partilha, cocriação e colaboração em língua portuguesa, aproximando profissionais e equipas.
                  </p>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider font-sora">O Propósito</h3>
                  <p className="text-zinc-100 text-base md:text-lg mt-2 leading-relaxed">
                    Apoiamos pessoas e empresas a transformarem conhecimento em prática e cooperação em impacto real, impulsionando a evolução da agilidade no país.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagem Recortada da Comunidade (Traz o calor humano e quebra o vazio) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-2xl shadow-emerald-950/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={ASSETS.GROUP_PHOTO_BG} 
                  alt="Comunidade TugÁgil" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#0A5C36]/90 border border-emerald-500/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-200 uppercase tracking-wider font-sora">
                  Comunidade Ativa
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. NOVA SECÇÃO INDEPENDENTE: LOCALIZAÇÃO (Porquê Gaia? - Imagem de Fundo Imersiva) */}
      <section className="relative min-h-[85vh] flex items-center bg-zinc-950 py-24 overflow-hidden border-t border-zinc-900">
        
        {/* Imagem de Fundo (Vila Nova de Gaia) em Ecrã Inteiro */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
            alt="Vila Nova de Gaia" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
          <div className="max-w-3xl">
            
            <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
              Porquê Vila Nova de Gaia? [0.1]
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-12">
              Descentralizar e <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">aproximar a comunidade.</span>
            </h2>
            
            {/* Bloco Dinâmico e Curto de Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-jakarta">
              <div>
                <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">A Cidade</h3>
                <p className="text-zinc-200 text-sm md:text-base mt-2 leading-relaxed">
                  Gaia acolhe a agilidade no Norte de Portugal, ligando a nossa comunidade a um dos hubs de tecnologia e inovação mais vibrantes de Portugal.
                </p>
              </div>
              <div>
                <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">O Campus: ISLA Gaia</h3>
                <p className="text-zinc-200 text-sm md:text-base mt-2 leading-relaxed">
                  As instalações do ISLA Gaia oferecem o auditório e as salas para acolher talks e workshops.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};