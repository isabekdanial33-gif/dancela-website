import React from 'react';
import { Sparkles, ArrowRight, Play, Award, Compass, Heart, ShieldCheck, MapPin } from 'lucide-react';

interface HomeProps {
  setCurrentPage: (page: string) => void;
}

export default function Home({ setCurrentPage }: HomeProps) {
  return (
    <div className="relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        
        {/* Background image overlay for premium dark atmosphere */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1920" 
            alt="Dancela Ballroom" 
            className="w-full h-full object-cover opacity-30 object-center"
          />
          {/* Custom vignette gradient masks */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Small pre-header badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[10px] uppercase tracking-widest font-extrabold mb-6 animate-pulse">
            <Award className="w-3.5 h-3.5" />
            <span>Студия Спортивно-Бальных Танцев • Астана</span>
          </div>

          {/* Super-display high contrast heading (Apple/Porsche level) */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase select-none">
            DANCELA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">STUDIO</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl md:text-2xl text-slate-300 font-light max-w-3xl leading-relaxed">
            Профессиональное обучение, воспитание чемпионов и совершенство движения. От первых шагов на паркете до золотых медалей международных турниров.
          </p>

          {/* Action buttons with custom hover transitions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage('contacts')}
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest font-extrabold bg-white text-black hover:bg-amber-400 transition-all duration-300 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-95"
            >
              <span>Записаться на пробное</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('trainers')}
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest font-extrabold border border-white/10 hover:border-white/30 text-white rounded-full flex items-center justify-center gap-2 hover:bg-white/5 transition-all duration-300 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Познакомиться с тренерами</span>
            </button>
          </div>

          {/* Key Quick Location Indicator */}
          <div className="mt-12 flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <MapPin className="w-4.5 h-4.5 text-amber-400" />
            <span>Казахстан, Астана, Esil Plaza, 2 этаж</span>
          </div>

        </div>

        {/* Bottom divider glow */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* --- STATS GRID (Bento-like style) --- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">4</span>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold mt-2">Ведущих Тренера</span>
            <p className="text-xs text-slate-400 mt-1">Мастера спорта РК и чемпионы</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left border-l border-white/5 md:pl-8">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">500+</span>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold mt-2">Наград и Кубков</span>
            <p className="text-xs text-slate-400 mt-1">Завоевано нашими учениками</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left border-l border-white/5 md:pl-8">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">100%</span>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold mt-2">Премиум Залы</span>
            <p className="text-xs text-slate-400 mt-1">Акустика и паркет в Esil Plaza</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left border-l border-white/5 md:pl-8">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">5+</span>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold mt-2">Направлений обучения</span>
            <p className="text-xs text-slate-400 mt-1">Для детей, взрослых и спортсменов</p>
          </div>

        </div>
      </section>

      {/* --- PREMIUM VALUES SECTION --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Философия Dancela</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
              Почему выбирают именно нас
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* Bento-style Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Professional Training */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  Профессиональное Обучение
                </h3>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  Обучение выстроено по лучшим мировым стандартам. Мы закладываем безупречную технику, музыкальность, развиваем координацию и идеальный баланс тела с самого раннего возраста.
                </p>
              </div>
              <button 
                onClick={() => setCurrentPage('about')}
                className="mt-8 text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-amber-300"
              >
                <span>Подробнее</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Competition Prep */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  Спортивная Подготовка
                </h3>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  Мы доводим танцоров от начального уровня до профессионального спортивного класса. Подготавливаем спортивные дуэты к национальным чемпионатам и международным кубкам WDSF.
                </p>
              </div>
              <button 
                onClick={() => setCurrentPage('tournaments')}
                className="mt-8 text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-amber-300"
              >
                <span>Предстоящие турниры</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Elite Atmosphere */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  Уникальная Атмосфера
                </h3>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  Dancela — это не просто занятия, это дружное спортивное комьюнити. Мы заботимся об эмоциональном комфорте учеников, прививаем дисциплину, уважение и искреннюю любовь к танцу.
                </p>
              </div>
              <button 
                onClick={() => setCurrentPage('styles')}
                className="mt-8 text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-amber-300"
              >
                <span>Выбрать направление</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* --- AI ASSISTANT PROMO BLOCK (Porsche/Apple aesthetic integration) --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-5xl mx-auto bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] uppercase tracking-wider font-extrabold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Умная технология Dancela</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Dancela AI Assistant
            </h3>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-xl">
              Наш инновационный искусственный интеллект-помощник готов ответить на любые ваши вопросы касательно стилей бальных танцев, тренировочного процесса, судейства WDSF и индивидуального подбора хореографии.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center">
            <a 
              href="https://dancela-assistant.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
            >
              <span>Запустить AI Assistant</span>
              <Sparkles className="w-4 h-4 fill-current" />
            </a>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-3">
              Откроется в новой вкладке
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
