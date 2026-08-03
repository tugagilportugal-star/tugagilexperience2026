import React from 'react';
import { Section } from '../components/UIComponents';
import { ASSETS } from '../config';
import { Download } from 'lucide-react';

interface SponsorsProps {
    onOpenSponsorModal?: () => void;
}

interface Sponsor {
  name: string;
  initials: string;      // Iniciais para o mockup
  logo?: string;         // Logo real »» quando existir, substitui o mockup
  url: string;
  customClass?: string;
}

/**
 * Componente inteligente que renderiza o logo do patrocinador.
 * - Se existir logo real (sponsor.logo), usa ele
 * - Se não existir, gera um mockup com as iniciais
 */
const SponsorLogo: React.FC<{ 
  sponsor: Sponsor;
  tier: 'gold' | 'silver' | 'bronze' | 'community';
  className?: string;
}> = ({ sponsor, tier, className = '' }) => {
  // Se existir logo real, renderiza a imagem
  if (sponsor.logo) {
    return (
      <img 
        src={sponsor.logo} 
        alt={sponsor.name} 
        className={`object-contain ${className}`} 
      />
    );
  }

  // Se não existir, renderiza o mockup com iniciais
  const colorSchemes = {
    gold:      { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
    silver:    { bg: '#f3f4f6', text: '#4b5563', border: '#9ca3af' },
    bronze:    { bg: '#fed7aa', text: '#9a3412', border: '#fb923c' },
    community: { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' }
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

export const Sponsors: React.FC<SponsorsProps> = ({ onOpenSponsorModal }) => {
  const MEDIA_KIT_URL = "https://drive.google.com/file/d/162ktlhFkYjvE90nH3ZAiW_kLQGrdI04o/view?usp=sharing";

  // ============================================
  // LISTAS DE PATROCINADORES
  // ============================================
  // Para substituir mockup por logo real:
  // 1. Adicione a propriedade 'logo' com o caminho da imagem
  // 2. Exemplo: logo: "/assets/microsoft-logo.png"
  // ============================================

  const goldSponsors: Sponsor[] = [
    { 
      name: "Microsoft", 
      initials: "MS", 
      url: "https://microsoft.com"
      // logo: "/assets/microsoft-logo.png"  ← Descomente quando tiver o logo
    },
    { 
      name: "Google", 
      initials: "GO", 
      url: "https://google.com"
    },
    { 
      name: "Amazon", 
      initials: "AM", 
      url: "https://amazon.com"
    },
  ];
  
  const silverSponsors: Sponsor[] = [
    { 
      name: "Spotify", 
      initials: "SP", 
      url: "https://spotify.com"
    },
    { 
      name: "Slack", 
      initials: "SL", 
      url: "https://slack.com"
    },
    { 
      name: "Notion", 
      initials: "NO", 
      url: "https://notion.so"
    },
    { 
      name: "Figma", 
      initials: "FI", 
      url: "https://figma.com"
    },
  ];

  const bronzeSponsors: Sponsor[] = [
    { 
      name: "Atlassian", 
      initials: "AT", 
      url: "https://atlassian.com"
    },
    { 
      name: "GitHub", 
      initials: "GH", 
      url: "https://github.com"
    },
    { 
      name: "Vercel", 
      initials: "VC", 
      url: "https://vercel.com"
    },
    { 
      name: "Netlify", 
      initials: "NL", 
      url: "https://netlify.com"
    },
    { 
      name: "Stripe", 
      initials: "ST", 
      url: "https://stripe.com"
    },
    { 
      name: "Twilio", 
      initials: "TW", 
      url: "https://twilio.com"
    },
  ];

  const communitySupporters: Sponsor[] = [
    { 
      name: "Dev.to", 
      initials: "DV", 
      url: "https://dev.to"
    },
    { 
      name: "Stack Overflow", 
      initials: "SO", 
      url: "https://stackoverflow.com"
    },
    { 
      name: "Hashnode", 
      initials: "HN", 
      url: "https://hashnode.com"
    },
    { 
      name: "Product Hunt", 
      initials: "PH", 
      url: "https://producthunt.com"
    }
  ];

  return (
    <Section id="sponsors" className="bg-white border-t border-gray-200">
      <div className="text-center max-w-6xl mx-auto px-4">
        
        {/* ============================================ */}
        {/* PATROCINADOR OFICIAL */}
        {/* ============================================ */}
        <div className="mb-24">
            <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-10 block">
              Patrocinador Oficial
            </span>
            <div className="flex justify-center transform hover:scale-105 transition-transform duration-500">
                <a 
                  href="https://www.scrumalliance.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-64 md:w-96 block"
                >
                    <img 
                      src={ASSETS.SPONSOR_LOGO} 
                      alt="Scrum Alliance" 
                      className="w-full h-auto drop-shadow-sm" 
                    />
                </a>
            </div>
        </div>

        {/* ============================================ */}
        {/* GOLD SPONSORS (Destaque máximo) */}
        {/* ============================================ */}
        {goldSponsors.length > 0 && (
          <div className="mb-24">
            <span className="text-lg font-bold tracking-[0.2em] text-yellow-600 uppercase mb-12 block">
              Patrocinadores Gold
            </span>
            <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
              {goldSponsors.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-gradient-to-br from-yellow-50 to-white rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 flex items-center justify-center h-40 w-[45%] md:w-80 p-8"
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

        {/* ============================================ */}
        {/* SILVER SPONSORS (Destaque médio) */}
        {/* ============================================ */}
        {silverSponsors.length > 0 && (
          <div className="mb-24">
            <span className="text-base font-bold tracking-[0.2em] text-gray-500 uppercase mb-12 block">
              Patrocinadores Silver
            </span>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {silverSponsors.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-gray-200 flex items-center justify-center h-32 w-[45%] md:w-72 p-6"
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

        {/* ============================================ */}
        {/* PATROCINADORES BRONZE */}
        {/* ============================================ */}
        <div className="mb-24">
            <span className="text-sm font-bold tracking-[0.2em] text-orange-700 uppercase mb-12 block">
                Patrocinadores Bronze
            </span>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
              {bronzeSponsors.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-center justify-center h-28 w-[45%] md:w-64 p-6"
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

        {/* ============================================ */}
        {/* COMUNIDADES APOIADORAS */}
        {/* ============================================ */}
        <div className="mb-24">
            <span className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-12 block">
                Comunidades Apoiadoras
            </span>
            <div className="flex flex-wrap justify-center gap-4 md:gap-10 items-center">
              {communitySupporters.map((sponsor, idx) => (
                <a 
                  key={idx} 
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-white rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center justify-center h-28 w-[45%] md:w-60 p-6"
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

        {/* ============================================ */}
        {/* SEPARADOR E OPORTUNIDADES */}
        {/* ============================================ */}
        <div className="mb-16 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 bg-white text-lg text-gray-500 font-medium">Oportunidades</span>
            </div>
        </div>

        <div className="p-8 md:p-12 bg-gradient-to-br from-[#00331F] via-[#00693E] to-[#00875A] rounded-3xl shadow-2xl text-white max-w-5xl mx-auto relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter text-center">Quer a sua empresa aqui?</h3>
              <p className="text-xl md:text-2xl text-green-100 mb-8 font-light max-w-3xl mx-auto text-center">Junte-se a nós e conecte a sua empresa a <span className="font-bold text-white">líderes e praticantes de agilidade</span> em Portugal.</p>
              <a href={MEDIA_KIT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-200 hover:text-white transition-colors mb-10 border-b border-green-200/30 hover:border-white pb-1 group">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span className="font-medium">Consulte o nosso Media Kit e descubra as vantagens de ser parceiro</span>
              </a>
              {onOpenSponsorModal && (
                <button onClick={onOpenSponsorModal} className="px-10 py-4 bg-brand-red hover:bg-white hover:text-brand-red text-white text-lg md:text-xl font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    Torne-se um Patrocinador do TugÁgil Experience 2026
                </button>
              )}
        </div>
      </div>
      </div>
    </Section>
  );
};