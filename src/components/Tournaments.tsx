import React, { useState } from 'react';
import { Calendar, MapPin, Award, ArrowRight, Hourglass } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentsProps {
  tournaments: Tournament[];
  contactPhone?: string;
}

export default function Tournaments({ tournaments, contactPhone = '+7 (706) 406-98-86' }: TournamentsProps) {
  const [filter, setFilter] = useState<'Все' | 'Предстоящие' | 'Прошедшие'>('Все');

  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.substring(1);
    }
    return digits || '77064069886';
  };

  const filteredTournaments = tournaments.filter(item => {
    if (filter === 'Предстоящие') return item.status === 'Регистрация открыта' || item.status === 'Предстоящий';
    if (filter === 'Прошедшие') return item.status === 'Прошедший';
    return true; // 'Все'
  });

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Спортивные арены</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Турниры & Соревнования
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Наши танцоры регулярно выступают на ведущих паркетах страны и мира. Участвуйте как зритель или заявляйтесь в качестве участника!
          </p>
        </div>

        {/* --- Navigation filter tab bar --- */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(['Все', 'Предстоящие', 'Прошедшие'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold rounded-xl border transition-all duration-300 ${
                filter === t
                  ? 'bg-white border-white text-black'
                  : 'text-slate-400 hover:text-white border-white/5 bg-white/[0.01]'
              }`}
            >
              {t === 'Все' ? 'Все турниры' : t}
            </button>
          ))}
        </div>

        {/* --- Tournament Cards --- */}
        {tournaments.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl max-w-2xl mx-auto px-6">
            <p className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-3">Раздел временно пуст</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              На данный момент нет доступных турниров. Для данного раздела пока нет доступной информации. Мы сообщим вам в ближайшее время. Пожалуйста, ожидайте обновлений.
            </p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <p className="text-sm text-slate-400">В этой категории турниров пока не запланировано.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tour) => {
              const isOpen = tour.status === 'Регистрация открыта';
              const isFuture = tour.status === 'Предстоящий';
              const isPast = tour.status === 'Прошедший';

              return (
                <div 
                  key={tour.id}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    {/* Visual poster */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img 
                        src={tour.imageUrl} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 bg-black/80 border rounded-full text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1.5 ${
                          isOpen 
                            ? 'text-emerald-400 border-emerald-500/20' 
                            : isFuture 
                              ? 'text-amber-400 border-amber-500/20' 
                              : 'text-slate-400 border-white/10'
                        }`}>
                          <Hourglass className="w-3 h-3 animate-pulse" />
                          <span>{tour.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-6">
                      <div className="flex flex-col gap-2.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>{tour.date}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="line-clamp-1">{tour.location}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors leading-snug mb-3">
                        {tour.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {tour.description}
                      </p>
                    </div>
                  </div>

                  {/* Foot action with WhatsApp/Register linking */}
                  <div className="px-6 pb-6 pt-3 mt-auto border-t border-white/5 bg-black/20 flex flex-col gap-3">
                    {isOpen ? (
                      <a 
                        href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте,%20хочу%20зарегистрироваться%20на%20турнир%20"${encodeURIComponent(tour.title)}"`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 text-center bg-emerald-600 hover:bg-emerald-500 text-emerald-50 text-[10px] uppercase tracking-widest font-extrabold rounded-xl transition-all shadow-md shadow-emerald-950/20"
                      >
                        Подать заявку на участие
                      </a>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                        <span>Dancela Sports</span>
                        {isPast ? <span>Турнир завершен</span> : <span>Регистрация позже</span>}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
