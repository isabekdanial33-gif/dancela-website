import React, { useState } from 'react';
import { Calendar, MapPin, Award, ArrowRight, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentsProps {
  tournaments: Tournament[];
  setTournaments?: React.Dispatch<React.SetStateAction<Tournament[]>>;
  contactPhone?: string;
  editorMode?: boolean;
}

const inputCls = "w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:border-amber-500/50 outline-none transition-all placeholder-slate-600";

const STATUS_STYLES: Record<Tournament['status'], string> = {
  'Регистрация открыта': 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'Предстоящий': 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  'Прошедший': 'bg-white/5 border-white/10 text-slate-500',
};

export default function Tournaments({ tournaments, setTournaments, contactPhone = '+7 (706) 406-98-86', editorMode = false }: TournamentsProps) {
  const [filter, setFilter] = useState<'Все' | 'Предстоящие' | 'Прошедшие'>('Все');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fTitle, setFTitle] = useState('');
  const [fDate, setFDate] = useState(new Date().toISOString().slice(0, 10));
  const [fLocation, setFLocation] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fImage, setFImage] = useState('');
  const [fStatus, setFStatus] = useState<Tournament['status']>('Предстоящий');

  const getCleanWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    return digits.startsWith('8') ? '7' + digits.slice(1) : digits || '77064069886';
  };

  const filtered = tournaments.filter(item => {
    if (filter === 'Предстоящие') return item.status === 'Регистрация открыта' || item.status === 'Предстоящий';
    if (filter === 'Прошедшие') return item.status === 'Прошедший';
    return true;
  });

  const resetForm = () => { setFTitle(''); setFDate(new Date().toISOString().slice(0, 10)); setFLocation(''); setFDesc(''); setFImage(''); setFStatus('Предстоящий'); setEditingId(null); setShowForm(false); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setTournaments) return;
    const item: Tournament = {
      id: editingId || `tour-${Date.now()}`,
      title: fTitle, date: fDate, location: fLocation, description: fDesc, status: fStatus,
      imageUrl: fImage || 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
    };
    if (editingId) {
      setTournaments(prev => prev.map(t => t.id === editingId ? item : t));
    } else {
      setTournaments(prev => [item, ...prev]);
    }
    resetForm();
  };

  const startEdit = (t: Tournament) => {
    setEditingId(t.id); setFTitle(t.title); setFDate(t.date); setFLocation(t.location);
    setFDesc(t.description); setFImage(t.imageUrl); setFStatus(t.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, title: string) => {
    if (!setTournaments || !window.confirm(`Удалить турнир «${title}»?`)) return;
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Спортивные арены</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">Турниры & Соревнования</h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Наши танцоры регулярно выступают на ведущих паркетах страны и мира.
          </p>
        </div>

        {/* Editor: Add/Edit form */}
        {editorMode && setTournaments && (
          <div className="mb-8">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/10"
              >
                <Plus className="w-4 h-4" /> Добавить турнир
              </button>
            ) : (
              <form onSubmit={handleSave} className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">{editingId ? 'Редактировать турнир' : 'Новый турнир'}</span>
                  <button type="button" onClick={resetForm} className="p-1.5 text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Название турнира</label>
                    <input value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="Открытый кубок Астаны 2026" className={inputCls} required />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Дата</label>
                    <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className={inputCls} required />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Статус</label>
                    <select value={fStatus} onChange={e => setFStatus(e.target.value as Tournament['status'])} className={inputCls}>
                      <option value="Предстоящий">Предстоящий</option>
                      <option value="Регистрация открыта">Регистрация открыта</option>
                      <option value="Прошедший">Прошедший</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Место проведения</label>
                    <input value={fLocation} onChange={e => setFLocation(e.target.value)} placeholder="Астана, Дворец Независимости" className={inputCls} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">URL фото (необязательно)</label>
                    <input value={fImage} onChange={e => setFImage(e.target.value)} placeholder="https://..." className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Описание</label>
                    <textarea rows={3} value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="Традиционный турнир по латиноамериканской программе..." className={inputCls + " resize-none"} required />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all">
                    <Check className="w-3.5 h-3.5 inline mr-1.5" />{editingId ? 'Сохранить' : 'Добавить'}
                  </button>
                  <button type="button" onClick={resetForm} className="py-3 px-5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all">Отмена</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['Все', 'Предстоящие', 'Прошедшие'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold rounded-xl border transition-all ${filter === t ? 'bg-white border-white text-black' : 'text-slate-400 border-white/8 hover:text-white bg-white/[0.01]'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tournaments.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl max-w-2xl mx-auto px-6">
            <Award className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
            <p className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-3">Турниров пока нет</p>
            <p className="text-xs text-slate-400 leading-relaxed">{editorMode ? 'Нажмите «Добавить турнир» выше.' : 'Следите за обновлениями — скоро появятся анонсы.'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><p className="text-sm text-slate-400">Нет турниров в этой категории.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-300 group shadow-xl relative flex flex-col">
                {/* Editor controls */}
                {editorMode && setTournaments && (
                  <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(item)} className="p-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 text-amber-300 rounded-xl transition-all backdrop-blur-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id, item.title)} className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 rounded-xl transition-all backdrop-blur-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 border rounded-full text-[9px] uppercase tracking-widest font-extrabold ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors leading-snug">{item.title}</h3>
                  <div className="flex flex-col gap-1.5 mt-3 mb-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">{item.description}</p>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-white/5 bg-black/20">
                  <a
                    href={`https://wa.me/${getCleanWhatsApp(contactPhone)}?text=Здравствуйте,%20хочу%20зарегистрироваться%20на%20турнир:%20${encodeURIComponent(item.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-amber-500/10 border border-white/8 hover:border-amber-500/25 text-white hover:text-amber-400 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all"
                  >
                    <span>Зарегистрироваться</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
