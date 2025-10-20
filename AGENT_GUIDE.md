# 🤖 Руководство для AI-агентов

> **Дата создания:** 6 октября 2025  
> **Статус проекта:** ✅ Развернут и подключен к Telegram боту  
> **Live URL:** https://johnda7.github.io/da-teens-webapp-tele/

---

## 📋 КРАТКОЕ РЕЗЮМЕ

Это **DA Teens WebApp** — Telegram Mini App для программы ментального здоровья подростков (13-18 лет). Приложение содержит 12 модулей по управлению тревожностью, депрессией, отношениями и стрессом.

### Ключевые факты:
- ✅ **Развернуто на GitHub Pages** и работает
- ✅ **Telegram бот подключен** и функционирует
- ✅ **Telegram Web App SDK интегрирован** полностью
- 🎯 **Язык контента:** Русский
- 👥 **Целевая аудитория:** Подростки 13-18 лет

---

## 🏗️ АРХИТЕКТУРА ПРОЕКТА

### Стек технологий:
```
Frontend: React 19 + TypeScript + Vite 6.3.6
Styling: Tailwind CSS 4.x + shadcn/ui компоненты
State: GitHub Spark KV (персистентное хранилище)
Icons: Phosphor Icons
Charts: Recharts
Deployment: GitHub Pages + GitHub Actions
Platform: Telegram Mini App (WebApp SDK)
```

### Структура проекта:
```
src/
├── App.tsx                          # Главный компонент с Telegram интеграцией
├── components/
│   ├── TeenWellnessHub.tsx         # Основной хаб приложения
│   ├── ModuleGrid.tsx              # Сетка модулей
│   ├── ModuleDetail.tsx            # Детальный просмотр модуля
│   ├── PracticePlayer.tsx          # Плеер медитаций/практик
│   ├── CheckInPanel.tsx            # Панель ежедневного чек-ина
│   ├── ProgressStats.tsx           # Статистика прогресса
│   ├── BadgeGrid.tsx               # Достижения
│   ├── CohortSchedule.tsx          # Расписание групповых встреч
│   ├── SOSButton.tsx               # Кнопка экстренной помощи
│   └── ui/                         # 30+ shadcn/ui компонентов
├── hooks/
│   ├── useTelegram.ts              # ⭐ Хук для Telegram WebApp API
│   └── use-mobile.ts               # Определение мобильных устройств
├── data/
│   ├── moduleData.ts               # 12 модулей контента
│   ├── practicesData.ts            # Медитации и дыхательные упражнения
│   ├── teenContent.ts              # Статьи и ресурсы
│   └── seedData.ts                 # Тестовые данные
├── types/
│   └── telegram-webapp.d.ts        # ⭐ TypeScript определения для Telegram
└── lib/
    ├── types.ts                    # Типы приложения
    └── utils.ts                    # Утилиты

Configuration:
├── vite.config.ts                  # ⭐ Настройки сервера + base path
├── index.html                      # ⭐ Telegram SDK подключен
├── .github/workflows/deploy.yml    # ⭐ Автоматический деплой
├── TELEGRAM_SETUP.md               # Инструкции по настройке бота
└── INTEGRATION_SUMMARY.md          # История интеграции
```

---

## 🔑 КРИТИЧЕСКИ ВАЖНЫЕ ФАЙЛЫ

### 1. `src/hooks/useTelegram.ts`
**Назначение:** React хук для работы с Telegram WebApp API

```typescript
export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;
  
  useEffect(() => {
    if (tg) {
      tg.ready();      // Инициализация
      tg.expand();     // Развернуть на весь экран
      setIsReady(true);
    }
  }, [tg]);
  
  return {
    tg,                                    // Инстанс Telegram WebApp
    user: tg?.initDataUnsafe?.user,       // Данные пользователя
    isReady,                               // Статус инициализации
    isTelegramWebApp: !!tg,               // Запущено ли в Telegram
    colorScheme: tg?.colorScheme,         // 'light' | 'dark'
    themeParams: tg?.themeParams,         // Цвета темы
  };
};
```

**Возможности:**
- Автоматическая авторизация через Telegram
- Синхронизация темы (светлая/темная)
- Доступ к профилю пользователя (имя, фото, ID)
- Управление кнопками (MainButton, BackButton)
- Тактильная обратная связь (HapticFeedback)

### 2. `src/App.tsx`
**Интеграция с Telegram:**

```typescript
const { user, isTelegramWebApp, tg } = useTelegram()
const defaultName = user?.first_name || 'Алекс'

// Автосинхронизация имени из Telegram
useEffect(() => {
  if (user && userProfile && userProfile.name !== user.first_name) {
    setUserProfile({ ...userProfile, name: user.first_name })
  }
}, [user, userProfile, setUserProfile])
```

### 3. `vite.config.ts`
**Критические настройки:**

```typescript
export default defineConfig({
  base: '/da-teens-webapp-tele/',  // ⚠️ Для GitHub Pages
  server: {
    host: '0.0.0.0',                // Доступ извне
    port: 5000,                      // Порт (локально может быть 5001)
    strictPort: false,               // Авто-выбор порта при занятости
  },
})
```

### 4. `index.html`
**Telegram SDK:**

```html
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
```

---

## 🎯 КОНТЕНТ И МОДУЛИ

### 12 Модулей ментального здоровья:

| # | Название | Описание | Темы |
|---|----------|----------|------|
| 1 | Привет, это ты | Знакомство с эмоциями | Эмоциональная осознанность |
| 2 | Твои эмоции | Понимание чувств | Идентификация эмоций |
| 3 | Твоё тело говорит | Телесные сигналы | Психосоматика |
| 4 | Когда тревога зашкаливает | Управление тревогой | Техники успокоения |
| 5 | Мысли-ловушки | Когнитивные искажения | Рефрейминг |
| 6 | Твой внутренний голос | Позитивный диалог | Самоподдержка |
| 7 | Когда грустно надолго | Работа с депрессией | Активация поведения |
| 8 | Люди вокруг | Социальные навыки | Коммуникация |
| 9 | Границы — это ок | Личные границы | Ассертивность |
| 10 | Стресс в школе | Учебный стресс | Тайм-менеджмент |
| 11 | Когда всё сложно | Кризисные ситуации | Копинг-стратегии |
| 12 | Твой путь дальше | Планирование будущего | Поддержка прогресса |

### Дополнительный контент:
- **19 практик:** Медитации, дыхательные упражнения (3-15 минут)
- **10+ статей:** Образовательные материалы по темам модулей
- **Система достижений:** 18 бейджей за прогресс
- **Групповые встречи:** 12-недельная программа с расписанием

---

## 🚀 DEPLOYMENT & ENVIRONMENTS

### Production (GitHub Pages):
```
URL: https://johnda7.github.io/da-teens-webapp-tele/
Branch: gh-pages (автоматический деплой)
Trigger: git push на main ветку
Workflow: .github/workflows/deploy.yml
Status: ✅ Активен и работает
```

### Local Development:
```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
# Откроется на http://localhost:5001 (или 5000)

# Сборка для продакшена
npm run build

# Превью production сборки
npm run preview
```

### Replit Environment:
```bash
# Настроено в .replit файле
run = "npm run dev"
entrypoint = "index.html"
modules = ["nodejs-20", "web"]

# Порт 5000, автоматический рестарт
```

---

## 🔧 ВАЖНЫЕ КОМАНДЫ

```bash
# Проверка ошибок TypeScript
npm run build

# Освободить порт 5000 (если занят)
lsof -ti:5000 | xargs kill -9

# Переустановка зависимостей
rm -rf node_modules package-lock.json && npm install

# Деплой на GitHub Pages (автоматически при push)
git add .
git commit -m "Update app"
git push origin main

# Проверка статуса деплоя
curl -I https://johnda7.github.io/da-teens-webapp-tele/
```

---

## 🤖 TELEGRAM BOT НАСТРОЙКА

### Bot Status: ✅ Подключен и работает

### Команды бота (настроены через @BotFather):
```
start - Запустить приложение
profile - Мой профиль
join - Присоединиться к группе
schedule - Расписание встреч
sos - Экстренная помощь
```

### WebApp URL:
```
https://johnda7.github.io/da-teens-webapp-tele/
```

### Как тестировать:
1. Открыть бота в Telegram
2. Нажать кнопку Menu или /start
3. WebApp развернется на весь экран
4. Имя пользователя подтянется из Telegram профиля
5. Тема синхронизируется с Telegram (светлая/темная)

**Документация:** См. `TELEGRAM_SETUP.md` для деталей

---

## 📊 STATE MANAGEMENT

### GitHub Spark KV
Все данные хранятся локально в браузере через GitHub Spark KV hooks:

```typescript
// Профиль пользователя
const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', {
  name: 'Алекс',
  age: 16,
  currentModule: 1,
  completedModules: [],
  badges: [],
  checkIns: {},
  practiceMinutes: 0,
  enrolledInCohort: false,
})

// Прогресс по модулям
const [moduleProgress, setModuleProgress] = useKV<ModuleProgress>('module-progress', {})

// Достижения
const [unlockedBadges, setUnlockedBadges] = useKV<string[]>('unlocked-badges', [])
```

**Важно:** Данные персистентны между сессиями, но хранятся только на клиенте.

---

## 🎨 DESIGN SYSTEM

### Цветовая палитра (успокаивающие тона):
```css
--primary: Deep Teal (180 65% 35%)
--secondary: Soft Blue (200 60% 60%)
--accent: Warm Coral (15 80% 65%)
--background: White / Dark gray
```

### Ключевые компоненты UI:
- **shadcn/ui:** 30+ предустановленных компонентов
- **Tailwind CSS:** Утилитарные классы
- **Phosphor Icons:** Современная иконография
- **Адаптивный дизайн:** Mobile-first подход

### Темная тема:
Автоматически синхронизируется с Telegram через `useTelegram().colorScheme`

---

## 🐛 ИЗВЕСТНЫЕ ОСОБЕННОСТИ

### 1. Порт конфликт
**Проблема:** Порт 5000 может быть занят (часто macOS AirPlay)  
**Решение:** `strictPort: false` в vite.config.ts автоматически выберет 5001

### 2. Base Path для GitHub Pages
**Проблема:** Роуты не работают без базового пути  
**Решение:** `base: '/da-teens-webapp-tele/'` в vite.config.ts

### 3. Telegram WebApp вне Telegram
**Поведение:** `window.Telegram?.WebApp` будет `undefined`  
**Обработка:** Хук `useTelegram()` возвращает `isTelegramWebApp: false`

### 4. Видео контент
**Статус:** Ссылки на видео — плейсхолдеры  
**TODO:** Заменить на реальные YouTube/Vimeo URL

---

## 📚 КЛЮЧЕВЫЕ ДОКУМЕНТЫ

| Файл | Назначение |
|------|-----------|
| `README.md` | Обзор проекта и quick start |
| `PRD.md` | Product Requirements Document |
| `TELEGRAM_SETUP.md` | Настройка Telegram бота |
| `INTEGRATION_SUMMARY.md` | История интеграции Replit изменений |
| `SECURITY.md` | Политика безопасности |
| `AGENT_GUIDE.md` | 👈 Этот файл |

---

## 🔄 ИСТОРИЯ РАЗРАБОТКИ

### Создатели:
1. **GitHub Spark AI** — Первоначальная генерация проекта (React app)
2. **Replit Agent** — Интеграция Telegram WebApp SDK (18 коммитов)
3. **GitHub Copilot** — Финальная интеграция и деплой

### Ключевые этапы:
- ✅ Создание базового React приложения с модулями
- ✅ Добавление Telegram Web App SDK
- ✅ Создание useTelegram hook
- ✅ Настройка GitHub Actions для автодеплоя
- ✅ Успешный деплой на GitHub Pages
- ✅ Подключение Telegram бота
- ✅ Тестирование интеграции

---

## 🎯 ЧТО ДАЛЬШЕ?

### Возможные улучшения:
1. **Backend API:**
   - Хранение данных на сервере
   - Реальная SOS эскалация с уведомлениями
   - Аналитика использования

2. **Контент:**
   - Реальные видео для модулей
   - Больше практик и медитаций
   - Интерактивные упражнения

3. **Социальные функции:**
   - Групповые чаты (через Telegram)
   - Обмен достижениями
   - Peer-to-peer поддержка

4. **Геймификация:**
   - Больше бейджей
   - Система уровней
   - Еженедельные челленджи

5. **Локализация:**
   - Английская версия
   - Другие языки

---

## 💡 СОВЕТЫ ДЛЯ НОВЫХ АГЕНТОВ

### При работе с кодом:
1. ✅ **Всегда проверяй** `useTelegram` hook перед изменениями Telegram API
2. ✅ **Тестируй локально** перед пушем (npm run dev)
3. ✅ **Помни про base path** при работе с роутингом
4. ✅ **Используй TypeScript** — все типы определены
5. ✅ **Следуй shadcn/ui** паттернам для UI компонентов

### При деплое:
1. ✅ Пуш в main → автоматический деплой через 2-3 минуты
2. ✅ Проверяй GitHub Actions: https://github.com/johnda7/da-teens-webapp-tele/actions
3. ✅ Тестируй на live URL после деплоя

### При отладке:
1. ✅ Проверь консоль браузера на ошибки
2. ✅ Убедись что Telegram SDK загружен (window.Telegram)
3. ✅ Проверь network tab для API calls
4. ✅ Используй npm run build для проверки TypeScript ошибок

---

## 🆘 ЭКСТРЕННЫЕ КОНТАКТЫ

### Репозиторий:
- **GitHub:** https://github.com/johnda7/da-teens-webapp-tele
- **Owner:** johnda7
- **Branch:** main

### Полезные ссылки:
- **Live Site:** https://johnda7.github.io/da-teens-webapp-tele/
- **Telegram Bot:** @BotFather (для настройки)
- **Telegram WebApp Docs:** https://core.telegram.org/bots/webapps
- **GitHub Actions:** https://github.com/johnda7/da-teens-webapp-tele/actions
- **shadcn/ui Docs:** https://ui.shadcn.com/

---

## ✅ ЧЕКЛИСТ ПЕРЕД НАЧАЛОМ РАБОТЫ

Перед тем как начать вносить изменения, убедись что:

- [ ] Прочитал этот файл полностью
- [ ] Понимаешь архитектуру проекта
- [ ] Знаешь где находится Telegram интеграция (useTelegram hook)
- [ ] Понимаешь как работает деплой (GitHub Actions)
- [ ] Знаешь про base path для GitHub Pages
- [ ] Установил зависимости (npm install)
- [ ] Запустил локально (npm run dev)
- [ ] Проверил что сайт работает на GitHub Pages
- [ ] Понимаешь структуру данных (GitHub Spark KV)

---

**Последнее обновление:** 6 октября 2025  
**Статус:** ✅ Проект полностью функционален и готов к разработке

*Удачи! 🚀*
