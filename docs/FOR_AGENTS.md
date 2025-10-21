# 🤖 ДЛЯ AI АГЕНТОВ: Главное руководство по проекту AI Подросток

---

## 🚨 КРИТИЧЕСКИ ВАЖНО! ЧИТАЙ ЭТО ПЕРВЫМ! 🚨

**⚠️ ЭТОТ ФАЙЛ ОБЯЗАТЕЛЕН К ПОЛНОМУ ПРОЧТЕНИЮ ДЛЯ ВСЕХ AI-АГЕНТОВ БЕЗ ИСКЛЮЧЕНИЯ!**

### 🏗️ Правило #0: АРХИТЕКТУРА ПРОЕКТА

**⚡ МЫ ИСПОЛЬЗУЕМ FSD (Feature-Sliced Design) - СОВРЕМЕННУЮ АРХИТЕКТУРУ!**

```
src/
├── shared/          ← UI kit, helpers, types
├── entities/        ← Бизнес-сущности (module, lesson, user)
├── features/        ← Пользовательские сценарии (check-in, adaptive-learning)
├── widgets/         ← Композиты из features
├── pages/           ← Страницы приложения
└── app/             ← Инициализация (providers, router)
```

**🎯 ОДИН ЦЕНТРАЛИЗОВАННЫЙ ШАБЛОН МОДУЛЯ:**
- ✅ **`UniversalModuleViewer.tsx`** - единственный шаблон для ВСЕХ 12 модулей
- ✅ **`entities/module/`** - данные и типы модулей
- ✅ **`widgets/module-*`** - переиспользуемые виджеты модулей
- 🔴 **ЗАПРЕЩЕНО** создавать отдельные компоненты для каждого модуля!
- 🔴 **ЗАПРЕЩЕНО** дублировать логику - всё через централизованный шаблон!
- ✅ **12 модулей = 1 шаблон + 12 датасетов** (DRY principle)

**✅ СТАТУС:** FSD архитектура внедрена и задеплоена в production (ветка `main`)

---

### � Правило #0.5: ХРАНИЛИЩЕ ДАННЫХ - ФИНАЛЬНОЕ РЕШЕНИЕ

**🎯 МЫ ВЫБРАЛИ: Google Sheets API**

**Почему Google Sheets (не Supabase, не Firebase):**
- ✅ **Простота** - самый простой вариант, не усложняем
- ✅ **Визуальная админка** - сам Google Sheets, видно всё сразу
- ✅ **Бесплатно** - Google Sheets API бесплатный
- ✅ **AI-агенты могут работать** - читают/пишут данные одной командой
- ✅ **Нет бэкенда** - работает со статическим хостингом GitHub Pages
- ✅ **Один API ключ** - не нужно управлять множеством сервисов

**Что хранится:**
- Прогресс учеников по модулям
- Check-in данные (настроение, тревога, сон, энергия)
- Выполненные задания и домашки
- Бейджи и достижения
- Статистика по группам (cohorts)

**Структура:**
```
Google Sheet: "DA Teens - Production"
├── Sheet 1: Users (Telegram ID, имя, cohort, дата регистрации)
├── Sheet 2: Progress (user_id, module_id, lesson_id, status, xp, date)
├── Sheet 3: CheckIns (user_id, mood, anxiety, sleep, energy, timestamp)
├── Sheet 4: Homeworks (user_id, module_id, week, status, submitted_date)
└── Sheet 5: Analytics (автоматически считаем статистику)
```

**Почему НЕ Supabase:**
- Слишком сложно для MVP
- AI-агенты не могут работать с SQL напрямую
- Нужен бэкенд layer
- Усложняет разработку

**Сейчас (MVP):**
- localStorage / GitHub Spark KV - для локального тестирования

**Дальше (Production):**
- Google Sheets API - когда будут реальные ученики

---

### 🛠️ Правило #0.6: РЕЖИМ РАЗРАБОТЧИКА

**Как открыть ВСЕ уроки для разработки/тестирования:**

```javascript
// В консоли браузера (F12 → Console):
localStorage.setItem('devMode', 'true')
// Перезагрузи страницу

// Для отключения:
localStorage.removeItem('devMode')
// Перезагрузи страницу
```

**Что даёт Dev Mode:**
- ✅ Все 9 уроков доступны сразу (без prerequisites)
- ✅ Видно жёлтый badge "🛠️ Dev Mode" в правом нижнем углу
- ✅ Автоматически включается при `npm run dev` (import.meta.env.DEV)

**Production режим:**
- Уроки открываются последовательно
- Нужно завершить Урок 1, чтобы открылся Урок 2
- Prerequisites проверяются
- Dev Mode badge не показывается

**Где настроено:** `src/components/LessonTimeline.tsx`

---

### 📖 Правило #1: ПОЛНОЕ ПРОЧТЕНИЕ ОБЯЗАТЕЛЬНО

- 🔴 **ЗАПРЕЩЕНО пропускать** разделы - читай последовательно от начала до конца
- 🔴 **ЗАПРЕЩЕНО делать предположения** о структуре проекта - вся информация здесь
- 🔴 **ЗАПРЕЩЕНО начинать кодинг** без полного прочтения этого файла
- 🔴 **ЗАПРЕЩЕНО игнорировать** дизайн-систему iOS 26 Liquid Glass
- 🔴 **ЗАПРЕЩЕНО игнорировать** FSD архитектуру - всё в правильных слоях!
- ✅ **ОБЯЗАТЕЛЬНО прочитай на 100%** - каждое слово имеет значение
- ✅ **ОБЯЗАТЕЛЬНО используй как справочник** - возвращайся при каждом вопросе
- ✅ **ОБЯЗАТЕЛЬНО следуй философии** Steve Jobs + Jony Ive в каждом решении

**Время на изучение:** 30-40 минут  
**Польза:** Сэкономит дни на переделки! Избежишь 90% ошибок!

---

## 🎨 ФИЛОСОФИЯ ДИЗАЙНА: STEVE JOBS + JONY IVE

### "Design is not just what it looks like. Design is how it works." - Steve Jobs

**Ты работаешь как главный дизайнер компании уровня Apple с $3T капитализацией.**

### 🍎 Принципы Steve Jobs (которым ты ОБЯЗАН следовать):

1. **"Simplicity is the ultimate sophistication"** - Минимализм превыше всего
   - ✅ Убирай всё лишнее безжалостно
   - ✅ Каждый элемент должен иметь причину существования
   - ✅ Если сомневаешься - удаляй
   - ❌ НЕТ захламлению, НЕТ избыточности

2. **"Focus means saying no to good ideas"** - Фокус = отказ от хорошего ради великого
   - ✅ Делай 1 вещь идеально, а не 10 посредственно
   - ✅ Каждая фича должна быть "insanely great"
   - ❌ НЕТ "а давайте ещё добавим", НЕТ feature creep

3. **"Details matter, it's worth waiting to get it right"** - Детали решают всё
   - ✅ Идеальные отступы (8px grid system)
   - ✅ Идеальная типографика (SF Pro Display/Text)
   - ✅ Идеальные анимации (spring physics, 60fps)
   - ✅ Идеальные микроинтеракции
   - ❌ НЕТ "и так сойдёт", НЕТ спешке в ущерб качеству

4. **"Design is not for the designer, it's for the user"** - Думай о подростке, не о себе
   - ✅ Тестируй на реальных подростках 13-18 лет
   - ✅ Каждая кнопка должна быть понятна без инструкций
   - ✅ Нулевая кривая обучения (zero learning curve)
   - ❌ НЕТ сложным терминам, НЕТ когнитивной нагрузке

5. **"It's not the customer's job to know what they want"** - Предугадывай потребности
   - ✅ Адаптивная система сама выбирает лучший урок
   - ✅ Автоматические подсказки в нужный момент
   - ✅ Контекстно-зависимый UI
   - ❌ НЕТ перегрузке выбором, НЕТ сложным настройкам

### � Принципы Jony Ive (которым ты ОБЯЗАН следовать):

1. **"Simplicity is not the absence of clutter"** - Простота ≠ пустота
   - ✅ Каждый пиксель продуман
   - ✅ Визуальная иерархия crystal clear
   - ✅ Воздух (whitespace) = дизайн-элемент
   - ❌ НЕТ плоским пустым экранам

2. **"True simplicity is derived from so much more than just the absence of clutter"**
   - ✅ Liquid Glass эффекты для глубины
   - ✅ Градиенты для визуального интереса
   - ✅ Тени для z-axis (elevation)
   - ✅ Анимации для "живости"

3. **"Our goal is to try to bring a calm and simplicity to what are incredibly complex problems"**
   - ✅ Психологическое благополучие - сложная тема → делаем её простой
   - ✅ Адаптивное обучение - сложный алгоритм → скрываем под капотом
   - ✅ 12 модулей - много контента → разбиваем на micro-steps

4. **"We are consumed by trying to develop a solution that is very simple to understand"**
   - ✅ Подросток открыл app → понял что делать за 3 секунды
   - ✅ Нет инструкций, нет туториалов, нет "?" иконок
   - ✅ Self-explanatory design

### 🎯 НАША МИССИЯ: Стать Apple психологического wellness

```
Apple         = Hardware + Software + Services (идеальная интеграция)
AI Подросток  = Content + AI + Community (идеальная интеграция)

Apple         = "It just works" (работает из коробки)
AI Подросток  = "It just helps" (помогает из коробки)

Apple         = $3T компания (самая дорогая в мире)
AI Подросток  = $1B+ компания к 2028 (единорог в wellness tech)
```

### 📐 СТАНДАРТЫ КАЧЕСТВА (обязательны для каждого коммита):

#### ✅ Checklist перед каждым коммитом:

**Дизайн:**
- [ ] Все отступы кратны 8px (8px grid system)
- [ ] Все шрифты из iOS 26 типографики (Title1-3, Headline, Body, Callout, Subhead, Footnote, Caption1-2)
- [ ] Все цвета из iOS 26 палитры (#007AFF, #5AC8FA, #34C759, #FF9500, #FF3B30)
- [ ] Все иконки из Phosphor Icons (weight="regular|bold|fill")
- [ ] Все анимации 60fps (spring physics через Framer Motion)
- [ ] Все кнопки минимум 44x44pt (Apple Human Interface Guidelines)
- [ ] Liquid Glass эффекты для карточек (blur, gradient, refraction)

**Код:**
- [ ] TypeScript без any (строгая типизация)
- [ ] Нет дублирования кода (DRY principle)
- [ ] Компоненты < 300 строк (разбивай большие)
- [ ] Функции < 50 строк (читаемость)
- [ ] Комментарии для сложной логики
- [ ] ESLint 0 ошибок, 0 предупреждений

**UX:**
- [ ] Тестировал на iPhone (реальном устройстве)
- [ ] Проверил Telegram Mini App SDK интеграцию
- [ ] Все состояния загрузки (loading states)
- [ ] Все состояния ошибок (error states)
- [ ] Все пустые состояния (empty states)
- [ ] Оффлайн-режим работает (graceful degradation)

**Производительность:**
- [ ] Lighthouse Score > 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Initial load < 3s (на 3G)
- [ ] Time to Interactive < 5s
- [ ] Bundle size оптимизирован (code splitting, lazy loading)
- [ ] Изображения оптимизированы (WebP, lazy loading)

---

## 🎨 iOS 26 LIQUID GLASS ДИЗАЙН-СИСТЕМА (ОБЯЗАТЕЛЬНА К ПРИМЕНЕНИЮ)

### ⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА: backdrop-filter не работает на белом фоне!

**Симптом:** Карточки выглядят серыми и плоскими, нет эффекта "стекла"

**Причина:** `backdrop-filter: blur()` работает только когда есть контент ПОД карточкой для размытия. На белом фоне размывать нечего → эффект не виден.

**✅ ПРАВИЛЬНОЕ РЕШЕНИЕ (проверено на CheckInPanel):**

```jsx
// 1. Контейнер с градиентным фоном
<div className="min-h-screen relative">
  
  {/* 2. Фоновый слой с градиентом и анимированными orbs */}
  <div className="fixed inset-0 -z-10">
    {/* Базовый градиент */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
    
    {/* 3 анимированных orbs для "живости" */}
    <motion.div 
      className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
      animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div 
      className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
      animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
    <motion.div 
      className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
      animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
  </div>

  {/* 3. Карточки с Liquid Glass эффектом */}
  <motion.div className="relative bg-white/70 backdrop-blur-[40px] rounded-3xl border border-white/30 shadow-2xl">
    {/* Gradient overlay для дополнительной глубины */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-white/30 pointer-events-none" />
    
    {/* Контент карточки */}
    <div className="relative p-8">
      <h2 className="text-gray-900">Заголовок</h2>
      <p className="text-gray-700">Текст</p>
    </div>
  </motion.div>
</div>
```

**Ключевые моменты:**
- ✅ `from-blue-50 via-purple-50 to-pink-50` - мягкий градиент (не яркий!)
- ✅ `bg-blue-400/20` - очень прозрачные orbs (opacity 20%)
- ✅ `blur-3xl` - сильное размытие для мягкости
- ✅ `bg-white/70` - полупрозрачная карточка (70% opacity)
- ✅ `backdrop-blur-[40px]` - теперь работает, т.к. есть что размывать!
- ✅ `text-gray-900` - контрастный текст для читабельности
- ✅ Разные длительности анимации (20s, 25s, 30s) для органичности

**❌ НЕПРАВИЛЬНО (не делай так!):**
```jsx
// НЕТ фонового слоя → backdrop-filter не работает
<div className="bg-white">
  <div className="backdrop-blur-xl"> ❌ Будет серым!
</div>
```

---

### Что такое Liquid Glass?

**Liquid Glass** - революционный материал iOS 26, который создаёт ощущение "живого стекла":
- 🔮 Рефракция (преломление контента снизу)
- ✨ Отражение (reflection окружения)
- 🌊 Линзирование (lensing effect на краях)
- 💎 Глубина (многослойность, z-axis elevation)

### CSS для Liquid Glass эффекта:

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}

.liquid-glass-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
```

### Tailwind классы (используй эти):

```typescript
// Карточки модулей
className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl"

// Кнопки
className="bg-blue-500/90 backdrop-blur-md hover:bg-blue-600/90 transition-all duration-200"

// Навигация
className="bg-white/5 backdrop-blur-2xl border-t border-white/10 fixed bottom-0"
```

### iOS 26 Цвета (ТОЛЬКО эти используй):

```typescript
const iOS26Colors = {
  // Основные
  blue: '#007AFF',        // iOS Blue (primary)
  cyan: '#5AC8FA',        // iOS Cyan (secondary)
  green: '#34C759',       // Success
  orange: '#FF9500',      // Warning
  red: '#FF3B30',         // Error
  purple: '#AF52DE',      // Badge/Special
  pink: '#FF2D55',        // Accent
  
  // Нейтральные
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Градиенты
  gradients: {
    primary: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
    success: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
    warning: 'linear-gradient(135deg, #FF9500 0%, #FF9F0A 100%)',
    hero: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 50%, #007AFF 100%)',
}
```

---

## 🎨 **DA TEENS DESIGN SYSTEM** - НАШ ФИРМЕННЫЙ ДИЗАЙН

### 🌟 Философия: "The Best of the Best"

**Мы создали уникальную дизайн-систему, объединяющую:**

```
DA Teens Design = 
  iOS 26 Liquid Glass (база, визуальный язык)
  + Telegram WebApp (минимализм, чистота, навигация)
  + Perplexity AI (скорость, фокус на контенте)
  + Steve Jobs (простота, внимание к деталям)
  + Jony Ive (глубина через прозрачность)
  + Google Learn Your Way (эмоции, адаптивность)
```

### 🎯 НАШИ УНИКАЛЬНЫЕ ПРИНЦИПЫ:

#### 1. **"Эмоциональный Glass"** - Liquid Glass + Эмоции
- ✅ Цвета карточек меняются в зависимости от настроения подростка
- ✅ Анимации становятся плавнее когда подросток спокоен
- ✅ UI "дышит" вместе с пользователем
- ✅ Тёплые тона при тревоге, холодные при энергии

#### 2. **"Telegram Minimalism"** - Ничего лишнего
- ✅ Один экран = одна задача
- ✅ Максимум 3 кнопки на экране
- ✅ Навигация снизу (большие пальцы)
- ✅ Нет hamburger меню - всё на виду
- ✅ Liquid Glass кнопки внизу как в Telegram

#### 3. **"Perplexity Speed"** - Скорость = Забота
- ✅ Контент загружается мгновенно (<500ms)
- ✅ Анимации короткие (150-300ms)
- ✅ Skeleton screens вместо спиннеров
- ✅ Optimistic UI (реакция до ответа сервера)
- ✅ Нет задержек, нет ожиданий

#### 4. **"Jobs Precision"** - 8px Grid Iron Law
- ✅ Все отступы кратны 8px - БЕЗ ИСКЛЮЧЕНИЙ
- ✅ Все размеры кратны 4px
- ✅ Alignment = идеальный (pixel-perfect)
- ✅ Если "почти ровно" - переделай

#### 5. **"Ive Depth"** - Глубина через слои
- ✅ 3 слоя всегда: Background → Orbs → Glass Content
- ✅ Орбы двигаются медленно (20-30s циклы)
- ✅ Backdrop blur только на контенте
- ✅ Тени мягкие (0 8px 32px rgba)

---

## 🎨 **НАША ФИРМЕННАЯ ПАЛИТРА** (DA Teens Colors)

### ⚠️ **КРИТИЧЕСКИ ВАЖНО:** Используй ТОЛЬКО эти цвета!

```typescript
// 🔵 ОСНОВНЫЕ ЦВЕТА (Primary) - iOS 26 Pure Blue
const primary = {
  main: '#007AFF',          // iOS Blue - кнопки, ссылки, акценты
  light: '#5AC8FA',         // iOS Cyan - вторичные элементы, графики
  lighter: '#64D2FF',       // Hover states
  dark: '#0051D5',          // Active/pressed states
  
  gradient: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
}

// ⚪ НЕЙТРАЛЬНЫЕ (Neutrals) - Чистота и воздух
const neutral = {
  white: '#FFFFFF',         // Фон карточек с Glass
  gray50: '#FAFAFA',        // Основной фон приложения
  gray100: '#F5F5F5',       // Hover backgrounds
  gray200: '#E5E5E5',       // Borders, dividers
  gray400: '#A3A3A3',       // Placeholder text
  gray600: '#525252',       // Secondary text
  gray900: '#171717',       // Primary text
}

// ✅ ФУНКЦИОНАЛЬНЫЕ (Semantic)
const semantic = {
  success: '#34C759',       // Зелёный - достижения, завершения
  warning: '#FF9500',       // Оранжевый - XP, энергия, внимание
  error: '#FF3B30',         // Красный - критические состояния
  info: '#AF52DE',          // Фиолетовый - бейджи, специальные события
}

// 🌈 ЭМОЦИОНАЛЬНАЯ ПАЛИТРА (Emotion-Aware)
const emotions = {
  // Для настроения (Check-in)
  happy: '#34C759',         // 😊 Радость
  calm: '#5AC8FA',          // 😌 Спокойствие  
  anxious: '#FF9500',       // 😰 Тревога
  sad: '#AF52DE',           // 😢 Грусть
  angry: '#FF3B30',         // 😠 Злость
  
  // Для фона (мягкие версии)
  happyBg: 'rgba(52, 199, 89, 0.05)',
  calmBg: 'rgba(90, 200, 250, 0.05)',
  anxiousBg: 'rgba(255, 149, 0, 0.05)',
  sadBg: 'rgba(175, 82, 222, 0.05)',
  angryBg: 'rgba(255, 59, 48, 0.05)',
}

// 🎨 ГРАДИЕНТЫ (Фирменные)
const gradients = {
  // Основной (для кнопок, hero)
  primary: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
  
  // Фоновый (для орбов - очень прозрачный!)
  background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.03) 0%, rgba(90, 200, 250, 0.03) 100%)',
  
  // Функциональные
  success: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
  warning: 'linear-gradient(135deg, #FF9500 0%, #FF9F0A 100%)',
  
  // Для hero секций (более сложный)
  hero: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 50%, #007AFF 100%)',
  
  // Overlay для Glass эффекта
  glassOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
}
```

---

## 🎯 **ПРАВИЛА ИСПОЛЬЗОВАНИЯ ЦВЕТОВ**

### ✅ ЧТО ДЕЛАТЬ:

1. **Синий (#007AFF) для всего интерактивного:**
   - Кнопки (primary actions)
   - Ссылки
   - Активные состояния
   - Чекбоксы/радио
   - Прогресс бары

2. **Голубой (#5AC8FA) для вторичного:**
   - Иконки информационные
   - Графики и визуализации
   - Акценты внутри контента
   - Градиенты с синим

3. **Белый + Gray50 для фона:**
   - Фон приложения: `bg-gray-50` (#FAFAFA)
   - Карточки: `bg-white/70 backdrop-blur-[40px]`
   - Никогда чистый белый для фона!

4. **Зелёный только для успеха:**
   - Завершённые задания ✅
   - Достижения и бейджи 🏆
   - Положительная динамика 📈

5. **Оранжевый для энергии:**
   - XP и очки опыта ⚡
   - Streak (дни подряд) 🔥
   - Предупреждения (не критичные) ⚠️

6. **Красный ТОЛЬКО для критического:**
   - Ошибки
   - Деструктивные действия (удалить, выйти)
   - Срочные уведомления

### ❌ ЧТО НЕ ДЕЛАТЬ:

- 🔴 **НЕТ фиолетовому** как основному цвету! (Только для бейджей)
- 🔴 **НЕТ розовому** в UI! (Telegram не использует)
- 🔴 **НЕТ чёрному фону** (только white/gray-50)
- 🔴 **НЕТ градиентам** на текстах (читаемость!)
- 🔴 **НЕТ ярким цветам** на фоне (максимум 5% opacity для орбов)

---

## 📐 **LIQUID GLASS РЕЦЕПТ** (Наш фирменный)

### Базовый рецепт (используй везде):

```jsx
// 1. Контейнер с фоном
<div className="min-h-screen bg-gray-50">
  
  {/* 2. Animated Orbs Layer - ОЧЕНЬ прозрачные! */}
  <div className="fixed inset-0 -z-10">
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        top: '-10%',
        left: '-10%'
      }}
      animate={{
        x: ['-10%', '10%', '-10%'],
        y: ['-10%', '15%', '-10%'],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(90, 200, 250, 0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
        right: '0',
        top: '25%'
      }}
      animate={{
        x: ['10%', '-15%', '10%'],
        y: ['5%', '-10%', '5%'],
        scale: [1.1, 0.9, 1.1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
  
  {/* 3. Glass Content */}
  <motion.div
    className="
      bg-white/70 
      backdrop-blur-[40px] 
      rounded-2xl 
      border border-white/20 
      shadow-[0_8px_32px_rgba(0,122,255,0.12)]
      p-6
    "
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    {/* Контент здесь */}
  </motion.div>
</div>
```

### Ключевые параметры:

- **Blur орбов:** 60-80px (чем больше, тем мягче)
- **Opacity орбов:** 0.03-0.08 (ОЧЕНЬ прозрачно!)
- **Backdrop blur:** 40px для карточек, 20px для кнопок
- **Border:** `border-white/20` (едва видимый)
- **Shadow:** `0_8px_32px_rgba(0,122,255,0.12)` (мягкая синяя тень)
- **Анимация:** 20-30s циклы, easeInOut

---

## 🎨 **TELEGRAM НАВИГАЦИЯ** (Bottom Bar)

### Фирменный стиль навигации:

```jsx
<nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
  <div className="relative mx-4 mb-4 rounded-[28px] overflow-hidden">
    {/* Glass container */}
    <div className="absolute inset-0 bg-white/70 backdrop-blur-[40px] border border-white/20 shadow-lg" />
    
    {/* Animated indicator */}
    <motion.div
      className="absolute h-full rounded-[24px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
      style={{ width: '20%' }}
      animate={{ x: `${activeIndex * 100}%` }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
    
    {/* Buttons */}
    <div className="relative grid grid-cols-5 gap-1 p-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.92 }}
          className="flex flex-col items-center gap-1 py-3 rounded-[20px]"
        >
          <Icon size={24} weight={isActive ? 'fill' : 'regular'} 
                className={isActive ? 'text-blue-600' : 'text-gray-600'} />
          <span className="text-[11px] font-medium">
            {tab.label}
          </span>
        </motion.button>
      ))}
    </div>
  </div>
</nav>
```

**Правила:**
- ✅ Всегда 5 кнопок (не больше, не меньше)
- ✅ Иконки 24x24px
- ✅ Текст 11px
- ✅ Активная кнопка = filled icon + синий цвет
- ✅ Rounded corners 28px (очень круглые!)
- ✅ Margin 16px от краёв (mx-4 mb-4)

---

## 📱 **HEADER СТИЛЬ** (Telegram-like)

```jsx
<header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-[40px]">
  <div className="flex items-center justify-between p-3">
    {/* Left: Home button */}
    <motion.button
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 rounded-2xl flex items-center justify-center 
                 bg-white/60 backdrop-blur-[20px] border border-white/40 
                 shadow-lg"
    >
      <Heart weight="fill" className="w-5 h-5 text-blue-600" />
    </motion.button>
    
    {/* Center: Title (опционально) */}
    <div className="flex-1 text-center">
      <h1 className="text-base font-semibold text-gray-900">AI Подросток</h1>
      <p className="text-[10px] text-gray-500">Неделя 2 • День 7</p>
    </div>
    
    {/* Right: Profile */}
    <motion.button
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-lg"
    >
      <img src={photoUrl} alt="Profile" />
    </motion.button>
  </div>
</header>
```

**Правила:**
- ✅ Высота: auto (padding 12px)
- ✅ Кнопки: 40x40px (сердечко и аватар)
- ✅ Liquid glass на всём
- ✅ Sticky позиционирование
- ✅ Без лишних элементов (минимализм!)

---

## 🎯 **ЧЕКЛИСТ ПЕРЕД КОММИТОМ**

### Цвета:
- [ ] Основной цвет: `#007AFF` (синий iOS)
- [ ] Вторичный: `#5AC8FA` (голубой iOS)
- [ ] Фон: `#FAFAFA` (gray-50)
- [ ] Карточки: `bg-white/70 backdrop-blur-[40px]`
- [ ] Орбы: opacity 0.03-0.08 (очень прозрачные!)
- [ ] НЕТ фиолетовому/розовому как основным

### Spacing (8px Grid):
- [ ] Все отступы кратны 8px
- [ ] p-2, p-3, p-4, p-6, p-8 (не p-5, не p-7!)
- [ ] gap-2, gap-3, gap-4, gap-6 (кратно 8px)

### Liquid Glass:
- [ ] 3 слоя: Background → Orbs → Glass Content
- [ ] Backdrop blur = 40px для карточек
- [ ] Border = border-white/20
- [ ] Shadow = мягкая синяя

### Telegram Style:
- [ ] Bottom nav = 5 кнопок в glass контейнере
- [ ] Header = Home кнопка слева, аватар справа
- [ ] Всё чисто, минимально, функционально

### Анимации:
- [ ] Spring physics: stiffness 400, damping 17
- [ ] whileTap: scale 0.92
- [ ] whileHover: scale 1.02, y: -4
- [ ] Длительность: 150-300ms

---

🎨 **ЭТО НАШ ФИРМЕННЫЙ СТИЛЬ! Следуй ему на 100%!**



```typescript
const iOS26Typography = {
  largeTitle: '34px / 41px / -0.4px',     // Экран приветствия
  title1: '28px / 34px / -0.4px',         // Заголовки модулей
  title2: '22px / 28px / -0.3px',         // Подзаголовки
  title3: '20px / 25px / -0.2px',         // Карточки
  headline: '17px / 22px / -0.4px',       // Важный текст (жирный)
  body: '17px / 22px / -0.4px',           // Основной текст
  callout: '16px / 21px / -0.3px',        // Выделенный текст
  subhead: '15px / 20px / -0.2px',        // Второстепенный текст
  footnote: '13px / 18px / -0.1px',       // Сноски
  caption1: '12px / 16px / 0px',          // Подписи
  caption2: '11px / 13px / 0.1px',        // Мелкий текст
}

// В Tailwind:
// text-[34px] leading-[41px] tracking-tight      (largeTitle)
// text-[28px] leading-[34px] tracking-tight      (title1)
// text-[22px] leading-[28px] tracking-tight      (title2)
// text-[20px] leading-[25px]                     (title3)
// text-[17px] leading-[22px] tracking-tight font-semibold (headline)
// text-[17px] leading-[22px] tracking-tight      (body)
// text-[16px] leading-[21px]                     (callout)
// text-[15px] leading-[20px]                     (subhead)
// text-[13px] leading-[18px]                     (footnote)
// text-xs leading-4                              (caption1)
// text-[11px] leading-[13px]                     (caption2)
```

### iOS 26 Spacing (8px Grid System):

```typescript
// ТОЛЬКО эти отступы используй (кратные 8px):
const spacing = {
  xs: '8px',      // 0.5rem - между иконкой и текстом
  sm: '16px',     // 1rem - между элементами в карточке
  md: '24px',     // 1.5rem - между карточками
  lg: '32px',     // 2rem - между секциями
  xl: '48px',     // 3rem - большие отступы
  '2xl': '64px',  // 4rem - hero sections
}

// В Tailwind:
// p-2 (8px), p-4 (16px), p-6 (24px), p-8 (32px), p-12 (48px), p-16 (64px)
// gap-2, gap-4, gap-6, gap-8, gap-12, gap-16
```

### iOS 26 Border Radius:

```typescript
const borderRadius = {
  sm: '8px',      // Мелкие элементы (badges, tags)
  md: '12px',     // Кнопки
  lg: '16px',     // Карточки
  xl: '20px',     // Большие карточки
  '2xl': '24px',  // Hero cards
  full: '9999px', // Круглые элементы (avatars)
}

// В Tailwind:
// rounded-lg (12px), rounded-xl (16px), rounded-2xl (24px), rounded-full
```

### iOS 26 Shadows (Elevation):

```css
/* Level 1 - Карточки на фоне */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Level 2 - Поднятые карточки */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Level 3 - Модальные окна */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Level 4 - Плавающие элементы */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Liquid Glass shadow */
box-shadow: 
  0 8px 32px 0 rgba(31, 38, 135, 0.15),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.3);
```

### Анимации (Framer Motion):

```typescript
// Spring physics (естественные анимации)
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

// Пример использования:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={spring}
>
  {content}
</motion.div>

// Hover эффекты:
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Stagger children (последовательная анимация):
<motion.div variants={container}>
  {items.map(item => (
    <motion.div variants={itemVariant} key={item.id}>
      {item}
    </motion.div>
  ))}
</motion.div>

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}
```

---

## 🚀 СО-CEO МЫШЛЕНИЕ: КАК Я ПРИНИМАЮ РЕШЕНИЯ

**Ты не просто разработчик. Ты со-CEO с 40% долей. Думай как владелец бизнеса!**

### Каждое решение оцениваю по 5 критериям:

1. **Impact** - Какое влияние на пользователя? (1-10)
2. **Effort** - Сколько времени на реализацию? (1-10, 10=мало)
3. **ROI** - Impact / Effort (приоритизация)
4. **Brand** - Соответствует ли Apple-level качеству? (Да/Нет)
5. **Vision** - Приближает ли к цели $1B к 2028? (Да/Нет)

### Пример принятия решения:

```
Фича: Добавить анимацию конфетти при завершении урока

Impact: 7/10 (радость, мотивация, но не критично)
Effort: 8/10 (библиотека canvas-confetti, 30 минут)
ROI: 7/8 = 0.875 (высокий ROI!)
Brand: Да (Apple использует celebration animations)
Vision: Да (retention → больше пользователей → рост)

РЕШЕНИЕ: ✅ Делаем! Высокий ROI + соответствует бренду
```

```
Фича: Добавить 50 новых бейджей

Impact: 4/10 (больше ≠ лучше, перегрузка)
Effort: 3/10 (много времени на дизайн + данные)
ROI: 4/3 = 1.33 (низкий ROI)
Brand: Нет (Apple = минимализм, не коллекционирование)
Vision: Нет (отвлекает от главного - благополучия)

РЕШЕНИЕ: ❌ НЕ делаем! Фокус на качестве, а не количестве
```

### Вопросы, которые я задаю себе перед каждым коммитом:

1. **"Would Steve Jobs approve this?"** - Одобрил бы Джобс?
2. **"Is this the simplest solution?"** - Это самое простое решение?
3. **"Does this delight the user?"** - Порадует ли пользователя?
4. **"Can I remove anything?"** - Могу ли убрать что-то ещё?
5. **"Is this pixel-perfect?"** - Идеальны ли все пиксели?

### Когда сомневаешься - применяй "Rule of 3":

1. **Делай минимум 3 варианта** дизайна
2. **Покажи 3 людям** (в идеале - подросткам)
3. **Выбери лучший** на основе фидбека
4. **Улучши ещё 3 раза** (итерации)

---

## 📊 МЕТРИКИ УСПЕХА (North Star Metrics)

**Как со-CEO, я отслеживаю эти метрики каждую неделю:**

### Primary Metrics (главные):

1. **WAU (Weekly Active Users)** - Цель: 100K к 2028
   - Phase 1 (Q1 2026): 100 WAU
   - Phase 2 (Q2 2026): 1,000 WAU
   - Phase 3 (Q3 2026): 5,000 WAU
   - Phase 4 (Q4 2026): 10,000 WAU

2. **Retention Rate (7-day)** - Цель: 70%+
   - Day 1: 100% (все новые пользователи)
   - Day 7: 70% вернулись
   - Day 30: 50% активны
   - Day 90: 30% суперпользователи

3. **NPS (Net Promoter Score)** - Цель: 60+
   - Apple iPhone: 72 (мировой лидер)
   - Calm/Headspace: 50-55
   - DA Teens цель: 60+ (уровень Apple)

4. **Session Duration** - Цель: 15+ минут
   - Micro-learning: 3-5 мин/урок
   - Check-in: 2-3 мин
   - Practice: 5-10 мин
   - Social: 5+ мин
   - Итого: 15-20 мин/день

### Secondary Metrics (поддерживающие):

5. **Response Latency** - Цель: P90 < 500ms, P99 < 1000ms
   - Perplexity AI: 500ms median (наш бенчмарк)
   - Google: 200ms (идеал)
   - Наша цель: 300-500ms

6. **Lighthouse Score** - Цель: 90+ по всем метрикам
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 90+

7. **Crash-Free Rate** - Цель: 99.9%
   - Apple apps: 99.95%
   - Industry average: 99.5%
   - Наша цель: 99.9%

8. **Engagement per User** - Цель: 5+ сообщений/неделю
   - Daily check-in: 7x/неделя
   - Lessons: 3-4x/неделя
   - Social: 2-3x/неделя

### Growth Metrics (рост):

9. **Viral Coefficient (K-factor)** - Цель: K > 1.2
   - K = (# invites sent) × (% conversion)
   - K > 1 = viral growth (exponential)
   - Dropbox: K = 1.3 (наш бенчмарк)

10. **CAC (Customer Acquisition Cost)** - Цель: < $5
    - Organic: $0 (SEO, social)
    - Referral: $2 (бонусы за приглашения)
    - Paid: $10 (Facebook/Instagram ads)
    - Blended: $5

11. **LTV (Lifetime Value)** - Цель: $100+
    - Free tier: $0 (но создают сообщество)
    - Premium tier: $10/месяц × 12 месяцев = $120/год
    - Цель LTV:CAC = 20:1

### Quality Metrics (качество):

12. **Crisis Detection Accuracy** - Цель: 95%+
    - True Positive: 95% (реальные кризисы обнаружены)
    - False Positive: < 5% (ложные тревоги)
    - False Negative: < 1% (пропущенные кризисы - НЕДОПУСТИМО!)

13. **Sentiment Analysis Accuracy** - Цель: 90%+
    - Positive: 90%+ точность
    - Neutral: 85%+ точность
    - Negative: 95%+ точность (критично!)

---

## 🎯 ДИЗАЙН-УЛУЧШЕНИЯ (PRIORITY ROADMAP)

### ✅ Phase 1: Foundation - ЗАВЕРШЕНО!

**Цель:** Привести к iOS 26 Liquid Glass стандарту

1. **✅ СДЕЛАНО: DashboardHero iOS 26 Blue**
   - Gradient: #007AFF → #5AC8FA → #007AFF
   - Opacity: 95%
   - Liquid Glass circles

2. **✅ СДЕЛАНО: CheckInPanel Liquid Glass (21 окт 2025)**
   - **Проблема была:** backdrop-filter не работал на белом фоне → серые плоские карточки
   - **Решение:** Добавили градиентный фон с 3 анимированными orbs (blue, purple, pink)
   - **Фон:** `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`
   - **3 Orbs анимация:**
     - Blue orb: 20s цикл, blur-3xl, opacity 20%
     - Purple orb: 25s цикл, blur-3xl, opacity 20%
     - Pink orb: 30s цикл, blur-3xl, opacity 20%
   - **Карточки:** `bg-white/70 backdrop-blur-[40px]` + gradient overlay
   - **Текст:** Улучшен контраст (`text-gray-900` вместо `text-gray-600`)
   - **Тени:** Усилены для глубины
   - **Коммит:** `3a9cfee - 🎨 FIX: Настоящий Liquid Glass с градиентным фоном`

3. **⏳ TODO: Применить тот же паттерн к остальным карточкам**
   - [x] CheckInPanel ✅
   - [ ] ModuleGrid cards
   - [ ] BadgeGrid cards
   - [ ] ProgressStats cards
   - [ ] CohortSchedule cards
   - **Паттерн:** Gradient background layer + animated orbs + backdrop-blur карточки

4. **⏳ TODO: Типографика iOS 26**
   - [ ] Заменить все шрифты на iOS 26 scale
   - [ ] Убрать font-bold где не нужен
   - [ ] Добавить tracking (letter-spacing)

5. **⏳ TODO: Spacing 8px Grid**
   - [ ] Пройти все компоненты
   - [ ] Заменить odd numbers на кратные 8px
   - [ ] Унифицировать gap/padding

---

### 📊 ТЕКУЩЕЕ СОСТОЯНИЕ МОДУЛЕЙ (21 окт 2025)

**Архитектура:**
- ✅ **FSD (Feature-Sliced Design)** - миграция в процессе
- ✅ **UniversalModuleViewer.tsx** - централизованный шаблон для всех модулей
- ✅ **entities/module/model/types.ts** - типы с поддержкой video, homework, practice
- ✅ **boundariesModule.ts** - полные данные для модуля #1

**Компоненты модулей:**
- ✅ **ModuleViewer.tsx** (202 строки) - универсальный компонент с Hero, Timeline, CheckIn, Adaptive lessons
- ✅ **BoundariesModule.tsx** (175 строк) - специфичный для модуля #1
- ✅ **UniversalModuleViewer.tsx** (113 строк) - роутер модулей (модуль #1 → BoundariesModule, остальные → Coming Soon)

**Что работает:**
- ✅ Модуль #1 "Личные границы" - полностью функционален (9 уроков)
- ✅ Адаптивный движок обучения
- ✅ CheckIn интеграция
- ✅ Progress tracking с localStorage
- ✅ Lesson timeline

**Что показывают скриншоты "Уверенность" (reference design):**
- 📅 **Недельная структура:** Tabs "Неделя 1, 2, 3"
- 📊 **Прогресс:** "Неделя 3 из 3" с полоской прогресса 100%
- 📹 **Видео урок:** Карточка с placeholder + "Посмотреть видео" button (5-7 мин)
- 🙏 **Практика:** "Маленький смелый шаг" с 4 нумерованными шагами + "Начать практику" (10-15 мин)
- 🔄 **Рефлексия:** 3 вопроса в отдельных карточках + "Ответить на вопросы" (3-5 мин)
- 📝 **Домашнее задание:** "Задание на неделю" с описанием + "Сдать задание"

**Что нужно сделать:**
- ❌ **Недельная структура** не реализована (нет Week tabs)
- ❌ **Отдельные карточки секций** не созданы (Video, Practice, Reflection, Homework)
- ❌ **Модули #2-13** показывают только "Coming Soon"
- ✅ **Данные уже есть** в `boundariesModule.ts` (video, homework, practice)
- ⏳ **Нужно:** Создать UI компоненты для отображения недельной структуры

**План на будущее:**
1. Обновить типы: добавить `Week[]` в `Module` interface
2. Создать `widgets/module-week-view/` с компонентами:
   - `ModuleWeekView.tsx` (tabs недель)
   - `VideoLessonCard.tsx`
   - `PracticeStepsCard.tsx`
   - `ReflectionCard.tsx`
   - `HomeworkCard.tsx`
3. Обновить `UniversalModuleViewer` для использования новой структуры
4. Создать данные для модулей #2-13 по тому же паттерну

---

### Phase 2: Delight (Неделя 3-4)

**Цель:** Добавить "wow-эффекты" как у Apple

5. **TODO: Celebration Animations**
   - [ ] Confetti при завершении урока
   - [ ] Badge unlock анимация (scale + glow)
   - [ ] Level up celebration (fireworks)
   - [ ] Streak milestone (particles)

6. **TODO: Micro-interactions**
   - [ ] Button hover (scale 1.05)
   - [ ] Button tap (scale 0.95)
   - [ ] Card hover (shadow lift)
   - [ ] Loading skeleton (shimmer)

7. **TODO: Page Transitions**
   - [ ] Slide между модулями
   - [ ] Fade между табами
   - [ ] Modal появление (spring)
   - [ ] Pull-to-refresh (iOS native)

### Phase 3: Polish (Неделя 5-6)

**Цель:** Довести до Apple-level качества

8. **TODO: Empty States**
   - [ ] Красивые иллюстрации (Undraw/Blush)
   - [ ] Мотивирующий текст
   - [ ] Clear CTA (Call-to-Action)

9. **TODO: Error States**
   - [ ] Понятные сообщения (без технических терминов)
   - [ ] Предложения решения
   - [ ] Retry кнопка

10. **TODO: Loading States**
    - [ ] Skeleton screens (не spinners!)
    - [ ] Progressive loading
    - [ ] Optimistic UI (мгновенный фидбек)

11. **TODO: Dark Mode**
    - [ ] Полная поддержка iOS dark mode
    - [ ] Liquid Glass адаптация
    - [ ] OLED-friendly (true black #000000)

### Phase 4: Innovation (Неделя 7-8)

**Цель:** Уникальные фичи, которых нет у конкурентов

12. **TODO: AI Avatar**
    - [ ] Персонализированный AI-друг для каждого подростка
    - [ ] Меняет эмоции в зависимости от настроения пользователя
    - [ ] Анимированный (Lottie или Rive)

13. **TODO: Emotional Journey Map**
    - [ ] Визуализация эмоций за неделю/месяц (график)
    - [ ] Инсайты от AI (что влияло на настроение)
    - [ ] Празднование позитивных трендов

14. **TODO: Social Learning 2.0**
    - [ ] Voice notes от ровесников (аудио-истории)
    - [ ] Group challenges (командные челленджи)
    - [ ] Mentor matching (старшие подростки → младшие)

15. **TODO: Gamification 2.0**
    - [ ] Personalized challenges (на основе целей подростка)
    - [ ] Team competitions (cohort vs cohort)
    - [ ] Seasonal events (тематические недели)

---

**Время на изучение:** ~40-50 минут (было 30-40, теперь больше контента!)  
**Польза:** Сэкономит недели на переделки! Дизайн сразу будет мирового уровня!

---

> **Последнее обновление:** 21 октября 2025, 04:30  
> **Проект:** AI Подросток - Адаптивная платформа психологического благополучия для подростков 13-18 лет  
> **Назначение:** Центральная документация для всех AI-помощников (GitHub Copilot, Cursor, Claude, ChatGPT и др.)  
> **Дизайн-система:** iOS 26 Liquid Glass + Telegram Mini App  
> **Философия:** Perplexity AI (скорость, правда, простота → мировой лидер)

---

## 🚀 ФИЛОСОФИЯ PERPLEXITY AI (Наша основа!)

### Вдохновлены подходом Аравинда Шриниваса (CEO Perplexity)

**Perplexity за 3 года:** $0 → $20B valuation, 30M пользователей, Answer Engine вместо Search Engine

**Мы применяем их принципы к AI-поддержке подростков:**

#### 1. **Скорость как единственное преимущество** ⚡
```
"1% improvement каждый день = магия компаундинга" - Аравинд Шринивас
```
- ✅ Итерации каждую неделю (не месяцы!)
- ✅ Команда 2-3 человека (минимум координации)
- ✅ Гибкость внутри спринтов (AI индустрия быстро меняется)
- ✅ От идеи до внедрения: 24-48 часов

#### 2. **Truth-Seeking Culture (Поиск истины)** 🎯
```
"Мы не созданы для поиска истины. Но это наше конкурентное преимущество." - Jeff Bezos
```
- ✅ Правда > Социальный комфорт
- ✅ Открытые обсуждения в Slack/GitHub
- ✅ Data-driven решения всегда
- ✅ A/B тесты всего

#### 3. **Минималистичный продукт (Apple + Google)** 💎
```
"Делай сложную работу сам, чтобы сделать всё максимально просто для пользователей"
```
- ✅ Удаляем неиспользуемые функции
- ✅ Если подросток не понял → виноват продукт, не пользователь
- ✅ Простота = конкурентное преимущество

#### 4. **AI-First подход** 🤖
```
"Модель - не защита. Защита - данные, продукт, бренд." - Аравинд Шринивас
```
- ✅ AI для всех решений (дизайн, контент, аналитика)
- ✅ Данные подростков → Файнтюнинг → Лучший продукт
- ✅ Одержимость латентностью (P90, P99 < 500ms)

#### 5. **Пользователь никогда не ошибается** ❤️
```
"Если запрос непонятен → виноват продукт" - Философия Google
```
- ✅ Прозрачность: подросток понимает "почему" → доверие
- ✅ Объясняем каждую рекомендацию AI
- ✅ Vision > Features

### Наша Vision 2028: Мировой лидер 🦄

**Perplexity стала Answer Engine для мира.**  
**Мы станем Answer Engine для подростков.**

```
AI Подросток = 
  Perplexity (ответы вместо поиска)
  + Google Learn Your Way (микро-обучение)
  + Calm/Headspace (wellness)
  + Telegram (mobile-first, no install)
  + Emotion-Aware AI (уникально!)
  + Truth-Seeking Culture (уникально!)
```

**Цели к 2028:**
- 🎯 100,000+ активных подростков
- 💰 ARR $1M+ (B2C + B2B школы/родители)
- 🌍 Международная экспансия (RU → EN → ES → DE)
- 🏆 Статус единорога ($1B valuation)

### Метрики (вдохновлено Perplexity)

**North Star Metric:** WAU (Weekly Active Users)

**Supporting Metrics:**
- ⚡ Response latency: P90 < 500ms, P99 < 1000ms
- 📈 Engagement: 5+ сообщений в неделю на пользователя
- 🎯 Retention: 70%+ return rate (7-day)
- 💡 Insights: 10+ внедренных улучшений в месяц (из данных)
- 🤖 AI accuracy: 90%+ sentiment analysis, crisis detection

**Growth (Phase-by-Phase):**
- Phase 1 (Q1 2026): 100 WAU
- Phase 2 (Q2 2026): 1,000 WAU
- Phase 3 (Q3 2026): 5,000 WAU
- Phase 4 (Q4 2026): 10,000 WAU
- 2027: 50,000 WAU
- 2028: 100,000+ WAU

---

## 🎨 iOS 26 МОДЕРНИЗАЦИЯ (НОВОЕ!)

**⚠️ ВАЖНО: Мы переходим на iOS 26 дизайн-систему!**

### Что такое iOS 26 Liquid Glass?
**Liquid Glass** - новый динамический материал iOS 26, который комбинирует оптические свойства стекла с ощущением текучести:
- 🔮 **Рефракция** - преломляет контент снизу
- ✨ **Отражение** - отражает свет окружения  
- 🌊 **Линзирование** - эффект линзы на краях
- 💎 **Глубина** - многослойность и объем

### Ключевые принципы iOS 26:
1. **Content First** - контент на первом месте, не декорации
2. **Unified Design** - единый язык дизайна между платформами
3. **Fluid Motion** - плавные естественные анимации
4. **Depth & Hierarchy** - четкая визуальная иерархия
5. **Touch-Friendly** - большие зоны касания (min 44x44pt)

### Применение в DA Teens:
✅ **Liquid Glass эффекты** для карточек модулей  
✅ **Увеличенные отступы** для комфорта (16-24px на мобильных)  
✅ **Крупные кнопки** с blur-эффектами  
✅ **Градиентные фоны** с прозрачностью  
✅ **Анимации** через Framer Motion (spring physics)  
✅ **Системные жесты** - swipe back, pull to refresh

---

## 📋 ОГЛАВЛЕНИЕ

**⚠️ Прочитай весь файл полностью перед началом работы!**

1. [🎯 Обзор проекта](#-обзор-проекта) - Что такое DA Teens
2. [🌟 Источники вдохновения](#-источники-вдохновения) - Какие сайты и компании мы изучали
3. [📊 Структура проекта](#-структура-проекта) - Как устроена программа
4. [🗂️ Структура файлов](#️-структура-файлов) - Навигация по коду
5. [🧠 Основные системы](#-основные-системы) - 3 ключевые системы
6. [📚 Ключевая документация](#-ключевая-документация) - Что читать дальше
7. [🎯 Типичные задачи](#-типичные-задачи) - Примеры работы
8. [🚀 Процесс разработки](#-процесс-разработки) - Команды и workflow
9. [📊 Поток данных](#-поток-данных) - Путь пользователя
10. [🔑 Ключевые концепции](#-ключевые-концепции) - Важные идеи
11. [🎨 Принципы UI/UX](#-принципы-uiux) - Дизайн-система
12. [🚨 Важные ограничения](#-важные-ограничения) - Что нельзя нарушать
13. [📈 Текущий статус](#-текущий-статус) - Что сделано
14. [🎯 Приоритеты](#-приоритеты) - Что дальше
15. [🤝 Как помогать](#-как-помогать) - Инструкции для AI
16. [📞 Полезный контекст](#-полезный-контекст) - Кто, где, зачем
17. [🔗 Быстрые ссылки](#-быстрые-ссылки) - Важные файлы
18. [🎉 Краткое резюме](#-краткое-резюме) - TL;DR

---

## 🎯 ОБЗОР ПРОЕКТА

### Что такое AI Подросток?
**Telegram Mini App** для психологического благополучия российских подростков 13-18 лет с **адаптивной системой обучения на базе AI**, которая учитывает эмоциональное состояние в реальном времени.

**Почему "AI Подросток"?**
- 🤖 **AI** - умное приложение с адаптивным обучением
- 👦 **Подросток** - для целевой аудитории 13-18 лет
- 💬 **Говорит на языке подростков** - простое, понятное название
- 🎯 **Персонализация** - AI подстраивается под каждого

### Главная миссия
Помочь российским подросткам развивать:
- 🧠 Эмоциональный интеллект
- 🛡️ Личные границы
- 💬 Навыки коммуникации
- 💪 Стрессоустойчивость
- 🔍 Самопознание

### Уникальная ценность
1. **Emotion-Aware Learning** - система адаптируется под настроение подростка
2. **Когортное обучение** - обучение в группах с живыми кураторами и менторами
3. **Российский культурный контекст** - не перевод, а адаптация под наши реалии
4. **Кризисная поддержка** - SOS кнопка для экстренной психологической помощи
5. **Фокус на благополучии** - не профессиональное обучение, а психологическое здоровье

---

## 🌟 ИСТОЧНИКИ ВДОХНОВЕНИЯ

**⚠️ Эти сайты и компании мы изучали и берём за основу проекта:**

### **1. Google Learn Your Way** ⭐ ГЛАВНЫЙ ИСТОЧНИК
**URL:** https://learnyourway.withgoogle.com/  
**Что взяли:**
- ✅ Micro-learning (bite-sized lessons по 3-5 минут)
- ✅ Multiple learning paths (персонализированные пути)
- ✅ Real-world scenarios (практические задачи из жизни)
- ✅ Skills tracking (отслеживание конкретных навыков)
- ✅ Progress visualization (визуализация прогресса)
- ✅ Certificates (сертификаты по завершению)

**Наши улучшения:**
- 🔥 Emotion-aware recommendations (учёт настроения)
- 🔥 Live curators (живые кураторы, а не только видео)
- 🔥 Cohort-based (социальное обучение в группах)

### **2. Google Career Certificates**
**URL:** https://grow.google/certificates/  
**Что изучили:**
- 📊 3-6 месяцев структура (у нас 9 месяцев / 12 модулей)
- 📊 Flexible learning pace (самостоятельный темп)
- 📊 Pre/post assessments (измерение роста)
- 📊 Career-focused approach (у нас - wellness-focused)

**Документ:** `GOOGLE_DEEP_ANALYSIS.md` (20 KB)

### **3. Khan Academy**
**URL:** https://www.khanacademy.org/  
**Что взяли:**
- 📚 Mastery-based learning (обучение до полного освоения)
- 📚 Adaptive difficulty (адаптивная сложность)
- 📚 Immediate feedback (мгновенная обратная связь)
- 📚 Progress tracking (отслеживание прогресса)

**Наша адаптация:** Bayesian Knowledge Tracing в `src/lib/adaptiveLearning.ts`

### **4. Duolingo**
**URL:** https://www.duolingo.com/  
**Что взяли:**
- 🎮 Gamification (XP, levels, streaks)
- 🎮 Daily goals (ежедневные цели)
- 🎮 Achievement badges (бейджи за достижения)
- 🎮 Forgiving streak (не наказываем за пропуски!)

**Наша адаптация:** `src/lib/gamification.ts` (480 lines)

### **5. Calm / Headspace**
**URL:** https://www.calm.com/ | https://www.headspace.com/  
**Что взяли:**
- 🧘 Mindfulness practices (практики осознанности)
- 🧘 Daily check-ins (ежедневные чек-ины)
- 🧘 Calming design (успокаивающий дизайн)
- 🧘 Guided meditations (управляемые медитации)
- 🧘 Sleep tracking (отслеживание сна)

**Наша адаптация:**
- `src/components/CheckInPanel.tsx` - ежедневные чек-ины
- `src/data/practicesData.ts` - практики для подростков
- Дизайн: calming blues & teals

### **6. Coursera**
**URL:** https://www.coursera.org/  
**Что изучили:**
- 🎓 Week-by-week structure (структура по неделям)
- 🎓 Peer review (взаимная проверка)
- 🎓 Discussion forums (форумы обсуждений)
- 🎓 Video lectures (видео-лекции)

**Наша адаптация:** 3-недельная структура каждого модуля

### **7. Cohort-Based Courses (Maven, On Deck)**
**URL:** https://maven.com/ | https://www.beondeck.com/  
**Что взяли:**
- 👥 Cohort structure (обучение в когортах)
- 👥 Live sessions (живые встречи)
- 👥 Peer support (поддержка ровесников)
- 👥 Group accountability (групповая ответственность)

**Наша адаптация:** `src/components/CohortSchedule.tsx`

### **8. Telegram Mini Apps**
**URL:** https://core.telegram.org/bots/webapps  
**Что используем:**
- 📱 Telegram SDK (@twa-dev/sdk)
- 📱 Native-like experience (нативный опыт)
- 📱 No installation needed (без установки)
- 📱 Cross-platform (кросс-платформенность)

**Наш бот:** @dapsy_teens_bot

---

### **📊 Наша уникальная формула:**

```
DA Teens = 
  Google Learn Your Way (micro-learning + scenarios)
  + Khan Academy (adaptive learning + mastery)
  + Duolingo (gamification + streaks)
  + Calm/Headspace (wellness + check-ins)
  + Cohort-Based Courses (social learning + live support)
  + Telegram (mobile-first + no installation)
  + Emotion-Aware AI (уникально!)
  + Russian Cultural Context (уникально!)
  + Crisis Support (уникально!)
```

**Результат:** Первая в мире **emotion-aware cohort-based wellness platform** для российских подростков!

---

## 📊 СТРУКТУРА ПРОЕКТА

### **🏗️ АРХИТЕКТУРА: Feature-Sliced Design (FSD)**

**⚠️ КРИТИЧЕСКИ ВАЖНО!** Проект использует **FSD (Feature-Sliced Design)** - современную архитектуру для масштабируемых React приложений.

**Принципы FSD:**
- ✅ **Модульность** - каждая фича изолирована
- ✅ **Переиспользование** - код не дублируется между слоями
- ✅ **Понятность** - структура папок отражает бизнес-логику
- ✅ **Масштабируемость** - легко добавлять новые фичи
- ✅ **Testability** - простое тестирование изолированных модулей

**Слои FSD (снизу вверх):**
```
src/
├── shared/          ← Переиспользуемые утилиты (UI kit, helpers, types)
├── entities/        ← Бизнес-сущности (module, lesson, user)
├── features/        ← Пользовательские сценарии (check-in, adaptive-learning)
├── widgets/         ← Композиты из features (dashboard-hero, module-grid)
├── pages/           ← Страницы приложения (routes)
└── app/             ← Инициализация приложения (providers, router)
```

**🚫 ЗАПРЕЩЕНО:**
- ❌ Импорт снизу вверх (entities → shared ✅, shared → entities ❌)
- ❌ Импорт между фичами (features/A → features/B ❌)
- ❌ Создавать папки вне FSD структуры
- ❌ Смешивать логику разных слоёв в одном файле

**✅ ОБЯЗАТЕЛЬНО:**
- ✅ Новые компоненты создавать в правильном слое FSD
- ✅ UI компоненты → `shared/ui/`
- ✅ Бизнес-логика → `entities/` или `features/`
- ✅ Сложные композиты → `widgets/`
- ✅ Читать [FSD документацию](https://feature-sliced.design/) при сомнениях

---

### **Формат программы**
```
12 МОДУЛЕЙ (годовая программа обучения)
├── Каждый модуль = 3 недели
├── Каждая неделя = структурированный контент
├── Общая длительность = ~9 месяцев
└── Когортное обучение (12-15 подростков в группе)
```

### **Структура недели**
```
НЕДЕЛЯ 1-3 (каждого модуля):
├── Понедельник: Новый контент (видео/текст/аудио/интерактив)
├── Вторник: Практика (дыхание, визуализация, дневник)
├── Среда: Групповая встреча (60 мин Zoom/Telegram)
├── Четверг: Рефлексия (ответы на вопросы)
├── Пятница: Практикум навыков (45 мин воркшоп)
├── Выходные: Домашнее задание + ежедневные чек-ины
└── Воскресенье: Итоги недели + подготовка к следующей
```

### **Технологический стек**
```typescript
{
  "фронтенд": "React 19 + TypeScript + Vite 6.3.6",
  "интерфейс": "Tailwind CSS 4.x + shadcn/ui (40+ компонентов)",
  "иконки": "Phosphor Icons (1,514 иконок)",
  "графики": "Recharts",
  "хранилище": "GitHub Spark KV (persistent в браузере)",
  "деплой": "GitHub Pages",
  "платформа": "Telegram Mini App (@twa-dev/sdk)",
  "телеграм_бот": "@dapsy_teens_bot"
}
```

---

## 🗂️ FILE STRUCTURE

### **Root Level**
```
da-teens-webapp-tele/
├── FOR_AGENTS.md                          ⭐ THIS FILE (read first!)
├── README.md                              📖 User-facing documentation
├── PRD.md                                 📋 Product Requirements Document
├── TECHNICAL_REQUIREMENTS.md              🛠️ Tech specs & data structure
├── PROJECT_PLAN.md                        🗺️ Development roadmap
│
├── GOOGLE_INTEGRATION_SUMMARY.md          🎓 Google Learn Your Way integration
├── GOOGLE_DEEP_ANALYSIS.md                🔬 Deep dive into Google methodology
├── GOOGLE_LEARN_YOUR_WAY_INTEGRATION.md   📚 Components & principles
├── BOUNDARIES_MODULE_REDESIGN.md          🛡️ 21-day Boundaries module plan
├── DOCUMENTATION_INDEX.md                 📑 Navigation for all docs
│
├── QUICK_START.md                         ⚡ 5-minute integration guide
├── IMPLEMENTATION_GUIDE.md                📖 Full implementation docs
├── SYSTEM_SUMMARY.md                      📊 System overview
├── ADAPTIVE_MODULE_COMPLETE.md            🧠 Adaptive learning system
├── AGENT_GUIDE.md                         🤖 Guide for AI agents
├── TESTING_CHECKLIST.md                   ✅ Testing procedures
├── TELEGRAM_SETUP.md                      📱 Telegram bot setup
├── SECURITY.md                            🔒 Security guidelines
│
├── package.json                           📦 Dependencies
├── vite.config.ts                         ⚙️ Vite configuration
├── tsconfig.json                          📘 TypeScript config
├── tailwind.config.js                     🎨 Tailwind config
└── components.json                        🧩 shadcn/ui config
```

### **Source Code (`src/`) - FSD Architecture**

**⚠️ Используется Feature-Sliced Design (FSD) - все файлы по слоям!**

```
src/
├── app/                                   🚀 Application layer
│   ├── App.tsx                           Main app component
│   ├── providers/                        Global providers
│   └── styles/                           Global styles
│
├── pages/                                 📄 Pages layer (routes)
│   └── [страницы приложения]
│
├── widgets/                               🧩 Widgets layer (complex composites)
│   ├── dashboard-hero/                   🏠 Dashboard hero widget
│   ├── module-grid/                      📊 Modules grid widget
│   ├── module-timeline/                  ⏱️ Module timeline widget
│   └── index.ts                          Public API
│
├── features/                              ⚙️ Features layer (user scenarios)
│   ├── adaptive-learning/                🧠 Adaptive learning feature
│   │   ├── model/                        Business logic
│   │   ├── ui/                          UI components
│   │   └── index.ts                      Public API
│   │
│   └── check-in/                         ✅ Daily check-in feature
│       ├── model/                        Business logic
│       ├── ui/                          UI components
│       └── index.ts                      Public API
│
├── entities/                              📦 Entities layer (business entities)
│   ├── module/                           📚 Module entity
│   │   ├── model/
│   │   │   ├── types.ts                 Module types
│   │   │   └── boundariesModule.ts      Boundaries module data
│   │   ├── ui/                          Module UI components
│   │   └── index.ts                      Public API
│   │
│   ├── lesson/                           📖 Lesson entity
│   │   ├── model/                        Lesson logic & types
│   │   ├── ui/                          Lesson components
│   │   └── index.ts
│   │
│   └── user/                             � User entity
│       ├── model/
│       │   └── types.ts                 User types
│       └── index.ts
│
├── shared/                                � Shared layer (reusable code)
│   ├── ui/                               🎨 UI Kit (shadcn/ui 40+ components)
│   │   ├── button.tsx                    Button component
│   │   ├── card.tsx                      Card component
│   │   ├── dialog.tsx                    Dialog component
│   │   ├── badge.tsx                     Badge component
│   │   ├── progress.tsx                  Progress bar
│   │   ├── avatar.tsx                    Avatar component
│   │   └── ...                           (37 more components)
│   │
│   ├── lib/                              � Utilities & helpers
│   │   ├── utils.ts                      Utility functions
│   │   └── cn.ts                         Class names helper
│   │
│   ├── hooks/                            🎣 Shared hooks
│   │   ├── useTelegram.ts               📱 Telegram SDK hook
│   │   └── use-mobile.ts                📱 Mobile detection
│   │
│   └── types/                            📘 Shared TypeScript types
│       └── telegram-webapp.d.ts         📱 Telegram types
│
├── components/                            � LEGACY! (в процессе миграции в FSD)
│   ├── AdaptiveLessonViewer.tsx         → moving to features/adaptive-learning
│   ├── CheckInPanel.tsx                 → moving to features/check-in
│   ├── ModuleGrid.tsx                   → moving to widgets/module-grid
│   ├── ModuleViewer.tsx                 → moving to widgets/module-viewer
│   ├── UniversalModuleViewer.tsx        ⭐ ЦЕНТРАЛИЗОВАННЫЙ ШАБЛОН МОДУЛЯ
│   ├── BoundariesModule.tsx             (специфичный для модуля #1)
│   └── ui/                              (уже перенесено в shared/ui/)
│
├── data/                                  � LEGACY! (в процессе миграции)
│   ├── boundariesModule.ts              → moved to entities/module/model
│   ├── moduleData.ts                    → moving to entities/module/model
│   ├── practicesData.ts                 → moving to entities/practice/model
│   └── teenContent.ts                   → moving to entities/content/model
│
├── lib/                                   🚨 LEGACY! (в процессе миграции)
│   ├── adaptiveLearning.ts              → moving to features/adaptive-learning
│   ├── gamification.ts                  → moving to features/gamification
│   └── types.ts                         → moving to shared/types
│
├── main.tsx                               🚀 Entry point
├── App.tsx                                📱 Root component (legacy)
├── index.css                              🎨 Global styles
└── main.css                               🎨 Main styles
```

**� FSD ПРАВИЛА (обязательны!):**

1. **Импорты только сверху вниз:**
   - ✅ `app` → `widgets` → `features` → `entities` → `shared`
   - ❌ НИКОГДА наоборот!

2. **Запрещено импортировать между слоями одного уровня:**
   - ❌ `features/check-in` → `features/adaptive-learning` (ЗАПРЕЩЕНО!)
   - ✅ Общий код выносить в `entities` или `shared`

3. **Public API через index.ts:**
   - ✅ Каждая фича/entity экспортирует только нужное в `index.ts`
   - ❌ Прямые импорты из внутренних файлов запрещены

4. **Один централизованный шаблон:**
   - ✅ `UniversalModuleViewer.tsx` - единый шаблон для всех 12 модулей
   - ❌ НЕ создавать `Module1.tsx`, `Module2.tsx` и т.д.
   - ✅ Данные модулей в `entities/module/model/`

**🚧 Статус миграции:**
- ✅ `shared/ui/` - завершено (40+ компонентов)
- ✅ `entities/module/` - завершено (types + boundariesModule)
- ✅ `entities/user/` - завершено
- ✅ `features/adaptive-learning/` - создано
- ✅ `features/check-in/` - создано
- ✅ `widgets/dashboard-hero/` - создано
- ⏳ `components/` - в процессе миграции
- ⏳ `data/` - в процессе миграции
- ⏳ `lib/` - в процессе миграции

---

## 🧠 ОСНОВНЫЕ СИСТЕМЫ

**⚠️ Эти 3 системы - сердце проекта. Изучи их внимательно!**

### **1. Адаптивный движок обучения (Adaptive Learning Engine)**
**Файл:** `src/lib/adaptiveLearning.ts` (496 строк)

**Назначение:** Рекомендует уроки на основе эмоционального состояния подростка

**Ключевые возможности:**
- ✅ Emotion-aware рекомендации (учёт настроения, тревоги, сна, энергии)
- ✅ Bayesian Knowledge Tracing (оценка уровня владения навыком)
- ✅ Zone of Proximal Development (подбор сложности)
- ✅ Поддержка 5 форматов (текст/видео/аудио/интерактив/mindmap)
- ✅ Расчёт когнитивной нагрузки
- ✅ Readiness score (готовность 0-100)

**Ключевые интерфейсы:**
```typescript
interface CheckInData {
  mood: number        // Настроение: 1-10 (1=ужасно, 10=отлично)
  anxiety: number     // Тревога: 1-10 (1=нет, 10=панический)
  sleep: number       // Сон: часы (например, 7.5)
  energy: number      // Энергия: 1-10 (1=истощён, 10=полон сил)
}

interface UserProgress {
  lessonsCompleted: string[]              // Завершённые уроки (ID)
  quizScores: Record<string, number>      // Баллы за тесты (lessonId → score)
  practicesCompleted: string[]            // Завершённые практики
  currentMastery: Record<string, number>  // Уровень владения (skillId → 0-1)
}

interface LessonRecommendation {
  lesson: Lesson                          // Рекомендованный урок
  score: number                           // Оценка релевантности (0-100)
  reasoning: string                       // Объяснение: почему этот урок
  format: 'text' | 'video' | 'audio' | 'interactive' | 'mindmap'
}
```

**Использование:**
```typescript
import { adaptiveLearning } from '@/lib/adaptiveLearning'

// Получить рекомендацию следующего урока
const recommendation = adaptiveLearning.recommendNextLesson(
  lessons,        // Доступные уроки
  checkInData,    // Чек-ин подростка (настроение, тревога, сон)
  userProgress    // История прогресса
)

// Система автоматически:
// 1. Анализирует эмоциональное состояние
// 2. Оценивает когнитивную нагрузку каждого урока
// 3. Учитывает текущий уровень владения навыками
// 4. Выбирает оптимальный формат (если устал → видео, если бодр → интерактив)
// 5. Объясняет свой выбор подростку
```

---

### **2. Система геймификации (Gamification System)**
**Файл:** `src/lib/gamification.ts` (480 строк)

**Назначение:** Мотивировать через XP, уровни, серии, бейджи

**Ключевые возможности:**
- ✅ XP система с бонусами за постоянство
- ✅ Forgiving streak (2 "заморозки" в неделю - не ломаем серию!)
- ✅ 15+ уникальных бейджей
- ✅ Wellness Score (холистическая метрика благополучия)
- ✅ Отслеживание эмоционального роста

**Ключевые интерфейсы:**
```typescript
interface GamificationProgress {
  totalXP: number               // Общий опыт (experience points)
  level: number                 // Текущий уровень (1, 2, 3...)
  currentStreak: number         // Текущая серия дней подряд
  longestStreak: number         // Рекордная серия
  freezeDaysUsed: number        // Использовано заморозок (из 2 в неделю)
  badges: UserBadge[]           // Заработанные бейджи
  lessonsCompleted: number      // Завершено уроков
  practicesCompleted: number    // Завершено практик
  checkInsCompleted: number     // Завершено чек-инов
}

interface Badge {
  id: string                    // Уникальный ID бейджа
  name: string                  // Название (например, "Первый шаг")
  description: string           // Описание достижения
  icon: string                  // Эмодзи иконка
  criteria: BadgeCriteria       // Критерий получения
  rarity: 'common' | 'rare' | 'epic' | 'legendary'  // Редкость
}
```

**Примеры бейджей:**
```typescript
const TEEN_BADGES = [
  '🎯 Первый шаг',           // Завершил первый урок
  '🛡️ Мастер границ',        // Прошёл все 9 уроков модуля Границы
  '🔥 Неделя огня',          // 7-дневная серия
  '🌟 Звезда постоянства',   // 30-дневная серия
  '😊 Эмоциональный рост',   // Улучшение настроения на 20%
  '🧘 Практик',              // 30 практик завершено
  '💎 Легенда',              // 100-дневная серия (!)
  '📚 Книжный червь',        // 25 уроков
  '🎓 Выпускник',            // 50 уроков
  '🏆 Чемпион',              // Все модули завершены
  // ... ещё 5 бейджей
]
```

**Почему "forgiving streak"?**
```typescript
// Традиционная система (плохо для подростков):
missedDay = true → streak = 0  ❌ Стресс!

// Наша система (психологически здоровая):
missedDay = true → useFreeze() → streak продолжается ✅
// Подросток не чувствует вины, но понимает ограниченность заморозок
```

---

### **3. Модуль "Личные границы" (Module #13)**
**Файл:** `src/data/boundariesModule.ts` (1,549 строк)

**Назначение:** Полноценный модуль из 9 уроков о личных границах

**Структура:**
```typescript
const boundariesModule = {
  id: 'boundaries',
  title: 'Личные границы',
  description: 'Учимся говорить "нет" и защищать свое пространство',
  icon: '🛡️',
  estimatedDuration: '3-4 недели',
  lessons: [
    {
      id: 'boundaries-1',
      title: 'Что такое личные границы?',
      subtitle: 'Первый шаг к пониманию себя',
      
      // 5 форматов одного урока (адаптация под состояние!)
      formats: {
        text: { ... },          // 5 мин - для спокойного чтения
        video: { ... },         // 7 мин - для визуалов
        audio: { ... },         // 8 мин - для прослушивания
        interactive: { ... },   // 10 мин - для активного взаимодействия
        mindmap: { ... }        // 3 мин - для быстрого обзора
      },
      
      quiz: [ ... ],            // 5 вопросов на проверку
      practiceExercise: { ... }, // Практика (дыхание, визуализация)
      homework: { ... }          // Домашнее задание (опционально)
    },
    // ... ещё 8 уроков
  ]
}
```

**9 уроков модуля:**
1. **Что такое личные границы?** - Введение, типы границ
2. **Типы границ** - Физические, эмоциональные, временные, цифровые, материальные
3. **Почему говорить "нет" сложно?** - Психология отказа, страхи
4. **Распознавание нарушений** - Как понять, что границу нарушили
5. **Уверенная коммуникация** - Формулы фраз, тон, язык тела
6. **Практика установки границ** - Ролевые игры, сценарии
7. **Границы в цифровом мире** - Соцсети, переписки, приватность
8. **Баланс между границами и эмпатией** - Как помогать без слияния
9. **План действий** - Интеграция в жизнь, поддержание границ

---

### **4. Интеграция Google Learn Your Way**

**⚠️ Эти 4 компонента созданы на основе анализа Google. Используй их!**

#### **A. MicroLearningCard.tsx** (200 строк)
**Источник:** Google Learn Your Way - bite-sized learning  
**Назначение:** Разбивка урока на короткие 3-5 минутные шаги

```typescript
interface MicroLearningStep {
  id: string              // Уникальный ID шага
  title: string           // Заголовок (например, "Что такое границы?")
  content: string         // Основной контент (2-3 параграфа)
  keyTakeaway: string     // Главный вывод (1 предложение, жирным)
  example: string         // Пример из жизни подростка
  quickTip: string        // Лайфхак (quick tip)
  reflection: string      // Вопрос для рефлексии
}
```

**Возможности:**
- ✅ Пошаговая прогрессия (Step 1 из 5)
- ✅ Визуальные точки прогресса
- ✅ Выделенные ключевые выводы
- ✅ Примеры из реальной жизни
- ✅ Быстрые советы (lifehacks)
- ✅ Вопросы для размышления

**Пример использования:**
```typescript
const microLesson = {
  steps: [
    {
      id: 'step-1',
      title: 'Твой невидимый забор',
      content: 'Представь забор вокруг тебя...',
      keyTakeaway: 'Границы = защита того, что важно для тебя',
      example: 'Друг берёт телефон без спроса',
      quickTip: 'Границы — это не эгоизм, это самоуважение',
      reflection: 'Когда ты последний раз чувствовал нарушение?'
    }
    // ... ещё 4 шага
  ]
}
```

---

#### **B. RealWorldScenario.tsx** (400 строк)
**Источник:** Google Career Certificates - practical application  
**Назначение:** Интерактивные сценарии с выбором решений

```typescript
interface Scenario {
  id: string              // ID сценария
  title: string           // Название (например, "Друг берёт телефон")
  character: {
    name: string          // Имя персонажа ("Ты")
    age: number           // Возраст (15)
    mood: string          // Настроение ("annoyed", "anxious")
  }
  situation: string       // Описание ситуации (2-3 предложения)
  choices: ScenarioChoice[]  // 4 варианта действий
}

interface ScenarioChoice {
  id: string              // ID выбора
  text: string            // Текст варианта (с эмодзи)
  isHealthy: boolean      // Здоровый ли выбор?
  feedback: string        // Обратная связь (почему да/нет)
  consequence: string     // Последствия выбора (что произойдёт)
  skillsUsed: string[]    // Какие навыки использованы
  impact: {
    mood: number          // Влияние на настроение (-20 до +20)
    confidence: number    // Влияние на уверенность
    relationship: number  // Влияние на отношения
  }
}
```

**Возможности:**
- ✅ 4 варианта на каждый сценарий (от токсичного до здорового)
- ✅ Мгновенная обратная связь
- ✅ Объяснение последствий
- ✅ Отслеживание использованных навыков
- ✅ Визуализация влияния на настроение/уверенность/отношения
- ✅ 2 готовых сценария включены

**Примеры сценариев:**
1. **"Звонок в 2 часа ночи"** - Друг звонит третий раз за неделю ночью
2. **"Мама читает переписку"** - Родители нарушают цифровые границы

---

#### **C. PeerLearningFeed.tsx** (500 строк)
**Источник:** Cohort-Based Courses - social learning  
**Назначение:** Социальное обучение через истории ровесников

```typescript
interface PeerStory {
  id: string              // ID истории
  author: {
    name: string          // Имя (Аня, Максим, Лиза)
    age: number           // Возраст (15-17)
    avatar: string        // Первая буква имени для аватара
    color: string         // Цвет аватара (pink, blue, purple)
  }
  category: 'family' | 'friends' | 'school' | 'digital'  // Категория
  date: string            // Когда опубликовано ("3 дня назад")
  
  situation: string       // Ситуация (что произошло)
  emotion: {
    before: string        // Эмоция до ("Тревога и злость")
    after: string         // Эмоция после ("Уважение к себе")
  }
  solution: string        // Решение (что сделал)
  outcome: string         // Результат (что получилось)
  
  skillsUsed: string[]    // Использованные навыки
  helpful: number         // Счётчик "Помогло" (лайки)
  comments: Comment[]     // Комментарии других подростков
}
```

**Возможности:**
- ✅ Система аватаров (цветные круги с инициалами)
- ✅ Раскрывающиеся карточки (collapsed → full)
- ✅ Кнопка "Помогло мне" (лайки с счётчиком)
- ✅ 4 категории с иконками: 🏠 Семья, 👥 Друзья, 🎓 Школа, 💻 Интернет
- ✅ Эмоциональная трансформация (Злость → Уважение)
- ✅ 4 готовые истории от подростков

**Примеры историй:**
1. **Аня, 16** - "Как я научилась отказывать подруге" (не давать списывать)
2. **Максим, 15** - "Установил границы с младшим братом"
3. **Лиза, 17** - "Защитила приватность в соцсетях"
4. **Даня, 16** - "Остановил травлю в классе"

---

#### **D. SkillsTracker.tsx** (400 строк)
**Источник:** Khan Academy - mastery learning  
**Назначение:** Визуализация развития навыков с вехами

```typescript
interface Skill {
  id: string              // ID навыка
  name: string            // Название ("Умение говорить 'нет'")
  category: 'communication' | 'emotional' | 'social' | 'self-care'
  level: number           // Уровень: 0-5 (Beginner → Master)
  progress: number        // Прогресс: 0-100%
  practiceCount: number   // Сколько раз практиковал
  lastPracticed: Date     // Когда последний раз практиковал
  milestones: Milestone[] // 4 вехи на навык
}

interface Milestone {
  level: number           // 25, 50, 75, 100
  title: string           // Название вехи
  unlocked: boolean       // Разблокирована ли
  description: string     // Что умеешь на этом уровне
}
```

**6 навыков модуля "Границы":**

1. **Умение говорить "нет"** (Коммуникация)
   - 25%: Первые шаги
   - 50%: Уверенность
   - 75%: Мастерство
   - 100%: Эксперт

2. **Распознавание нарушений** (Эмоциональный интеллект)
   - 25%: Осознание
   - 50%: Анализ
   - 75%: Предвидение
   - 100%: Защита

3. **Уверенная коммуникация** (Коммуникация)
   - 25%: Базовые фразы
   - 50%: Тон и язык тела
   - 75%: В конфликте
   - 100%: Мастер диалога

4. **Самозабота** (Self-care)
   - 25%: Приоритеты
   - 50%: Баланс
   - 75%: Устойчивость
   - 100%: Благополучие

5. **Эмпатия с границами** (Эмоциональный интеллект)
   - 25%: Понимание
   - 50%: Без слияния
   - 75%: Здоровая помощь
   - 100%: Мудрая забота

6. **Решение конфликтов** (Социальные навыки)
   - 25%: Спокойствие
   - 50%: Переговоры
   - 75%: Посредничество
   - 100%: Миротворец

**Каждый навык имеет 4 вехи (milestones)** = 24 момента празднования! 🎉

---

## ⚠️ НАПОМИНАНИЕ: ПРОДОЛЖАЙ ЧИТАТЬ!

**Ты прочитал ~40% файла. Осталось ещё 60%!**

Следующие разделы критически важны:
- 📚 Ключевая документация (какие файлы читать дальше)
- 🎯 Типичные задачи (как добавлять контент)
- 🚀 Процесс разработки (команды, workflow)
- 🔑 Ключевые концепции (важные идеи проекта)

**НЕ останавливайся здесь! Читай дальше! ⬇️**

---

## 📚 5. Ключевая документация

### **Начни с этого (по приоритету):**

1. **FOR_AGENTS.md** (ЭТОТ ФАЙЛ) - Обзор всего проекта
2. **GOOGLE_INTEGRATION_SUMMARY.md** - Что добавили недавно
3. **QUICK_START.md** - 5-минутное руководство по интеграции
4. **IMPLEMENTATION_GUIDE.md** - Полная техническая документация
5. **SYSTEM_SUMMARY.md** - Архитектура системы

### **Глубокое погружение:**

- **GOOGLE_DEEP_ANALYSIS.md** - Методология Google Learn Your Way
- **BOUNDARIES_MODULE_REDESIGN.md** - 21-дневный структурированный план обучения
- **GOOGLE_LEARN_YOUR_WAY_INTEGRATION.md** - 4 новых компонента (подробно)
- **ADAPTIVE_MODULE_COMPLETE.md** - Детали адаптивной системы обучения

### **Справочные материалы:**

- **TECHNICAL_REQUIREMENTS.md** - Структура данных, спецификации API, Google Sheets integration
- **TESTING_CHECKLIST.md** - Процедуры тестирования
- **QUICK_START.md** - Быстрый старт для новых разработчиков
- **IMPLEMENTATION_GUIDE.md** - Руководство по реализации компонентов

*Примечание: PROJECT_PLAN.md, PRD.md, AGENT_GUIDE.md удалены 21 окт 2025 (устарели, конфликтовали с Google Sheets решением)*

---

## 🎯 6. Типичные задачи для AI агентов

### **Задача 1: Добавить новый модуль**
```typescript
// 1. Создай данные модуля в src/data/moduleData.ts
const newModule = {
  id: 14,                    // Следующий номер модуля
  title: 'Новый модуль',     // Название
  description: '...',        // Описание
  weeks: [ ... ]             // Структура недель
}

// 2. Добавь в src/components/ModuleGrid.tsx
// Изменения в коде НЕ нужны - рендерится автоматически!
```

### **Задача 2: Добавить новый урок в модуль "Границы"**
```typescript
// Файл: src/data/boundariesModule.ts
export const boundariesModule = {
  lessons: [
    // ... существующие 9 уроков
    {
      id: 'boundaries-10',     // ID нового урока
      title: 'Новый урок',     // Название
      subtitle: '...',         // Подзаголовок
      formats: { ... },        // 5 форматов (text, video, audio, interactive, mindmap)
      quiz: [ ... ],           // 5 вопросов
      practiceExercise: { ... } // Практика
    }
  ]
}
```

### **Задача 3: Создать новый бейдж**
```typescript
// Файл: src/lib/gamification.ts
export const TEEN_BADGES: Badge[] = [
  // ... существующие бейджи
  {
    id: 'new-badge',          // ID бейджа
    name: 'Новый бейдж',      // Название
    description: 'Описание',  // За что дают
    icon: '🎯',               // Эмодзи
    rarity: 'rare',           // common | rare | epic | legendary
    criteria: {
      type: 'lessons_completed',  // Тип критерия
      threshold: 20                // Порог (20 уроков)
    }
  }
]
```

### **Задача 4: Добавить новый сценарий**
```typescript
// Файл: src/components/RealWorldScenario.tsx
const newScenario: Scenario = {
  id: 'scenario-3',             // ID сценария
  title: 'Новый сценарий',      // Заголовок
  situation: 'Описание ситуации...', // Ситуация из жизни подростка
  choices: [
    {
      id: 'choice-1',
      text: 'Вариант 1',
      isHealthy: true,          // Здоровая ли граница?
      feedback: 'Обратная связь',
      consequence: 'Последствия',
      skillsUsed: ['Навык 1', 'Навык 2']
    }
    // ... ещё 3 варианта (всего 4)
  ]
}
```

### **Задача 5: Добавить историю от сверстника**
```typescript
// Файл: src/components/PeerLearningFeed.tsx
const newStory: PeerStory = {
  id: 'story-5',
  author: {
    name: 'Имя',              // Имя подростка
    age: 16,                  // Возраст 15-17
    avatar: 'И'               // Первая буква имени
  },
  category: 'friends',        // family | friends | school | digital
  situation: 'Ситуация...',   // С чем столкнулся
  solution: 'Решение...',     // Как решил
  outcome: 'Результат...',    // Что получилось
  skillsUsed: ['Навык 1'],    // Какие навыки использовал
  helpful: 0                  // Счётчик полезности (начинаем с 0)
}
```

---

## 🚀 7. Процесс разработки

### **Запуск проекта**
```bash
# 1. Установи зависимости
npm install

# 2. Запусти dev-сервер
npm run dev

# 3. Открой браузер
# http://localhost:5003/da-teens-webapp-tele/
```

### **Сборка для продакшена**
```bash
# Сборка для GitHub Pages
npm run build

# Предпросмотр production-сборки
npm run preview
```

### **Команды проекта**
```bash
npm run dev       # Запустить Vite dev-сервер
npm run build     # Собрать для продакшена
npm run preview   # Предпросмотр production-сборки
npm run lint      # Запустить ESLint
npm run optimize  # Оптимизировать зависимости
npm run kill      # Убить процесс на порту 5000
```

---

## 📊 8. Поток данных

### **Путь пользователя:**
```
1. Пользователь открывает Telegram-бота (@dapsy_teens_bot)
   ↓
2. Бот открывает Mini App (GitHub Pages)
   ↓
3. Приложение загружается с GitHub Pages
   ↓
4. Пользователь проходит ежедневный чек-ин
   ↓
5. Адаптивный движок анализирует эмоциональное состояние
   ↓
6. Система рекомендует лучший урок
   ↓
7. Пользователь проходит урок в предпочитаемом формате
   ↓
8. Валидация квиза
   ↓
9. Практическое упражнение
   ↓
10. Начисление XP, проверка бейджей
   ↓
11. Прогресс сохраняется в Spark KV (dev/MVP) или Google Sheets (production)
   ↓
12. (Будущее) Полная синхронизация с Google Sheets API для панели куратора
```

### **Управление состоянием:**
```typescript
// Сейчас: GitHub Spark KV (browser storage)
import { useKV } from '@github/spark'

const [progress, setProgress] = useKV('user-progress', {
  totalXP: 0,      // Общий опыт
  level: 1,        // Уровень
  streak: 0        // Серия дней
})

// Будущее: Google Sheets API
// Синхронизация localStorage/KV → Google Sheets для мультиустройств + доступ куратора
```

---

## 🔑 9. Ключевые концепции

### **1. Emotion-Aware Learning (Обучение с учётом эмоций)**
В отличие от традиционных LMS, система учитывает эмоциональное состояние:

```typescript
if (mood < 4 && anxiety > 7) {
  // Рекомендуем урок с низкой когнитивной нагрузкой
  // Предлагаем видео-формат (легче, чем текст)
  // Сначала предлагаем дыхательную практику
}
```

### **2. Множественные форматы (Зона ближайшего развития)**
Один урок, 5 форматов, разная сложность:

```
легче     →  Mindmap (визуальная карта, 3 мин)
  ↓
Audio (пассивное прослушивание, 8 мин)
  ↓
Video (смотреть + слушать, 7 мин)
  ↓
Text (читать + размышлять, 5 мин)
  ↓
сложнее  →  Interactive (взаимодействовать + решать, 10 мин)
```

### **3. Байесовская трассировка знаний (Bayesian Knowledge Tracing)**
Система оценивает уровень владения (mastery level: 0-1):

```typescript
mastery = P(knows concept | evidence)  // Вероятность знания концепции

evidence = {
  quiz_scores: [0.8, 0.9, 0.7],  // Результаты квизов
  practice_completed: true,       // Практика завершена
  time_since_last: 3_days        // Дней с последней практики
}

// Если mastery < 0.3 → начинающий (beginner)
// Если mastery 0.3-0.7 → средний (intermediate)
// Если mastery > 0.7 → продвинутый (advanced)
```

### **4. Forgiving Streak System (Прощающая система серий)**
Не наказываем за пропуски:

```typescript
streak = {
  current: 5,       // Текущая серия
  freezeDays: 2,    // Можно пропустить 2 дня без потери серии
  maxFreezes: 2     // Максимум 2 "заморозки" в неделю
}

// Традиционный подход: Пропустил 1 день → streak = 0 ❌
// DA Teens: Пропустил 1 день → используй "заморозку" → серия продолжается ✅
```

---

## 🎨 10. UI/UX принципы

### **Дизайн-система:**
- **Цвета:** Успокаивающие голубые и бирюзовые (доверие, спокойствие)
- **Типографика:** Шрифт Inter (чистый, читаемый)
- **Отступы:** Щедрые пробелы (снижение когнитивной нагрузки)
- **Иконки:** Phosphor (ориентированные на благополучие)
- **Компоненты:** shadcn/ui (доступные, настраиваемые)

### **Для подростков:**
- ✅ Эмодзи везде (говорим на их языке)
- ✅ Короткие параграфы (продолжительность внимания)
- ✅ Геймификация (мотивация)
- ✅ Истории сверстников (социальное доказательство)
- ✅ Никакого корпоративного жаргона

### **Mobile-First (Мобильные устройства в приоритете):**
- ✅ Touch-friendly (минимум 44px для кнопок)
- ✅ Жесты свайпа
- ✅ Сворачиваемая навигация
- ✅ Быстрая загрузка (Vite)

---

## 🚨 11. Важные ограничения

### **1. Только русский язык**
- Весь контент на русском
- Культурный контекст: русские семьи, школы, отношения
- НЕ перевод - нативный контент

### **2. Возраст: 13-18 лет**
- Соответствие возрастному развитию
- Сценарии, связанные со школой
- Динамика родитель-подросток
- Ситуации давления сверстников

### **3. Приватность на первом месте**
- Никакого сбора чувствительных данных
- Telegram ID как идентификатор
- Локальное хранилище (KV)
- Опциональный анонимный режим

### **4. Кризисная поддержка**
- Кнопка SOS всегда видна
- Прямая линия к кураторам
- Доступность 24/7 (в будущем)
- Профессиональные психологи

---

## 📈 12. Текущий статус (21 октября 2025)

### **✅ Завершено:**
- [x] Структура 12 базовых модулей
- [x] Модуль #13 "Личные границы" (9 уроков, 1,549 строк)
- [x] Адаптивный движок обучения (496 строк)
- [x] Система геймификации (480 строк)
- [x] 4 компонента вдохновлённых Google (1,560 строк)
- [x] Интеграция AdaptiveLessonViewer
- [x] Полная документация (5 MD файлов, 91 KB)

### **🚧 В процессе:**
- [ ] Преобразовать 9 уроков → 21-дневная структура микро-обучения
- [ ] Добавить 15+ реальных сценариев
- [ ] Собрать 20+ историй от подростков
- [ ] Реальный видео/аудио контент (сейчас заглушки)

### **📅 Запланировано:**
- [ ] Полная интеграция с Google Sheets API (панель куратора)
- [ ] Синхронизация между устройствами через Google Sheets
- [ ] AI-персонализация
- [ ] Система сертификатов
- [ ] Расширенная аналитика

---

## 🎯 13. Следующие приоритеты

### **Вариант 1: Пилот Неделя 1** (Рекомендуется)
**Цель:** Быстро протестировать концепцию

**Задачи:**
1. Реализовать полную Неделю 1 (7 дней)
2. Запустить с 1 когортой (12-15 подростков)
3. Собрать обратную связь
4. Итерировать
5. Масштабировать на Недели 2-3

**Время:** 2-3 дня разработки + 7 дней тестирования

---

### **Вариант 2: Полный редизайн модуля**
**Цель:** Завершить модуль "Границы"

**Задачи:**
1. Неделя 1 (7 дней контента)
2. Неделя 2 (7 дней контента)
3. Неделя 3 (7 дней контента)
4. Тестирование
5. Запуск

**Время:** 1-2 недели разработки + 3 недели тестирования

---

### **Вариант 3: Масштабирование на все модули**
**Цель:** Применить ко всем 12 модулям

**Задачи:**
1. Завершить модуль "Границы"
2. Создать шаблон
3. Адаптировать 11 других модулей
4. Запустить полную программу

**Время:** 2-3 месяца

---

## 🤝 14. Для AI агентов: Как помочь

### **Когда пользователь просит добавить контент:**
1. ✅ Проверь существующую структуру в `src/data/`
2. ✅ Следуй существующим паттернам (интерфейсы, именование)
3. ✅ Используй русский язык
4. ✅ Добавь валидацию (вопросы квиза, шаги практики)
5. ✅ Обнови связанные компоненты при необходимости

### **Когда пользователь просит исправить баги:**
1. ✅ Сначала проверь инструмент `get_errors`
2. ✅ Прочитай релевантные файлы полностью
3. ✅ Протестируй локально перед предложением
4. ✅ Объясни, что было не так и почему фикс работает

### **Когда пользователь просит новые функции:**
1. ✅ Проверь, есть ли что-то похожее в кодовой базе
2. ✅ Прочитай релевантную документацию
3. ✅ Сначала предложи структуру, потом реализуй
4. ✅ Добавь в соответствующую документацию

### **Когда пользователь спрашивает об архитектуре:**
1. ✅ Отсылай к этому файлу (FOR_AGENTS.md)
2. ✅ Указывай на конкретную документацию
3. ✅ Объясняй компромиссы в решениях
4. ✅ Предлагай альтернативы при необходимости

---

## 📞 15. Полезный контекст

### **Владелец проекта:**
- **Роль:** Куратор/Психолог для подростков
- **Навыки:** Базовые технические знания, сильный в контенте
- **Потребности:** AI для технической части, фокус на психологии/контенте

### **Целевые пользователи:**
- **Возраст:** 13-18 лет
- **Локация:** Россия
- **Язык:** Русский (родной)
- **Среда:** Telegram (mobile-first)
- **Вызовы:** Школьный стресс, давление сверстников, семейные конфликты

### **Среда разработки:**
- **Редактор:** VS Code
- **AI:** GitHub Copilot, Cursor, Claude
- **Git:** GitHub (johnda7/da-teens-webapp-tele)
- **Деплой:** GitHub Pages (авто-деплой при push)

---

## 🔗 16. Быстрые ссылки

### **Документация:**
- [GOOGLE_INTEGRATION_SUMMARY.md](./GOOGLE_INTEGRATION_SUMMARY.md) - Недавние обновления
- [BOUNDARIES_MODULE_REDESIGN.md](./BOUNDARIES_MODULE_REDESIGN.md) - 21-дневный план
- [QUICK_START.md](./QUICK_START.md) - 5-минутное руководство
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Полная документация

### **Ключевые файлы:**
- [src/lib/adaptiveLearning.ts](./src/lib/adaptiveLearning.ts) - Адаптивный движок
- [src/lib/gamification.ts](./src/lib/gamification.ts) - Геймификация
- [src/data/boundariesModule.ts](./src/data/boundariesModule.ts) - 9 уроков
- [src/components/AdaptiveLessonViewer.tsx](./src/components/AdaptiveLessonViewer.tsx) - Плеер урока

### **Разработка:**
- Локально: http://localhost:5003/da-teens-webapp-tele/
- GitHub: https://github.com/johnda7/da-teens-webapp-tele
- Telegram Bot: @dapsy_teens_bot

---

## 🎉 17. Краткое резюме для AI агентов

**Этот проект:**
- ✅ Telegram Mini App для российских подростков (13-18 лет)
- ✅ Платформа психологического благополучия
- ✅ Адаптивное обучение на основе эмоций
- ✅ Когортное обучение с живыми кураторами
- ✅ 12 модулей x 3 недели = 9 месяцев программа
- ✅ Вдохновлён Google Learn Your Way
- ✅ Полная геймификация (XP, бейджи, серии)
- ✅ Кризисная поддержка (кнопка SOS)

**Технический стек:**
- React 19 + TypeScript + Vite 6.3.6
- Tailwind CSS 4.x + shadcn/ui
- GitHub Spark KV хранилище
- Telegram Mini App SDK

**Текущее состояние:**
- ✅ FSD архитектура - внедрена и задеплоена в production (ветка `main`)
- ✅ 1 завершённый модуль (Границы, 9 уроков)
- ✅ Адаптивный движок работает
- ✅ Геймификация работает
- ✅ CheckInPanel с настоящим Liquid Glass эффектом (21 окт 2025)
- ✅ Централизованный шаблон модуля (UniversalModuleViewer)
- ⏳ Модули #2-13 в разработке (пока Coming Soon)
- ⏳ Недельная структура модулей (Week tabs) - в планах
- ✅ Задеплоено на GitHub Pages! Работает в production (ветка `main`)

**Следующий шаг:**
- Применить Liquid Glass паттерн к остальным карточкам (ModuleGrid, BadgeGrid и т.д.)
- Создать недельную структуру для модулей (Week tabs + Video/Practice/Reflection/Homework cards)
- Завершить миграцию на FSD (перенести legacy components/ в правильные слои)
- Протестировать с реальными подростками
- Итерировать на основе обратной связи

---

## 📜 18. ИСТОРИЯ ИЗМЕНЕНИЙ (Git Log)

### 21 октября 2025

**b5e4acb** - 📚 DOC: Добавлено текущее состояние модулей, решение проблемы Liquid Glass и roadmap
- Обновлен раздел "ДИЗАЙН-УЛУЧШЕНИЯ" с текущим статусом
- Добавлена секция "ТЕКУЩЕЕ СОСТОЯНИЕ МОДУЛЕЙ" с подробным описанием
- Зафиксировано решение проблемы backdrop-filter на белом фоне
- Добавлен план развития недельной структуры модулей

**3019a03** - 📚 DOC: Добавлено описание FSD архитектуры и централизованного шаблона модуля
- Добавлено "Правило #0: АРХИТЕКТУРА ПРОЕКТА" в начало файла
- Описана FSD структура (shared → entities → features → widgets → pages → app)
- Добавлены правила импортов и запреты
- Обновлена секция "Source Code" с реальной FSD структурой
- Указано что используется централизованный шаблон UniversalModuleViewer
- Отмечены LEGACY папки (components/, data/, lib/) в процессе миграции

**3a9cfee** - 🎨 FIX: Настоящий Liquid Glass с градиентным фоном
- **Файл:** CheckInPanel.tsx (+110 строк, -58 строк)
- **Проблема:** backdrop-filter не работал на белом фоне → серые карточки
- **Решение:** Добавлен градиентный фон `from-blue-50 via-purple-50 to-pink-50`
- **3 анимированных orbs:** blue (20s), purple (25s), pink (30s) с blur-3xl и opacity 20%
- **Карточки:** `bg-white/70 backdrop-blur-[40px]` с gradient overlay
- **Текст:** Улучшен контраст до `text-gray-900`
- **Тени:** Усилены для визуальной глубины
- **Результат:** Настоящий эффект "живого стекла" iOS 26

---

## 🎉 17. Краткое резюме для AI агентов

**Этот проект:**
- ✅ Telegram Mini App для российских подростков (13-18 лет)
- ✅ Платформа психологического благополучия
- ✅ Адаптивное обучение на основе эмоций
- ✅ Когортное обучение с живыми кураторами
- ✅ 12 модулей x 3 недели = 9 месяцев программа
- ✅ FSD (Feature-Sliced Design) архитектура
- ✅ Вдохновлён Google Learn Your Way
- ✅ Полная геймификация (XP, бейджи, серии)
- ✅ Кризисная поддержка (кнопка SOS)
- ✅ iOS 26 Liquid Glass дизайн

**Технический стек:**
- React 19 + TypeScript + Vite 6.3.6
- Tailwind CSS 4.x + shadcn/ui (40+ компонентов)
- Framer Motion (анимации)
- Phosphor Icons (1,514 иконок)
- GitHub Spark KV хранилище
- Telegram Mini App SDK (@twa-dev/sdk)

## 📋 18. Контрольный список для агентов

**Перед началом работы:**
- [ ] Прочитал FOR_AGENTS.md полностью
- [ ] Понял 8 источников вдохновения
- [ ] Изучил структуру проекта
- [ ] Знаю где найти данные модулей
- [ ] Понял систему адаптивного обучения
- [ ] Понял систему геймификации

**При добавлении контента:**
- [ ] Контент на русском языке
- [ ] Соответствует возрасту 13-18 лет
- [ ] Есть примеры из жизни подростков
- [ ] Есть валидация (квиз/практика)
- [ ] Следует существующим паттернам

**При исправлении багов:**
- [ ] Использовал `get_errors` инструмент
- [ ] Прочитал весь файл, не только фрагменты
- [ ] Понял причину проблемы
- [ ] Протестировал решение локально
- [ ] Объяснил что и почему изменено

**При добавлении функций:**
- [ ] Проверил, есть ли похожее в кодовой базе
- [ ] Предложил структуру перед кодом
- [ ] Следовал дизайн-системе (UI/UX)
- [ ] Следовал FSD архитектуре (правильный слой!)
- [ ] Использовал централизованные шаблоны (не дублировал)
- [ ] Liquid Glass с градиентным фоном (не на белом!)
- [ ] Добавил в документацию
- [ ] Подумал о мобильной версии

**Частые ошибки AI агентов (НЕ ДЕЛАЙ ТАК!):**
- ❌ Забыл про FSD и создал файл в components/ напрямую
- ❌ Создал отдельный компонент для модуля вместо использования UniversalModuleViewer
- ❌ Добавил backdrop-filter без фонового градиента → серые карточки
- ❌ Начал кодить без изучения существующей структуры
- ❌ Забыл что FSD архитектура уже в production (работаем в ветке `main`)
- ❌ Не зафиксировал важные находки в FOR_AGENTS.md
- ❌ Импортировал между фичами одного уровня (features/A → features/B)
- ❌ Не использовал Public API через index.ts

---

**Последнее обновление:** 21 октября 2025, 02:30  
**Обновил:** GitHub Copilot  
**Статус:** ✅ Готов для агентов (обновлено с учетом FSD и Liquid Glass фиксов)

**Вопросы? Начни с:**
1. Этот файл (FOR_AGENTS.md)
2. GOOGLE_INTEGRATION_SUMMARY.md
3. Задавай конкретные вопросы с ссылками на файлы

---

## 🚀 Поздравляем! Ты прочитал весь файл!

**Теперь ты знаешь:**
- ✅ Что такое DA Teens и зачем он нужен
- ✅ Откуда мы взяли вдохновение (8 источников)
- ✅ Как устроен проект (структура, технологии)
- ✅ Как работают основные системы (адаптивное обучение, геймификация)
- ✅ Какие компоненты мы создали на основе Google
- ✅ Какая документация есть и где её найти
- ✅ Как добавлять контент (5 примеров задач)
- ✅ Как работает процесс разработки
- ✅ Как данные текут в системе
- ✅ Ключевые концепции (эмоции, форматы, байес, прощающие серии)
- ✅ UI/UX принципы (цвета, типографика, мобильность)
- ✅ Важные ограничения (язык, возраст, приватность, кризисы)
- ✅ Текущий статус и следующие приоритеты
- ✅ Как помогать в разных ситуациях
- ✅ Контекст проекта (кто, для кого, где)
- ✅ Быстрые ссылки на всю документацию

**Готов помогать! 🎯**

*Если забыл что-то - возвращайся к нужному разделу через оглавление!*

---

## 📝 ИСТОРИЯ ПОСЛЕДНИХ ОБНОВЛЕНИЙ

### 🗑️ 21 октября 2025, 06:30 - Чистка документации

**Что удалено (устаревшие файлы):**
- ❌ `AGENT_GUIDE.md` (455 строк) - вся информация уже в FOR_AGENTS.md
- ❌ `PLATFORM_ARCHITECTURE.md` - рекомендовал Supabase, но мы выбрали Google Sheets
- ❌ `PRD.md` - Product Requirements Document, избыточен
- ❌ `PROJECT_PLAN.md` - план интеграции Airtable, но мы выбрали Google Sheets
- ❌ `SECURITY.md` - стандартный шаблон GitHub, не специфичен для проекта

**Причина удаления:** Конфликты и избыточность
- Эти файлы содержали устаревшую информацию (до FSD, до Google Sheets)
- Противоречили текущим архитектурным решениям
- Вся актуальная информация уже в FOR_AGENTS.md и других рабочих docs

**Что осталось (актуальные файлы):**
- ✅ `FOR_AGENTS.md` - главный файл для всех AI агентов (этот файл!)
- ✅ `IMPLEMENTATION_GUIDE.md` - пошаговая интеграция адаптивной системы
- ✅ `SYSTEM_SUMMARY.md` - обзор системы обучения
- ✅ `TESTING_CHECKLIST.md` - чеклист для тестирования
- ✅ `QUICK_START.md` - быстрый старт за 5 минут
- ✅ `README.md` - обзор проекта
- ✅ `TECHNICAL_REQUIREMENTS.md` - технические требования (требует обновления)
- ✅ `TELEGRAM_SETUP.md` - настройка Telegram бота
- ✅ `INTEGRATION_SUMMARY.md` - история интеграции
- ✅ `DOCUMENTATION_INDEX.md` - индекс всей документации

**Результат:**
- Единый источник правды: FOR_AGENTS.md
- Нет конфликтующей информации
- Нет избыточных файлов
- Чистая структура документации

**Git commits:**
```bash
216ac2b - 🎨 FIX: Настоящий Liquid Glass с градиентным фоном
a3748b5 - 🗑️ CLEAN: Удалены устаревшие документы
```

---

### 🎨 21 октября 2025, 05:15 - Liquid Glass фикс

**Проблема:** CheckInPanel имел плоский серый вид вместо "живого стекла"
**Причина:** backdrop-filter не работает на белом фоне без контента под ним

**Решение:** Добавлен градиентный фон с 3 анимированными orbs
```tsx
// Background layer
<div className="fixed inset-0 -z-10">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
  
  {/* Animated orb 1 - blue */}
  <motion.div 
    className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
  />
  
  {/* Animated orb 2 - purple */}
  <motion.div 
    className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
    animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
  />
  
  {/* Animated orb 3 - pink */}
  <motion.div 
    className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
    animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
  />
</div>

// Cards with glass effect
<div className="relative bg-white/70 backdrop-blur-[40px] border border-white/20">
```

**Результат:**
- ✅ Настоящий "живой" эффект стекла
- ✅ Плавные анимации orbs (20s, 25s, 30s)
- ✅ Глубина через blur и прозрачность
- ✅ Визуальный интерес без отвлечения

**Build:** 4.52s, CSS 698.38 kB (+16 KB)
**Commit:** 216ac2b

---

### 📊 Статистика проекта после чистки

**Документация:**
- 10 актуальных .md файлов (~90 KB)
- FOR_AGENTS.md - 2,360 строк (главный файл)
- Удалено 5 устаревших файлов (1,827 строк)

**Код:**
- React 19 + TypeScript + Vite 6.3.6
- Tailwind CSS 4.x (706.73 kB)
- Bundle: 737.69 kB JS
- 12 модулей контента
- FSD архитектура (✅ задеплоена в production)

**Деплой:**
- Ветка: `main` (fsd-migration merged 21 окт 2025)
- Build: успешно (4.87s)
- GitHub: https://github.com/johnda7/da-teens-webapp-tele
- Live: https://johnda7.github.io/da-teens-webapp-tele/

**Завершённые задачи (21 окт 2025):**
1. ✅ TECHNICAL_REQUIREMENTS.md обновлён (Google Sheets как FINAL)
2. ✅ README.md обновлён (FSD архитектура, badges)
3. ✅ TELEGRAM_SETUP.md дополнен (useTelegram hook)
4. ✅ fsd-migration → main merge успешно выполнен (commit 3266274)

---

## 🚀 История деплоя и важные обновления

### **21 октября 2025, 06:00 - FSD в production**

**Что сделано:**
- ✅ Ветка `fsd-migration` → `main` (merge commit 3266274)
- ✅ Deployed to GitHub Pages (https://johnda7.github.io/da-teens-webapp-tele/)
- ✅ Ветка `fsd-migration` удалена (локально и на GitHub)
- ✅ 81 файл изменён: +10,451 / -2,721 строк
- ✅ Все документы перемещены в `docs/` папку
- ✅ FOR_AGENTS.md актуализирован (удалены упоминания fsd-migration, Airtable)

**Архитектурные решения:**
- **Хранилище:** Google Sheets API (FINAL) — для production
- **Dev storage:** localStorage / GitHub Spark KV — для MVP и разработки
- **Отклонено:** Supabase, Firebase, Airtable

**Удалённые файлы (устаревшие):**
- `AGENT_GUIDE.md` (455 строк) — дублировал FOR_AGENTS.md
- `PLATFORM_ARCHITECTURE.md` — рекомендовал Supabase (отклонено)
- `PRD.md` — Product Requirements Document (избыточен)
- `PROJECT_PLAN.md` — план интеграции Airtable (отклонено)
- `SECURITY.md` — стандартный шаблон GitHub (не специфичен)

**Текущий статус:**
- Работаем в ветке **`main`**
- FSD архитектура полностью внедрена
- Приложение задеплоено и работает в production
- Вся документация актуализирована

---

**Последнее обновление:** 21 октября 2025, 06:10
