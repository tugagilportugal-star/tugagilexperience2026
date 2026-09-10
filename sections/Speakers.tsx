import React from 'react';
import { Section } from '../components/UIComponents';
import { Linkedin, Sparkles, UserCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SpeakerData {
  id: string;
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  isRevealed: boolean;
  isEnglish?: boolean;
}

export const Speakers: React.FC = () => {
  
  const keynotes: SpeakerData[] = [
    { id: "k1", name: "A anunciar", role: "Lorem ipsum dolor sit amet", isRevealed: false },
    { id: "k2", name: "A anunciar", role: "Consectetur adipiscing elit", isRevealed: false },
  ];

  const speakers: SpeakerData[] = [
    { id: "s1", name: "A anunciar", role: "Product Owner", isRevealed: false },
    { id: "s2", name: "A anunciar", role: "Agile Coach", isRevealed: false },
    { id: "s3", name: "A anunciar", role: "Engineering Manager", isRevealed: false },
    { id: "s4", name: "A anunciar", role: "Scrum Master", isRevealed: false },
    { id: "s5", name: "A anunciar", role: "Product Manager", isRevealed: false },
    { id: "s6", name: "A anunciar", role: "Tech Lead", isRevealed: false },
    { id: "s7", name: "A anunciar", role: "UX Designer", isRevealed: false },
    { id: "s8", name: "A anunciar", role: "DevOps Engineer", isRevealed: false },
    { id: "s9", name: "A anunciar", role: "Data Scientist", isRevealed: false },
    { id: "s10", name: "A anunciar", role: "CTO", isRevealed: false },
  ];

  const KeynoteCard = ({ data }: { data: SpeakerData }) => {
    if (!data.isRevealed) {
      return (
        <div className="w-full max-w-[320px] aspect-[3/4] rounded-[2rem] border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center p-8 text-center shadow-sm">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <UserCircle2 className="w-12 h-12 text-zinc-600" />
          </div>
          <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest mb-2">Keynote</span>
          <h3 className="text-xl font-black text-white mb-2 font-sora">{data.name}</h3>
          <p className="text-zinc-500 text-sm font-jakarta">{data.role}</p>
        </div>
      );
    }

    return (
      <div className="group relative overflow-hidden rounded-[2rem] aspect-[3/4] w-full max-w-[320px] shadow-xl shadow-emerald-500/10 bg-zinc-900">
        <img 
          src={data.image} 
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-95"></div>
        
        {data.isEnglish && (
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1 group/flag">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-xl transition-transform group-hover/flag:scale-110 border-2 border-zinc-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full"><rect width="60" height="60" fill="#012169"/><path d="M0 0l60 60M60 0L0 60" stroke="#fff" strokeWidth="12"/><path d="M0 0l60 60M60 0L0 60" stroke="#C8102E" strokeWidth="8"/><path d="M30 0v60M0 30h60" stroke="#fff" strokeWidth="20"/><path d="M30 0v60M0 30h60" stroke="#C8102E" strokeWidth="12"/></svg>
            </div>
            <span className="opacity-0 group-hover/flag:opacity-100 transition-opacity duration-200 bg-zinc-900/95 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none border border-zinc-800">
              Talk em Inglês
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col items-start text-left z-10">
          <span className="inline-flex items-center gap-1 bg-[#D3122A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 shadow-lg shadow-red-500/20">
            <Sparkles className="w-3 h-3" /> Keynote
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight font-sora">{data.name}</h3>
          <p className="text-emerald-400 font-bold text-xs mb-1 font-jakarta">{data.role}</p>
          
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-white mt-2">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  const SpeakerCard = ({ data }: { data: SpeakerData }) => {
    if (!data.isRevealed) {
      return (
        <div className="flex flex-col items-center text-center group">
          <div className="w-full aspect-square rounded-2xl bg-zinc-900 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center mb-4 transition-colors group-hover:bg-zinc-800">
            <UserCircle2 className="w-12 h-12 text-zinc-600 mb-2" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Em Breve</span>
          </div>
          <h4 className="font-bold text-base text-white mb-1 font-jakarta">{data.name}</h4>
          <p className="text-xs font-medium text-emerald-400 mb-1 leading-tight font-jakarta">{data.role}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center group">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-md shadow-emerald-500/5 border border-zinc-800 bg-zinc-900">
          {data.isEnglish && (
            <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 group/flag">
              <div className="w-7 h-7 rounded-full overflow-hidden shadow-md transition-transform group-hover/flag:scale-110 border-2 border-zinc-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full"><rect width="60" height="60" fill="#012169"/><path d="M0 0l60 60M60 0L0 60" stroke="#fff" strokeWidth="12"/><path d="M0 0l60 60M60 0L0 60" stroke="#C8102E" strokeWidth="8"/><path d="M30 0v60M0 30h60" stroke="#fff" strokeWidth="20"/><path d="M30 0v60M0 30h60" stroke="#C8102E" strokeWidth="12"/></svg>
              </div>
              <span className="opacity-0 group-hover/flag:opacity-100 transition-opacity duration-200 bg-zinc-900/95 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none border border-zinc-800">
                Talk em Inglês
              </span>
            </div>
          )}
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {data.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900/90 backdrop-blur-sm text-white flex items-center justify-center hover:bg-emerald-500 shadow-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <h4 className="font-bold text-lg text-white mb-1 font-jakarta">{data.name}</h4>
        <p className="text-xs font-medium text-emerald-400 mb-1 leading-tight font-jakarta">{data.role}</p>
      </div>
    );
  };

  return (
    <Section id="speakers" className="relative bg-zinc-900 border-t border-zinc-800 overflow-hidden">
      
      {/* Glow ambiental vermelho no canto superior direito */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* Título da Secção */}
        <div className="text-center mb-20">
          <div className="inline-block relative mb-4">
            <span className="relative z-10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#D3122A] border-2 border-red-500/30 rounded-full bg-red-500/5 font-sora">
              Line-Up
            </span>
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full -z-10"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-sora">
            Speakers 2026
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-6 font-medium font-jakarta">
            Grandes nomes da agilidade, inovação e inteligência artificial.
          </p>
        </div>
{/* DESCOMENTAR QUANDO HOUVER SPEAKERS CONFIRMADOS
        SECÇÃO KEYNOTES 
        <div className="mb-24 w-full">
          <h3 className="text-2xl font-black text-white mb-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3 tracking-tighter font-sora">
            <Sparkles className="text-[#D3122A] w-6 h-6" /> Keynotes
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 w-full">
            {keynotes.map(keynote => (
              <KeynoteCard key={keynote.id} data={keynote} />
            ))}
          </div>
        </div>

         SECÇÃO SPEAKERS 
        <div>
          <h3 className="text-2xl font-black text-white mb-10 text-center md:text-left tracking-tighter font-sora">
            Speakers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {speakers.map(speaker => (
              <SpeakerCard key={speaker.id} data={speaker} />
            ))}
          </div>
        </div>

         CTA PARA A AGENDA 
        <div className="mt-20 mb-12 flex flex-col items-center">
          <Link
            to="/agenda"
            className="group relative inline-flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-[#0A5C36] to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1"
          >
            <span className="text-xl font-black tracking-tight font-sora">Explorar Agenda Completa</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D3122A] transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
/*}
        {/* Banner Call for Speakers 2026 — fundo verde */}
        <div className="mt-16 p-8 md:p-12 bg-gradient-to-br from-[#00331F] via-[#00693E] to-[#00875A] text-center w-full rounded-3xl shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
          {/* Detalhes decorativos vermelhos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E31E2D] opacity-10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#E31E2D] opacity-10 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm mb-4 border border-white/20">
              <span className="font-bold text-white text-sm font-sora">Call for Speakers</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight font-sora">
              Queres partilhar no TugÁgil Experience Gaia 2026?
            </h3>
            
            <p className="text-emerald-100 text-base mb-6 max-w-3xl mx-auto leading-relaxed font-jakarta">
              A 21 de novembro, no ISLA Gaia, temos três trilhas à tua espera: 
              <br />
              <strong className="text-white">Gestão & Liderança · Engenharia de Software · Design & Produto</strong>. 
              <br />
              Candidata-te para uma talk da comunidade ou um workshop.
            </p>
              
            <a 
              href="https://forms.gle/xPBvjEndTL94mhJ26"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#E31E2D] text-white px-8 py-3.5 rounded-xl font-black text-lg shadow-lg hover:bg-white hover:text-[#00693E] transition-all duration-300 transform hover:-translate-y-1 font-sora"
            >
              Candidatar-me
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};