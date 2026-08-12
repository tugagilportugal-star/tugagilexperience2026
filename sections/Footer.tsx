import React from 'react';
import { Linkedin, Instagram, Mail, Globe } from 'lucide-react';
import { ASSETS } from '../config';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060a07] text-white py-16 border-t border-zinc-900 overflow-hidden">
      
      {/* Glow ambiental emerald no canto inferior esquerdo */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Organization */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider font-sora">Organização</h4>
            
            <div className="flex flex-col items-start">
                <a 
                    href="https://tugagil.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-2 p3"
                    aria-label="Visitar site da TugÁgil"
                >
                    <img 
                        src={ASSETS.TUGAGIL_EXP_2026} 
                        alt="TugÁgil" 
                        className="h-[150px] w-auto object-contain hover:opacity-80 transition-opacity drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                    />
                </a>
                <span className="text-sm text-zinc-400 font-light font-jakarta">Comunidade de Práticas</span>

                {/* TugÁgil Social Media & Web */}
                <div className="flex space-x-3 mt-4">
                    <a 
                        href="https://www.linkedin.com/company/tugagil/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-zinc-900 rounded-full hover:bg-emerald-500 transition-colors"
                        aria-label="LinkedIn TugÁgil"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                        href="https://www.instagram.com/tugagil/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-zinc-900 rounded-full hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888] transition-colors"
                        aria-label="Instagram TugÁgil"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                        href="https://tugagil.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-zinc-900 rounded-full hover:bg-[#D3122A] transition-colors"
                        aria-label="Website TugÁgil"
                    >
                        <Globe className="w-5 h-5" />
                    </a>
                </div>
            </div>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-1">
             <h4 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider font-sora">Explorar</h4>
             <ul className="space-y-3 text-zinc-300 font-jakarta">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-white hover:translate-x-1 transition-all">Início</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-white hover:translate-x-1 transition-all">Sobre o Evento</button></li>
                <li><button onClick={() => scrollTo('sponsors')} className="hover:text-white hover:translate-x-1 transition-all">Patrocine</button></li>
             </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider font-sora">Contacto</h4>
            <a href="mailto:tuga@tugagil.com" className="flex items-center text-zinc-300 hover:text-white transition-colors group mb-4 font-jakarta">
                <Mail className="w-5 h-5 mr-3 group-hover:text-emerald-400" />
                tuga@tugagil.com
            </a>
            <div className="flex space-x-4 mt-6">
                <a 
                    href="https://www.linkedin.com/showcase/scrum-gathering-regional-lisboa-2026/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 bg-zinc-900 rounded-full hover:bg-emerald-500 transition-colors"
                    aria-label="LinkedIn RSG Lisbon"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
                <a 
                    href="https://www.instagram.com/rsglisbon/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 bg-zinc-900 rounded-full hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888] transition-colors"
                    aria-label="Instagram RSG Lisbon"
                >
                    <Instagram className="w-5 h-5" />
                </a>
             </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-1 text-sm text-zinc-400 font-jakarta">
             <h4 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider font-sora">Legal</h4>
             <div className="space-y-3">
                <p>Copyright © 2026 TugÁgil</p>
                <p>
                    <a href="https://docs.google.com/document/d/1RQVsJYgjLgXwsFr1g-lpjxfkUTuPk0EaHCpoo9k-boo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-zinc-700 underline-offset-4">Política de Privacidade</a>
                </p>
                <p className="text-xs text-zinc-600 mt-4">
                    Regional Scrum Gathering® is a registered trademark of Scrum Alliance, Inc.
                </p>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};