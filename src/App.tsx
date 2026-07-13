import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Styles from './components/Styles';
import Trainers from './components/Trainers';
import Gallery from './components/Gallery';
import News from './components/News';
import Tournaments from './components/Tournaments';
import Schedule from './components/Schedule';
import Prices from './components/Prices';
import Contacts from './components/Contacts';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Settings from './components/Settings';

import { 
  Trainer, PriceItem, NewsItem, Tournament, ScheduleItem, GalleryItem, User,
  INITIAL_TRAINERS, INITIAL_PRICES, INITIAL_NEWS, INITIAL_TOURNAMENTS, INITIAL_SCHEDULE, INITIAL_GALLERY
} from './types';

import { 
  Award, MapPin, Phone, Instagram, ShieldCheck, Heart, Mail 
} from 'lucide-react';

export default function App() {
  // --- STATE DECLARATIONS ---
  const [currentPage, setCurrentPage] = useState<string>('home');

  const [editorMode, setEditorMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('dancela_editor_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [contactPhone, setContactPhone] = useState<string>(() => {
    const saved = localStorage.getItem('dancela_contact_phone');
    if (!saved || saved === '8 (776) 772-20-13') {
      localStorage.setItem('dancela_contact_phone', '+7 (706) 406-98-86');
      return '+7 (706) 406-98-86';
    }
    return saved;
  });

  const [contactEmail, setContactEmail] = useState<string>(() => {
    const saved = localStorage.getItem('dancela_contact_email');
    if (!saved || saved === 'info@dancela.kz' || saved === 'info.doncelok@gmail.com') {
      localStorage.setItem('dancela_contact_email', 'Dancela2024@gmail.com');
      return 'Dancela2024@gmail.com';
    }
    return saved;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dancela_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic entities managed by Admin Panel, loaded from localStorage or pre-populated defaults
  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('dancela_trainers');
    return saved ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [prices, setPrices] = useState<PriceItem[]>(() => {
    const saved = localStorage.getItem('dancela_prices');
    return saved ? JSON.parse(saved) : INITIAL_PRICES;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('dancela_news');
    const parsed = saved ? JSON.parse(saved) : INITIAL_NEWS;
    return parsed.filter((item: any) => item.id !== 'n1' && item.id !== 'n2' && item.id !== 'n3');
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('dancela_tournaments');
    const parsed = saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
    return parsed.filter((item: any) => item.id !== 'n1' && item.id !== 'n2' && item.id !== 'n3' && item.id !== 't1' && item.id !== 't2' && item.id !== 't3');
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('dancela_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('dancela_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('dancela_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('dancela_prices', JSON.stringify(prices));
  }, [prices]);

  useEffect(() => {
    localStorage.setItem('dancela_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('dancela_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('dancela_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('dancela_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dancela_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dancela_current_user');
    }
  }, [currentUser]);

  // --- HANDLERS ---
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-100 antialiased">
      
      {/* Decorative ambient blurred glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-900/10 blur-[120px] pointer-events-none z-0" />

      {/* --- HEADER NAVBAR --- */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* --- DYNAMIC PAGES CONTAINER --- */}
      <main className="flex-1 relative z-10">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'styles' && <Styles setCurrentPage={setCurrentPage} />}
        {currentPage === 'trainers' && <Trainers trainers={trainers} contactPhone={contactPhone} />}
        {currentPage === 'gallery' && <Gallery galleryItems={galleryItems} />}
        {currentPage === 'news' && <News news={news} />}
        {currentPage === 'tournaments' && <Tournaments tournaments={tournaments} contactPhone={contactPhone} />}
        {currentPage === 'schedule' && <Schedule schedule={schedule} />}
        {currentPage === 'prices' && <Prices prices={prices} contactPhone={contactPhone} />}
        {currentPage === 'contacts' && (
          <Contacts contactPhone={contactPhone} contactEmail={contactEmail} />
        )}
        
        {currentPage === 'auth' && (
          <Auth 
            onLoginSuccess={handleLoginSuccess} 
            setCurrentPage={setCurrentPage} 
            contactPhone={contactPhone}
            contactEmail={contactEmail}
          />
        )}
        
        {currentPage === 'profile' && <Profile currentUser={currentUser} contactPhone={contactPhone} />}
        
        {currentPage === 'settings' && (
          <Settings 
            editorMode={editorMode}
            setEditorMode={setEditorMode}
            trainers={trainers}
            setTrainers={setTrainers}
            prices={prices}
            setPrices={setPrices}
            schedule={schedule}
            setSchedule={setSchedule}
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
          />
        )}
      </main>

      {/* --- PREMIUM COMPREHENSIVE FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 bg-neutral-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-12 mb-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-black">
                D
              </div>
              <span className="text-white font-extrabold text-base tracking-widest uppercase">Dancela</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Премиальная студия спортивно-бальных танцев в Астане. Профессиональный паркет, опытный тренерский состав и спортивная карьера для ваших детей.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest mb-1">Разделы сайта</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">О студии</button>
              <button onClick={() => { setCurrentPage('styles'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">Направления</button>
              <button onClick={() => { setCurrentPage('trainers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">Тренеры</button>
              <button onClick={() => { setCurrentPage('schedule'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">Расписание</button>
              <button onClick={() => { setCurrentPage('prices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">Стоимость</button>
              <button onClick={() => { setCurrentPage('contacts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 text-left transition-colors">Контакты</button>
            </div>
          </div>

          {/* Column 3: Contact quick facts */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest mb-1">Наши контакты</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Астана, Esil Plaza, 2 этаж</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="https://instagram.com/dancela.studio" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">@dancela.studio</a>
              </div>
            </div>
          </div>

          {/* Column 4: Quality Mark */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest mb-1">Федерация</h4>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h5 className="text-[11px] font-extrabold text-white uppercase tracking-tight">Под эгидой WDSF</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Официальные спортивные классы, книжки спортсменов и продвижение в национальном рейтинге.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Outer bottom panel */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 Студия спортивно-бального танца Dancela. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <a href="https://dancela-assistant.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <span>Dancela AI Assistant</span>
            </a>
            <span>•</span>
            <span className="font-mono text-[10px]">Esil Plaza, Astana, KZ</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
