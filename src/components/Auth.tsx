import React, { useState } from 'react';
import { Sparkles, AlertCircle, Chrome, Mail, User as UserIcon, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../lib/firebase';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  setCurrentPage: (page: string) => void;
  contactPhone: string;
  contactEmail: string;
}

export default function Auth({ onLoginSuccess, setCurrentPage, contactPhone, contactEmail }: AuthProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCleanPhone = (phoneStr: string) => {
    return phoneStr.replace(/\D/g, '');
  };

  const checkIsAdmin = (emailVal: string, phoneVal: string) => {
    const cleanEmail = emailVal.trim().toLowerCase();
    const cleanPhone = getCleanPhone(phoneVal);
    
    const targetEmail = contactEmail.trim().toLowerCase(); // Dancela2024@gmail.com
    const targetPhone = getCleanPhone(contactPhone); // 77064069886
    
    const isEmailAdmin = cleanEmail === targetEmail;
    const isPhoneAdmin = cleanPhone !== '' && (cleanPhone === targetPhone || cleanPhone === '8' + targetPhone.substring(1) || cleanPhone === '7' + targetPhone.substring(1));
    
    return isEmailAdmin || isPhoneAdmin;
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const emailVal = fbUser.email || '';
      const phoneVal = fbUser.phoneNumber || '';
      const isAdmin = checkIsAdmin(emailVal, phoneVal);

      const loggedInUser: User = {
        id: fbUser.uid,
        email: emailVal,
        name: fbUser.displayName || 'Пользователь Google',
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        phoneNumber: phoneVal,
        bookedLessons: []
      };

      handleSuccessLogin(loggedInUser);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Окно авторизации Google было заблокировано браузером. Пожалуйста, откройте приложение в новой вкладке (кнопка сверху справа) и попробуйте снова.');
      } else {
        setErrorMessage(`Ошибка авторизации через Google: ${error.message || error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Пожалуйста, заполните электронную почту и пароль.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        // Sign In
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = credential.user;

        const isAdmin = checkIsAdmin(fbUser.email || '', fbUser.phoneNumber || '');
        const loggedInUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Ученик Dancela',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          phoneNumber: fbUser.phoneNumber || '',
          bookedLessons: []
        };
        handleSuccessLogin(loggedInUser);
      } else {
        // Register
        if (password.length < 6) {
          setErrorMessage('Пароль должен содержать не менее 6 символов.');
          setIsLoading(false);
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = credential.user;

        const isAdmin = checkIsAdmin(email, phone);
        const loggedInUser: User = {
          id: fbUser.uid,
          email: email.trim().toLowerCase(),
          name: name.trim() || 'Новый Ученик',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          phoneNumber: phone,
          bookedLessons: []
        };
        handleSuccessLogin(loggedInUser);
      }
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMessage('Неверный email или пароль.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Этот адрес электронной почты уже используется другим аккаунтом.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Неверный формат адреса электронной почты.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Пароль слишком слабый. Длина пароля должна быть не менее 6 символов.');
      } else {
        setErrorMessage(`Ошибка: ${error.message || error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth_page_container" className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 min-h-[80vh] flex items-center justify-center">
      <div id="auth_card" className="max-w-md w-full bg-white/[0.01] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow orb */}
        <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Success screen */}
        {successMessage ? (
          <div id="auth_success_screen" className="text-center py-12 relative z-10 animate-fade-in">
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
            <div id="auth_header" className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Реальный Firebase Вход</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {authMode === 'login' ? 'Вход в систему' : 'Регистрация'}
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                {authMode === 'login' 
                  ? 'Войдите в личный кабинет ученика или панель управления.' 
                  : 'Зарегистрируйте новый личный кабинет для записи на занятия.'}
              </p>
            </div>

            {/* Helper Hint */}
            <div id="auth_helper_hint" className="mb-6 p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-start gap-2.5 text-[10px] leading-relaxed text-slate-300">
              <Lock className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <span className="font-extrabold text-white uppercase tracking-wider block mb-0.5">Доступ администратора:</span>
                Доступ к разделу настроек (редактирования) открывается только при авторизации по контактам студии: <br />
                <span className="font-mono text-amber-400 font-bold block mt-1">Email: {contactEmail}</span>
                <span className="font-mono text-amber-400 font-bold block">Телефон: {contactPhone}</span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div id="auth_error_banner" className="mb-6 p-4 bg-rose-950/40 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Info banner */}
            {infoMessage && (
              <div id="auth_info_banner" className="mb-6 p-4 bg-amber-950/40 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Mode selection tabs */}
            <div className="grid grid-cols-2 gap-2 mb-6 bg-white/[0.02] p-1 rounded-xl border border-white/5 relative z-10">
              <button
                id="tab_login"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className={`py-2 px-3 rounded-lg text-xs uppercase tracking-wider font-extrabold transition-all text-center ${
                  authMode === 'login'
                    ? 'bg-amber-400 text-black font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Войти
              </button>
              <button
                id="tab_register"
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className={`py-2 px-3 rounded-lg text-xs uppercase tracking-wider font-extrabold transition-all text-center ${
                  authMode === 'register'
                    ? 'bg-amber-400 text-black font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Google Login Button */}
            <div className="mb-6 relative z-10">
              <button
                id="google_auth_btn"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <Chrome className="w-4 h-4 text-rose-500" />
                <span>{isLoading ? 'Загрузка...' : 'Войти через Google'}</span>
              </button>
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-wider">или по электронной почте</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4 relative z-10">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Ваше ФИО:</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        id="register_name"
                        type="text"
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-200 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Номер телефона:</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs text-slate-500 font-bold">+7</span>
                      <input
                        id="register_phone"
                        type="tel"
                        placeholder="(706) 406-98-86"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-200 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Электронная Почта:</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="auth_email"
                    type="email"
                    placeholder={contactEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-200 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Пароль:</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="auth_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 pl-11 pr-12 text-xs font-semibold text-slate-200 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="submit_auth_form"
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
              >
                {isLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
