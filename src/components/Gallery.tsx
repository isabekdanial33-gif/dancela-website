import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, Plus, Trash2, Link } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryProps {
  galleryItems: GalleryItem[];
  setGalleryItems?: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  editorMode?: boolean;
}

export default function Gallery({ galleryItems, setGalleryItems, editorMode = false }: GalleryProps) {
  const [scannedFiles, setScannedFiles] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addUrl, setAddUrl] = useState('');
  const [addCaption, setAddCaption] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => { if (res.ok) return res.json(); throw new Error(); })
      .then((data: string[]) => setScannedFiles(data))
      .catch(() => {});
  }, []);

  const allItems: GalleryItem[] = [
    ...scannedFiles.map((file, idx) => ({
      id: `scanned-${idx}`,
      url: file,
      caption: `gallery/${file.substring(file.lastIndexOf('/') + 1)}`
    })),
    ...galleryItems
  ];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUrl.trim() || !setGalleryItems) return;
    setGalleryItems(prev => [{ id: `gal-${Date.now()}`, url: addUrl.trim(), caption: addCaption || undefined }, ...prev]);
    setAddUrl(''); setAddCaption(''); setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (!setGalleryItems) return;
    setGalleryItems(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Жизнь в движении</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">Галерея Студии</h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Наши турниры, репетиции, радость побед и неповторимая атмосфера зала Dancela.
          </p>
        </div>

        {/* Editor: Add photo bar */}
        {editorMode && setGalleryItems && (
          <div className="mb-8 bg-amber-500/8 border border-amber-500/25 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Режим редактора галереи
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить фото
              </button>
            </div>
            {showAddForm && (
              <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">URL фото</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-black/60 border border-white/12 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                  </div>
                </div>
                <div className="sm:col-span-5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Подпись (необязательно)</label>
                  <input value={addCaption} onChange={e => setAddCaption(e.target.value)} placeholder="Кубок Dancela 2026" className="w-full bg-black/60 border border-white/12 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" />
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-extrabold uppercase rounded-xl transition-all">Добавить</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="py-2.5 px-3 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-all"><X className="w-3.5 h-3.5" /></button>
                </div>
              </form>
            )}
            <p className="text-[10px] text-amber-400/60 mt-2">{allItems.length} фото • Наведите на фото для управления</p>
          </div>
        )}

        {/* Grid */}
        {allItems.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-sm text-slate-400">Галерея пуста.</p>
            {editorMode && <p className="text-xs text-amber-400 mt-2">Нажмите «Добавить фото» выше</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allItems.map((item) => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01] aspect-video hover:border-white/15 transition-all duration-300 shadow-lg">
                <img
                  src={item.url}
                  alt={item.caption || 'Dancela Studio'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 flex flex-col justify-between p-5 ${editorMode ? 'opacity-0 group-hover:opacity-100 bg-black/70' : 'opacity-0 group-hover:opacity-100 bg-black/50'}`}>
                  {editorMode && setGalleryItems && !item.id.startsWith('scanned') ? (
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-2 bg-red-500/30 hover:bg-red-500/60 border border-red-500/40 text-red-200 rounded-xl transition-all"
                        title="Удалить фото"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="self-end bg-black/60 border border-white/10 p-2 rounded-full text-white cursor-pointer" onClick={() => setSelectedImage(item.url)}>
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-left">
                    {item.caption && <p className="text-xs font-semibold text-amber-400">{item.caption}</p>}
                  </div>
                </div>
                {/* Click to zoom when not in editor delete mode */}
                {(!editorMode || item.id.startsWith('scanned')) && (
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedImage(item.url)} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Dancela Gallery"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
