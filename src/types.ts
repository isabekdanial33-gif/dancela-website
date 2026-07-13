export interface Trainer {
  id: string;
  name: string;
  role: string;
  description: string;
  achievements: string[];
  imageUrl: string;
}

export interface PriceItem {
  id: string;
  title: string;
  category: 'kids' | 'adults' | 'private' | 'sport' | 'wedding';
  price: number;
  period: string;
  features: string[];
  isRecommended?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  status: 'Предстоящий' | 'Регистрация открыта' | 'Прошедший';
}

export interface ScheduleItem {
  id: string;
  day: string; // "Понедельник", "Вторник", etc.
  time: string; // "15:00 - 16:30"
  groupName: string; // e.g. "Дети 1 (Начинающие)"
  trainerName: string; // e.g. "Карина Ким"
  level: string; // "Начинающие", "Профи"
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  phoneNumber?: string;
  bookedLessons?: { id: string; date: string; time: string; title: string }[];
}

// Prefilled default data
export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: '1',
    name: 'Айзат Ержанович',
    role: 'Руководитель студии, главный тренер',
    description: 'Основатель студии Dancela. Воспитывает чемпионов и развивает спортивно-бальные танцы в Казахстане.',
    achievements: [
      'Мастер спорта Республики Казахстан по спортивным бальным танцам',
      'Многократный чемпион Казахстана',
      'Победитель международных турниров WDSF'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Милана Тамарина',
    role: 'Ведущий педагог',
    description: 'Высококлассный специалист, помогающий раскрыть индивидуальность каждого ученика.',
    achievements: [
      'Мастер спорта Республики Казахстан',
      'Финалистка и призёр чемпионатов Казахстана',
      'Победитель международных турниров WDSF',
      'Специализируется на технике, музыкальности и эмоциональной подаче танца'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Мирас Мейрамович',
    role: 'Тренер',
    description: 'Действующий профессиональный спортсмен, передающий актуальные мировые методики.',
    achievements: [
      'Действующий спортсмен',
      'Многократный чемпион Казахстана',
      'Финалист международных соревнований',
      'Работает со спортсменами высокого уровня'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Карина Ким',
    role: 'Педагог детских групп',
    description: 'Заботливый и вдохновляющий тренер, открывающий мир танца для самых маленьких.',
    achievements: [
      'Специалист по обучению детей',
      'Развивает координацию, чувство ритма и дисциплину',
      'Индивидуальный игровой подход к обучению'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_PRICES: PriceItem[] = [
  {
    id: 'p1',
    title: 'Дети — 8 занятий',
    category: 'kids',
    price: 30000,
    period: 'в месяц',
    features: [
      '8 групповых занятий',
      'Профессиональные тренеры',
      'Развитие чувства ритма и координации',
      'Участие в клубных мероприятиях',
      'Современные залы в Esil Plaza'
    ]
  },
  {
    id: 'p2',
    title: 'Дети — 12 занятий',
    category: 'kids',
    price: 35000,
    period: 'в месяц',
    features: [
      '12 групповых занятий',
      'Профессиональные тренеры',
      'Подготовка к первым соревнованиям',
      'Индивидуальный подход к ребенку',
      'Дружелюбная атмосфера',
      'Возможность участия в турнирах'
    ],
    isRecommended: true
  },
  {
    id: 'p3',
    title: 'Взрослые — 12 занятий',
    category: 'adults',
    price: 40000,
    period: 'в месяц',
    features: [
      '12 групповых занятий',
      'Обучение латиноамериканской и европейской программе',
      'Современные оборудованные залы',
      'Подтянутая фигура и отличная осанка',
      'Гибкое расписание',
      'Дружелюбная творческая атмосфера'
    ],
    isRecommended: true
  },
  {
    id: 'p4',
    title: 'Индивидуальные занятия',
    category: 'private',
    price: 15000,
    period: 'за 1 занятие',
    features: [
      'Персональная тренировка с любым тренером',
      '100% фокус на вашей технике и балансе',
      'Удобное время по согласованию',
      'Быстрый прогресс для соревнований',
      'Персональный разбор ошибок'
    ]
  },
  {
    id: 'p5',
    title: 'Спортивная подготовка Pro',
    category: 'sport',
    price: 55000,
    period: 'в месяц',
    features: [
      'Безлимитный доступ к практике в залах',
      'Специализированные тренировки по ОФП',
      'Индивидуальное ведение спортивной карьеры',
      'Подготовка к международным турнирам WDSF',
      'Регулярные мастер-классы от судей'
    ]
  },
  {
    id: 'p6',
    title: 'Постановка свадебного танца',
    category: 'wedding',
    price: 60000,
    period: 'курс из 5 занятий',
    features: [
      'Уникальная хореография под вашу музыку',
      'Адаптация под любой уровень подготовки',
      'Помощь в выборе композиции',
      'Репетиция в свадебных туфлях',
      'Красивые видеозаписи репетиций'
    ]
  }
];

export const INITIAL_NEWS: NewsItem[] = [];

export const INITIAL_TOURNAMENTS: Tournament[] = [];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 's1', day: 'Понедельник', time: '15:00 - 16:00', groupName: 'Дети (Младшая группа)', trainerName: 'Карина Ким', level: 'Начинающие' },
  { id: 's2', day: 'Понедельник', time: '16:30 - 18:00', groupName: 'Дети (Спортивная группа)', trainerName: 'Айзат Ержанович', level: 'Спортсмены' },
  { id: 's3', day: 'Понедельник', time: '19:00 - 20:30', groupName: 'Взрослые (Хобби Латина)', trainerName: 'Милана Тамарина', level: 'Все уровни' },
  
  { id: 's4', day: 'Вторник', time: '16:00 - 17:30', groupName: 'Юниоры (Стандарт)', trainerName: 'Мирас Мейрамович', level: 'Спортсмены' },
  { id: 's5', day: 'Вторник', time: '19:00 - 20:30', groupName: 'Взрослые (Европейская программа)', trainerName: 'Айзат Ержанович', level: 'Все уровни' },
  
  { id: 's6', day: 'Среда', time: '15:00 - 16:00', groupName: 'Дети (Младшая группа)', trainerName: 'Карина Ким', level: 'Начинающие' },
  { id: 's7', day: 'Среда', time: '16:30 - 18:00', groupName: 'Дети (Спортивная группа)', trainerName: 'Айзат Ержанович', level: 'Спортсмены' },
  { id: 's8', day: 'Среда', time: '19:00 - 20:30', groupName: 'Взрослые (Хобби Латина)', trainerName: 'Милана Тамарина', level: 'Все уровни' },
  
  { id: 's9', day: 'Четверг', time: '16:00 - 17:30', groupName: 'Юниоры (Стандарт)', trainerName: 'Мирас Мейрамович', level: 'Спортсмены' },
  { id: 's10', day: 'Четверг', time: '19:00 - 20:30', groupName: 'Взрослые (Европейская программа)', trainerName: 'Айзат Ержанович', level: 'Все уровни' },
  
  { id: 's11', day: 'Пятница', time: '15:00 - 16:00', groupName: 'Дети (Младшая группа)', trainerName: 'Карина Ким', level: 'Начинающие' },
  { id: 's12', day: 'Пятница', time: '16:30 - 18:00', groupName: 'Дети (Спортивная группа)', trainerName: 'Айзат Ержанович', level: 'Спортсмены' },
  { id: 's13', day: 'Пятница', time: '18:30 - 20:00', groupName: 'Спортивная подготовка Pro', trainerName: 'Мирас Мейрамович', level: 'Спортсмены' },
  
  { id: 's14', day: 'Суббота', time: '10:00 - 12:00', groupName: 'Индивидуальные практики', trainerName: 'Все преподаватели', level: 'По записи' },
  { id: 's15', day: 'Суббота', time: '12:30 - 14:00', groupName: 'Постановка свадебного танца', trainerName: 'Милана Тамарина', level: 'Индивидуально' }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', caption: 'Открытый кубок Dancela 2026' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', caption: 'Тренировочные сборы детской команды' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800', caption: 'Выступление взрослой группы Хобби-Латина' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', caption: 'Торжественный вальс победителей' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', caption: 'Атмосфера в зале Esil Plaza' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800', caption: 'Судейская коллегия турнира' }
];
