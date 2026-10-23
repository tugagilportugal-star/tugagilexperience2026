// src/sections/Agenda.tsx
import React, { useState, useEffect  } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  isBreak?: boolean;
  isPending?: boolean;
}

export const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon'>('morning');

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  // --- CRONOGRAMA DA MANHÃ ---
  const morningSchedule: ScheduleItem[] = [
    { time: "08:30 - 09:00", title: "Check-in e receção", location: "Auditório", isBreak: true },
    { time: "09:00 - 09:10", title: "Abertura TugÁgil", location: "Auditório" },
    { time: "09:10 - 09:20", title: "ISLA — Boas-vindas", location: "Auditório" },
    { time: "09:20 - 10:00", title: "Talk 1", speaker: "A confirmar", location: "Auditório" },
    { time: "10:00 - 10:05", title: "Transição de palco", location: "Auditório", isBreak: true },
    { time: "10:05 - 10:45", title: "Talk 2", speaker: "A confirmar", location: "Auditório" },
    { time: "10:45 - 11:05", title: "☕ Coffee Break", location: "Área de Convivência", isBreak: true },
    { time: "11:05 - 11:10", title: "Regresso e transição", location: "Auditório", isBreak: true },
    { time: "11:10 - 11:50", title: "Product Management na era dos agentes: menos backlog, mais decisões", speaker: "Pedro Oliveira", location: "Auditório" },
    { time: "11:50 - 11:55", title: "Preparação do painel", location: "Auditório", isBreak: true },
    { time: "11:55 - 12:35", title: "Painel — Gestão, Produto e Engenharia", location: "Auditório" },
    { time: "12:35 - 13:00", title: "Perguntas, síntese e fecho da manhã", location: "Auditório" },
    { time: "13:00 - 14:15", title: "🍽️ Almoço e Networking", location: "Área de Alimentação", isBreak: true },
  ];

  // --- CRONOGRAMA DA TARDE: AUDITÓRIO ---
  const afternoonMainStage: ScheduleItem[] = [
    { time: "14:15 - 14:20", title: "Regresso ao auditório", isBreak: true },
    { time: "14:20 - 14:40", title: "O Custo de Ignorar o Sistema", speaker: "Fábio Perrotta" },
    { time: "14:40 - 14:45", title: "Transição de palco", isBreak: true },
    { time: "14:45 - 15:05", title: "Desconstruindo com IA: E se o maior problema não for a tecnologia?", speaker: "Luciano Alves" },
    { time: "15:05 - 15:10", title: "Transição de palco", isBreak: true },
    { time: "15:10 - 15:30", title: "Talk 6", speaker: "A confirmar" },
    { time: "15:30 - 15:35", title: "Transição de palco", isBreak: true },
    { time: "15:35 - 15:55", title: "O futuro é de segunda mão: como a tecnologia está a reinventar o valor daquilo que já existe", speaker: "Silas Moreira" },
    { time: "15:55 - 16:00", title: "Transição de palco", isBreak: true },
    { time: "16:00 - 16:20", title: "Quiet Bravery: The Leadership Growth No One Sees Until It Blossoms", speaker: "Filipa Gomes" },
    { time: "16:20 - 16:25", title: "Transição de palco", isBreak: true },
    { time: "16:25 - 16:45", title: "Talk 9", speaker: "A confirmar", isPending: true },
    { time: "16:45 - 16:50", title: "Transição de palco", isBreak: true },
    { time: "16:50 - 17:20", title: "Sessão de encerramento" },
    { time: "17:20 - 17:30", title: "Encerramento TugÁgil" },
  ];

  // --- CRONOGRAMA DA TARDE: WORKSHOPS ---
  const afternoonWorkshops: ScheduleItem[] = [
    { 
      time: "14:30 - 17:00", 
      title: "Decoding Product: The Immersive Lab", 
      speaker: "Ricardo Fernandes e Manuel Pimenta", 
      location: "Sala a confirmar" 
    },
    { 
      time: "14:30 - 17:00", 
      title: "THE LEADERSHIP EXPERIMENT", 
      speaker: "Anthony Simões", 
      location: "Sala a confirmar" 
    },
    { 
      time: "14:30 - 17:00", 
      title: "AI SOFTWARE FACTORY", 
      speaker: "Matheus Haddad e Fábio Castro", 
      location: "Sala a confirmar" 
    },
  ];

  // Componente auxiliar para renderizar um item da agenda
  const AgendaItemRow: React.FC<{ item: ScheduleItem; showLocation?: boolean }> = ({ item, showLocation = true }) => {
    const isPending = item.isPending || item.title.includes('A confirmar') || item.speaker?.includes('A confirmar');
    
    return (
      <div className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-4 border-b border-zinc-900 last:border-0 ${item.isBreak ? 'opacity-70' : ''}`}>
        <div className="sm:w-32 shrink-0">
          <span className="text-sm font-mono font-bold text-emerald-400">{item.time}</span>
        </div>
        <div className="flex-1">
          <h4 className={`text-base font-bold font-sora leading-snug ${isPending ? 'text-zinc-500 italic' : 'text-white'}`}>
            {item.title}
          </h4>
          {item.speaker && !isPending && (
            <p className="text-sm text-zinc-400 font-jakarta mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item.speaker}
            </p>
          )}
          {isPending && item.speaker && (
             <p className="text-sm text-zinc-500 font-jakarta mt-1 italic flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> {item.speaker}
            </p>
          )}
          {showLocation && item.location && (
            <p className="text-xs text-zinc-600 font-jakarta mt-1.5 flex items-center gap-1">
              <MapPin size={12} /> {item.location}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 font-jakarta">
      
      {/* Navbar Simplificada */}
      <nav className="fixed top-0 left-0 right-0 bg-[#060a07]/95 backdrop-blur-md border-b border-zinc-900 h-20 flex items-center px-6 z-[100]">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white font-bold text-sm font-sora transition-colors">
          <ArrowLeft size={18} /> Voltar ao Site
        </Link>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-left mb-12">
          <span className="text-[#D3122A] text-xs font-bold uppercase tracking-widest font-sora">Agenda Detalhada</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 font-sora tracking-tight">Cronograma do Evento</h1>
        </div>

        {/* Abas Manhã / Tarde */}
        <div className="flex gap-8 mb-12 border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setActiveTab('morning')}
            className={`pb-2 text-xl font-bold transition-all font-sora ${activeTab === 'morning' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Manhã
          </button>
          <button 
            onClick={() => setActiveTab('afternoon')}
            className={`pb-2 text-xl font-bold transition-all font-sora ${activeTab === 'afternoon' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Tarde
          </button>
        </div>

        {/* CONTEÚDO MANHÃ */}
        {activeTab === 'morning' && (
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
              <MapPin size={18} className="text-emerald-400" />
              <h3 className="text-lg font-bold font-sora text-white">Auditório Principal</h3>
            </div>
            <div className="space-y-2">
              {morningSchedule.map((item, index) => (
                <AgendaItemRow key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO TARDE (Layout em 2 Colunas) */}
        {activeTab === 'afternoon' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Coluna 1: Auditório */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
                <MapPin size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold font-sora text-white">Auditório Principal</h3>
              </div>
              <div className="space-y-2">
                {afternoonMainStage.map((item, index) => (
                  <AgendaItemRow key={index} item={item} showLocation={false} />
                ))}
              </div>
            </div>

            {/* Coluna 2: Workshops */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
                <MapPin size={18} className="text-sky-400" />
                <h3 className="text-lg font-bold font-sora text-white">Workshops em Paralelo</h3>
              </div>
              <div className="space-y-6">
                {afternoonWorkshops.map((item, index) => (
                  <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-sky-500/30 transition-colors">
                    <span className="text-sm font-mono font-bold text-sky-400 block mb-2">{item.time}</span>
                    <h4 className="text-base font-bold font-sora text-white leading-snug mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-400 font-jakarta flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> {item.speaker}
                    </p>
                    {item.location && (
                      <p className="text-xs text-zinc-600 font-jakarta flex items-center gap-1">
                        <MapPin size={12} /> {item.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};