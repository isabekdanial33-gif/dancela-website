import React from 'react';
import { Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { Trainer } from '../types';

interface TrainersProps {
  trainers: Trainer[];
  contactPhone?: string;
}

export default function Trainers({ trainers, contactPhone = '+7 (706) 406-98-86' }: TrainersProps) {
  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.substring(1);
    }
    return digits || '77064069886';
  };
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Команда Чемпионов</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Наши тренеры
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            В Dancela преподают признанные профессионалы, мастера спорта Республики Казахстан, победители международных соревнований WDSF с богатым педагогическим опытом.
          </p>
        </div>

        {/* --- Trainers Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id}
              className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-900 border-b border-white/5">
                  <img 
                    src={trainer.imageUrl} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 object-top"
                  />
                  {/* Subtle color grading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Floating role badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-amber-400">
                      {trainer.role}
                    </span>
                  </div>
                </div>

                {/* Trainer Meta Info */}
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {trainer.description}
                  </p>
                </div>
              </div>

              {/* Achievements details */}
              <div className="px-6 pb-6 pt-2 border-t border-white/5 mt-auto bg-black/40">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 block mb-2">
                  Достижения и регалии:
                </span>
                <ul className="space-y-1.5">
                  {trainer.achievements.map((ach, index) => (
                    <li key={index} className="flex items-start gap-2 text-[11px] text-slate-300 leading-tight">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

        {/* --- Bottom Callout --- */}
        <div className="mt-16 bg-white/[0.01] border border-white/5 rounded-3xl p-8 text-center max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-lg font-bold text-white uppercase">Хотите тренироваться индивидуально?</h4>
            <p className="text-xs text-slate-400 mt-1">Каждый из наших наставников проводит персональные мастер-классы и тренировки по предварительной записи.</p>
          </div>
          <a
            href={`https://wa.me/${getCleanWhatsApp(contactPhone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black text-xs uppercase tracking-widest font-extrabold rounded-full transition-all shrink-0 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            Записаться к тренеру
          </a>
        </div>

      </div>
    </div>
  );
}
