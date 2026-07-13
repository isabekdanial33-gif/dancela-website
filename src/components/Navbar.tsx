import React from 'react';
import { Sparkles, Menu, X, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'about', label: 'О студии' },
    { id: 'styles', label: 'Направления' },
    { id: 'trainers', label: 'Тренеры' },
    { id: 'gallery', label: 'Галерея' },
    { id: 'news', label: 'Новости' },
    { id: 'tournaments', label: 'Турниры' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'prices', label: 'Стоимость' },
    { id: 'contacts', label: 'Контакты' },
    ...(currentUser?.role === 'admin' ? [{ id: 'settings', label: 'Настройки' }] : []),
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-all duration-300">
              <span className="text-black font-extrabold text-lg tracking-tighter">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-widest leading-none group-hover:text-amber-400 transition-colors">
                DANCELA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                dance studio
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* AI Assistant */}
            <a
              href="https://dancela-assistant.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                    currentPage === 'profile'
                      ? 'border-white text-white bg-white/10'
                      : 'border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Выйти"
                  className="p-2 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 rounded-full transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-l border-white/10 pl-3">
                <button
                  onClick={() => handleNavClick('auth')}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-bold border border-white/15 text-white hover:bg-white/8 hover:border-white/30 rounded-full transition-all duration-300 flex items-center gap-1.5 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Войти</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile header buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="https://dancela-assistant.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-full flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI</span>
            </a>
            {!currentUser && (
              <button
                onClick={() => handleNavClick('auth')}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border border-white/15 text-white hover:bg-white/8 rounded-full flex items-center gap-1 transition-all"
              >
                <LogIn className="w-3 h-3" />
                <span>Войти</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 py-3 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-black font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Mobile user section */}
          <div className="border-t border-white/5 pt-3 mt-2 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400 font-semibold bg-white/5 rounded-xl">
                  <span className="truncate">{currentUser.name} ({currentUser.role === 'admin' ? 'Админ' : 'Ученик'})</span>
                  <button onClick={onLogout} className="text-red-400 font-bold uppercase tracking-wider text-[10px]">
                    Выйти
                  </button>
                </div>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full text-center py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold border border-white/10 text-slate-200"
                >
                  Личный кабинет
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-bold border border-white/15 text-white hover:bg-white/8 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Войти / Регистрация</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
