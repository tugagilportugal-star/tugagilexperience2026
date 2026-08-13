import React from 'react';
import { Section } from '../components/UIComponents';
import { ASSETS } from '../config';
import { Download } from 'lucide-react';

interface Sponsor {
  name: string;
  initials: string;
  logo?: string;
  url: string;
  customClass?: string;
}

const SponsorLogo: React.FC<{ 
  sponsor: Sponsor;
  tier: 'gold' | 'silver' | 'bronze' | 'community';
  className?: string;
}> = ({ sponsor, tier, className = '' }) => {
  if (sponsor.logo) {
  // Anel sutil na cor do tier, para manter a identidade mesmo no prato branco
    const plateRing = {
      gold: 'ring-2 ring-yellow-500/50',
      silver: 'ring-1 ring-zinc-400/40',
      bronze: 'ring-1 ring-orange-400/40',
      community: 'ring-1 ring-emerald-400/40',
    }[tier];

  return (
    <div className={`${className} ${plateRing} bg-white rounded-xl p-4 md:p-5 flex items-center justify-center shadow-lg`}>
      <img 
        src={sponsor.logo} 
        alt={sponsor.name} 
        className="w-full h-full object-contain" 
      />
    </div>
  );
}

  const colorSchemes = {
    gold:      { bg: 'rgba(234,179,8,0.08)',   text: '#fbbf24', border: 'rgba(234,179,8,0.3)' },
    silver:    { bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
    bronze:    { bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', border: 'rgba(249,115,22,0.3)' },
    community: { bg: 'rgba(16,185,129,0.08)',  text: '#10b981', border: 'rgba(16,185,129,0.3)' }
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
    { name: "Isla Gaia", initials: "IGS", url: "https://www.islagaia.pt", logo: "/assets/Isla-Gaia.png"},
    { name: "Google", initials: "GO", url: "https://google.com" },
    { name: "Amazon", initials: "AM", url: "https://amazon.com" },
  ];
  
  const silverSponsors: Sponsor[] = [
    { name: "Spotify", initials: "SP", url: "https://spotify.com" },
    { name: "Slack", initials: "SL", url: "https://slack.com" },
    { name: "Notion", initials: "NO", url: "https://notion.so" },
    { name: "Figma", initials: "FI", url: "https://figma.com" },
  ];

  const bronzeSponsors: Sponsor[] = [
    { name: "Atlassian", initials: "AT", url: "https://atlassian.com" },
    { name: "GitHub", initials: "GH", url: "https://github.com" },
    { name: "Vercel", initials: "VC", url: "https://vercel.com" },
    { name: "Netlify", initials: "NL", url: "https://netlify.com" },
    { name: "Stripe", initials: "ST", url: "https://stripe.com" },
    { name: "Twilio", initials: "TW", url: "https://twilio.com" },
  ];

  const communitySupporters: Sponsor[] = [
    { name: "Dev.to", initials: "DV", url: "https://dev.to" },
    { name: "Stack Overflow", initials: "SO", url: "https://stackoverflow.com" },
    { name: "Hashnode", initials: "HN", url: "https://hashnode.com" },
    { name: "Product Hunt", initials: "PH", url: "https://producthunt.com" }
  ];

  return (
    <Section id="sponsors" className="relative bg-[#050806] border-t border-zinc-900 overflow-hidden">
      
      {/* Glow ambiental verde no canto superior direito */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-24">
        
        {/* PATROCINADOR OFICIAL */}
        <div className="mb-24">
            <span className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-10 block font-sora">
              Patrocinador Oficial
            </span>
            <div className="flex justify-center transform hover:scale-105 transition-transform duration-500">
                <a 
                  href="https://www.scrumalliance.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-64 md:w-96 block bg-white rounded-2xl p-6"
                >
                    <img 
                      src={ASSETS.SPONSOR_LOGO} 
                      alt="Scrum Alliance" 
                      className="w-full h-auto drop-shadow-sm" 
                    />
                </a>
            </div>
        </div>

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

        {/* COMUNIDADES APOIADORAS */}
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

        {/* SEPARADOR */}
        <div className="mb-16 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 bg-[#050806] text-lg text-zinc-400 font-medium font-sora">Oportunidades</span>
            </div>
        </div>

        {/* CTA VERDE */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-[#0A5C36] via-emerald-600 to-emerald-500 rounded-3xl shadow-2xl shadow-emerald-500/20 text-white max-w-5xl mx-auto relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter text-center font-sora">Quer a sua empresa aqui?</h3>
              <p className="text-xl md:text-2xl text-emerald-100 mb-8 font-light max-w-3xl mx-auto text-center font-jakarta">Junte-se a nós e conecte a sua empresa a <span className="font-bold text-white">líderes e praticantes de agilidade</span> em Portugal.</p>
              <a href={MEDIA_KIT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors mb-10 border-b border-emerald-200/30 hover:border-white pb-1 group">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span className="font-medium">Consulte o nosso Media Kit e descubra as vantagens de ser parceiro</span>
              </a>
              <a 
                href="https://forms.gle/BYNi9Gu7yHH2b4A16"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#E31E2D] text-white px-8 py-3.5 rounded-xl font-black text-lg shadow-lg hover:bg-white hover:text-[#00693E] transition-all duration-300 transform hover:-translate-y-1 font-sora"
              >
                  Torne-se um Patrocinador do TugÁgil Experience 2026
              </a>
          </div>
        </div>
      </div>
    </Section>
  );
};