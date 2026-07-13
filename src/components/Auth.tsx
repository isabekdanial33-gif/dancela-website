import React, { useState, useEffect, useRef } from 'react';
import {
  Mail, Lock, Phone, Eye, EyeOff, ArrowRight,
  Loader2, CheckCircle, AlertCircle, X, ExternalLink
} from 'lucide-react';
import {
  auth, googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '../lib/firebase';
import { User } from '../types';

// ── Admin check — never exposed in UI ────────────────────────────────────────
const ADMIN_EMAILS = ['dancela2024@gmail.com', 'isabekdanial33@gmail.com'];
const ADMIN_PHONES = ['77064069886', '77767722013', '77014962932'];

function normalizePhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('8') && d.length === 11) return '7' + d.slice(1);
  return d;
}
function isAdminEmail(e: string) { return ADMIN_EMAILS.includes(e.trim().toLowerCase()); }
function isAdminPhone(p: string) { return ADMIN_PHONES.includes(normalizePhone(p)); }

function buildUser(fbUser: any, overrideName?: string): User {
  const email = fbUser.email || '';
  const phone = fbUser.phoneNumber || '';
  return {
    id: fbUser.uid,
    email,
    name: overrideName || fbUser.displayName || email.split('@')[0] || phone || 'Пользователь',
    role: isAdminEmail(email) || isAdminPhone(phone) ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    phoneNumber: phone || undefined,
  };
}

// ── Error map ─────────────────────────────────────────────────────────────────
function friendlyError(code: string, message?: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use':     'Этот email уже зарегистрирован. Попробуйте войти.',
    'auth/invalid-email':            'Некорректный адрес email.',
    'auth/weak-password':            'Пароль слишком простой — минимум 6 символов.',
    'auth/wrong-password':           'Неверный пароль. Попробуйте ещё раз.',
    'auth/invalid-credential':       'Неверный email или пароль.',
    'auth/user-not-found':           'Пользователь с таким email не найден.',
    'auth/too-many-requests':        'Слишком много попыток. Подождите несколько минут.',
    'auth/popup-closed-by-user':     'Окно входа было закрыто. Попробуйте снова.',
    'auth/popup-blocked':            'Браузер заблокировал всплывающее окно. Разрешите попапы для этого сайта.',
    'auth/cancelled-popup-request':  'Запрос отменён. Попробуйте снова.',
    'auth/operation-not-allowed':    'Этот метод входа не включён в Firebase Console. Активируйте его в разделе Authentication → Sign-in method.',
    'auth/invalid-phone-number':     'Некорректный номер. Используйте международный формат: +77001234567',
    'auth/invalid-verification-code':'Неверный код из SMS.',
    'auth/code-expired':             'Код истёк. Запросите новый.',
    'auth/missing-phone-number':     'Введите номер телефона.',
    'auth/quota-exceeded':           'Превышен лимит SMS. Попробуйте позже.',
    'auth/captcha-check-failed':     'Ошибка капчи. Обновите страницу и попробуйте снова.',
    'auth/network-request-failed':   'Нет соединения с интернетом.',
    'auth/internal-error':           'Внутренняя ошибка Firebase. Проверьте настройки проекта.',
  };
  if (map[code]) return map[code];
  // surface raw message for unknown codes so developer can debug
  return message ? `Ошибка: ${message}` : `Ошибка (${code}). Попробуйте снова.`;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onClose?: () => void;
}

type Method = 'google' | 'email' | 'phone';
type EmailMode = 'login' | 'register';

export default function Auth({ onLoginSuccess, onClose }: AuthProps) {
  const [method, setMethod]       = useState<Method>('google');
  const [emailMode, setEmailMode] = useState<EmailMode>('login');

  // email
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [name, setName]                 = useState('');
  const [showPass, setShowPass]         = useState(false);

  // phone
  const [phone, setPhone]               = useState('+7');
  const [otpSent, setOtpSent]           = useState(false);
  const [otp, setOtp]                   = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);

  // ui
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // recaptcha — one persistent div in DOM
  const recaptchaRef  = useRef<HTMLDivElement>(null);
  const verifierRef   = useRef<any>(null);

  useEffect(() => {
    return () => {
      // cleanup verifier on unmount
      try { verifierRef.current?.clear(); } catch {}
      verifierRef.current = null;
    };
  }, []);

  const clear = () => { setError(''); setSuccess(''); };

  const fail = (err: any) => {
    console.error('[Auth error]', err);
    setError(friendlyError(err?.code ?? '', err?.message ?? ''));
  };

  // ── Google ────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clear(); setLoading(true);
    try {
      const r = await signInWithPopup(auth, googleProvider);
      setSuccess('Вход выполнен!');
      setTimeout(() => onLoginSuccess(buildUser(r.user)), 500);
    } catch (e: any) { fail(e); }
    finally { setLoading(false); }
  };

  // ── Email ─────────────────────────────────────────────────────────────────
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault(); clear();
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов.'); return; }
    setLoading(true);
    try {
      let r;
      if (emailMode === 'register') {
        r = await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        r = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      setSuccess('Вход выполнен!');
      setTimeout(() => onLoginSuccess(buildUser(r.user, emailMode === 'register' ? name : undefined)), 500);
    } catch (e: any) { fail(e); }
    finally { setLoading(false); }
  };

  // ── Phone — send OTP ──────────────────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault(); clear();

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Введите полный номер телефона в международном формате: +77001234567');
      return;
    }

    setLoading(true);
    try {
      // Always recreate verifier to avoid stale state
      try { verifierRef.current?.clear(); } catch {}
      verifierRef.current = null;

      // recaptchaRef.current must be in DOM — it's always rendered below
      verifierRef.current = new RecaptchaVerifier(auth, 'dancela-recaptcha', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError('Капча устарела. Попробуйте снова.');
          try { verifierRef.current?.clear(); } catch {}
          verifierRef.current = null;
        },
      });

      const result = await signInWithPhoneNumber(auth, phone.trim(), verifierRef.current);
      setConfirmation(result);
      setOtpSent(true);
      setSuccess(`SMS-код отправлен на ${phone}`);
    } catch (e: any) {
      fail(e);
      try { verifierRef.current?.clear(); } catch {}
      verifierRef.current = null;
    }
    finally { setLoading(false); }
  };

  // ── Phone — verify OTP ────────────────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      const r = await confirmation.confirm(otp);
      setSuccess('Вход выполнен!');
      setTimeout(() => onLoginSuccess(buildUser(r.user)), 500);
    } catch (e: any) { fail(e); }
    finally { setLoading(false); }
  };

  const resetPhone = () => {
    setOtpSent(false); setOtp(''); setConfirmation(null);
    try { verifierRef.current?.clear(); } catch {}
    verifierRef.current = null;
    clear();
  };

  // ── shared button style ───────────────────────────────────────────────────
  const primaryBtn = `w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-yellow-400
    hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest
    rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
    shadow-lg shadow-amber-500/15`;

  const inputCls = `w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 text-sm text-white
    placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Recaptcha anchor — always in DOM, invisible */}
      <div id="dancela-recaptcha" ref={recaptchaRef} className="fixed bottom-0 left-0 opacity-0 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-900/8 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 font-black text-black text-2xl shadow-xl shadow-amber-500/20 mb-4">D</div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Войти в Dancela</h1>
          <p className="text-sm text-slate-500 mt-1.5">Личный кабинет студии бальных танцев</p>
          {onClose && (
            <button onClick={onClose} className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Method tabs */}
        <div className="flex bg-white/[0.03] border border-white/8 rounded-2xl p-1 mb-6 gap-1">
          {([
            { id: 'google' as Method, label: 'Google',   icon: <span className="font-black text-sm">G</span> },
            { id: 'email'  as Method, label: 'Email',    icon: <Mail className="w-3.5 h-3.5" /> },
            { id: 'phone'  as Method, label: 'Телефон',  icon: <Phone className="w-3.5 h-3.5" /> },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMethod(tab.id); clear(); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                ${method === tab.id ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              {error.includes('не включён') && (
                <a
                  href="https://console.firebase.google.com"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-2 text-amber-400 font-bold underline hover:text-amber-300"
                >
                  <ExternalLink className="w-3 h-3" /> Открыть Firebase Console
                </a>
              )}
            </div>
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /><span>{success}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/8 rounded-3xl p-8 backdrop-blur-sm">

          {/* ── GOOGLE ── */}
          {method === 'google' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-400 text-center mb-1">Быстрый вход через аккаунт Google.</p>
              <button onClick={handleGoogle} disabled={loading} className={primaryBtn}>
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                }
                <span>{loading ? 'Выполняется вход...' : 'Войти через Google'}</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-slate-600">или</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMethod('email')} className="flex items-center justify-center gap-2 py-3 border border-white/8 text-slate-400 hover:text-white hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button onClick={() => setMethod('phone')} className="flex items-center justify-center gap-2 py-3 border border-white/8 text-slate-400 hover:text-white hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                  <Phone className="w-3.5 h-3.5" /> Телефон
                </button>
              </div>
            </div>
          )}

          {/* ── EMAIL ── */}
          {method === 'email' && (
            <div>
              <div className="flex bg-black/40 border border-white/8 rounded-xl p-1 mb-6 gap-1">
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => { setEmailMode(m); clear(); }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${emailMode === m ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>
                    {m === 'login' ? 'Войти' : 'Регистрация'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleEmail} className="flex flex-col gap-4">
                {emailMode === 'register' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Ваше имя</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Имя и фамилия"
                      className={inputCls + " px-4"} />
                  </div>
                )}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Email адрес</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@gmail.com"
                      className={inputCls + " pl-11 pr-4"} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      required minLength={6} placeholder="Минимум 6 символов"
                      className={inputCls + " pl-11 pr-12"} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-[10px] text-red-400 mt-1.5 font-medium">Минимум 6 символов</p>
                  )}
                </div>
                <button type="submit" disabled={loading || password.length < 6} className={primaryBtn + " mt-1"}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{loading ? 'Загрузка...' : emailMode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
                </button>
              </form>

              {/* Firebase Console hint */}
              <div className="mt-5 p-3.5 bg-white/[0.02] border border-white/8 rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  <span className="text-amber-400 font-bold">Не работает?</span> Убедитесь что в{' '}
                  <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
                    className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-0.5">
                    Firebase Console <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {' '}включён метод входа: <span className="text-white font-bold">Authentication → Sign-in method → Email/Password → Enable</span>
                </p>
              </div>
            </div>
          )}

          {/* ── PHONE ── */}
          {method === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                  <p className="text-sm text-slate-400 mb-1">Введите номер — отправим SMS с кодом.</p>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Номер телефона</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        placeholder="+77001234567"
                        className={inputCls + " pl-11 pr-4 font-mono tracking-wider"}
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5">Международный формат: +7 XXX XXX XX XX</p>
                  </div>
                  <button type="submit" disabled={loading} className={primaryBtn}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>{loading ? 'Отправка SMS...' : 'Получить SMS-код'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-4 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>SMS отправлен на <span className="font-mono font-bold">{phone}</span></span>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">Код из SMS</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      placeholder="• • • • • •"
                      maxLength={6}
                      className={`${inputCls} px-4 text-center text-2xl font-black tracking-[0.5em] placeholder-slate-700`}
                    />
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} className={primaryBtn}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    <span>{loading ? 'Проверка...' : 'Подтвердить код'}</span>
                  </button>
                  <button type="button" onClick={resetPhone}
                    className="text-xs text-slate-500 hover:text-slate-300 text-center underline transition-colors">
                    Изменить номер / отправить повторно
                  </button>
                </form>
              )}

              {/* Firebase Console hint */}
              <div className="mt-5 p-3.5 bg-white/[0.02] border border-white/8 rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  <span className="text-amber-400 font-bold">Не работает?</span> В{' '}
                  <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
                    className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-0.5">
                    Firebase Console <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {' '}включите:{' '}
                  <span className="text-white font-bold">Authentication → Sign-in method → Phone → Enable</span>
                  , а также добавьте домен в{' '}
                  <span className="text-white font-bold">Authentication → Settings → Authorized domains</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-6 px-4 leading-relaxed">
          Входя в систему, вы соглашаетесь с правилами студии Dancela.
        </p>
      </div>
    </div>
  );
}
