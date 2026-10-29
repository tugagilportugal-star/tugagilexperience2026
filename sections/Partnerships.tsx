import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Check, Eye, Users, Network, 
  Mic, Laptop, Heart, Target, Download, ExternalLink 
} from 'lucide-react';

export const Partnerships: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Marca e talento'); // Começa com um selecionado por padrão
  
  // Scroll para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters = [
    "Marca e talento", "Produto e tecnologia", "Relações de negócio", 
    "Impacto comunitário", "Marca empregadora"
  ];

  // Dicionário com textos únicos e personalizados para cada filtro
  const filterDescriptions: Record<string, string> = {
    "Marca e talento": "Seja reconhecido pelos profissionais que quer atrair. Aproxime a sua organização de profissionais especializados e torne visível a sua cultura, competências e compromisso com o desenvolvimento profissional.",
    "Produto e tecnologia": "Mostre o que a sua empresa faz de melhor. Crie espaços de demonstração, workshops práticos ou sessões técnicas onde os participantes possam experimentar e validar as vossas soluções no terreno.",
    "Relações de negócio": "Construa ligações genuínas. Coloque a sua equipa em contacto direto com decisores, líderes e comunidades tecnológicas num ambiente propício a parcerias estratégicas.",
    "Impacto comunitário": "Devolva valor ao ecossistema. Apoie o acesso à aprendizagem e à inovação, fortalecendo a sua reputação como uma organização que investe no futuro da tecnologia em Portugal.",
    "Marca empregadora": "Reforce o seu Employer Branding. Demonstre na prática como é trabalhar na sua empresa, atraindo os melhores talentos através de experiências autênticas e conversas reais com as suas equipas."
  };

  const benefits = [
    { icon: Eye, title: "Visibilidade e notoriedade", desc: "Associe a marca a conteúdos especializados e a uma comunidade ativa, com oportunidades de comunicação antes, durante e após o evento." },
    { icon: Users, title: "Talento e marca empregadora", desc: "Reforce o posicionamento da sua empresa junto de profissionais de engenharia, produto, agilidade e liderança." },
    { icon: Network, title: "Ecossistema e relações", desc: "Explore novas ligações a profissionais de empresas, comunidades e projetos tecnológicos — com foco em relações genuínas." },
    { icon: Mic, title: "Autoridade e conhecimento", desc: "Dê voz aos seus especialistas através de casos práticos, conversas temáticas, sessões técnicas ou demonstrações." },
    { icon: Laptop, title: "Experimentação de soluções", desc: "Apresente ferramentas e abordagens a profissionais que as podem experimentar, avaliar e recomendar no contexto das suas equipas." },
    { icon: Heart, title: "Impacto e continuidade", desc: "Apoie o acesso à aprendizagem e explore uma colaboração que pode continuar através de outras iniciativas da TugÁgil." },
  ];

  const opportunities = [
    "Apresentação institucional breve",
    "Participação técnica ou caso real",
    "Espaço de contacto e demonstração",
    "Conteúdo e comunicação conjunta",
    "Experiências para colaboradores",
    "Relatório de contrapartidas"
  ];

  const stats = [
    { value: "390+", label: "Participantes (2025/2026)" },
    { value: "60+", label: "Sessões realizadas" },
    { value: "21", label: "Oradores especialistas" },
    { value: "10+", label: "Patrocinadores" },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-jakarta">
      
      {/* Navbar de Navegação */}
      <nav className="fixed top-0 left-0 right-0 bg-[#050806]/95 backdrop-blur-md border-b border-zinc-900 h-20 flex items-center justify-between px-6 z-[100]">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white font-bold text-sm font-sora transition-colors">
          <ArrowLeft size={18} /> Voltar ao Site
        </Link>
        <a 
          href="https://forms.gle/BYNi9Gu7yHH2b4A16" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all font-sora"
        >
          Ser Parceiro <ExternalLink size={14} />
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 block font-sora">
            Parcerias com Propósito
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 font-sora leading-tight">
            Mais do que visibilidade.<br />
            <span className="text-zinc-400">Ligações que criam valor.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Ligue a sua marca a profissionais de tecnologia, produto, engenharia de software e liderança. 
            Partilhe conhecimento, crie relações e faça parte de uma comunidade que transforma experiências em aprendizagem.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a 
              href="#beneficios" 
              className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 rounded-xl transition-all font-bold font-sora"
            >
              Descobrir Benefícios
            </a>
            <a 
              href="https://forms.gle/BYNi9Gu7yHH2b4A16"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all font-sora group"
            >
              Quero explorar uma parceria
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            21 NOV 2026 · ISLA, VILA NOVA DE GAIA · PARCERIAS À MEDIDA
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-6 bg-zinc-900/30 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl md:text-4xl font-black text-white font-sora mb-2">{stat.value}</div>
              <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="beneficios" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white font-sora mb-4">O que a sua empresa ganha</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              O valor de uma parceria vai muito além de um logótipo. Cada colaboração é uma oportunidade para fortalecer a presença da sua organização no ecossistema tecnológico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-sora mb-3">{benefit.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FILTERS SECTION */}
      <section className="py-24 px-6 bg-zinc-900/20 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white font-sora mb-4">Parcerias Relevantes</h2>
          <p className="text-zinc-400 mb-10">O que procura a sua organização? Selecione uma prioridade:</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all font-sora ${
                  activeFilter === filter 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-12 text-left transition-all duration-300">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white font-sora mb-2">
                  {activeFilter}
                </h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {filterDescriptions[activeFilter]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES SECTION */}
      <section id="contrapartidas" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white font-sora mb-6">
                Formas de Participar
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Além das modalidades de patrocínio standard, existem possibilidades de ativação à medida, sujeitas a alinhamento, disponibilidade e adequação à programação do evento.
              </p>
              <a 
                href="https://forms.gle/BYNi9Gu7yHH2b4A16"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold font-sora group"
              >
                Discutir uma proposta à medida 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-zinc-200 font-medium font-jakarta">{opp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA / FORM SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900/40 to-zinc-900 border border-emerald-500/20 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white font-sora mb-4">
              Vamos construir esta parceria?
            </h2>
            <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
              O próximo passo começa com uma conversa. Conte-nos o que a sua organização procura. 
              Podemos explorar formatos de patrocínio e colaboração alinhados com os vossos objetivos.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-zinc-950/50 border border-zinc-800 rounded-full px-4 py-2 mb-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-zinc-300 font-medium">Modalidades a partir de 500 € · Condições sob proposta</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://drive.google.com/file/d/1Cai1MrG1hbuli8ud7Y7K_HAqPx4IcSYR/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 hover:text-white hover:border-white hover:bg-zinc-800 transition-all font-bold font-sora"
              >
                <Download className="w-5 h-5" />
                Descarregar Media Kit
              </a>
              <a 
                href="https://forms.gle/BYNi9Gu7yHH2b4A16"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-black shadow-xl transition-all font-sora group"
              >
                Preencher Formulário de Interesse
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};