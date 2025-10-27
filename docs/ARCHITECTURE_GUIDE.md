# 🏗️ Архитектура приложения DA Teens

> **Дата:** 21 октября 2025  
> **Цель:** Правильная структура для масштабирования и переноса на платформу с бэкендом

---

## 📚 ЛУЧШИЕ ПРАКТИКИ (изучено)

### 1️⃣ **Feature-Based Architecture** (Рекомендуется!)

**Принцип:** Группируем код по фичам/модулям, а не по типу файлов

```
src/
  features/           ← Основные фичи приложения
    auth/             ← Авторизация
      components/
      hooks/
      api/
      types/
      index.ts
    boundaries/       ← Модуль "Границы" (#13)
      components/
      data/
      hooks/
      types/
      index.ts
    confidence/       ← Модуль "Уверенность" (#1)
      components/
      data/
      hooks/
      types/
      index.ts
  shared/            ← Переиспользуемый код
    ui/              ← UI компоненты (Button, Card)
    hooks/           ← Общие хуки
    utils/           ← Утилиты
    types/           ← Общие типы
    api/             ← API клиент
  app/               ← Конфигурация приложения
    routes/          ← Роутинг
    store/           ← Глобальное состояние
    providers/       ← Context providers
```

**Преимущества:**
✅ Легко найти весь код модуля  
✅ Легко удалить/добавить модуль  
✅ Команда может работать параллельно  
✅ Легко переносить на backend  

---

### 2️⃣ **Domain-Driven Design (DDD)**

**Принцип:** Структура отражает бизнес-логику

```
src/
  domains/           ← Бизнес-домены
    learning/        ← Обучение
      modules/       ← Модули (1-12)
      lessons/       ← Уроки
      progress/      ← Прогресс
    wellness/        ← Благополучие
      checkin/       ← Check-in
      mood/          ← Настроение
      support/       ← Поддержка (SOS)
    social/          ← Социальные фичи
      cohorts/       ← Группы
      badges/        ← Бейджи
      feed/          ← Лента
```

---

### 3️⃣ **Atomic Design** (для UI)

```
src/
  components/
    atoms/           ← Базовые (Button, Input)
    molecules/       ← Составные (SearchBar, Card)
    organisms/       ← Сложные (Header, ModuleGrid)
    templates/       ← Шаблоны страниц
    pages/           ← Готовые страницы
```

---

## 🎯 НАША АРХИТЕКТУРА (Hybrid Approach)

Комбинируем **Feature-Based** + **Domain-Driven** для DA Teens:

```
src/
  ├── app/                      ← Конфигурация приложения
  │   ├── App.tsx               ← Главный компонент
  │   ├── router.tsx            ← Роутинг (будущее)
  │   ├── providers.tsx         ← Providers (Telegram, Theme)
  │   └── store/                ← Глобальное состояние
  │       ├── user.ts           ← User store
  │       ├── progress.ts       ← Progress store
  │       └── index.ts
  │
  ├── features/                 ← Основные фичи
  │   ├── dashboard/            ← Главный экран
  │   │   ├── components/
  │   │   │   ├── DashboardHero.tsx
  │   │   │   └── QuickActions.tsx
  │   │   ├── hooks/
  │   │   │   └── useDashboard.ts
  │   │   └── index.ts
  │   │
  │   ├── checkin/              ← Check-in система
  │   │   ├── components/
  │   │   │   ├── CheckInModal.tsx
  │   │   │   ├── CheckInPanel.tsx
  │   │   │   └── EmojiSlider.tsx
  │   │   ├── hooks/
  │   │   │   └── useCheckIn.ts
  │   │   ├── types/
  │   │   │   └── checkin.types.ts
  │   │   └── index.ts
  │   │
  │   └── wellness/             ← SOS и поддержка
  │       ├── components/
  │       │   ├── SOSButton.tsx
  │       │   └── CrisisResources.tsx
  │       └── index.ts
  │
  ├── modules/                  ← 12 модулей обучения
  │   ├── _shared/              ← Общее для всех модулей
  │   │   ├── components/
  │   │   │   ├── ModuleGrid.tsx
  │   │   │   ├── ModuleDetail.tsx
  │   │   │   └── LessonViewer.tsx
  │   │   ├── hooks/
  │   │   │   ├── useModule.ts
  │   │   │   └── useProgress.ts
  │   │   ├── types/
  │   │   │   └── module.types.ts
  │   │   └── index.ts
  │   │
  │   ├── 01-confidence/        ← Модуль #1: Уверенность
  │   │   ├── components/
  │   │   │   ├── ConfidenceHero.tsx
  │   │   │   └── ConfidenceModule.tsx
  │   │   ├── data/
  │   │   │   ├── lessons.ts
  │   │   │   ├── practices.ts
  │   │   │   └── scenarios.ts
  │   │   ├── hooks/
  │   │   │   └── useConfidence.ts
  │   │   ├── types/
  │   │   │   └── confidence.types.ts
  │   │   ├── README.md         ← Документация модуля
  │   │   └── index.ts
  │   │
  │   ├── 02-friendship/        ← Модуль #2: Дружба
  │   ├── 03-communication/     ← Модуль #3: Общение
  │   ├── ...
  │   │
  │   └── 13-boundaries/        ← Модуль #13: Границы (Адаптивный)
  │       ├── components/
  │       │   ├── BoundariesHero.tsx
  │       │   ├── BoundariesModule.tsx
  │       │   ├── LessonTimeline.tsx
  │       │   └── RealWorldScenario.tsx
  │       ├── data/
  │       │   ├── boundariesModule.ts
  │       │   ├── lessons.ts
  │       │   └── scenarios.ts
  │       ├── hooks/
  │       │   └── useBoundaries.ts
  │       ├── types/
  │       │   └── boundaries.types.ts
  │       ├── README.md
  │       └── index.ts
  │
  ├── shared/                   ← Переиспользуемый код
  │   ├── ui/                   ← shadcn/ui компоненты
  │   │   ├── button.tsx
  │   │   ├── card.tsx
  │   │   └── ...
  │   │
  │   ├── components/           ← Общие компоненты
  │   │   ├── ProgressStats.tsx
  │   │   ├── BadgeGrid.tsx
  │   │   └── SkillsTracker.tsx
  │   │
  │   ├── hooks/                ← Общие хуки
  │   │   ├── useTelegram.ts
  │   │   ├── useKV.ts
  │   │   └── useMobile.ts
  │   │
  │   ├── lib/                  ← Утилиты и библиотеки
  │   │   ├── adaptiveLearning.ts
  │   │   ├── gamification.ts
  │   │   ├── utils.ts
  │   │   └── api/              ← API клиент (будущее)
  │   │       ├── client.ts
  │   │       ├── endpoints.ts
  │   │       └── types.ts
  │   │
  │   ├── types/                ← Общие типы
  │   │   ├── user.types.ts
  │   │   ├── telegram.types.ts
  │   │   └── global.types.ts
  │   │
  │   └── styles/               ← Стили
  │       ├── theme.css
  │       └── globals.css
  │
  ├── assets/                   ← Статические ресурсы
  │   ├── images/
  │   ├── icons/
  │   └── fonts/
  │
  └── main.tsx                  ← Entry point
```

---

## 🔄 WORKFLOW: Разработка → Проверка → Деплой

### Этап 1: Локальная разработка

```bash
# 1. Запускаем dev сервер
npm run dev

# 2. Открываем в браузере
http://localhost:5003/da-teens-webapp-tele/

# 3. Проверяем:
✅ Работает ли новая фича?
✅ Нет ли ошибок в консоли?
✅ Responsive на мобильном?
✅ Все анимации плавные?
✅ Данные сохраняются в localStorage?
```

### Этап 2: Проверка типов и линтинг

```bash
# Проверить TypeScript ошибки
npm run build

# Проверить код стиль (если есть ESLint)
npm run lint
```

### Этап 3: Git коммит

```bash
# 1. Смотрим изменения
git status

# 2. Добавляем файлы
git add src/modules/13-boundaries/

# 3. Коммит с описанием
git commit -m "✨ Module #13: Добавлен компонент X"

# 4. Проверяем историю
git log --oneline -3
```

### Этап 4: Деплой

```bash
# Пушим на GitHub (auto-deploy на Pages)
git push origin main

# Ждём 2-3 минуты
# Проверяем: https://johnda7.github.io/da-teens-webapp-tele/
```

---

## 📋 CHECKLIST для каждого модуля

### Структура модуля:
```
modules/XX-название/
  ├── components/          ✅ UI компоненты модуля
  │   ├── Hero.tsx         ← Главная секция
  │   ├── Module.tsx       ← Основной компонент
  │   ├── Timeline.tsx     ← Timeline уроков
  │   └── Scenario.tsx     ← Практические задания
  │
  ├── data/                ✅ Данные модуля
  │   ├── lessons.ts       ← 9 уроков
  │   ├── practices.ts     ← Практики
  │   └── scenarios.ts     ← Сценарии
  │
  ├── hooks/               ✅ Хуки модуля
  │   └── useModule.ts     ← Логика модуля
  │
  ├── types/               ✅ TypeScript типы
  │   └── module.types.ts
  │
  ├── README.md            ✅ Документация
  │   ├── Описание модуля
  │   ├── Структура уроков
  │   ├── API компонентов
  │   └── Примеры использования
  │
  └── index.ts             ✅ Экспорты
      export { default as ModuleName } from './components/Module'
      export * from './hooks/useModule'
      export * from './types/module.types'
```

---

## 🔗 ИНТЕГРАЦИЯ С BACKEND (будущее)

### API слой:
```typescript
// shared/lib/api/client.ts
export const api = {
  modules: {
    get: (id: number) => fetch(`/api/modules/${id}`),
    update: (id: number, data) => fetch(`/api/modules/${id}`, { method: 'PUT' })
  },
  progress: {
    get: (userId: string) => fetch(`/api/users/${userId}/progress`),
    update: (userId: string, data) => fetch(`/api/users/${userId}/progress`, { method: 'POST' })
  },
  checkin: {
    create: (data) => fetch(`/api/checkins`, { method: 'POST' }),
    history: (userId: string) => fetch(`/api/users/${userId}/checkins`)
  }
}
```

### State Management (будущее):
```typescript
// app/store/progress.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set) => ({
      progress: {},
      updateProgress: (moduleId, data) => set((state) => ({
        progress: { ...state.progress, [moduleId]: data }
      }))
    }),
    { name: 'da-teens-progress' }
  )
)
```

---

## 🎯 ПЛАН РЕФАКТОРИНГА

### Этап 1: Переименовать и переместить (30 мин)
- [ ] Создать `src/modules/13-boundaries/`
- [ ] Переместить все компоненты границ
- [ ] Переместить data файлы
- [ ] Создать index.ts с экспортами

### Этап 2: Создать shared структуру (20 мин)
- [ ] Переместить общие компоненты в `shared/components/`
- [ ] Переместить хуки в `shared/hooks/`
- [ ] Переместить utils в `shared/lib/`

### Этап 3: Обновить импорты (10 мин)
- [ ] Поправить все import пути
- [ ] Проверить что ничего не сломалось

### Этап 4: Тестирование (15 мин)
- [ ] Проверить локально
- [ ] Проверить все модули работают
- [ ] Коммит + деплой

---

## 🚀 ПРЕИМУЩЕСТВА НОВОЙ СТРУКТУРЫ

### Для разработки:
✅ **Легко найти код** - всё по модулям  
✅ **Легко добавить модуль** - копируй структуру  
✅ **Легко удалить** - просто удали папку  
✅ **Параллельная работа** - команда не мешает друг другу  

### Для переноса на backend:
✅ **API endpoints** уже спроектированы  
✅ **Types** готовы для backend  
✅ **Логика** отделена от UI  
✅ **State management** готов к замене на Redux/Zustand  

### Для масштабирования:
✅ **12 модулей** - каждый в своей папке  
✅ **Легко тестировать** - изолированные модули  
✅ **Легко документировать** - README в каждом модуле  
✅ **Code splitting** - автоматический (Vite)  

---

## 📖 РЕСУРСЫ

**Best Practices:**
- [React Folder Structure](https://www.robinwieruch.de/react-folder-structure/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

**Примеры:**
- Airbnb: Feature-based
- Facebook: Domain-driven
- Spotify: Micro-frontends

---

**Готов начать рефакторинг?** 🚀
