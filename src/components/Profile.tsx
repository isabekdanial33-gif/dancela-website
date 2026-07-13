import React, { useState, useEffect } from 'react';
import { Compass, Calendar, Clock, Sparkles, MessageCircle, Plus, Sun, Moon, Monitor } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  currentUser: User | null;
  contactPhone?: string;
}

type ThemeMode = 'dark' | 'light' | 'system';

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light-mode');
  } else if (theme === 'dark') {
    root.classList.remove('light-mode');
    root.classList.add('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    root.classList.toggle('light-mode', !prefersDark);
  }
}

export default function Profile({ currentUser, contactPhone = '+7 (706) 406-98-86' }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'lessons' | 'settings'>('info');

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('dancela_theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('dancela_theme', theme);
  }, [theme]);

  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) return '7' + digits.substring(1);
    return digits || '77064069886';
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-sm">Пожалуйста, авторизуйтесь для входа в кабинет.</p>
      </div>
    );
  }

  const defaultBookedLessons = [
    { id: 'b1', date: 'Среда, 15 июля', time: '19:00 - 20:30', title: 'Взрослые (Хобби Латина) — Милана Тамарина' },
    { id: 'b2', date: 'Пятница, 17 июля', time: '16:30 - 18:00', title: 'Групповая спортивная подготовка — Айзат Ержанович' },
  ];

  const themeOptions: { id: ThemeMode; icon: React.ReactNode; label: string; desc: string }[] = [
    { id: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Тёмная', desc: 'Чёрный фон, золотые акценты' },
    { id: 'light', icon: <Sun className="w-4 h-4" />, label: 'Светлая', desc: 'Белый фон, читаемый текст' },
    { id: 'system', icon: <Monitor className="w-4 h-4" />, label: 'Системная', desc: 'Следует настройкам устройства' },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30
      dark:bg-transparent dark:text-slate-100
      light-mode:bg-slate-50 light-mode:text-slate-900
    ">
      <div className="max-w-4xl mx-auto">

        {/* Header banner */}
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
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email || currentUser.phoneNumber}</p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5 text-center sm:text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Статус карты:</span>
            <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] uppercase font-bold tracking-widest">
              Абонемент Активен
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
          {([
            { id: 'info', label: 'Профиль' },
            { id: 'lessons', label: `Тренировки (${defaultBookedLessons.length})` },
            { id: 'settings', label: 'Настройки' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Info ── */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col gap-5 text-left">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-white/5 pb-3">Личные данные</h3>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">ФИО:</span>
                <span className="text-xs text-slate-300 font-semibold">{currentUser.name}</span>
              </div>
              {currentUser.email && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Email:</span>
                  <span className="text-xs text-slate-300 font-semibold font-mono">{currentUser.email}</span>
                </div>
              )}
              {currentUser.phoneNumber && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Телефон:</span>
                  <span className="text-xs text-slate-300 font-semibold font-mono">{currentUser.phoneNumber}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Дата регистрации:</span>
                <span className="text-xs text-slate-300 font-semibold font-mono">
                  {new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-950 to-neutral-900 border border-white/5 rounded-3xl p-6 text-left flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Совет дня</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Раскрывайте харизму через танец</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  В латиноамериканской программе танец — это диалог страсти и эмоций. Фокусируйтесь на выражении взгляда и плавном движении бедер. Ваш тренер поможет сделать баланс идеальным.
                </p>
              </div>
              <a
                href="https://dancela-assistant.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 text-center bg-white text-black hover:bg-amber-400 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all block"
              >
                Проконсультироваться с AI Assistant
              </a>
            </div>
          </div>
        )}

        {/* ── Tab: Lessons ── */}
        {activeTab === 'lessons' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">Моё расписание занятий</h3>
              <a
                href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте,%20хочу%20записаться%20на%20тренировку`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black hover:bg-amber-400 text-[10px] uppercase tracking-widest font-black rounded-full transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Записаться</span>
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
                    Подтверждено
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-2xl p-5 text-center mt-6">
              <p className="text-xs text-slate-400">Для переноса или отмены свяжитесь с нами в WhatsApp.</p>
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

        {/* ── Tab: Settings (Theme) ── */}
        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-6">Оформление интерфейса</h3>

            <div className="bg-white/[0.02] border border-white/8 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Тема приложения</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                      theme === opt.id
                        ? 'border-amber-500/40 bg-amber-500/8 text-white'
                        : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      theme === opt.id
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider">{opt.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {theme === opt.id && (
                      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-slate-600 mt-5 leading-relaxed">
                Выбранная тема сохраняется в браузере и применяется при каждом посещении.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
