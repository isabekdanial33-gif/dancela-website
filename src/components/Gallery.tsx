import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Sparkles, ZoomIn, X, Compass } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export default function Gallery({ galleryItems }: GalleryProps) {
  const [scannedFiles, setScannedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'studio'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch scanned files dynamically from /api/gallery
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch gallery files');
      })
      .then((data: string[]) => {
        setScannedFiles(data);
      })
      .catch(err => {
        console.warn('Could not load dynamic server-side gallery files:', err);
      });
  }, []);

  // Merge default pre-populated gallery items with scanned files dynamically
  const dynamicGallery: GalleryItem[] = [
    // Scanned files first as requested
    ...scannedFiles.map((file, idx) => ({
      id: `scanned-${idx}`,
      url: file,
      caption: `Файл из папки gallery: ${file.substring(file.lastIndexOf('/') + 1)}`
    })),
    // Static premium photos
    ...galleryItems
  ];

  const filteredItems = dynamicGallery.filter(item => {
    if (activeTab === 'custom') return item.id.startsWith('scanned');
    if (activeTab === 'studio') return !item.id.startsWith('scanned');
    return true; // 'all'
  });

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Жизнь в движении</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Галерея Студии
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Наши турниры, интенсивные репетиции, радость побед и неповторимая атмосфера премиального зала Dancela в Esil Plaza.
          </p>
        </div>

        {/* --- Info Box for Auto Scanning Feature (Technical alignment) --- */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">Автоматическая синхронизация папки</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Любые файлы, помещенные в <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded font-mono">public/gallery</code>, моментально появятся в разделе «Файлы из папки».</p>
            </div>
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-widest rounded-full self-start sm:self-auto shrink-0">
            Активно
          </span>
        </div>

        {/* --- Category Tabs --- */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
              activeTab === 'all' 
                ? 'bg-white text-black' 
                : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
            }`}
          >
            Все снимки ({dynamicGallery.length})
          </button>
          
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === 'custom' 
                ? 'bg-white text-black' 
                : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Папка gallery ({scannedFiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
              activeTab === 'studio' 
                ? 'bg-white text-black' 
                : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
            }`}
          >
            Галерея студии ({galleryItems.length})
          </button>
        </div>

        {/* --- Image Grid (Porsche level visual density) --- */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-sm text-slate-400">В этой категории пока нет снимков.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedImage(item.url)}
                className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer aspect-video relative flex items-center justify-center shadow-lg hover:border-white/20 transition-all duration-300"
              >
                <img 
                  src={item.url} 
                  alt={item.caption || 'Dancela Studio'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover mask and magnifying glass icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="self-end bg-black/60 border border-white/10 p-2.5 rounded-full text-white">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Dancela Gallery</p>
                    {item.caption && <p className="text-[11px] text-amber-400 mt-1 font-medium">{item.caption}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- Lightbox Modal (Apple style minimalist popover) --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-5xl w-full max-h-[85vh] relative flex items-center justify-center overflow-hidden">
            <img 
              src={selectedImage} 
              alt="Dancela Ballroom Fullscreen" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
}
