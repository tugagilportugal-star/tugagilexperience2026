// sections/About.tsx
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative bg-zinc-950 text-white pb-24 overflow-hidden">
      
      {/* 1. BANNER DE DESTAQUE DINÂMICO (Quebra o preto com preto) */}
      <div className="relative w-full bg-[#0A5C36] py-4 overflow-hidden border-y border-emerald-500/20 mb-20 z-10">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10 text-sm font-black tracking-widest text-emerald-100 font-sora">
          <span>INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •</span>
          <span>INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •</span>
          <span>INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • OUTUBRO EM GAIA •</span>
        </div>
      </div>

      {/* 2. CONTEÚDO CONTEXTUALIZADO DO EVENTO */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 text-left">
            <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-3">
              Porquê Vila Nova de Gaia?
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight font-sora mb-6">
              O que é o TugÁgil Experience?
            </h2>
            
            <p className="text-zinc-300 text-lg font-jakarta leading-relaxed mb-6">
              A comunidade TugÁgil nasceu com o propósito de promover a agilidade e a inovação tecnológica em Portugal. E é com este intuito de descentralizar o conhecimento e a partilha entre profissionais que residem na região Norte do país, que criamos o **TugÁgil Experience**: um evento focado no ecossistema de liderança, transformação organizacional, gestão de produtos e engenharia de software, que terá lugar em **Vila Nova de Gaia**. O TugÁgil Experience é uma oportunidade para profissionais, líderes e entusiastas da tecnologia se reunirem, aprenderem e se inspirarem com especialistas de nacionais.
            </p>

            <p className="text-zinc-400 text-base font-jakarta leading-relaxed mb-6">
              Escolhemos Vila Nova de Gaia como o nosso ponto de encontro e o moderno campus do **ISLA Gaia** como a nossa casa. Trata-se de uma localização estratégica de fácil acesso, com instalações preparadas para proporcionar debates e salas estruturadas para masterclasses e workshops de Engenharia, Liderança e Design de Produto.
            </p>
          </div>
        </div>

        {/* Imagem de Fundo de Vila Nova de Gaia */}
        <div className="w-full h-96 rounded-2xl overflow-hidden border border-zinc-900 shadow-2xl mt-12">
          <img 
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
            alt="Vila Nova de Gaia" 
            className="w-full h-full object-cover grayscale"
          />
        </div>

      </div>
    </section>
  );
};