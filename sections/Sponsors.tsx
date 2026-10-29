import React from 'react';
import { Section } from '../components/UIComponents';
import { ASSETS } from '../config';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Sponsor {
  name: string;
  initials: string;
  logo?: string;
  url: string;
  customClass?: string;
}

const SponsorLogo: React.FC<{ 
  sponsor: Sponsor;
  tier: 'gold' | 'silver' | 'bronze' | 'community' | 'partner';
  className?: string;
}> = ({ sponsor, tier, className = '' }) => {
  if (sponsor.logo) {
    const plateRing = {
      gold: 'ring-2 ring-yellow-500/50',
      silver: 'ring-1 ring-zinc-400/40',
      bronze: 'ring-1 ring-orange-400/40',
      community: 'ring-1 ring-emerald-400/40',
      partner: 'ring-1 ring-blue-400/40',
    }[tier];

    return (
      <div className={`${className} ${plateRing} bg-white rounded-xl p-2 md:p-3 flex items-center justify-center shadow-lg overflow-hidden`}>
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className={`w-full h-full object-contain ${sponsor.customClass ?? ''}`}
        />
      </div>
    );
  }

  const colorSchemes = {
    gold:      { bg: 'rgba(234,179,8,0.08)',   text: '#fbbf24', border: 'rgba(234,179,8,0.3)' },
    silver:    { bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
    bronze:    { bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', border: 'rgba(249,115,22,0.3)' },
    community: { bg: 'rgba(16,185,129,0.08)',  text: '#10b981', border: 'rgba(16,185,129,0.3)' },
    partner:   { bg: 'rgba(59,130,246,0.08)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)' } // Corrigido para azul harmonioso
  };

  const colors = colorSchemes[tier];

  return (
    <div 
      className={`flex items-center justify-center rounded-lg border-2 font-bold ${className}`}
      style={{ 
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border
      }}
    >
      <span className="text-2xl md:text-3xl">{sponsor.initials}</span>
    </div>
  );
};

export const Sponsors: React.FC = () => {
  const MEDIA_KIT_URL = "https://drive.google.com/file/d/1Cai1MrG1hbuli8ud7Y7K_HAqPx4IcSYR/view?usp=drive_link";

  const goldSponsors: Sponsor[] = [
    { name: "Isla Gaia", initials: "IGS", url: "https://www.islagaia.pt", logo: "/assets/Isla-Gaia-Logo.png"},
  ];
  
  const silverSponsors: Sponsor[] = [
    { name: "Growing Centuries", initials: "GC", url: "https://growingcenturies.pt/", logo: "/assets/NAMING_PRETO_N_P.png" },
  ];

  const bronzeSponsors: Sponsor[] = [
    { name: "Ateliê do Software", initials: "AS", url: "https://atelie.software/", logo: "/assets/Logo_Atelie_Software_Transparente.png" },
    { name: "Aubay", initials: "AU", url: "https://www.aubay.pt/", logo: "/assets/Aubay-logo.png" },
    { name: "Cleva Solutions", initials: "CS", url: "https://cleva-solutions.ai/en/", logo: "/assets/logo-cleva.webp" },
    { name: "Scrum.pt", initials: "SPT", url: "https://scrum.pt/", logo: "/assets/scrum-pt.jpeg" },
  ];

  const communitySupporters: Sponsor[] = [
    { name: "Porto Tech Hub", initials: "PTH", url: "https://portotechhub.com/", logo: "/assets/Logo-principal.png", customClass: "scale-150" },
  ];

  const partnersCompanies: Sponsor[] = [
    { name: "wGood", initials: "WG", url: "https://wgood.app/", logo: "/assets/wgood.png", customClass: "scale-150" },
    { name: "ANIMALABS", initials: "AL", url: "", logo: "/assets/Logo_ANIMA_LABS.png", customClass: "scale-150" },
  ];

  return (
    <Section id="sponsors" className="relative bg-[#050806] border-t border-zinc-900 overflow-hidden">
      
      {/* Glow ambiental verde no canto superior direito */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-24">
        
        {/* GOLD SPONSORS */}
        {goldSponsors.length > 0 && (
          <div className="mb-24">
            <span className="text-lg font-bold tracking-[0.2em] text-yellow-500 uppercase mb-12 block font-sora">
              Patrocinadores Gold
            </span>
            <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
              {goldSponsors.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-zinc-900 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-yellow-500/30 flex items-center justify-center h-40 w-[45%] md:w-80 p-8"
                >
                  <SponsorLogo 
                    sponsor={sponsor}
                    tier="gold"
                    className="w-full h-32 group-hover:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* SILVER SPONSORS */}
        {silverSponsors.length > 0 && (
          <div className="mb-24">
            <span className="text-base font-bold tracking-[0.2em] text-zinc-400 uppercase mb-12 block font-sora">
              Patrocinadores Silver
            </span>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {silverSponsors.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-zinc-900 rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-zinc-700 flex items-center justify-center h-32 w-[45%] md:w-72 p-6"
                >
                  <SponsorLogo 
                    sponsor={sponsor}
                    tier="silver"
                    className="w-full h-24 group-hover:scale-105 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* BRONZE SPONSORS */}
        {bronzeSponsors.length > 0 && (
          <div className="mb-24">
              <span className="text-sm font-bold tracking-[0.2em] text-orange-400 uppercase mb-12 block font-sora">
                  Patrocinadores Bronze
              </span>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
                {bronzeSponsors.map((sponsor, idx) => (
                  <a 
                    key={idx} 
                    href={sponsor.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group bg-zinc-900 rounded-xl hover:shadow-lg transition-all duration-300 border border-zinc-800 flex items-center justify-center h-28 w-[45%] md:w-64 p-6"
                  >
                    <SponsorLogo 
                      sponsor={sponsor}
                      tier="bronze"
                      className="w-full h-20 group-hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
          </div>
        )}

        {/* COMUNIDADES APOIADORAS */}
        {communitySupporters.length > 0 && (
          <div className="mb-24">
              <span className="text-sm font-bold tracking-[0.2em] text-emerald-400 uppercase mb-12 block font-sora">
                  Comunidades Apoiadoras
              </span>
              <div className="flex flex-wrap justify-center gap-4 md:gap-10 items-center">
                {communitySupporters.map((sponsor, idx) => (
                  <a 
                    key={idx} 
                    href={sponsor.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group bg-zinc-900 rounded-xl hover:shadow-md transition-all duration-300 border border-zinc-800 flex items-center justify-center h-28 w-[45%] md:w-60 p-6"
                  >
                    <SponsorLogo 
                      sponsor={sponsor}
                      tier="community"
                      className="w-full h-20 group-hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
          </div>
        )}

        {/* EMPRESAS E MARCAS PARCEIRAS */}
        {partnersCompanies.length > 0 && (
          <div className="mb-24">
              <span className="text-sm font-bold tracking-[0.2em] text-blue-400 uppercase mb-12 block font-sora">
                  Empresas & Marcas Parceiras
              </span>
              <div className="flex flex-wrap justify-center gap-4 md:gap-10 items-center">
                {partnersCompanies.map((sponsor, idx) => (
                  <a 
                    key={idx} 
                    href={sponsor.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group bg-zinc-900 rounded-xl hover:shadow-md transition-all duration-300 border border-zinc-800 flex items-center justify-center h-28 w-[45%] md:w-60 p-6"
                  >
                    <SponsorLogo 
                      sponsor={sponsor}
                      tier="partner"
                      className="w-full h-20 group-hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* GATEWAY PARA A PÁGINA DE PARCERIAS (Substitui o CTA verde antigo) */}
        {/* ================================================================ */}
        <div className="mt-24 relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-16 text-center">
          {/* Glow sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block font-sora">
              Parcerias com Propósito
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight font-sora">
              Mais do que visibilidade.<br className="hidden md:block" />Ligações que criam valor.
            </h3>
            <p className="text-zinc-400 text-lg mb-8 font-jakarta leading-relaxed">
              Ligue a sua marca a profissionais de tecnologia, produto e liderança. 
              Explore formatos de patrocínio e colaboração alinhados com os objetivos da sua organização.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={MEDIA_KIT_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all font-bold font-sora"
              >
                <Download className="w-4 h-4" />
                Descarregar Media Kit
              </a>
              <Link 
                to="/parcerias" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all font-sora group"
              >
                Explorar Propostas de Parceria
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
};