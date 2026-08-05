// sections/About.tsx
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative min-h-[90vh] flex flex-col justify-center bg-zinc-950 text-white pb-24 overflow-hidden border-t border-zinc-900">
      
      {/* Estilo CSS embutido para garantir que a faixa se move sozinha sem tocar em ficheiros externos */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* 1. FAIXA VERDE EM MOVIMENTO (Ticker Dinâmico) */}
      <div className="relative w-full bg-[#0A5C36] py-4 overflow-hidden border-y border-emerald-500/20 mb-20 z-10">
        <div className="animate-marquee gap-10 text-xs md:text-sm font-black tracking-widest text-emerald-100 font-sora uppercase">
          <span>INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
          <span>INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •&nbsp;</span>
        </div>
      </div>

      {/* 2. IMAGEM DE FUNDO (Vila Nova de Gaia) [0.1] */}
      <div className="absolute inset-0 z-0 mt-16">
        <img 
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
          alt="Vila Nova de Gaia" 
          className="w-full h-full object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
      </div>

      {/* 3. CONTEÚDO EDITORIAL À ESQUERDA (Mensagens Curtas e Diretas) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-left">
        <div className="max-w-2xl">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
            O Encontro
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-12">
            A ligação que <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">transforma ideias.</span>
          </h2>
          
          {/* Layout dinâmico de leitura rápida */}
          <div className="space-y-8 font-jakarta">
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora">O Evento</h3>
              <p className="text-zinc-300 text-base mt-1">
                A primeira edição presencial do TugÁgil Experience na região Norte. Um dia inteiro focado em partilha e experiências reais.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora">A Comunidade</h3>
              <p className="text-zinc-300 text-base mt-1">
                Espaços seguros de cocriação, networking e ligação genuína entre profissionais e organizações.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg font-sora">O Local</h3>
              <p className="text-zinc-300 text-base mt-1">
                Acolhidos no campus do <strong className="text-white font-semibold">ISLA Gaia</strong>, em Vila Nova de Gaia. Um ecossistema perfeito para debater e aprender.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};