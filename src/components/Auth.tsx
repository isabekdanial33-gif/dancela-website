import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import {
  auth, googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '../lib/firebase';
import { User } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN VERIFICATION — credentials are checked silently, never revealed in UI
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_EMAILS = [
  'dancela2024@gmail.com',
  'isabekdanial33@gmail.com',
];

const ADMIN_PHONE_DIGITS = [
  '77064069886',
  '77767722013',
  '77014962932',
];

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length === 11) return '7' + digits.slice(1);
  if (digits.startsWith('7') && digits.length === 11) return digits;
  return digits;
}

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

function isAdminPhone(phone: string): boolean {
  return ADMIN_PHONE_DIGITS.includes(normalizePhone(phone));
}

// ─────────────────────────────────────────────────────────────────────────────

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onClose?: () => void;
}

type Method = 'google' | 'email' | 'phone';
type EmailMode = 'login' | 'register';

export default function Auth({ onLoginSuccess, onClose }: AuthProps) {
  const [method, setMethod] = useState<Method>('google');
  const [emailMode, setEmailMode] = useState<EmailMode>('login');

  // Email fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone fields
  const [phone, setPhone] = useState('+7');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<any>(null);

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const clearMessages = () => { setError(''); setSuccess(''); };

  // ── Friendly Russian error messages ──────────────────────────────────────
  function friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Этот email уже зарегистрирован. Попробуйте войти.',
      'auth/invalid-email': 'Некорректный адрес email.',
      'auth/weak-password': 'Пароль должен содержать минимум 6 символов.',
      'auth/wrong-password': 'Неверный пароль.',
      'auth/user-not-found': 'Пользователь с таким email не найден.',
      'auth/too-many-requests': 'Слишком много попыток. Подождите немного.',
      'auth/popup-closed-by-user': 'Окно входа было закрыто.',
      'auth/invalid-phone-number': 'Некорректный номер телефона.',
      'auth/invalid-verification-code': 'Неверный SMS-код.',
      'auth/code-expired': 'Срок действия кода истёк. Запросите новый.',
      'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету.',
    };
    return map[code] || 'Произошла ошибка. Попробуйте снова.';
  }

  // ── Build User object from Firebase user ─────────────────────────────────
  function buildUser(firebaseUser: any, overrideName?: string): User {
    const userEmail = firebaseUser.email || '';
    const userPhone = firebaseUser.phoneNumber || '';
    const role =
      isAdminEmail(userEmail) || isAdminPhone(userPhone) ? 'admin' : 'user';

    return {
      id: firebaseUser.uid,
      email: userEmail,
      name: overrideName || firebaseUser.displayName || userEmail.split('@')[0] || userPhone || 'Пользователь',
      role,
      createdAt: new Date().toISOString(),
      phoneNumber: userPhone || undefined,
    };
  }

  // ── Google Sign-In ────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearMessages();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = buildUser(result.user);
      setSuccess('Вход выполнен успешно!');
      setTimeout(() => onLoginSuccess(user), 600);
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Email Sign-In / Register ───────────────────────────────────────────────
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (emailMode === 'register') {
        result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        result = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = buildUser(result.user, emailMode === 'register' ? name : undefined);
      setSuccess('Вход выполнен успешно!');
      setTimeout(() => onLoginSuccess(user), 600);
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: init recaptcha & send SMS ─────────────────────────────────────
  const initRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try { recaptchaVerifierRef.current.clear(); } catch {}
      recaptchaVerifierRef.current = null;
    }
    if (!recaptchaContainerRef.current) return;

    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
      size: 'invisible',
      callback: () => {},
    });
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      initRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setOtpSent(true);
      setSuccess('SMS-код отправлен! Проверьте ваш телефон.');
    } catch (err: any) {
      setError(friendlyError(err.code));
      try { recaptchaVerifierRef.current?.clear(); } catch {}
      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = buildUser(result.user);
      setSuccess('Вход выполнен успешно!');
      setTimeout(() => onLoginSuccess(user), 600);
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-900/8 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-xl shadow-xl shadow-amber-500/20">
              D
            </div>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Войти в Dancela
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Личный кабинет студии бальных танцев
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Method Selector */}
        <div className="flex bg-white/[0.03] border border-white/8 rounded-2xl p-1 mb-8 gap-1">
          {([
            { id: 'google', icon: 'G', label: 'Google' },
            { id: 'email', icon: <Mail className="w-3.5 h-3.5" />, label: 'Email' },
            { id: 'phone', icon: <Phone className="w-3.5 h-3.5" />, label: 'Телефон' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMethod(tab.id as Method); clearMessages(); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                method === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={typeof tab.icon === 'string' ? 'font-black text-sm' : ''}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Error / Success ── */}
        {error && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/8 rounded-3xl p-8 backdrop-blur-sm">

          {/* ── GOOGLE ── */}
          {method === 'google' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-400 text-center mb-2">
                Быстрый вход через аккаунт Google — одно нажатие.
              </p>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-amber-50 text-black font-bold text-sm rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-lg shadow-white/5"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{loading ? 'Выполняется вход...' : 'Войти через Google'}</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-slate-600 font-medium">или выберите другой способ</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethod('email')}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button
                  onClick={() => setMethod('phone')}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Phone className="w-3.5 h-3.5" /> Телефон
                </button>
              </div>
            </div>
          )}

          {/* ── EMAIL ── */}
          {method === 'email' && (
            <div>
              {/* Login / Register toggle */}
              <div className="flex bg-black/40 border border-white/8 rounded-xl p-1 mb-6 gap-1">
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setEmailMode(m); clearMessages(); }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      emailMode === m ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'login' ? 'Войти' : 'Регистрация'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleEmail} className="flex flex-col gap-4">
                {emailMode === 'register' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Ваше имя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Имя и фамилия"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Email адрес</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="example@gmail.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Минимум 6 символов"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-[10px] text-red-400 mt-1.5 font-medium">Минимум 6 символов</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/15 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Загрузка...' : emailMode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ── PHONE ── */}
          {method === 'phone' && (
            <div>
              {/* Invisible recaptcha container */}
              <div ref={recaptchaContainerRef} id="recaptcha-container" />

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                  <p className="text-sm text-slate-400 mb-1">
                    Введите номер телефона — мы отправим SMS с кодом подтверждения.
                  </p>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Номер телефона</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+7 (___) ___-__-__"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-mono tracking-wider"
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5">Формат: +7 (XXX) XXX-XX-XX</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-lg shadow-amber-500/15 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>{loading ? 'Отправка SMS...' : 'Получить SMS-код'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                  <div className="px-4 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>SMS отправлен на <span className="font-mono font-bold">{phone}</span></span>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Код из SMS</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      placeholder="6-значный код"
                      maxLength={6}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-center text-2xl font-black text-white tracking-[0.5em] placeholder-slate-700 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-40 shadow-lg shadow-amber-500/15"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    <span>{loading ? 'Проверка...' : 'Подтвердить код'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setConfirmationResult(null); clearMessages(); }}
                    className="text-xs text-slate-500 hover:text-slate-300 text-center transition-colors underline"
                  >
                    Изменить номер / отправить код повторно
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-700 mt-6 px-4 leading-relaxed">
          Входя в систему, вы соглашаетесь с правилами студии Dancela.
          Ваши данные защищены и не передаются третьим лицам.
        </p>
      </div>
    </div>
  );
}
