import React from 'react';
import { Award, ShieldCheck, Play, MapPin, Heart, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Студия Dancela</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            О нашей студии
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Студия спортивно-бального танца Dancela — это место, где объединяются грация, железная спортивная дисциплина и истинное искусство движения.
          </p>
        </div>

        {/* --- Two Column Detailed Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-[4/3] group">
            <img 
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800" 
              alt="Студия танцев Dancela"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-semibold uppercase bg-black/70 border border-white/10 px-4 py-2 rounded-full text-white">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Esil Plaza, Астана</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Развиваем таланты от новичков до профессионалов
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Dancela была основана с целью создать уникальное тренировочное пространство, сочетающее в себе теплоту дружеской атмосферы и строгие стандарты спортивного совершенствования. Мы верим, что бальные танцы — это не просто хобби, а образ жизни, формирующий красивое тело, крепкий дух и великолепные манеры.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Наши тренировочные залы расположены на 2 этаже премиального комплекса <strong className="text-white font-semibold">Esil Plaza</strong> в Астане. Это дает нашим ученикам непревзойденный комфорт: просторные светлые залы, специализированный амортизирующий паркет для защиты суставов, совершенную вентиляцию и премиальный звук.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-white">Безопасный паркет</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Особое напольное покрытие снижает нагрузку при прыжках.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-white">WDSF Программа</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Официальные дисциплины европейской и латиноамериканской программы.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- Philosophy Section --- */}
        <div className="bg-gradient-to-tr from-slate-950 to-neutral-900 border border-white/5 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Наш подход</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase mt-2">
              5 Столпов Обучения в Dancela
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-black">
                1
              </div>
              <h5 className="text-xs uppercase font-bold text-white">Музыкальность</h5>
              <p className="text-[11px] text-slate-400 mt-2">Тонкое понимание ритма и выражение характера каждого танца.</p>
            </div>

            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-black">
                2
              </div>
              <h5 className="text-xs uppercase font-bold text-white">Техничность</h5>
              <p className="text-[11px] text-slate-400 mt-2">Безупречная работа стоп, баланс, биомеханика и линии корпуса.</p>
            </div>

            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-black">
                3
              </div>
              <h5 className="text-xs uppercase font-bold text-white">Презентация</h5>
              <p className="text-[11px] text-slate-400 mt-2">Развитие артистизма, харизмы и уверенного позиционирования на паркете.</p>
            </div>

            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-black">
                4
              </div>
              <h5 className="text-xs uppercase font-bold text-white">Дисциплина</h5>
              <p className="text-[11px] text-slate-400 mt-2">Формирование воли, трудолюбия и умения преодолевать трудности.</p>
            </div>

            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/5">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-black">
                5
              </div>
              <h5 className="text-xs uppercase font-bold text-white">Единство</h5>
              <p className="text-[11px] text-slate-400 mt-2">Поддержка, командный дух и искренняя радость совместного движения.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
