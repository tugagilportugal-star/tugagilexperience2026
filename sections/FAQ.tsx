import React, { useState } from 'react';
import { Section } from '../components/UIComponents';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC<{ onOpenTicketModal?: () => void }> = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData: { question: string; answer: React.ReactNode }[] =[
        {
            question: "Onde será o evento?",
            answer: "O evento terá lugar no ISLA GAIA, na vibrante cidade de Vila Nova de Gaia. Escolhemos este espaço para unir a energia de um dos maiores ecossistemas de ensino tecnológico do país à máxima conveniência para os nossos participantes: tem a Linha D do metro nas proximidades e facilidade de estacionamento nas imediações."
        },
        {
            question: "Qual a data do evento?",
            answer: "21 de Novembro de 2026. Reserve na sua agenda!"
        },
        {
            question: "O evento será em inglês ou português?",
            answer: "Como um evento internacional, teremos sessões em ambos os idiomas. O TugÁgil Experience preza pela multiculturalidade, por isso espere keynotes globais em inglês, mas também trilhas e talks locais em português."
        },
        {
            question: "Para quem é este evento?",
            answer: "Para agilistas, líderes, gestores, product managers, designers, engenheiros de software, tech leads, empreendedores, estudantes e profissionais interessados em agilidade aplicada. Acima de tudo, o TugÁgil Experience é o espaço ideal para qualquer pessoa apaixonada por transformação organizacional, inovação e novas formas de trabalho, que procure elevar o nível da agilidade e criar um impacto real nas suas organizações."
        },
        {
            question: "O evento dispõe de serviço de bengaleiro?",
            answer: "Para garantir a máxima agilidade e segurança de todos os participantes, o evento não dispõe de serviço de bengaleiro. Recomendamos que evite trazer volumes desnecessários ou de grandes dimensões, uma vez que a organização não se responsabiliza por objetos de caráter pessoal ou bens deixados nas áreas comuns do recinto."
        },
        {
            question: "Existe restaurante no local do evento?",
            answer: "O ISLA Gaia dispõe de cafetaria no local. Para quem prefere almoçar fora, há diversas opções de restaurantes a poucos minutos a pé na mesma zona. Para uma maior variedade de escolhas, o Gaia Shopping fica a cerca de 5 minutos de carro do campus."

        }
    ];

    return (
        <Section id="faq" className="relative bg-zinc-900 border-t border-zinc-800 overflow-hidden">
            
            {/* Glow ambiental vermelho no canto inferior esquerdo */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
                
                <div className="text-center mb-12">
                    <span className="text-xs font-bold tracking-[0.3em] text-emerald-400 uppercase mb-4 block font-sora">
                        Dúvidas
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter font-sora">
                        Perguntas Frequentes
                    </h2>
                </div>
                
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
                            <button
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-800/60 transition-colors focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="font-semibold text-white pr-4 font-jakarta">{item.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                                )}
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-6 pb-6 text-zinc-300 leading-relaxed border-t border-zinc-800 pt-5 font-jakarta">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};