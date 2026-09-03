// components/TicketPurchaseModal.tsx
import React, { useState } from 'react';

interface Participant {
  name: string;
  email: string;
  role: string;     // Cargo
  company: string;  // Organização/Empresa
}

export const TicketPurchaseModal: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', email: '', role: '', company: '' }
  ]);
  const [rgpdConsent, setRgpdConsent] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Lote Ativo: Early Bird a 39,90€
  const activePrice = 39.90;

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    setParticipants(prev => {
      const updated = [...prev];
      if (newQty > prev.length) {
        while (updated.length < newQty) {
          updated.push({ name: '', email: '', role: '', company: '' });
        }
      } else {
        updated.splice(newQty);
      }
      return updated;
    });
  };

  const handleInputChange = (index: number, field: keyof Participant, value: string) => {
    setParticipants(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdConsent) return;
    setIsSubmitted(true);
  };

  const totalPrice = (activePrice * quantity).toFixed(2);

  // 1. ECRÃ DE SUCESSO CUSTOMIZADO (Sem visual genérico de IA)
  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-6 flex flex-col items-center justify-center animate-[fadeInUp_0.4s_ease-out_forwards]">
        
        {/* Ícone Minimalista Customizado nas Cores da Marca (TugÁgil) */}
        <div className="w-14 h-14 border-2 border-brand-blue rounded-2xl flex items-center justify-center mb-6 bg-brand-blue/5">
          <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h3 className="text-2xl font-black text-brand-darkBlue font-sora tracking-tight">
          Dados registados com sucesso!
        </h3>
        
        <p className="text-zinc-500 mt-3 max-w-md text-sm font-jakarta leading-relaxed">
          Os dados dos participantes foram guardados com sucesso. Clique abaixo para prosseguir para o checkout seguro e concluir a compra.
        </p>
        
        {/* Botão de Checkout Limpo nas Cores Corretas */}
        <button 
          onClick={() => {
            // Futura ligação ao checkout do Stripe pelo Fábio
            alert('A redirecionar para o checkout seguro...');
          }}
          className="mt-8 w-full max-w-xs py-4 rounded-xl bg-[#F47A20] hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase transition-colors duration-200 shadow-md font-sora"
        >
          Avançar para Pagamento
        </button>
      </div>
    );
  }

  // 2. FORMULÁRIO PRINCIPAL
  return (
    <div className="w-full text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Quantidade e Info de Lote */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <label className="block text-sm font-black text-brand-darkBlue font-sora">
              Quantidade de Bilhetes
            </label>
            <span className="text-xs text-zinc-400 font-jakarta">
              Lote em vigor: <strong className="text-brand-blue">Early Bird ({activePrice.toFixed(2)}€/unidade)</strong>
            </span>
          </div>
          
          <select 
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 border-2 border-zinc-200 rounded-xl font-bold text-brand-darkBlue bg-white focus:border-brand-blue focus:outline-none transition-colors"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Bilhete' : 'Bilhetes'}</option>
            ))}
          </select>
        </div>

        {/* Campos Dinâmicos dos Participantes */}
        <div className="space-y-6 max-h-[44vh] overflow-y-auto pr-1">
          {participants.map((participant, index) => (
            <div key={index} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-4">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest font-sora block pb-2 border-b border-zinc-200/50">
                Participante #{index + 1}
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1 font-sora">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={participant.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    placeholder="Ex: Marina Silva"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-brand-blue focus:outline-none bg-white text-sm font-jakarta"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1 font-sora">Endereço de E-mail</label>
                  <input 
                    type="email"
                    required
                    value={participant.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    placeholder="tuga@tugagil.com"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-brand-blue focus:outline-none bg-white text-sm font-jakarta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cargo */}
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1 font-sora">Cargo / Função</label>
                  <input 
                    type="text"
                    required
                    value={participant.role}
                    onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                    placeholder="Ex: Product Owner"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-brand-blue focus:outline-none bg-white text-sm font-jakarta"
                  />
                </div>
                {/* Organização */}
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1 font-sora">Organização / Empresa <span className="text-[10px] text-zinc-400 font-normal">(Opcional)</span></label>
                  <input 
                    type="text"
                    value={participant.company}
                    onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                    placeholder="Ex: Comunidade TugÁgil"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-brand-blue focus:outline-none bg-white text-sm font-jakarta"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo de Custos Claro antes do Pagamento */}
        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-brand-darkBlue">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sora">Preço Total ({quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'})</span>
          <span className="text-xl font-black font-sora">{totalPrice}€</span>
        </div>

        {/* Declaração RGPD com Link para a Política de Privacidade */}
        <div className="flex items-start space-x-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <input 
            type="checkbox"
            required
            id="rgpd"
            checked={rgpdConsent}
            onChange={(e) => setRgpdConsent(e.target.checked)}
            className="mt-1 h-4 w-4 border-zinc-300 text-brand-blue focus:ring-brand-blue rounded"
          />
          <label htmlFor="rgpd" className="text-[11px] text-zinc-500 leading-relaxed font-jakarta">
            Autorizo o tratamento dos meus dados para efeitos de inscrição no evento, em conformidade com a{' '}
            <a 
              href="/politica-de-privacidade" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold underline text-brand-blue hover:text-brand-darkBlue transition-colors"
            >
              Política de Privacidade
            </a>.
          </label>
        </div>

        {/* Botão de Submissão Principal */}
        <button 
          type="submit"
          disabled={!rgpdConsent}
          className="w-full py-4 rounded-xl bg-brand-blue hover:bg-brand-darkBlue text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-md disabled:bg-zinc-300 disabled:cursor-not-allowed font-sora"
        >
          Confirmar dados e seguir para pagamento
        </button>

      </form>
    </div>
  );
}