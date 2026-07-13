import React from 'react';
import { MapPin, Phone, Instagram, Send, Compass, ExternalLink, Mail } from 'lucide-react';

interface ContactsProps {
  contactPhone: string;
  contactEmail: string;
}

export default function Contacts({ contactPhone, contactEmail }: ContactsProps) {
  const [emailCopied, setEmailCopied] = React.useState(false);

  const handleBuildRoute = () => {
    // Open Google Maps route directly to Kabandai Batyr Ave 49 in Astana
    window.open('https://www.google.com/maps/dir/?api=1&destination=51.102602,71.407767', '_blank');
  };

  const getCleanPhoneForWhatsApp = (rawPhone: string) => {
    return rawPhone.replace(/\D/g, '');
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    // Don't fully block default mailto behavior, but copy to clipboard and notify
    navigator.clipboard.writeText(contactEmail).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 3000);
    }).catch(() => {});
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Связь с нами</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Контакты
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Мы находимся в самом сердце Астаны в престижном комплексе Esil Plaza. Свяжитесь с нами любым удобным способом или сразу приезжайте на тренировку!
          </p>
        </div>

        {/* --- Main Two Column Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Column 1: Informational & Action Buttons (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 bg-white/[0.01] border border-white/5 rounded-3xl p-8 shadow-xl">
            
            <div className="flex flex-col gap-8">
              {/* Studio Brand Header */}
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">DANCELA STUDIO</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Спортивно-бальные танцы</p>
              </div>

              {/* Address detail */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">Адрес студии:</h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    Казахстан, Астана <br />
                    Esil Plaza <br />
                    Проспект Кабанбай Батыра, 49 <br />
                    2 этаж
                  </p>
                </div>
              </div>

              {/* Telephone detail */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">Телефон / WhatsApp:</h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed font-mono font-bold">
                    {contactPhone}
                  </p>
                </div>
              </div>

              {/* Email detail with backup information */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">Электронная Почта:</h4>
                    {emailCopied && (
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
                        Скопировано!
                      </span>
                    )}
                  </div>
                  <a 
                    href={`mailto:${contactEmail}`}
                    onClick={handleEmailClick}
                    className="text-sm text-amber-400 font-bold mt-1 leading-relaxed block hover:text-amber-300"
                  >
                    {contactEmail}
                  </a>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Если телефон недоступен или вы не можете дозвониться, кликните по почте, чтобы скопировать её и написать нам напрямую.
                  </p>
                </div>
              </div>

              {/* Instagram detail */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">Instagram аккаунт:</h4>
                  <a 
                    href="https://instagram.com/dancela.studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-amber-400 font-bold mt-1 leading-relaxed block hover:text-amber-300"
                  >
                    @dancela.studio
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-6 mt-6">
              <a 
                href={`https://wa.me/${getCleanPhoneForWhatsApp(contactPhone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 text-xs font-bold uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/20"
              >
                <span>Написать в WhatsApp</span>
              </a>

              <button 
                onClick={handleEmailClick}
                className="w-full py-3.5 px-4 bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-white/5 relative group overflow-hidden"
              >
                <span>Написать на Email</span>
                {emailCopied && (
                  <span className="absolute inset-0 bg-emerald-600 text-emerald-50 font-black text-xs uppercase tracking-widest flex items-center justify-center animate-fade-in">
                    Адрес скопирован в буфер!
                  </span>
                )}
              </button>

              <a 
                href="https://instagram.com/dancela.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 transition-all"
              >
                <span>Перейти в Instagram</span>
              </a>
            </div>

          </div>

          {/* Column 2: Stylized Premium Map Layout (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            
            {/* Ambient map backing decorative graphics */}
            <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex-1 flex flex-col justify-between gap-8">
              
              {/* Map Header */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] uppercase tracking-widest font-extrabold text-amber-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Интерактивная навигация</span>
                </span>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight mt-3">Esil Plaza — Астана</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Мы расположены в престижном районе левого берега Астаны по проспекту Кабанбай Батыра, рядом с ключевыми центрами притяжения.
                </p>
              </div>

              {/* STYLIZED MOCK MAP COMPONENT (Breathtaking clean UI style) */}
              <div className="relative border border-white/10 bg-black/80 rounded-2xl p-6 aspect-video flex flex-col justify-between overflow-hidden shadow-2xl group">
                
                {/* Visual grid lines mimicking professional vector layout maps */}
                <div className="absolute top-0 bottom-0 left-1/3 border-l border-dashed border-white/5 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-2/3 border-l border-dashed border-white/5 pointer-events-none" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/5 pointer-events-none" />
                
                {/* Bold Street Name Labels */}
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-600 font-extrabold select-none">
                  пр. Кабанбай Батыра / Kabandai Batyr Ave
                </div>
                
                <div className="absolute right-6 top-8 text-[10px] uppercase font-mono tracking-widest text-slate-700 font-extrabold select-none -rotate-90">
                  ул. Сыганак
                </div>

                {/* Pin highlighting Esil Plaza */}
                <div className="self-center flex flex-col items-center gap-2 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl shadow-amber-500/30 border border-amber-300/30 animate-bounce">
                    <MapPin className="w-7 h-7 text-black fill-current" />
                  </div>
                  <div className="px-4 py-2 bg-black/90 border border-amber-500/30 text-amber-300 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg">
                    Dancela (Esil Plaza) • 2 этаж
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono tracking-widest text-slate-600 font-extrabold select-none">
                  Левый берег / Left Bank Astana
                </div>

              </div>

              {/* Map Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block font-bold">Ориентиры:</span>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Второй этаж Esil Plaza. Удобная бесплатная охраняемая парковка для учеников студии.</p>
                </div>

                <button
                  onClick={handleBuildRoute}
                  className="px-6 py-3.5 bg-white text-black hover:bg-amber-400 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
                >
                  <span>Построить маршрут</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
