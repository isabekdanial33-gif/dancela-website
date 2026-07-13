import React from 'react';
import { Award, Star, Compass, Clock, Check, Users } from 'lucide-react';

interface StylesProps {
  setCurrentPage: (page: string) => void;
}

export default function Styles({ setCurrentPage }: StylesProps) {
  const categories = [
    {
      id: 'kids',
      title: 'Детские группы',
      age: 'от 4 до 15 лет',
      description: 'Развитие координации, гибкости, чувства ритма и дисциплины с раннего детства. Обучение включает базовые шаги европейской и латиноамериканской программы, ОФП и подготовку к детским спортивным турнирам.',
      details: [
        'Игровой подход для самых маленьких',
        'Быстрое физическое и музыкальное развитие',
        'Подготовка к получению спортивных разрядов',
        'Индивидуальный контроль тренера за осанкой ребенка'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'adults',
      title: 'Взрослые группы (Хобби)',
      age: 'без возрастных ограничений',
      description: 'Идеальное направление для тех, кто хочет научиться танцевать «для себя». Развитие грации, великолепной осанки, уверенности и пластики. Разучиваем зажигательную латину (ча-ча-ча, самба, румба, джайв) и благородный стандарт (медленный вальс, танго, квикстеп).',
      details: [
        'Обучение с абсолютного нуля',
        'Прекрасный способ снятия стресса и кардионагрузки',
        'Дружелюбное творческое комьюнити единомышленников',
        'Возможность участия в турнирах категории Pro-Am'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'sport',
      title: 'Спортивная подготовка Pro',
      age: 'для действующих спортсменов',
      description: 'Углубленный курс спортивного мастерства для профессиональных танцевальных дуэтов и соло-исполнителей. Интенсивная подготовка к чемпионатам Республики Казахстан и крупным международным турнирам WDSF.',
      details: [
        'Разбор сложнейших технических концепций',
        'Специализированные тренировки по физической выносливости',
        'Лекции по судейской системе, актерскому мастерству и имиджу',
        'Индивидуальные сборы и мастер-классы от топовых тренеров'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'private',
      title: 'Индивидуальные занятия',
      age: 'любой возраст и уровень',
      description: 'Максимально эффективный формат обучения. Все внимание тренера направлено только на вас. Индивидуальный разбор механики вашего тела, коррекция баланса, исправление ошибок и постановка уникальной индивидуальной хореографии.',
      details: [
        '100% фокус тренера на ваших целях',
        'Ускоренное освоение танцевальных фигур (в 3-4 раза быстрее)',
        'Гибкий график занятий, адаптированный под вас',
        'Подготовка индивидуальных шоу-номеров'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'wedding',
      title: 'Постановка свадебного танца',
      age: 'для молодоженов',
      description: 'Создание волшебного первого танца молодой пары. Поставим уникальный и запоминающийся танец (нежный вальс, страстное танго или динамичный микс) под выбранную вами музыку всего за несколько уроков.',
      details: [
        'Индивидуальная хореография любой сложности',
        'Адаптация под особенности вашего платья и площадки',
        'Обучение даже при полном отсутствии опыта танцев',
        'Комфортная атмосфера без лишнего стресса'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold">Танцевальные программы</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3 uppercase">
            Направления обучения
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            В Dancela мы разработали эффективные программы для людей любого возраста и целей — от фитнеса и удовольствия до профессионального спорта высоких достижений.
          </p>
        </div>

        {/* --- List of categories in premium cards --- */}
        <div className="flex flex-col gap-16">
          {categories.map((cat, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={cat.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b border-white/5 pb-16 last:border-0 last:pb-0`}
              >
                {/* Image panel */}
                <div className={`lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/5 aspect-[4/3] group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Text description panel */}
                <div className={`lg:col-span-7 flex flex-col gap-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">{cat.title}</h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {cat.age}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {cat.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to actions for styles */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={() => setCurrentPage('contacts')}
                      className="px-6 py-3 bg-white text-black hover:bg-amber-400 text-[11px] uppercase tracking-widest font-black rounded-full transition-all duration-300"
                    >
                      Записаться на пробный урок
                    </button>
                    <button
                      onClick={() => setCurrentPage('prices')}
                      className="px-6 py-3 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-[11px] uppercase tracking-widest font-bold rounded-full transition-all duration-300"
                    >
                      Посмотреть стоимость
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
