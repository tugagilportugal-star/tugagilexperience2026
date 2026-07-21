// src/sections/About.tsx
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative bg-zinc-950 text-white py-24 overflow-hidden border-t border-zinc-900">
      
      {/* Detalhe de Luz de Fundo para dar energia visual */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#0A5C36]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Coluna da Esquerda: O Conceito e Conexão (Fontes Sora e Jakarta) */}
          <div className="lg:col-span-7">
            <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">
              A Conexão que faltava no Norte
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 font-sora leading-tight">
              Mais do que um evento, <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">uma experiência real.</span>
            </h2>
            
            <p className="text-zinc-300 mt-6 text-base md:text-lg font-jakarta leading-relaxed">
              O **TugÁgil Experience Gaia 2026** é a primeira edição de um evento presencial de dia inteiro desenhado para inspirar e ligar a comunidade ágil na região Norte de Portugal [0.1]. 
            </p>
            
            <p className="text-zinc-400 mt-4 text-base font-jakarta leading-relaxed">
              Vamos unir profissionais, decisores e líderes de agilidade, tecnologia, produto, gestão e pessoas para um dia inteiro de networking de alta qualidade, partilha sincera de experiências e aprendizagem prática inovadora [0.1].
            </p>

            <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
              <h4 className="font-bold text-white font-sora flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A5C36]" /> Onde vai acontecer?
              </h4>
              <p className="text-zinc-400 text-sm mt-2 font-jakarta">
                Acolhidos no prestigiado auditório e salas temáticas do **ISLA Gaia**, em Vila Nova de Gaia, criámos o ecossistema perfeito para debates abertos (Fishbowl), workshops e masterclasses interativas e conexão genuína [0.1].
              </p>
            </div>
          </div>

          {/* Coluna da Direita: Números de Impacto e Comunidade */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Card 1: Participantes */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-[#0A5C36] text-3xl md:text-4xl font-extrabold font-sora">180</span>
              <p className="text-sm font-bold text-zinc-300 mt-4 font-sora">Participantes</p>
              <p className="text-xs text-zinc-500 mt-1 font-jakarta">Capacidade exclusiva para conexão de alta qualidade [0.1].</p>
            </div>

            {/* Card 2: Atividades */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-[#D3122A] text-3xl md:text-4xl font-extrabold font-sora">13</span>
              <p className="text-sm font-bold text-zinc-300 mt-4 font-sora font-sora">Sessões</p>
              <p className="text-xs text-zinc-500 mt-1 font-jakarta">3 keynotes principais, 7 talks da comunidade e 3 workshops iterativos [0.1].</p>
            </div>

            {/* Card 3: Profissionais Impactados */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl flex flex-col justify-between col-span-2">
              <div className="flex justify-between items-baseline">
                <span className="text-white text-3xl md:text-4xl font-extrabold font-sora">+1000</span>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md font-mono">TugÁgil</span>
              </div>
              <p className="text-sm font-bold text-zinc-300 mt-4 font-sora">Profissionais Impactados</p>
              <p className="text-xs text-zinc-500 mt-1 font-jakarta">Desde 2022 uma jornada de partilha, cocriação e aprendizagem contínua em Portugal [0.2].</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};