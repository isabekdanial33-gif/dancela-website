import React, { useState } from 'react';
import { Calendar, Clock, User, Compass, Layers, CheckCircle } from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleProps {
  schedule: ScheduleItem[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  const days = ['Все дни', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const [selectedDay, setSelectedDay] = useState('Все дни');

  const filteredSchedule = schedule.filter(item => {
    return selectedDay === 'Все дни' || item.day === selectedDay;
  });

  // Group by Day for better layout when "Все дни" is selected
  const daysInOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">График тренировок</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Расписание занятий
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Выберите удобное время для ваших тренировок. Мы проводим групповые и индивидуальные занятия с утра до позднего вечера.
          </p>
        </div>

        {/* --- Day Tabs Navigation --- */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 bg-white/[0.01] border border-white/5 rounded-3xl p-4 max-w-4xl mx-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all duration-300 ${
                selectedDay === day
                  ? 'bg-white text-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* --- Schedule Display Cards --- */}
        {selectedDay !== 'Все дни' ? (
          /* Single day view */
          filteredSchedule.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl max-w-4xl mx-auto">
              <p className="text-sm text-slate-400">В этот день групповых занятий нет.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredSchedule.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {item.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white uppercase tracking-tight mb-3">
                    {item.groupName}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-white/5 pt-3">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Тренер: <strong className="text-slate-200">{item.trainerName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Grouped multi-day view (stunning grid of columns per day) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {daysInOrder.map((dayName) => {
              const dayLessons = schedule.filter(item => item.day === dayName);
              if (dayLessons.length === 0) return null;

              return (
                <div 
                  key={dayName}
                  className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 flex flex-col"
                >
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-amber-400 border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                    <span>{dayName}</span>
                    <span className="text-[10px] bg-white/5 text-slate-400 px-2.5 py-0.5 rounded-full font-mono">{dayLessons.length}</span>
                  </h4>

                  <div className="space-y-4 flex-1">
                    {dayLessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.time}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                            {lesson.level}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-tight mb-2">
                          {lesson.groupName}
                        </h5>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-amber-400" />
                          <span>{lesson.trainerName}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Quick Notice block --- */}
        <div className="mt-16 text-center max-w-2xl mx-auto bg-white/[0.01] border border-white/5 rounded-3xl p-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            ⚠️ Расписание групповых тренировок может незначительно меняться в зависимости от подготовки к турнирам. Индивидуальные уроки согласовываются индивидуально с выбранным тренером.
          </p>
        </div>

      </div>
    </div>
  );
}
