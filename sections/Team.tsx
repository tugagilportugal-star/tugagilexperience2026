import React from 'react';
import { Section } from '../components/UIComponents';
import { Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  image: string;
  linkedin: string;
}

export const Team: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: "Raquel Bartz Alves",
      image: "/assets/Raquel.png", 
      linkedin: "https://www.linkedin.com/in/raquelbartzalves/" 
    },
    {
      name: "Sylvia Grec",
      image: "/assets/Sylvia.png",
      linkedin: "https://www.linkedin.com/in/sylvia-grec/"
    },
    {
      name: "Marina Bittencourt",
      image: "/assets/Marina.png",
      linkedin: "https://www.linkedin.com/in/marinarosabittencourt/"
    },
    {
      name: "Fábio Castro",
      image: "/assets/Fabio.png",
      linkedin: "https://www.linkedin.com/in/frmcastro/"
    },
    {
      name: "Cristiane Alves",
      image: "/assets/Cristiane.png",
      linkedin: "https://www.linkedin.com/in/cristiane-mendes-alves-pmp%C2%AE-psm-i-psk-i-okrcp-5a243b4/"
    },
    {
      name: "Matheus Haddad",
      image: "/assets/Matheus.png",
      linkedin: "https://www.linkedin.com/in/matheushaddad/"
    },
    {
      name: "Natasha Doria",
      image: "/assets/Natasha.png",
      linkedin: "https://www.linkedin.com/in/natasha-doria-18070448/"
    },
    {
      name: "Aline Alvim",
      image: "/assets/Aline.png",
      linkedin: "https://www.linkedin.com/in/alvimaline"
    }, 
  ];

  return (
    <Section id="team" className="relative bg-[#050806] border-t border-zinc-900 overflow-hidden">
      
      {/* Glow ambiental emerald no canto superior esquerdo */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs block mb-3 font-sora">
            Quem faz acontecer o TugÁgil Experience 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-sora">
            Equipa Organizadora
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto font-jakarta">
            Voluntários apaixonados dedicados a trazer a melhor experiência de agilidade e inovação para o Norte de Portugal.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {team.map((member, idx) => (
            <div key={idx} className="group text-center w-36 md:w-48">
              
              <div className="relative mb-4 mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg shadow-emerald-500/10 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-all duration-300 transform group-hover:-translate-y-2 border-[5px] border-emerald-500/40 group-hover:border-emerald-400 bg-zinc-900">
                
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Overlay LinkedIn com vermelho TugÁgil */}
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"                >
                  <Linkedin className="w-8 h-8 text-white" />
                </a>
              </div>

              <h3 className="text-sm md:text-base font-bold text-white mb-1 leading-tight px-2 font-jakarta">
                {member.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};