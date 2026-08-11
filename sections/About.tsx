// src/sections/About.tsx
import React from 'react';
import { ASSETS } from '../config';
import { MapPin, Train, Car, ExternalLink, Globe, Zap, Users, Award } from 'lucide-react';

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

      {/* 1. FAIXA VERDE HORIZONTAL DINÂMICA */}
      <div className="relative w-full bg-[#0A5C36] py-5 overflow-hidden border-y border-emerald-500/20 z-20">
        <div className="animate-marquee gap-12 text-sm font-black tracking-[0.25em] text-white font-sora uppercase">
          <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • NOVEMBRO EM GAIA •&nbsp;</span>
          <span>PORTUGAL • INOVAÇÃO • TECNOLOGIA • PRODUTO • COMUNIDADE • NOVEMBRO EM GAIA •&nbsp;</span>
        </div>
      </div>


      {/* 2. ABOUT COMUNIDADE: Origem e Propósito */}
      <section className="relative bg-zinc-900 text-white py-24 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Texto Editorial da Comunidade */}
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
                  <h3 className="text-emerald-400 font-bold text-lg font-sora uppercase tracking-wider">O O Nosso Propósito</h3>
                  <p className="text-zinc-200 text-base md:text-lg mt-2 leading-relaxed">
                    Apoiamos pessoas e empresas a transformarem conhecimento em prática e cooperação em impacto real, impulsionando a evolução da agilidade no país.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagem Limpa da Comunidade */}
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


      {/* 3. NOVA SECÇÃO LOCALIZAÇÃO: Estilo RSG Destination Card */}
      <section className="relative bg-[#050806] text-white py-24 overflow-hidden border-t border-zinc-900">
        
        {/* Imagem de Fundo de Gaia (Visível e integrada sem conflitar com o texto) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80" 
            alt="Vila Nova de Gaia" 
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-[#050806]/85" />
        </div>

        {/* Luzes Ambientais do Palco da Localização */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#0A5C36]/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full text-left">
          
          {/* Cabeçalho de Localização */}
          <div className="mb-16">
            <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora block mb-4">
              LOCALIZAÇÃO
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-sora mb-6">
              Onde será o TugÁgil Experience 2026?
            </h2>
            <p className="text-zinc-400 text-base md:text-lg font-jakarta max-w-3xl leading-relaxed">
              Unimos a energia de um dos ecossistemas de engenharia e produto que mais cresce no país à máxima conveniência de acessos e instalações para todos os participantes.
            </p>
          </div>

          {/* Grid de Conteúdo Dinâmico */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Coluna da Esquerda: Grande Cartão de Acessibilidade (Espaçamento corrigido para evitar vácuo) [1.2.7] */}
            <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
              
              {/* Nome do Local e Morada Oficial */}
              <div className="flex gap-4 items-start mb-8">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A5C36] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <MapPin size={24} />
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold font-sora text-white leading-tight">
                    ISLA Gaia
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1 font-jakarta">
                    R. Diogo Macedo 192, 4400-107 Vila Nova de Gaia, Portugal [1.2.7]
                  </p>
                </div>
              </div>

              <hr className="border-zinc-800/80 mb-8" />

              {/* Lista de Transportes/Como Chegar */}
              <div className="space-y-8 font-jakarta">
                
                {/* Metro (Transparente quanto à caminhada de 15 minutos) [1.2.7] */}
                <div className="flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Train size={20} />
                  </span>
                  <div>
                    <h4 className="font-bold text-white font-sora text-base">Metro (Linha Amarela)</h4>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                      Acessibilidade garantida. O campus fica a cerca de 15 minutos a pé (1 km) da estação de Metro D. João II (Linha Amarela), permitindo uma ligação direta ao centro do Porto.
                    </p>
                  </div>
                </div>

                {/* Estacionamento e Acessos */}
                <div className="flex gap-4 items-start">
                  <span className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Car size={20} />
                  </span>
                  <div>
                    <h4 className="font-bold text-white font-sora text-base">Acessos e Estacionamento</h4>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                      Para quem viaja de carro, o acesso é facilitado através das autoestradas A1, A44 e VCI, com opções de estacionamento público nas imediações do campus.
                    </p>
                  </div>
                </div>

              </div>

              {/* Botão Google Maps robusto e universal */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=ISLA+Gaia+Rua+Diogo+Macedo+192" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group font-sora"
                >
                  VER NO GOOGLE MAPS <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Coluna da Direita: Ecossistema e Tópicos de Inovação */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Cartão Superior: Porquê o Norte? (Sem o link opcional) [1.2.7] */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold font-sora text-white mb-4">
                  Porquê Vila Nova de Gaia?
                </h3>
                <p className="text-sm text-zinc-400 font-jakarta leading-relaxed">
                  A área metropolitana do Porto e Gaia consolidou-se como um dos polos de inovação tecnológica e engenharia de software mais dinâmicos de Portugal. A região atrai anualmente hubs internacionais de desenvolvimento e equipas altamente qualificadas de gestão de produto e agilidade.
                </p>
              </div>

              {/* Grid de 4 Mini-Cartões de Tópicos Relevantes */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Item 1 */}
                <div className="bg-zinc-900/40 border border-[#0A5C36]/20 rounded-xl p-5">
                  <Zap className="text-emerald-400 mb-3" size={20} />
                  <h4 className="font-bold font-sora text-sm text-white">Hub de Inovação</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-jakarta">Forte presença de scaleups de engenharia.</p>
                </div>

                {/* Item 2 */}
                <div className="bg-zinc-900/40 border border-[#0A5C36]/20 rounded-xl p-5">
                  <Users className="text-emerald-400 mb-3" size={20} />
                  <h4 className="font-bold font-sora text-sm text-white">Comunidade Ativa</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-jakarta">Partilha entre profissionais.</p>
                </div>

                {/* Item 3 */}
                <div className="bg-zinc-900/40 border border-[#0A5C36]/20 rounded-xl p-5">
                  <Award className="text-emerald-400 mb-3" size={20} />
                  <h4 className="font-bold font-sora text-sm text-white">Talento Qualificado</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-jakarta">Proximidade com universidades de referência.</p>
                </div>

                {/* Item 4 */}
                <div className="bg-zinc-900/40 border border-[#0A5C36]/20 rounded-xl p-5">
                  <Globe className="text-emerald-400 mb-3" size={20} />
                  <h4 className="font-bold font-sora text-sm text-white">Ligação Global</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-jakarta">Infraestruturas e acessos diretos.</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
};