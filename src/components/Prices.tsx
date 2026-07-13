import React, { useState } from 'react';
import { CheckCircle2, Award, Sparkles, MessageSquare, Flame } from 'lucide-react';
import { PriceItem } from '../types';

interface PricesProps {
  prices: PriceItem[];
  contactPhone?: string;
}

export default function Prices({ prices, contactPhone = '+7 (706) 406-98-86' }: PricesProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'kids' | 'adults' | 'other'>('all');

  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.substring(1);
    }
    return digits || '77064069886';
  };

  const filteredPrices = prices.filter(item => {
    if (activeCategory === 'kids') return item.category === 'kids';
    if (activeCategory === 'adults') return item.category === 'adults';
    if (activeCategory === 'other') return item.category !== 'kids' && item.category !== 'adults';
    return true; // 'all'
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'kids': return 'Детские группы';
      case 'adults': return 'Взрослые группы';
      case 'private': return 'Индивидуальные занятия';
      case 'sport': return 'Спортивная подготовка';
      case 'wedding': return 'Постановка свадебного танца';
      default: return 'Программа';
    }
  };

  // Static benefits requested in prompt:
  const benefits = [
    'Профессиональные тренеры — мастера спорта РК и победители WDSF;',
    'Современные залы — специализированный паркет в Esil Plaza;',
    'Участие в соревнованиях — подготовка и поездки на турниры;',
    'Индивидуальный подход — заботливое ведение каждого ученика;',
    'Дружелюбная атмосфера — сплоченная команда и поддержка.'
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Гибкие тарифы</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Стоимость обучения
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Выберите оптимальный абонемент для себя или своего ребенка. В нашей студии созданы идеальные условия для быстрого творческого и спортивного развития.
          </p>
        </div>

        {/* --- Filters Tab Bar --- */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'Все абонементы' },
            { id: 'kids', label: 'Детские группы' },
            { id: 'adults', label: 'Взрослые' },
            { id: 'other', label: 'Индивидуальные & Свадебные' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2.5 text-xs uppercase tracking-wider font-extrabold rounded-xl border transition-all duration-300 ${
                activeCategory === tab.id
                  ? 'bg-white border-white text-black font-bold'
                  : 'text-slate-400 hover:text-white border-white/5 bg-white/[0.01]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Price Cards Grid (High contrast modern design) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden border ${
                item.isRecommended
                  ? 'bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 border-amber-500/30 scale-102 lg:scale-105 z-10'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
              }`}
            >
              {/* Highlight ribbon */}
              {item.isRecommended && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black rounded-full text-[9px] uppercase tracking-widest font-extrabold">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>Популярный</span>
                </div>
              )}

              {/* Title & Price info */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">
                  {getCategoryLabel(item.category)}
                </span>
                
                <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-4">
                  {item.title}
                </h3>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                    {item.price.toLocaleString('ru-RU')} ₸
                  </span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    / {item.period}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="border-t border-white/5 pt-6 mb-8">
                  <ul className="space-y-3">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${item.isRecommended ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте!%20Хочу%20записаться%20на%20программу:%20"${encodeURIComponent(item.title)}"`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 text-center rounded-xl text-xs uppercase tracking-widest font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                  item.isRecommended
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/10'
                    : 'bg-white text-black hover:bg-amber-400 shadow-white/5'
                }`}
              >
                <span>Записаться</span>
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
              </a>

            </div>
          ))}
        </div>

        {/* --- Core Studio Advantages & Benefits List (Requested in prompt) --- */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold uppercase text-white tracking-wider">
              Что входит в стоимость обучения в Dancela:
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const parts = benefit.split(' — ');
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-black/40 border border-white/5 rounded-2xl">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <strong className="text-xs text-white block uppercase tracking-tight">{parts[0]}</strong>
                    <span className="text-xs text-slate-400 leading-normal block mt-0.5">{parts[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
