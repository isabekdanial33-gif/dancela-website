import React, { useState } from 'react';
import { Compass, Calendar, Clock, Sparkles, MessageCircle, Heart, Plus } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  currentUser: User | null;
  contactPhone?: string;
}

export default function Profile({ currentUser, contactPhone = '+7 (706) 406-98-86' }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'lessons'>('info');

  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.substring(1);
    }
    return digits || '77064069886';
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-sm">Пожалуйста, авторизуйтесь для входа в кабинет.</p>
      </div>
    );
  }

  // Prepopulate standard booked lessons for a beautiful student portfolio UX:
  const defaultBookedLessons = [
    { id: 'b1', date: 'Среда, 15 июля', time: '19:00 - 20:30', title: 'Взрослые (Хобби Латина) — Милана Тамарина' },
    { id: 'b2', date: 'Пятница, 17 июля', time: '16:30 - 18:00', title: 'Групповая спортивная подготовка — Айзат Ержанович' }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header banner --- */}
        <div className="bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-8 sm:p-10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-40%] right-[-10%] w-[250px] h-[250px] bg-amber-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-amber-500/10">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[9px] bg-black/80 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 font-extrabold uppercase tracking-widest">
                Личный кабинет ученика
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1.5">{currentUser.name}</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-center sm:text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Статус карты:</span>
            <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] uppercase font-bold tracking-widest">
              Абонемент Активен
            </span>
          </div>
        </div>

        {/* --- Cabinet Tabs --- */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 border-b-2 ${
              activeTab === 'info'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Информация профиля
          </button>
          
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 border-b-2 ${
              activeTab === 'lessons'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Мои тренировки ({defaultBookedLessons.length})
          </button>
        </div>

        {/* --- Tab Content --- */}
        {activeTab === 'info' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Metadata */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col gap-5 text-left">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-white/5 pb-3">Личные данные</h3>
              
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">ФИО Ученика:</span>
                <span className="text-xs text-slate-300 font-semibold">{currentUser.name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Телефон:</span>
                <span className="text-xs text-slate-300 font-semibold font-mono">{currentUser.phoneNumber || 'Не указан'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Дата регистрации:</span>
                <span className="text-xs text-slate-300 font-semibold font-mono">
                  {new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            {/* AI Advisor Block */}
            <div className="bg-gradient-to-tr from-slate-950 to-neutral-900 border border-white/5 rounded-3xl p-6 text-left flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Совет дня</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Раскрывайте харизму через танец</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  "В латиноамериканской программе танец — это диалог, полный страсти и эмоций. Фокусируйтесь сегодня на выражении взгляда и плавном движении бедер. Ваш тренер поможет сделать баланс идеальным."
                </p>
              </div>

              <a
                href="https://dancela-assistant.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 text-center bg-white text-black hover:bg-amber-400 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all block cursor-pointer"
              >
                Проконсультироваться с AI Assistant
              </a>
            </div>
          </div>
        ) : (
          /* Bookings/lessons view */
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">Мое расписание занятий</h3>
              <a
                href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте,%20хочу%20записаться%20на%20тренировку`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black hover:bg-amber-400 text-[10px] uppercase tracking-widest font-black rounded-full transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Записаться на занятие</span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              {defaultBookedLessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-white tracking-tight">{lesson.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lesson.date} • {lesson.time}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold rounded-full self-start sm:self-auto">
                    Занятие Подтверждено
                  </span>
                </div>
              ))}
            </div>

            {/* Quick contact trigger */}
            <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-2xl p-5 text-center mt-6">
              <p className="text-xs text-slate-400">Для переноса или отмены бронирования групповых или индивидуальных тренировок, пожалуйста, свяжитесь с нами в WhatsApp.</p>
              <a 
                href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте,%20хочу%20перенести/отменить%20занятие`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold uppercase tracking-wider mt-2 hover:text-amber-300"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Служба поддержки</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
