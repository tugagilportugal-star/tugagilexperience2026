// sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';

export const About: React.FC = () => {
  return (
    <>
      {/* Estilos da Animação do Ticker embutidos de forma segura */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
      `}} />

      {/* 1. FAIXA VERDE HORIZONTAL DINÂMICA (Sem rotação, sem blocos brancos, efeito Outline) */}
      <div className="relative w-full bg-[#0A5C36] py-5 overflow-hidden border-y border-emerald-500/20 z-20">
        <div className="animate-marquee gap-12 text-sm font-black tracking-[0.25em] text-white font-sora uppercase">
          <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
          <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
        </div>
      </div>


      {/* 2. ABOUT COMUNIDADE: Equilíbrio de Contraste (Fundo Cinzento-Carvão Suave) */}
      <section className="relative bg-zinc-900 text-white py-24 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Conteúdo da História (Títulos verdes, textos claros) */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
                A Nossa Jornada
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-sora mb-12">
                A ligação que <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">transforma ideias.</span>
              </h2>
              
              <div className="space-y-10 font-jakarta">
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">A Origem (2022)</h3>
                  <p className="text-zinc-200 text-base md:text-lg mt-2 leading-relaxed">
                    Nascemos em março de 2022 para fortalecer a agilidade em Portugal. Criámos um espaço seguro de partilha, cocriação e colaboração em língua portuguesa, aproximando profissionais e equipas.
                  </p>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">O Nosso Propósito</h3>
                  <p className="text-zinc-200 text-base md:text-lg mt-2 leading-relaxed">
                    Apoiamos pessoas e empresas a transformarem conhecimento em prática e cooperação em impacto real, impulsionando a evolução da agilidade no país.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagem Limpa da Comunidade (Sem tags verdes de IA) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                <img 
                  src={ASSETS.GROUP_PHOTO_BG} 
                  alt="Comunidade TugÁgil" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. ABOUT LOCALIZAÇÃO: O Layout "WOW" (Ficha Técnica / Spec Sheet) */}
      <section className="relative min-h-[85vh] flex items-center bg-zinc-950 py-24 overflow-hidden border-t border-zinc-900">
        
        {/* Imagem de Fundo de Gaia (Suave e visível ao fundo) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
            alt="Vila Nova de Gaia" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-zinc-950/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
          
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
            Localização
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-16">
            Porquê Vila Nova de Gaia?
          </h2>

          {/* Ficha Técnica Minimalista de Alto Impacto (Design de Engenharia/Arquitetura) */}
          <div className="border-t border-zinc-800 divide-y divide-zinc-800 font-jakarta">
            
            {/* Linha 1: A Cidade */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-4 text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">
                A Cidade
              </div>
              <div className="md:col-span-8 text-zinc-200 text-base md:text-lg leading-relaxed">
                O Norte de Portugal é um polo ativo de inovação. Escolhemos Vila Nova de Gaia para descentralizar o conhecimento e criar conexões fortes com os profissionais da região.
              </div>
            </div>

            {/* Linha 2: O Campus */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-4 text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">
                O Campus
              </div>
              <div className="md:col-span-8 text-zinc-200 text-base md:text-lg leading-relaxed">
                O ISLA Gaia abre-nos as portas com um campus moderno, auditórios e salas equipadas para as nossas sessões de tecnologia, gestão e produto.
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};