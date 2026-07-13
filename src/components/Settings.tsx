import React, { useState } from 'react';
import { 
  Trainer, PriceItem, ScheduleItem, GalleryItem, NewsItem, Tournament 
} from '../types';
import { 
  Sparkles, ToggleLeft, ToggleRight, Edit2, Trash2, Plus, Save, Phone, Mail, 
  UserCheck, CreditCard, Calendar, Image as ImageIcon, AlertCircle, Eye, EyeOff, ShieldAlert
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
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
}

export default function Settings({
  editorMode,
  setEditorMode,
  trainers,
  setTrainers,
  prices,
  setPrices,
  schedule,
  setSchedule,
  galleryItems,
  setGalleryItems,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail
}: SettingsProps) {
  
  const [activeEditorTab, setActiveEditorTab] = useState<'contacts' | 'trainers' | 'prices' | 'schedule' | 'gallery' | 'news_tours'>('contacts');
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- 1. Contacts Editor States ---
  const [phoneInput, setPhoneInput] = useState(contactPhone);
  const [emailInput, setEmailInput] = useState(contactEmail);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');

  // --- 2. Trainer Form States ---
  const [trainerName, setTrainerName] = useState('');
  const [trainerRole, setTrainerRole] = useState('');
  const [trainerDesc, setTrainerDesc] = useState('');
  const [trainerAchievements, setTrainerAchievements] = useState('');
  const [trainerImage, setTrainerImage] = useState('');

  // --- 3. Price Form States ---
  const [priceTitle, setPriceTitle] = useState('');
  const [priceCategory, setPriceCategory] = useState<'kids' | 'adults' | 'private' | 'sport' | 'wedding'>('kids');
  const [priceVal, setPriceVal] = useState<number>(0);
  const [pricePeriod, setPricePeriod] = useState('в месяц');
  const [priceFeatures, setPriceFeatures] = useState('');
  const [priceRec, setPriceRec] = useState(false);

  // --- 4. Schedule Form States ---
  const [schedDay, setSchedDay] = useState('Понедельник');
  const [schedTime, setSchedTime] = useState('');
  const [schedGroup, setSchedGroup] = useState('');
  const [schedTrainer, setSchedTrainer] = useState('');
  const [schedLevel, setSchedLevel] = useState('Начинающие');

  // --- 5. Gallery Form States ---
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');

  // --- Handlers: Contacts ---
  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    setContactPhone(phoneInput);
    setContactEmail(emailInput);
    localStorage.setItem('dancela_contact_phone', phoneInput);
    localStorage.setItem('dancela_contact_email', emailInput);
    setContactSuccessMsg('Контакты успешно сохранены!');
    setTimeout(() => setContactSuccessMsg(''), 3000);
  };

  // --- Handlers: Trainer CRUD ---
  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    const achs = trainerAchievements.split('\n').filter(a => a.trim() !== '');
    if (editingId) {
      setTrainers(prev => prev.map(t => t.id === editingId ? {
        ...t, name: trainerName, role: trainerRole, description: trainerDesc, achievements: achs, imageUrl: trainerImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
      } : n => n));
      setEditingId(null);
    } else {
      const newTrainer: Trainer = {
        id: `trainer-${Date.now()}`,
        name: trainerName,
        role: trainerRole,
        description: trainerDesc,
        achievements: achs,
        imageUrl: trainerImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
      };
      setTrainers(prev => [...prev, newTrainer]);
    }
    setTrainerName(''); setTrainerRole(''); setTrainerDesc(''); setTrainerAchievements(''); setTrainerImage('');
  };

  const startEditTrainer = (t: Trainer) => {
    setEditingId(t.id);
    setTrainerName(t.name);
    setTrainerRole(t.role);
    setTrainerDesc(t.description);
    setTrainerAchievements(t.achievements.join('\n'));
    setTrainerImage(t.imageUrl);
  };

  const handleDeleteTrainer = (id: string) => {
    if (confirm('Удалить этого тренера?')) {
      setTrainers(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- Handlers: Price CRUD ---
  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const feats = priceFeatures.split('\n').filter(f => f.trim() !== '');
    if (editingId) {
      setPrices(prev => prev.map(p => p.id === editingId ? {
        ...p, title: priceTitle, category: priceCategory, price: Number(priceVal), period: pricePeriod, features: feats, isRecommended: priceRec
      } : p));
      setEditingId(null);
    } else {
      const newP: PriceItem = {
        id: `price-${Date.now()}`,
        title: priceTitle,
        category: priceCategory,
        price: Number(priceVal),
        period: pricePeriod,
        features: feats,
        isRecommended: priceRec
      };
      setPrices(prev => [...prev, newP]);
    }
    setPriceTitle(''); setPriceVal(0); setPricePeriod('в месяц'); setPriceFeatures(''); setPriceRec(false);
  };

  const startEditPrice = (p: PriceItem) => {
    setEditingId(p.id);
    setPriceTitle(p.title);
    setPriceCategory(p.category);
    setPriceVal(p.price);
    setPricePeriod(p.period);
    setPriceFeatures(p.features.join('\n'));
    setPriceRec(!!p.isRecommended);
  };

  const handleDeletePrice = (id: string) => {
    if (confirm('Удалить этот тариф?')) {
      setPrices(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- Handlers: Schedule CRUD ---
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSchedule(prev => prev.map(s => s.id === editingId ? {
        ...s, day: schedDay, time: schedTime, groupName: schedGroup, trainerName: schedTrainer, level: schedLevel
      } : s));
      setEditingId(null);
    } else {
      const newS: ScheduleItem = {
        id: `sched-${Date.now()}`,
        day: schedDay,
        time: schedTime,
        groupName: schedGroup,
        trainerName: schedTrainer,
        level: schedLevel
      };
      setSchedule(prev => [...prev, newS]);
    }
    setSchedTime(''); setSchedGroup(''); setSchedTrainer('');
  };

  const startEditSched = (s: ScheduleItem) => {
    setEditingId(s.id);
    setSchedDay(s.day);
    setSchedTime(s.time);
    setSchedGroup(s.groupName);
    setSchedTrainer(s.trainerName);
    setSchedLevel(s.level);
  };

  const handleDeleteSched = (id: string) => {
    if (confirm('Удалить это занятие из расписания?')) {
      setSchedule(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Handlers: Gallery CRUD ---
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galUrl) return;
    const newG: GalleryItem = {
      id: `gal-${Date.now()}`,
      url: galUrl,
      caption: galCaption || undefined
    };
    setGalleryItems(prev => [newG, ...prev]);
    setGalUrl(''); setGalCaption('');
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Удалить этот снимок из галереи?')) {
      setGalleryItems(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Панель Настроек</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Настройки и управление
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Переключайте режимы отображения сайта и управляйте всем контентом в одном месте.
          </p>
        </div>

        {/* --- MODE SWITCH BOARD (STUNNING BOX) --- */}
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
              {editorMode ? <Eye className="w-5 h-5 text-amber-400 animate-pulse" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
              <span>Текущий режим: {editorMode ? 'Режим редактора' : 'Обычный режим'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              В <strong className="text-amber-400">Режиме редактора</strong> вы получаете доступ к удобным инструментам изменения контента. В <strong className="text-slate-300">Обычном режиме</strong> сайт выглядит как идеальный презентационный портал для клиентов и не мешает просмотру лишними кнопками.
            </p>
          </div>

          <button
            onClick={() => {
              const nextMode = !editorMode;
              setEditorMode(nextMode);
              localStorage.setItem('dancela_editor_mode', JSON.stringify(nextMode));
            }}
            className={`px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all duration-300 active:scale-95 text-xs font-black uppercase tracking-wider ${
              editorMode 
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20' 
                : 'bg-white/5 border border-white/10 hover:border-white/20 text-slate-300'
            }`}
          >
            <span>{editorMode ? 'Выключить редактор' : 'Включить редактор'}</span>
            {editorMode ? <ToggleRight className="w-6 h-6 shrink-0" /> : <ToggleLeft className="w-6 h-6 shrink-0" />}
          </button>
        </div>

        {/* --- IF EDITOR MODE ACTIVE, SHOW INTERACTIVE TABS --- */}
        {editorMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left sidebar tabs (col-span-3) */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 block px-3 mb-2">Разделы для редактирования</span>
              {[
                { id: 'contacts', label: 'Контакты', icon: Phone },
                { id: 'trainers', label: 'Тренеры', icon: UserCheck },
                { id: 'prices', label: 'Стоимость / Тарифы', icon: CreditCard },
                { id: 'schedule', label: 'Расписание', icon: Calendar },
                { id: 'gallery', label: 'Галерея', icon: ImageIcon },
                { id: 'news_tours', label: 'Новости и Турниры', icon: ShieldAlert }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSel = activeEditorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveEditorTab(tab.id as any);
                      setEditingId(null);
                    }}
                    className={`py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-3 border ${
                      isSel
                        ? 'bg-amber-400 border-amber-400 text-black font-black'
                        : 'text-slate-300 border-transparent hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right main board (col-span-9) */}
            <div className="lg:col-span-9 bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8">
              
              {/* CONTACTS EDITOR */}
              {activeEditorTab === 'contacts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Редактор контактных данных</h3>
                    <p className="text-xs text-slate-400 mt-1">Эти данные будут автоматически изменены в футере и на странице контактов в реальном времени.</p>
                  </div>

                  {contactSuccessMsg && (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{contactSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveContacts} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Номер телефона / WhatsApp:</label>
                      <input 
                        type="text" 
                        value={phoneInput} 
                        onChange={e => setPhoneInput(e.target.value)} 
                        placeholder="+7 (706) 406-98-86" 
                        className="w-full bg-black/50 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200"
                        required 
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Электронная Почта (Email):</label>
                      <input 
                        type="email" 
                        value={emailInput} 
                        onChange={e => setEmailInput(e.target.value)} 
                        placeholder="Dancela2024@gmail.com" 
                        className="w-full bg-black/50 border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-200"
                        required 
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Используется, если клиент хочет написать вам напрямую.</p>
                    </div>

                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
                    >
                      Сохранить изменения
                    </button>
                  </form>
                </div>
              )}

              {/* TRAINERS EDITOR */}
              {activeEditorTab === 'trainers' && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Управление тренерским составом</h3>
                    <p className="text-xs text-slate-400 mt-1">Добавляйте новых преподавателей или редактируйте текущих мастеров спорта.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSaveTrainer} className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                      <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-2">{editingId ? 'Редактировать тренера' : 'Добавить тренера'}</h4>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">ФИО тренера:</label>
                        <input type="text" value={trainerName} onChange={e => setTrainerName(e.target.value)} placeholder="Мирас Мейрамович" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Должность / Специализация:</label>
                        <input type="text" value={trainerRole} onChange={e => setTrainerRole(e.target.value)} placeholder="Старший тренер" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Фото (URL):</label>
                        <input type="text" value={trainerImage} onChange={e => setTrainerImage(e.target.value)} placeholder="https://unsplash..." className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Краткое описание:</label>
                        <textarea rows={2} value={trainerDesc} onChange={e => setTrainerDesc(e.target.value)} placeholder="Квалифицированный специалист..." className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none resize-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Достижения (каждое с новой строки):</label>
                        <textarea rows={2} value={trainerAchievements} onChange={e => setTrainerAchievements(e.target.value)} placeholder="Мастер спорта РК&#10;Судья национальной категории" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none resize-none" />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all hover:bg-amber-300">
                        {editingId ? 'Сохранить изменения' : 'Добавить на сайт'}
                      </button>
                    </form>

                    {/* Trainers List */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Текущий состав:</h4>
                      {trainers.map(t => (
                        <div key={t.id} className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={t.imageUrl} alt="" className="w-9 h-9 object-cover rounded-full border border-white/5" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white">{t.name}</p>
                              <p className="text-[10px] text-slate-500">{t.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => startEditTrainer(t)} className="p-1.5 border border-white/5 hover:border-amber-500/20 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteTrainer(t.id)} className="p-1.5 border border-white/5 hover:border-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PRICES EDITOR */}
              {activeEditorTab === 'prices' && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Управление тарифами</h3>
                    <p className="text-xs text-slate-400 mt-1">Редактируйте стоимость абонементов, групповых и индивидуальных тренировок.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSavePrice} className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                      <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-2">{editingId ? 'Редактировать тариф' : 'Добавить тариф'}</h4>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Название абонемента:</label>
                        <input type="text" value={priceTitle} onChange={e => setPriceTitle(e.target.value)} placeholder="Дети — 12 занятий" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Категория:</label>
                          <select value={priceCategory} onChange={e => setPriceCategory(e.target.value as any)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none">
                            <option value="kids">Дети</option>
                            <option value="adults">Взрослые</option>
                            <option value="private">Индивидуальные</option>
                            <option value="sport">Спортсмены</option>
                            <option value="wedding">Свадебный танец</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Период:</label>
                          <input type="text" value={pricePeriod} onChange={e => setPricePeriod(e.target.value)} placeholder="в месяц" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Стоимость (₸):</label>
                          <input type="number" value={priceVal} onChange={e => setPriceVal(Number(e.target.value))} placeholder="35000" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input type="checkbox" id="rec-price-set" checked={priceRec} onChange={e => setPriceRec(e.target.checked)} className="accent-amber-400 h-4 w-4" />
                          <label htmlFor="rec-price-set" className="text-[10px] uppercase font-bold text-slate-400 cursor-pointer">Популярный</label>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Преимущества (каждое с новой строки):</label>
                        <textarea rows={2} value={priceFeatures} onChange={e => setPriceFeatures(e.target.value)} placeholder="12 групповых занятий&#10;Опытный тренер" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none resize-none" required />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all hover:bg-amber-300">
                        {editingId ? 'Сохранить тариф' : 'Добавить тариф'}
                      </button>
                    </form>

                    {/* Tariffs List */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Текущие тарифы:</h4>
                      {prices.map(p => (
                        <div key={p.id} className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                          <div className="text-left">
                            <p className="text-xs font-bold text-white">{p.title}</p>
                            <p className="text-[10px] text-amber-400 font-mono">{p.price.toLocaleString('ru-RU')} ₸ / {p.period}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => startEditPrice(p)} className="p-1.5 border border-white/5 hover:border-amber-500/20 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeletePrice(p.id)} className="p-1.5 border border-white/5 hover:border-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCHEDULE EDITOR */}
              {activeEditorTab === 'schedule' && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Редактор Расписания</h3>
                    <p className="text-xs text-slate-400 mt-1">Редактируйте дни, часы проведения тренировок, группы и ведущих тренеров.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSaveSchedule} className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                      <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-2">{editingId ? 'Редактировать занятие' : 'Добавить занятие'}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">День недели:</label>
                          <select value={schedDay} onChange={e => setSchedDay(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none">
                            <option value="Понедельник">Понедельник</option>
                            <option value="Вторник">Вторник</option>
                            <option value="Среда">Среда</option>
                            <option value="Четверг">Четверг</option>
                            <option value="Пятница">Пятница</option>
                            <option value="Суббота">Суббота</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Уровень / Описание:</label>
                          <input type="text" value={schedLevel} onChange={e => setSchedLevel(e.target.value)} placeholder="Начинающие" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Время проведения:</label>
                        <input type="text" value={schedTime} onChange={e => setSchedTime(e.target.value)} placeholder="15:00 - 16:00" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Название группы:</label>
                        <input type="text" value={schedGroup} onChange={e => setSchedGroup(e.target.value)} placeholder="Дети (Младшая группа)" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">ФИО тренера:</label>
                        <input type="text" value={schedTrainer} onChange={e => setSchedTrainer(e.target.value)} placeholder="Карина Ким" className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all hover:bg-amber-300">
                        {editingId ? 'Сохранить изменения' : 'Добавить занятие'}
                      </button>
                    </form>

                    {/* Classes list */}
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Запланированные уроки:</h4>
                      {schedule.map(s => (
                        <div key={s.id} className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">{s.day}</span>
                            <p className="text-xs font-bold text-white mt-1.5">{s.groupName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{s.time} • {s.trainerName}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => startEditSched(s)} className="p-1.5 border border-white/5 hover:border-amber-500/20 hover:text-amber-400 text-slate-400 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteSched(s.id)} className="p-1.5 border border-white/5 hover:border-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GALLERY EDITOR */}
              {activeEditorTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Редактор фотогалереи</h3>
                    <p className="text-xs text-slate-400 mt-1">Добавляйте ссылки на фотографии, которые украсят галерею студии Dancela.</p>
                  </div>

                  <form onSubmit={handleSaveGallery} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5 items-end">
                    <div className="md:col-span-6">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Ссылка на фото (URL):</label>
                      <input type="text" value={galUrl} onChange={e => setGalUrl(e.target.value)} placeholder="https://images.unsplash..." className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:border-amber-500/50 outline-none" required />
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Подпись / Название:</label>
                      <input type="text" value={galCaption} onChange={e => setGalCaption(e.target.value)} placeholder="Летние тренировки" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:border-amber-500/50 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" className="w-full py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all hover:bg-amber-300">
                        Добавить
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {galleryItems.map(g => (
                      <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/5">
                        <img src={g.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                          <p className="text-[10px] font-bold text-white truncate max-w-[120px] mb-2">{g.caption || 'Без подписи'}</p>
                          <button 
                            onClick={() => handleDeleteGallery(g.id)}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 hover:text-red-100 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEWS AND TOURNAMENTS SYSTEM BLOCK */}
              {activeEditorTab === 'news_tours' && (
                <div className="space-y-6 text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white uppercase tracking-tight">Доступ к разделу временно закрыт</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Добавление, редактирование или удаление новостей и турниров временно отключено согласно установленным требованиям безопасности. На данный момент эти разделы пусты. Пожалуйста, ожидайте дальнейших сообщений от администрации.
                  </p>
                  <div className="max-w-xs mx-auto border-t border-white/5 pt-4 mt-6 text-[10px] uppercase font-bold text-amber-400 tracking-widest">
                    Только для администраторов системы
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Normal mode message */
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <EyeOff className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Обычный режим активен</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Вы успешно переключились на презентационный режим. На страницах тренеров, стоимости, расписания и галереи теперь скрыты все кнопки редактирования, чтобы обеспечить максимально эстетичный и профессиональный просмотр для пользователей.
            </p>
            <button
              onClick={() => {
                setEditorMode(true);
                localStorage.setItem('dancela_editor_mode', JSON.stringify(true));
              }}
              className="mt-6 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Перейти в режим редактора
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
