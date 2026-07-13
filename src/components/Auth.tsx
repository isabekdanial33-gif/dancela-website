import React, { useState } from 'react';
import { Sparkles, AlertCircle, Chrome, Phone, Mail, User as UserIcon, CheckCircle2, Lock } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  setCurrentPage: (page: string) => void;
  contactPhone: string;
  contactEmail: string;
}

export default function Auth({ onLoginSuccess, setCurrentPage, contactPhone, contactEmail }: AuthProps) {
  const [activeMethod, setActiveMethod] = useState<'google' | 'phone' | 'email'>('google');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Google Selector State
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const getCleanPhone = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.substring(1);
    }
    if (digits.startsWith('+7')) {
      return digits.substring(1);
    }
    return digits;
  };

  const handleSuccessLogin = (user: User) => {
    setSuccessMessage(`Успешный вход! Вы вошли как ${user.role === 'admin' ? 'Администратор' : 'Пользователь'} (${user.name}).`);
    setTimeout(() => {
      onLoginSuccess(user);
      if (user.role === 'admin') {
        setCurrentPage('settings');
      } else {
        setCurrentPage('profile');
      }
    }, 1500);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage('');

    if (!codeSent) {
      if (!phone.trim()) {
        setInfoMessage('Пожалуйста, введите корректный номер телефона.');
        return;
      }
      setCodeSent(true);
      setInfoMessage('СМС-код отправлен! Для симуляции входа введите любой 4-значный код (например, 1234).');
      return;
    }

    if (code.length < 4) {
      setInfoMessage('Введите 4-значный код подтверждения.');
      return;
    }

    // Process Login
    const cleanEntered = getCleanPhone(phone);
    const cleanAdmin = getCleanPhone(contactPhone);
    const isAdmin = cleanEntered === cleanAdmin && cleanAdmin !== '';

    const displayName = name.trim() || (isAdmin ? 'Администратор студии' : 'Ученик Dancela');

    const loggedInUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: isAdmin ? contactEmail : 'user@dancela.kz',
      name: displayName,
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      phoneNumber: phone,
      bookedLessons: []
    };

    handleSuccessLogin(loggedInUser);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage('');

    if (!email.trim() || !password.trim()) {
      setInfoMessage('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const isAdmin = email.trim().toLowerCase() === contactEmail.trim().toLowerCase();
    const displayName = name.trim() || (isAdmin ? 'Администратор студии' : 'Ученик Dancela');

    const loggedInUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      name: displayName,
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      phoneNumber: contactPhone,
      bookedLessons: []
    };

    handleSuccessLogin(loggedInUser);
  };

  const handleGoogleSelect = (selectedEmail: string, selectedName: string) => {
    const isAdmin = selectedEmail.trim().toLowerCase() === contactEmail.trim().toLowerCase();
    
    const loggedInUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: selectedEmail.trim().toLowerCase(),
      name: selectedName || (isAdmin ? 'Администратор Google' : 'Ученик Google'),
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      bookedLessons: []
    };

    setShowGoogleSelector(false);
    handleSuccessLogin(loggedInUser);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white/[0.01] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow orb */}
        <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Success screen */}
        {successMessage ? (
          <div className="text-center py-12 relative z-10 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Авторизация пройдена</h3>
            <p className="text-sm text-slate-300 px-4 leading-relaxed font-semibold">
              {successMessage}
            </p>
            <div className="w-12 h-1 bg-amber-500/30 mx-auto mt-8 rounded-full animate-pulse" />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold">Перенаправление...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Панель Авторизации</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Вход в систему
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Для доступа к управлению настройками (редактору) используйте контакты администратора.
              </p>
            </div>

            {/* Helper Hint */}
            <div className="mb-6 p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-start gap-2.5 text-[10px] leading-relaxed text-slate-300">
              <Lock className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <span className="font-extrabold text-white uppercase tracking-wider block mb-0.5">Доступ администратора:</span>
                Доступ к разделу настроек (редактирования) открывается только при авторизации по контактам студии: <br />
                <span className="font-mono text-amber-400 font-bold block mt-1">Email: {contactEmail}</span>
                <span className="font-mono text-amber-400 font-bold block">Телефон: {contactPhone}</span>
              </div>
            </div>

            {/* Info banner */}
            {infoMessage && (
              <div className="mb-6 p-4 bg-amber-950/40 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Tab selection bar */}
            <div className="grid grid-cols-3 gap-2 mb-8 bg-white/[0.02] p-1 rounded-xl border border-white/5 relative z-10">
              {[
                { id: 'google', label: 'Google', icon: Chrome },
                { id: 'phone', label: 'Телефон', icon: Phone },
                { id: 'email', label: 'Email', icon: Mail }
              ].map((method) => {
                const Icon = method.icon;
                const isSel = activeMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      setActiveMethod(method.id as any);
                      setInfoMessage('');
                      setShowGoogleSelector(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all flex flex-col items-center gap-1.5 ${
                      isSel
                        ? 'bg-amber-400 text-black font-black font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Render active method form */}
            <div className="relative z-10">
              
              {/* Google Method */}
              {activeMethod === 'google' && (
                <div className="space-y-4">
                  {!showGoogleSelector ? (
                    <>
                      <p className="text-xs text-slate-400 text-center leading-relaxed">
                        Войдите с помощью вашей учетной записи Google для мгновенного и безопасного доступа.
                      </p>
                      <button
                        onClick={() => setShowGoogleSelector(true)}
                        className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <Chrome className="w-4 h-4" />
                        <span>Войти через Google</span>
                      </button>
                    </>
                  ) : (
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">Выбор аккаунта Google:</h4>
                      
                      <button
                        onClick={() => handleGoogleSelect(contactEmail, 'Главный Администратор')}
                        className="w-full p-3.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/50 rounded-xl text-left transition-all flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black flex items-center justify-center shrink-0">
                          А
                        </div>
                        <div className="truncate">
                          <p className="text-xs text-white font-black">Администратор (Студия)</p>
                          <p className="text-[10px] text-amber-400 font-mono truncate">{contactEmail}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleGoogleSelect('isabekdanial34@gmail.com', 'Даниал Исабек')}
                        className="w-full p-3.5 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl text-left transition-all flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-black flex items-center justify-center shrink-0">
                          Д
                        </div>
                        <div className="truncate">
                          <p className="text-xs text-white font-black">Даниал Исабек (Пользователь)</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">isabekdanial34@gmail.com</p>
                        </div>
                      </button>

                      <div className="border-t border-white/5 pt-3 space-y-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold text-center">Или войти с произвольного Google аккаунта:</p>
                        <input
                          type="text"
                          placeholder="Ваше Имя"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 transition-colors"
                        />
                        <input
                          type="email"
                          placeholder="example@gmail.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 transition-colors"
                        />
                        <button
                          onClick={() => handleGoogleSelect(customGoogleEmail || 'guest@gmail.com', customGoogleName || 'Гость')}
                          className="w-full py-2.5 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                        >
                          Использовать этот аккаунт
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phone Method */}
              {activeMethod === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Ваше ФИО:</label>
                    <input
                      type="text"
                      placeholder="Иван Иванов (Необязательно)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors mb-4"
                    />

                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Номер телефона:</label>
                    <input
                      type="tel"
                      placeholder={contactPhone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors"
                      required
                    />
                  </div>

                  {codeSent && (
                    <div className="animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Код из СМС:</label>
                      <input
                        type="text"
                        placeholder="1234"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
                  >
                    {codeSent ? 'Подтвердить код' : 'Получить СМС-код'}
                  </button>
                </form>
              )}

              {/* Email Method */}
              {activeMethod === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Ваше ФИО:</label>
                    <input
                      type="text"
                      placeholder="Иван Иванов (Необязательно)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Электронная Почта:</label>
                    <input
                      type="email"
                      placeholder={contactEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Пароль:</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
                  >
                    Войти по Email
                  </button>
                </form>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
