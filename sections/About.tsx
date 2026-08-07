// sections/About.tsx
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center bg-zinc-950 text-white pb-24 overflow-hidden border-t border-zinc-900/40">
      
      {/* Estilo CSS embutido para a animação do Ticker */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* 1. FAIXA VERDE ROTACIONADA (Slanted Marquee - Muito mais dinâmica e ousada) */}
      <div className="relative w-full overflow-hidden my-16 z-20">
        <div className="bg-[#0A5C36] py-4 border-y border-emerald-500/20 transform -rotate-2 scale-105 shadow-xl shadow-black/40">
          <div className="animate-marquee gap-10 text-xs md:text-sm font-black tracking-[0.2em] text-emerald-100 font-sora uppercase">
            <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
            <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
          </div>
        </div>
      </div>

      {/* 2. IMAGEM DE FUNDO (Gaia) - Com maior brilho e sem o lado esquerdo preto */}
      <div className="absolute inset-0 z-0 mt-20">
        <img 
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
          alt="Vila Nova de Gaia" 
          className="w-full h-full object-cover opacity-40 grayscale"
        />
        {/* Filtro de escurecimento suave e uniforme (permite ver Gaia por todo o fundo) */}
        <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[2px]" />
      </div>

      {/* 3. CONTEÚDO EDITORIAL À ESQUERDA (História da Comunidade conectada ao Evento) [0.2] */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
        <div className="max-w-3xl">
          
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
            Jornada TugÁgil
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-12">
            A ligação que <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">transforma ideias.</span>
          </h2>
          
          {/* Estrutura fluida e limpa (Títulos verdes, textos claros) */}
          <div className="space-y-10 font-jakarta max-w-2xl">
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">A Origem (2022)</h3>
              <p className="text-zinc-100 text-base md:text-lg mt-2 leading-relaxed">
                Nascemos em março de 2022 para fortalecer a agilidade em Portugal. Criámos um espaço seguro de partilha, aprendizagem e colaboração em língua portuguesa, aproximando profissionais e organizações.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">O Nosso Propósito</h3>
              <p className="text-zinc-100 text-base md:text-lg mt-2 leading-relaxed">
                Apoiamos pessoas e empresas na sua jornada de evolução, ajudando-as a transformar conhecimento em prática e cooperação em impacto real através de conversas sobre liderança, inovação e produto.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">A Experiência (2026)</h3>
              <p className="text-zinc-100 text-base md:text-lg mt-2 leading-relaxed">
                O <strong className="text-[#emerald-400] font-bold">TugÁgil Experience Gaia 2026</strong> é o culminar desta história: a nossa primeira edição presencial na região Norte para criar as pontes físicas que impulsionam esta evolução.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );