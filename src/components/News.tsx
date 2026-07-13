import React, { useState } from 'react';
import { Search, Calendar, Tag, ArrowRight, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsProps {
  news: NewsItem[];
  setNews?: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  editorMode?: boolean;
}

const inputCls = "w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:border-amber-500/50 outline-none transition-all placeholder-slate-600";

export default function News({ news, setNews, editorMode = false }: NewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [fCategory, setFCategory] = useState('Новости');
  const [fDate, setFDate] = useState(new Date().toISOString().slice(0, 10));
  const [fImage, setFImage] = useState('');

  const categories = ['Все', ...Array.from(new Set(news.map(n => n.category)))];

  const filtered = news.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'Все' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const resetForm = () => { setFTitle(''); setFContent(''); setFCategory('Новости'); setFDate(new Date().toISOString().slice(0, 10)); setFImage(''); setEditingId(null); setShowForm(false); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setNews) return;
    const item: NewsItem = {
      id: editingId || `news-${Date.now()}`,
      title: fTitle, content: fContent, category: fCategory, date: fDate,
      imageUrl: fImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    };
    if (editingId) {
      setNews(prev => prev.map(n => n.id === editingId ? item : n));
    } else {
      setNews(prev => [item, ...prev]);
    }
    resetForm();
  };

  const startEdit = (n: NewsItem) => {
    setEditingId(n.id); setFTitle(n.title); setFContent(n.content);
    setFCategory(n.category); setFDate(n.date); setFImage(n.imageUrl);
    setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, title: string) => {
    if (!setNews || !window.confirm(`Удалить новость «${title}»?`)) return;
    setNews(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">События & Объявления</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">Новости Студии</h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Будьте в курсе последних достижений, анонсов и тренировочных интенсивов Dancela.
          </p>
        </div>

        {/* Editor: Add/Edit form */}
        {editorMode && setNews && (
          <div className="mb-8">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/10"
              >
                <Plus className="w-4 h-4" /> Добавить новость
              </button>
            ) : (
              <form onSubmit={handleSave} className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">{editingId ? 'Редактировать новость' : 'Новая новость'}</span>
                  <button type="button" onClick={resetForm} className="p-1.5 text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Заголовок</label>
                    <input value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="Открытый кубок Dancela 2026" className={inputCls} required />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Категория</label>
                    <input value={fCategory} onChange={e => setFCategory(e.target.value)} placeholder="Новости" className={inputCls} required />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Дата</label>
                    <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className={inputCls} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">URL фото (необязательно)</label>
                    <input value={fImage} onChange={e => setFImage(e.target.value)} placeholder="https://..." className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Текст новости</label>
                    <textarea rows={4} value={fContent} onChange={e => setFContent(e.target.value)} placeholder="Текст статьи или объявления..." className={inputCls + " resize-none"} required />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all">
                    <Check className="w-3.5 h-3.5 inline mr-1.5" />{editingId ? 'Сохранить' : 'Опубликовать'}
                  </button>
                  <button type="button" onClick={resetForm} className="py-3 px-5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all">Отмена</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Поиск..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-500 transition-colors" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border transition-all ${selectedCategory === cat ? 'bg-white border-white text-black' : 'text-slate-400 hover:text-white border-white/8 bg-white/[0.01]'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {news.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl max-w-2xl mx-auto px-6">
            <p className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-3">Новостей пока нет</p>
            <p className="text-xs text-slate-400 leading-relaxed">{editorMode ? 'Нажмите «Добавить новость» выше, чтобы создать первую публикацию.' : 'Следите за обновлениями — скоро появятся первые новости студии.'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <p className="text-sm text-slate-400">Ничего не найдено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <article key={item.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col group shadow-xl relative">
                {/* Editor controls */}
                {editorMode && setNews && (
                  <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(item)} className="p-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 text-amber-300 rounded-xl transition-all backdrop-blur-sm" title="Редактировать"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id, item.title)} className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 rounded-xl transition-all backdrop-blur-sm" title="Удалить"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-amber-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />{item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-4 flex-1">{item.content}</p>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">Dancela News</span>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-amber-300">
                    Читать <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
