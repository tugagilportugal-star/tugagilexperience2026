// components/NavBar.tsx
import React, { useState, useEffect } from 'react';
import { ASSETS } from '../config';
import { Menu, X, ArrowUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

interface NavbarProps {
  onOpenTicketModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTicketModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomePage = location.pathname === '/';

  const navBgClass = !isHomePage || isScrolled
    ? 'bg-[#060a07]/95 backdrop-blur-md shadow-lg py-2'
    : 'bg-gradient-to-b from-black/80 to-transparent py-4';

  const navLinks: NavLink[] = [
    { label: 'O EVENTO', href: '/#about', isRoute: false },
    { label: 'PROGRAMA', href: '/#program', isRoute: false },
    { label: 'AGENDA', href: '/agenda', isRoute: true },
    { label: 'SPEAKERS', href: '/#speakers', isRoute: false },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 transition-all duration-500 z-[100] ${navBgClass}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* LOGO OFICIAL */}
<div className="flex items-center">
  <Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:scale-105 transition-transform">
     <img 
       src={ASSETS.TUGAGIL_EXPERIENCE_LOGO} 
       alt="TugÁgil Experience" 
       className="h-16 sm:h-20 w-auto object-contain"
     />
  </Link>
</div>

            {/* LINKS & CTA (DESKTOP) */}
            <div className="hidden xl:flex items-center gap-10">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-sm font-bold text-white uppercase tracking-widest hover:text-emerald-400 transition-colors font-sora"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm font-bold text-white uppercase tracking-widest hover:text-emerald-400 transition-colors font-sora"
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>

              {/* Botão de Compra no Canto Direito */}
              <button 
                onClick={onOpenTicketModal}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#0A5C36] hover:bg-[#08482b] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Comprar Bilhete
              </button>
            </div>

            {/* MOBILE TRIGGER */}
            <div className="xl:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <Menu className="w-8 h-8" />
                </button>
            </div>

          </div>
        </div>
      </nav>

      {/* BOTÃO VOLTAR AO TOPO */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#0A5C36] text-white shadow-lg transition-all duration-500 transform hover:bg-[#08482b] hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* MOBILE MENU */}
      <div 
        className={`fixed inset-0 z-[110] bg-[#060a07]/98 backdrop-blur-xl transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img 
              src={ASSETS.TUGAGIL_EXPERIENCE_LOGO} 
              alt="TugÁgil Experience" 
              className="h-12 sm:h-14 w-auto object-contain" 
              />
            </Link>
             <button 
               onClick={() => setIsMobileMenuOpen(false)}
               className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
             >
               <X className="w-8 h-8" />
             </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center gap-10 p-6 overflow-y-auto">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors font-sora"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors font-sora"
                >
                  {link.label}
                </a>
              )
            ))}
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onOpenTicketModal(); }}
              className="w-full max-w-xs py-4 rounded-xl bg-[#0A5C36] hover:bg-[#08482b] text-white font-bold text-base uppercase tracking-wider transition-all text-center shadow-lg"
            >
              Comprar Bilhete
            </button>
        </div>
      </div>
    </>
  );
};