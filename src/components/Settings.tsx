import React, { useState, useRef } from 'react';
import {
  Trainer, PriceItem, ScheduleItem, GalleryItem, NewsItem, Tournament
} from '../types';
import {
  Sparkles, ToggleLeft, ToggleRight, Edit2, Trash2, Plus, Save,
  Phone, Mail, UserCheck, CreditCard, Calendar, Image as ImageIcon,
  Eye, EyeOff, Trophy, Newspaper, CheckCircle, X, AlertCircle, Link
} from 'lucide-react';

interface SettingsProps {
  editorMode: boolean;
  setEditorMode: (mode: boolean) => void;
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  prices: PriceItem[];
  setPrices: React.Dispatch<React.SetStateAction<PriceItem[]>>;
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
}

type Tab = 'contacts' | 'trainers' | 'prices' | 'schedule' | 'gallery' | 'news' | 'tournaments';

// ── Reusable field components ────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:border-amber-500/50 focus:bg-black/80 outline-none transition-all placeholder-slate-600";
const textareaCls = inputCls + " resize-none";

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onHide }: { msg: string; onHide: () => void }) {
  React.useEffect(() => { const t = setTimeout(onHide, 2800); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-2xl shadow-2xl animate-fade-in">
      <CheckCircle className="w-4 h-4 shrink-0" />
      {msg}
      <button onClick={onHide} className="ml-1 text-emerald-500 hover:text-emerald-300"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-200">{msg}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">Отмена</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">Удалить</button>
        </div>
      </div>
    </div>
  );
}

export default function Settings({
  editorMode, setEditorMode,
  trainers, setTrainers,
  prices, setPrices,
  schedule, setSchedule,
  galleryItems, setGalleryItems,
  news, setNews,
  tournaments, setTournaments,
  contactPhone, setContactPhone,
  contactEmail, setContactEmail,
}: SettingsProps) {

  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<{ msg: string; onConfirm: () => void } | null>(null);

  const showToast = (msg: string) => setToast(msg);
  const askConfirm = (msg: string, cb: () => void) => setConfirm({ msg, onConfirm: cb });

  // ── Contacts ──────────────────────────────────────────────────────────────
  const [phoneInput, setPhoneInput] = useState(contactPhone);
  const [emailInput, setEmailInput] = useState(contactEmail);

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    setContactPhone(phoneInput);
    setContactEmail(emailInput);
    localStorage.setItem('dancela_contact_phone', phoneInput);
    localStorage.setItem('dancela_contact_email', emailInput);
    showToast('Контакты сохранены!');
  };

  // ── Trainers ─────────────────────────────────────────────────────────────
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tAchs, setTAchs] = useState('');
  const [tImg, setTImg] = useState('');

  const resetTrainer = () => { setTName(''); setTRole(''); setTDesc(''); setTAchs(''); setTImg(''); setEditingId(null); };

  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    const achievements = tAchs.split('\n').filter(a => a.trim());
    const imgUrl = tImg || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600';
    if (editingId) {
      setTrainers(prev => prev.map(t => t.id === editingId ? { ...t, name: tName, role: tRole, description: tDesc, achievements, imageUrl: imgUrl } : t));
      showToast('Тренер обновлён!');
    } else {
      setTrainers(prev => [...prev, { id: `trainer-${Date.now()}`, name: tName, role: tRole, description: tDesc, achievements, imageUrl: imgUrl }]);
      showToast('Тренер добавлен!');
    }
    resetTrainer();
  };

  const startEditTrainer = (t: Trainer) => {
    setEditingId(t.id); setTName(t.name); setTRole(t.role);
    setTDesc(t.description); setTAchs(t.achievements.join('\n')); setTImg(t.imageUrl);
  };

  // ── Prices ────────────────────────────────────────────────────────────────
  const [pTitle, setPTitle] = useState('');
  const [pCat, setPCat] = useState<PriceItem['category']>('kids');
  const [pVal, setPVal] = useState(0);
  const [pPeriod, setPPeriod] = useState('в месяц');
  const [pFeatures, setPFeatures] = useState('');
  const [pRec, setPRec] = useState(false);

  const resetPrice = () => { setPTitle(''); setPVal(0); setPPeriod('в месяц'); setPFeatures(''); setPRec(false); setEditingId(null); };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const features = pFeatures.split('\n').filter(f => f.trim());
    if (editingId) {
      setPrices(prev => prev.map(p => p.id === editingId ? { ...p, title: pTitle, category: pCat, price: pVal, period: pPeriod, features, isRecommended: pRec } : p));
      showToast('Тариф обновлён!');
    } else {
      setPrices(prev => [...prev, { id: `price-${Date.now()}`, title: pTitle, category: pCat, price: pVal, period: pPeriod, features, isRecommended: pRec }]);
      showToast('Тариф добавлен!');
    }
    resetPrice();
  };

  const startEditPrice = (p: PriceItem) => {
    setEditingId(p.id); setPTitle(p.title); setPCat(p.category);
    setPVal(p.price); setPPeriod(p.period); setPFeatures(p.features.join('\n')); setPRec(!!p.isRecommended);
  };

  // ── Schedule ──────────────────────────────────────────────────────────────
  const [sDay, setSDay] = useState('Понедельник');
  const [sTime, setSTime] = useState('');
  const [sGroup, setSGroup] = useState('');
  const [sTrainer, setSTrainer] = useState('');
  const [sLevel, setSLevel] = useState('Начинающие');

  const resetSchedule = () => { setSTime(''); setSGroup(''); setSTrainer(''); setEditingId(null); };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSchedule(prev => prev.map(s => s.id === editingId ? { ...s, day: sDay, time: sTime, groupName: sGroup, trainerName: sTrainer, level: sLevel } : s));
      showToast('Занятие обновлено!');
    } else {
      setSchedule(prev => [...prev, { id: `sched-${Date.now()}`, day: sDay, time: sTime, groupName: sGroup, trainerName: sTrainer, level: sLevel }]);
      showToast('Занятие добавлено!');
    }
    resetSchedule();
  };

  const startEditSchedule = (s: ScheduleItem) => {
    setEditingId(s.id); setSDay(s.day); setSTime(s.time); setSGroup(s.groupName); setSTrainer(s.trainerName); setSLevel(s.level);
  };

  // ── Gallery ───────────────────────────────────────────────────────────────
  const [gUrl, setGUrl] = useState('');
  const [gCaption, setGCaption] = useState('');
  const [gEditCaption, setGEditCaption] = useState('');
  const [gEditId, setGEditId] = useState<string | null>(null);

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gUrl.trim()) return;
    setGalleryItems(prev => [{ id: `gal-${Date.now()}`, url: gUrl.trim(), caption: gCaption || undefined }, ...prev]);
    setGUrl(''); setGCaption('');
    showToast('Фото добавлено!');
  };

  const handleUpdateCaption = (id: string) => {
    setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, caption: gEditCaption } : g));
    setGEditId(null); setGEditCaption('');
    showToast('Подпись обновлена!');
  };

  // ── News ──────────────────────────────────────────────────────────────────
  const [nTitle, setNTitle] = useState('');
  const [nContent, setNContent] = useState('');
  const [nCategory, setNCategory] = useState('Новости');
  const [nDate, setNDate] = useState(new Date().toISOString().slice(0, 10));
  const [nImage, setNImage] = useState('');

  const resetNews = () => { setNTitle(''); setNContent(''); setNCategory('Новости'); setNDate(new Date().toISOString().slice(0, 10)); setNImage(''); setEditingId(null); };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    const item: NewsItem = {
      id: editingId || `news-${Date.now()}`,
      title: nTitle, content: nContent, category: nCategory,
      date: nDate, imageUrl: nImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    };
    if (editingId) {
      setNews(prev => prev.map(n => n.id === editingId ? item : n));
      showToast('Новость обновлена!');
    } else {
      setNews(prev => [item, ...prev]);
      showToast('Новость добавлена!');
    }
    resetNews();
  };

  const startEditNews = (n: NewsItem) => {
    setEditingId(n.id); setNTitle(n.title); setNContent(n.content);
    setNCategory(n.category); setNDate(n.date); setNImage(n.imageUrl);
    setActiveTab('news');
  };

  // ── Tournaments ───────────────────────────────────────────────────────────
  const [toTitle, setToTitle] = useState('');
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [toLocation, setToLocation] = useState('');
  const [toDesc, setToDesc] = useState('');
  const [toImage, setToImage] = useState('');
  const [toStatus, setToStatus] = useState<Tournament['status']>('Предстоящий');

  const resetTournament = () => { setToTitle(''); setToDate(new Date().toISOString().slice(0, 10)); setToLocation(''); setToDesc(''); setToImage(''); setToStatus('Предстоящий'); setEditingId(null); };

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Tournament = {
      id: editingId || `tour-${Date.now()}`,
      title: toTitle, date: toDate, location: toLocation,
      description: toDesc, status: toStatus,
      imageUrl: toImage || 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
    };
    if (editingId) {
      setTournaments(prev => prev.map(t => t.id === editingId ? item : t));
      showToast('Турнир обновлён!');
    } else {
      setTournaments(prev => [item, ...prev]);
      showToast('Турнир добавлен!');
    }
    resetTournament();
  };

  const startEditTournament = (t: Tournament) => {
    setEditingId(t.id); setToTitle(t.title); setToDate(t.date); setToLocation(t.location);
    setToDesc(t.description); setToImage(t.imageUrl); setToStatus(t.status);
    setActiveTab('tournaments');
  };

  // ── Tab config ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'contacts', label: 'Контакты', icon: Phone },
    { id: 'trainers', label: 'Тренеры', icon: UserCheck, count: trainers.length },
    { id: 'prices', label: 'Тарифы', icon: CreditCard, count: prices.length },
    { id: 'schedule', label: 'Расписание', icon: Calendar, count: schedule.length },
    { id: 'gallery', label: 'Галерея', icon: ImageIcon, count: galleryItems.length },
    { id: 'news', label: 'Новости', icon: Newspaper, count: news.length },
    { id: 'tournaments', label: 'Турниры', icon: Trophy, count: tournaments.length },
  ];

  // ── Form panel wrapper ────────────────────────────────────────────────────
  const FormPanel = ({ title, onCancel, children }: { title: string; onCancel?: () => void; children: React.ReactNode }) => (
    <div className="bg-black/40 border border-white/8 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">{title}</h4>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );

  // ── Submit button ─────────────────────────────────────────────────────────
  const SubmitBtn = ({ label, editLabel }: { label: string; editLabel: string }) => (
    <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all shadow-lg shadow-amber-500/10">
      {editingId ? editLabel : label}
    </button>
  );

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 text-left min-h-screen">
      {toast && <Toast msg={toast} onHide={() => setToast('')} />}
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Панель администратора
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Управление сайтом
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Редактируйте весь контент студии: тренеры, тарифы, расписание, галерея, новости, турниры.
          </p>
        </div>

        {/* ── Editor Mode Toggle ── */}
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
              {editorMode
                ? <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                : <EyeOff className="w-4 h-4 text-slate-400" />
              }
              <span>Режим редактора: {editorMode ? <span className="text-amber-400">Включён</span> : <span className="text-slate-400">Выключен</span>}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Когда включён — посетители видят кнопки редактирования на всех страницах сайта. Выключайте перед показом клиентам.
            </p>
          </div>
          <button
            onClick={() => {
              const next = !editorMode;
              setEditorMode(next);
              localStorage.setItem('dancela_editor_mode', JSON.stringify(next));
            }}
            className={`px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all duration-300 active:scale-95 text-xs font-black uppercase tracking-wider shrink-0 ${
              editorMode
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
            }`}
          >
            {editorMode ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            <span>{editorMode ? 'Выключить' : 'Включить'}</span>
          </button>
        </div>

        {/* ── Main editor grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 block px-3 mb-2">Разделы</span>
            {tabs.map(({ id, label, icon: Icon, count }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setEditingId(null); }}
                  className={`py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-3 border ${
                    active
                      ? 'bg-amber-400 border-amber-400 text-black'
                      : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {count !== undefined && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${active ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-9 bg-white/[0.015] border border-white/8 rounded-3xl p-6 sm:p-8 min-h-[600px]">

            {/* ══════════ CONTACTS ══════════ */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Контактные данные</h3>
                  <p className="text-xs text-slate-400 mt-1">Автоматически обновляются в футере и на странице контактов.</p>
                </div>
                <form onSubmit={handleSaveContacts} className="space-y-4 max-w-md">
                  <Field label="Телефон / WhatsApp">
                    <input type="text" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+7 (706) 406-98-86" className={inputCls} required />
                  </Field>
                  <Field label="Email адрес">
                    <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Dancela2024@gmail.com" className={inputCls} required />
                  </Field>
                  <button type="submit" className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all">
                    Сохранить контакты
                  </button>
                </form>
              </div>
            )}

            {/* ══════════ TRAINERS ══════════ */}
            {activeTab === 'trainers' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Тренерский состав</h3>
                  <p className="text-xs text-slate-400 mt-1">Добавляйте и редактируйте преподавателей студии.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <form onSubmit={handleSaveTrainer}>
                    <FormPanel title={editingId ? 'Редактировать тренера' : 'Новый тренер'} onCancel={editingId ? resetTrainer : undefined}>
                      <Field label="ФИО">
                        <input value={tName} onChange={e => setTName(e.target.value)} placeholder="Карина Ким" className={inputCls} required />
                      </Field>
                      <Field label="Должность">
                        <input value={tRole} onChange={e => setTRole(e.target.value)} placeholder="Педагог детских групп" className={inputCls} required />
                      </Field>
                      <Field label="Фото (URL или оставьте пустым)">
                        <input value={tImg} onChange={e => setTImg(e.target.value)} placeholder="https://..." className={inputCls} />
                      </Field>
                      <Field label="Краткое описание">
                        <textarea rows={2} value={tDesc} onChange={e => setTDesc(e.target.value)} placeholder="Опытный педагог..." className={textareaCls} required />
                      </Field>
                      <Field label="Достижения (каждое с новой строки)">
                        <textarea rows={3} value={tAchs} onChange={e => setTAchs(e.target.value)} placeholder={"Мастер спорта РК\nПобедитель WDSF"} className={textareaCls} />
                      </Field>
                      <SubmitBtn label="Добавить тренера" editLabel="Сохранить изменения" />
                    </FormPanel>
                  </form>

                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {trainers.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-xs">Тренеры не добавлены</div>
                    )}
                    {trainers.map(t => (
                      <div key={t.id} className={`border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all ${editingId === t.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/6 bg-white/[0.01] hover:border-white/12'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={t.imageUrl} alt="" className="w-10 h-10 object-cover rounded-xl border border-white/8 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{t.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{t.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => startEditTrainer(t)} className="p-1.5 border border-white/8 hover:border-amber-500/30 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => askConfirm(`Удалить тренера «${t.name}»?`, () => setTrainers(prev => prev.filter(x => x.id !== t.id)))} className="p-1.5 border border-white/8 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ PRICES ══════════ */}
            {activeTab === 'prices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Тарифы и абонементы</h3>
                  <p className="text-xs text-slate-400 mt-1">Управляйте стоимостью занятий.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <form onSubmit={handleSavePrice}>
                    <FormPanel title={editingId ? 'Редактировать тариф' : 'Новый тариф'} onCancel={editingId ? resetPrice : undefined}>
                      <Field label="Название">
                        <input value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Дети — 12 занятий" className={inputCls} required />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Категория">
                          <select value={pCat} onChange={e => setPCat(e.target.value as PriceItem['category'])} className={inputCls}>
                            <option value="kids">Дети</option>
                            <option value="adults">Взрослые</option>
                            <option value="private">Индивидуальные</option>
                            <option value="sport">Спортсмены</option>
                            <option value="wedding">Свадебный</option>
                          </select>
                        </Field>
                        <Field label="Период">
                          <input value={pPeriod} onChange={e => setPPeriod(e.target.value)} placeholder="в месяц" className={inputCls} required />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-end">
                        <Field label="Стоимость (₸)">
                          <input type="number" value={pVal} onChange={e => setPVal(Number(e.target.value))} placeholder="35000" className={inputCls} required />
                        </Field>
                        <div className="flex items-center gap-2 pb-0.5">
                          <input type="checkbox" id="price-rec" checked={pRec} onChange={e => setPRec(e.target.checked)} className="accent-amber-400 w-4 h-4 cursor-pointer" />
                          <label htmlFor="price-rec" className="text-[10px] uppercase font-bold text-slate-400 cursor-pointer">Популярный</label>
                        </div>
                      </div>
                      <Field label="Включено (каждое с новой строки)">
                        <textarea rows={3} value={pFeatures} onChange={e => setPFeatures(e.target.value)} placeholder={"12 занятий в месяц\nОпытный тренер"} className={textareaCls} required />
                      </Field>
                      <SubmitBtn label="Добавить тариф" editLabel="Сохранить тариф" />
                    </FormPanel>
                  </form>

                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {prices.length === 0 && <div className="text-center py-12 text-slate-500 text-xs">Тарифы не добавлены</div>}
                    {prices.map(p => (
                      <div key={p.id} className={`border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all ${editingId === p.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/6 bg-white/[0.01] hover:border-white/12'}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-white truncate">{p.title}</p>
                            {p.isRecommended && <span className="text-[8px] uppercase font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded shrink-0">Хит</span>}
                          </div>
                          <p className="text-[10px] text-amber-400 font-mono mt-0.5">{p.price.toLocaleString('ru-RU')} ₸ {p.period}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => startEditPrice(p)} className="p-1.5 border border-white/8 hover:border-amber-500/30 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => askConfirm(`Удалить тариф «${p.title}»?`, () => setPrices(prev => prev.filter(x => x.id !== p.id)))} className="p-1.5 border border-white/8 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ SCHEDULE ══════════ */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Расписание занятий</h3>
                  <p className="text-xs text-slate-400 mt-1">Настройте дни, время, группы и тренеров.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <form onSubmit={handleSaveSchedule}>
                    <FormPanel title={editingId ? 'Редактировать занятие' : 'Новое занятие'} onCancel={editingId ? resetSchedule : undefined}>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="День недели">
                          <select value={sDay} onChange={e => setSDay(e.target.value)} className={inputCls}>
                            {['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </Field>
                        <Field label="Уровень">
                          <input value={sLevel} onChange={e => setSLevel(e.target.value)} placeholder="Начинающие" className={inputCls} required />
                        </Field>
                      </div>
                      <Field label="Время (напр. 15:00 - 16:30)">
                        <input value={sTime} onChange={e => setSTime(e.target.value)} placeholder="15:00 - 16:30" className={inputCls} required />
                      </Field>
                      <Field label="Название группы">
                        <input value={sGroup} onChange={e => setSGroup(e.target.value)} placeholder="Дети (Младшая группа)" className={inputCls} required />
                      </Field>
                      <Field label="Тренер">
                        <input value={sTrainer} onChange={e => setSTrainer(e.target.value)} placeholder="Карина Ким" className={inputCls} required />
                        {trainers.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {trainers.map(t => (
                              <button type="button" key={t.id} onClick={() => setSTrainer(t.name)} className="text-[9px] px-2 py-0.5 bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 text-slate-500 rounded-full border border-white/8 transition-all">
                                {t.name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        )}
                      </Field>
                      <SubmitBtn label="Добавить занятие" editLabel="Сохранить занятие" />
                    </FormPanel>
                  </form>

                  <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                    {schedule.length === 0 && <div className="text-center py-12 text-slate-500 text-xs">Расписание пусто</div>}
                    {schedule.map(s => (
                      <div key={s.id} className={`border rounded-xl p-3 flex items-start justify-between gap-2 transition-all ${editingId === s.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/6 bg-white/[0.01] hover:border-white/12'}`}>
                        <div className="min-w-0">
                          <span className="text-[8px] uppercase tracking-widest font-extrabold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded">{s.day}</span>
                          <p className="text-xs font-bold text-white mt-1 truncate">{s.groupName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{s.time} • {s.trainerName}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => startEditSchedule(s)} className="p-1.5 border border-white/8 hover:border-amber-500/30 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => askConfirm(`Удалить занятие «${s.groupName}»?`, () => setSchedule(prev => prev.filter(x => x.id !== s.id)))} className="p-1.5 border border-white/8 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ GALLERY ══════════ */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Фотогалерея</h3>
                  <p className="text-xs text-slate-400 mt-1">Добавляйте, подписывайте и удаляйте фотографии студии.</p>
                </div>

                <form onSubmit={handleAddGallery} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-black/40 border border-white/8 rounded-2xl p-4">
                  <div className="sm:col-span-5">
                    <Field label="URL фотографии">
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input value={gUrl} onChange={e => setGUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls + " pl-9"} required />
                      </div>
                    </Field>
                  </div>
                  <div className="sm:col-span-5">
                    <Field label="Подпись (необязательно)">
                      <input value={gCaption} onChange={e => setGCaption(e.target.value)} placeholder="Летние тренировки" className={inputCls} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs uppercase font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Добавить
                    </button>
                  </div>
                </form>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{galleryItems.length} фото в галерее</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {galleryItems.length === 0 && (
                    <div className="col-span-4 text-center py-16 text-slate-600 text-xs">Галерея пуста. Добавьте первое фото выше.</div>
                  )}
                  {galleryItems.map(g => (
                    <div key={g.id} className="relative group rounded-2xl overflow-hidden border border-white/8 bg-white/[0.01]">
                      <div className="aspect-square">
                        <img src={g.url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400'; }} />
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-2">
                        {gEditId === g.id ? (
                          <div className="w-full space-y-1.5">
                            <input
                              value={gEditCaption}
                              onChange={e => setGEditCaption(e.target.value)}
                              className="w-full bg-black/80 border border-amber-500/30 rounded-lg py-1.5 px-2.5 text-[10px] text-white outline-none"
                              placeholder="Подпись..."
                              autoFocus
                            />
                            <div className="flex gap-1">
                              <button onClick={() => handleUpdateCaption(g.id)} className="flex-1 py-1 bg-amber-400 text-black text-[9px] font-bold rounded-lg">Сохранить</button>
                              <button onClick={() => setGEditId(null)} className="flex-1 py-1 bg-white/10 text-white text-[9px] font-bold rounded-lg">Отмена</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-[9px] text-slate-300 text-center px-1 leading-snug">{g.caption || 'Без подписи'}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => { setGEditId(g.id); setGEditCaption(g.caption || ''); }}
                                className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 text-amber-300 rounded-lg transition-all"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => askConfirm('Удалить это фото из галереи?', () => setGalleryItems(prev => prev.filter(x => x.id !== g.id)))}
                                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ NEWS ══════════ */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Новости студии</h3>
                  <p className="text-xs text-slate-400 mt-1">Публикуйте объявления, события и достижения.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <form onSubmit={handleSaveNews}>
                    <FormPanel title={editingId ? 'Редактировать новость' : 'Новая новость'} onCancel={editingId ? resetNews : undefined}>
                      <Field label="Заголовок">
                        <input value={nTitle} onChange={e => setNTitle(e.target.value)} placeholder="Открытый кубок Dancela 2026" className={inputCls} required />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Категория">
                          <input value={nCategory} onChange={e => setNCategory(e.target.value)} placeholder="Новости" className={inputCls} required />
                        </Field>
                        <Field label="Дата">
                          <input type="date" value={nDate} onChange={e => setNDate(e.target.value)} className={inputCls} required />
                        </Field>
                      </div>
                      <Field label="Фото (URL)">
                        <input value={nImage} onChange={e => setNImage(e.target.value)} placeholder="https://..." className={inputCls} />
                      </Field>
                      <Field label="Текст новости">
                        <textarea rows={4} value={nContent} onChange={e => setNContent(e.target.value)} placeholder="Текст статьи или объявления..." className={textareaCls} required />
                      </Field>
                      <SubmitBtn label="Опубликовать новость" editLabel="Сохранить новость" />
                    </FormPanel>
                  </form>

                  <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                    {news.length === 0 && <div className="text-center py-16 text-slate-500 text-xs">Новостей пока нет</div>}
                    {news.map(n => (
                      <div key={n.id} className={`border rounded-xl overflow-hidden transition-all ${editingId === n.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/6 bg-white/[0.01] hover:border-white/12'}`}>
                        <div className="flex gap-3 p-3">
                          <img src={n.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg border border-white/8 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => startEditNews(n)} className="p-1.5 border border-white/8 hover:border-amber-500/30 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3 h-3" /></button>
                                <button onClick={() => askConfirm(`Удалить новость «${n.title}»?`, () => setNews(prev => prev.filter(x => x.id !== n.id)))} className="p-1.5 border border-white/8 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-1">{n.category} • {new Date(n.date).toLocaleDateString('ru-RU')}</p>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{n.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ TOURNAMENTS ══════════ */}
            {activeTab === 'tournaments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Турниры и соревнования</h3>
                  <p className="text-xs text-slate-400 mt-1">Анонсируйте предстоящие турниры и архивируйте прошедшие.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <form onSubmit={handleSaveTournament}>
                    <FormPanel title={editingId ? 'Редактировать турнир' : 'Новый турнир'} onCancel={editingId ? resetTournament : undefined}>
                      <Field label="Название турнира">
                        <input value={toTitle} onChange={e => setToTitle(e.target.value)} placeholder="Открытый кубок Астаны 2026" className={inputCls} required />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Дата">
                          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inputCls} required />
                        </Field>
                        <Field label="Статус">
                          <select value={toStatus} onChange={e => setToStatus(e.target.value as Tournament['status'])} className={inputCls}>
                            <option value="Предстоящий">Предстоящий</option>
                            <option value="Регистрация открыта">Регистрация открыта</option>
                            <option value="Прошедший">Прошедший</option>
                          </select>
                        </Field>
                      </div>
                      <Field label="Место проведения">
                        <input value={toLocation} onChange={e => setToLocation(e.target.value)} placeholder="Астана, Дворец Независимости" className={inputCls} required />
                      </Field>
                      <Field label="Фото (URL)">
                        <input value={toImage} onChange={e => setToImage(e.target.value)} placeholder="https://..." className={inputCls} />
                      </Field>
                      <Field label="Описание">
                        <textarea rows={3} value={toDesc} onChange={e => setToDesc(e.target.value)} placeholder="Традиционный турнир по латиноамериканской программе..." className={textareaCls} required />
                      </Field>
                      <SubmitBtn label="Добавить турнир" editLabel="Сохранить турнир" />
                    </FormPanel>
                  </form>

                  <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                    {tournaments.length === 0 && <div className="text-center py-16 text-slate-500 text-xs">Турниры не добавлены</div>}
                    {tournaments.map(t => (
                      <div key={t.id} className={`border rounded-xl overflow-hidden transition-all ${editingId === t.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/6 bg-white/[0.01] hover:border-white/12'}`}>
                        <div className="flex gap-3 p-3">
                          <img src={t.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg border border-white/8 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-white leading-tight">{t.title}</p>
                                <span className={`text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block ${
                                  t.status === 'Регистрация открыта' ? 'bg-emerald-500/20 text-emerald-400' :
                                  t.status === 'Предстоящий' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-white/8 text-slate-500'
                                }`}>{t.status}</span>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => startEditTournament(t)} className="p-1.5 border border-white/8 hover:border-amber-500/30 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3 h-3" /></button>
                                <button onClick={() => askConfirm(`Удалить турнир «${t.title}»?`, () => setTournaments(prev => prev.filter(x => x.id !== t.id)))} className="p-1.5 border border-white/8 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-1">{new Date(t.date).toLocaleDateString('ru-RU')} • {t.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
