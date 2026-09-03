import React, { useState } from 'react';

interface ParticipantData {
  name: string;
  email: string;
  company: string;
}

export const TicketPurchaseModal: React.FC = () => {
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [participants, setParticipants] = useState<ParticipantData[]>([
    { name: '', email: '', company: '' }
  ]);
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Definição dos lotes
  const activeLot = { name: 'Early Bird', price: 39.90 };

  const handleQuantityChange = (qty: number) => {
    setTicketQuantity(qty);
    setParticipants(prev => {
      const next = [...prev];
      if (qty > prev.length) {
        // Adiciona novos campos vazios se a quantidade aumentar
        while (next.length < qty) {
          next.push({ name: '', email: '', company: '' });
        }
      } else {
        // Reduz se a quantidade diminuir
        next.splice(qty);
      }
      return next;
    });
  };

  const handleInputChange = (index: number, field: keyof ParticipantData, value: string) => {
    setParticipants(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdConsent) return;
    
    // Sucesso da simulação de registo
    setIsSuccess(true);
  };

  const totalCost = (activeLot.price * ticketQuantity).toFixed(2);

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-brand-darkBlue">Dados registados com sucesso!</h3>
        <p className="text-slate-600 mt-3 max-w-md mx-auto">
          Os dados dos {ticketQuantity} participantes foram guardados. Siga agora para o checkout seguro para concluir o pagamento.
        </p>
        <button 
          onClick={() => {
            // Aqui será integrado o redirecionamento para o Stripe Checkout correspondente
            alert('A redirecionar para o Stripe Checkout (Simulado)...');
          }}
          className="mt-8 inline-block bg-brand-orange hover:bg-brand-darkBlue text-white font-bold px-8 py-3.5 rounded-full transition shadow-lg"
        >
          Avançar para Pagamento ({totalCost}€)
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tabela de Lotes no topo do Modal */}
      <div className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">Tabela de Lotes</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* Lote 1 - Esgotado */}
          <div className="relative bg-white p-3 rounded-xl border border-slate-200 text-center opacity-60">
            <span className="absolute top-2 right-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">Esgotado</span>
            <span className="text-xs text-slate-400 line-through block">Early Bird</span>
            <span className="text-sm font-bold text-slate-400 line-through">39,90€</span>
          </div>

          {/* Lote 2 - Ativo */}
          <div className="bg-brand-blue/5 p-3 rounded-xl border-2 border-brand-blue text-center">
            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest block mb-0.5">Ativo</span>
            <span className="text-xs text-brand-darkBlue font-medium block">Regular</span>
            <span className="text-lg font-black text-brand-darkBlue">49,90€</span>
          </div>

          {/* Lote 3 - Brevemente */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center opacity-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Lote Final</span>
            <span className="text-xs text-slate-400 block">Late</span>
            <span className="text-sm font-bold text-slate-400">59,90€</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seletor de Quantidade */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <label className="block text-sm font-bold text-brand-darkBlue">Quantidade de Bilhetes</label>
            <span className="text-xs text-slate-400">Podes registar até 5 bilhetes por compra.</span>
          </div>
          <select 
            value={ticketQuantity} 
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-brand-darkBlue"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Bilhete' : 'Bilhetes'}</option>
            ))}
          </select>
        </div>

        {/* Formulários Dinâmicos dos Participantes */}
        <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
          {participants.map((participant, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Participante #{index + 1}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={participant.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={participant.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    placeholder="tuga@tugagil.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Organização <span className="text-[10px] font-normal text-slate-400">(Opcional)</span></label>
                <input 
                  type="text" 
                  value={participant.company}
                  onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                  placeholder="Ex: TugÁgil"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue focus:outline-none bg-white"
                />
              </div>
            </div>
          ))}
        </div>

        {/* RGPD */}
        <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl">
          <input 
            type="checkbox" 
            required 
            id="rgpd"
            checked={rgpdConsent}
            onChange={(e) => setRgpdConsent(e.target.checked)}
            className="mt-1 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue" 
          />
          <label htmlFor="rgpd" className="text-[11px] text-slate-500 leading-normal">
            Autorizo o processamento dos dados fornecidos para efeitos de inscrição, envio de confirmação e comunicações logísticas do evento pela equipa do TugÁgil.
          </label>
        </div>

        {/* Botão de Checkout */}
        <button 
          type="submit" 
          disabled={!rgpdConsent}
          className="w-full bg-brand-blue hover:bg-brand-darkBlue disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition flex items-center justify-center space-x-2 shadow-md"
        >
          <span>Confirmar dados e seguir para pagamento</span>
        </button>
      </form>
    </div>
  );
};