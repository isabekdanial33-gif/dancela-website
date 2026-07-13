import React, { useState } from 'react';
import { Search, Calendar, FolderOpen, Tag, ArrowRight } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsProps {
  news: NewsItem[];
}

export default function News({ news }: NewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', ...Array.from(new Set(news.map(n => n.category)))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">События & Объявления</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Новости Студии
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Будьте в курсе последних достижений студии Dancela, анонсов новых наборов в группы, соревнований и тренировочных интенсивов.
          </p>
        </div>

        {/* --- Search & Filters Bar --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Filter category tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider font-extrabold rounded-xl border transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-white border-white text-black'
                    : 'text-slate-400 hover:text-white border-white/5 bg-white/[0.01]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- News Grid --- */}
        {news.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl max-w-2xl mx-auto px-6">
            <p className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-3">Раздел временно пуст</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              На данный момент нет доступных новостей. Для данного раздела пока нет доступной информации. Мы сообщим вам в ближайшее время. Пожалуйста, ожидайте обновлений.
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <p className="text-sm text-slate-400">Ничего не найдено по вашему запросу.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article 
                key={item.id}
                className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Photo cover */}
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-amber-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{item.category}</span>
                      </span>
                    </div>
                  </div>

                  {/* News metadata and Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mb-3">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-4">
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* Footer readmore */}
                <div className="px-6 pb-6 pt-3 mt-auto border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Dancela News
                  </span>
                  <button className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-amber-300">
                    <span>Подробнее</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
