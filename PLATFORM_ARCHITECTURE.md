# 🏗️ DA Teens Platform Architecture

> **Цель:** Правильная архитектура для масштабирования с персонализацией, дашбордом учителей и GitHub workflow

---

## 🎯 ТРЕБОВАНИЯ ПЛАТФОРМЫ

### Роли пользователей:
1. **Ученик (Teen)** - основной пользователь, проходит модули
2. **Куратор (Curator)** - ведет группы, смотрит прогресс
3. **Учитель (Teacher)** - создает контент, настраивает модули
4. **Админ** - управление платформой

### Ключевые фичи:
- ✅ Персонализация для каждого ученика
- ✅ Dashboard для учителей/кураторов
- ✅ Прогресс в реальном времени
- ✅ Групповое обучение (cohorts)
- ✅ Analytics и отчеты
- ✅ Адаптивные рекомендации

---

## 📊 ИЗУЧЕННЫЕ ПОДХОДЫ

### 1️⃣ **Supabase (Рекомендуется!)**

**Почему Supabase:**
- ✅ PostgreSQL база (мощная и гибкая)
- ✅ Realtime subscriptions (живые обновления)
- ✅ Row Level Security (безопасность на уровне строк)
- ✅ Auth встроенная (JWT, OAuth, Magic Links)
- ✅ Storage для файлов
- ✅ Edge Functions (serverless)
- ✅ **БЕСПЛАТНЫЙ тариф:** до 500MB БД, 2GB storage, 50,000 активных юзеров/месяц
- ✅ Self-hosted опция (можно развернуть на своем сервере)

**Интеграция с GitHub:**
```bash
# 1. Supabase CLI локально
npm install -g supabase

# 2. Инициализация
supabase init

# 3. Миграции в Git
supabase/migrations/*.sql  # Версионируются в Git

# 4. Deploy через CLI
supabase db push

# 5. Или через GitHub Actions (CI/CD)
```

**Архитектура с Supabase:**
```
Frontend (React + Vite)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase Cloud
    ├── PostgreSQL Database
    │   ├── public.users
    │   ├── public.modules
    │   ├── public.progress
    │   ├── public.cohorts
    │   └── public.checkins
    ├── Realtime (WebSocket)
    ├── Storage (files)
    └── Edge Functions (API)
```

---

### 2️⃣ **Firebase (Альтернатива)**

**Плюсы:**
- ✅ Быстрая настройка
- ✅ Realtime Database
- ✅ Auth + Analytics встроены
- ✅ Хорошая интеграция с Google

**Минусы:**
- ❌ NoSQL (сложнее для сложных запросов)
- ❌ Vendor lock-in (только Google)
- ❌ Дороже при масштабировании

---

### 3️⃣ **PocketBase (Легкий вариант)**

**Плюсы:**
- ✅ Один исполняемый файл (~15MB)
- ✅ SQLite встроена
- ✅ Realtime
- ✅ Admin UI из коробки
- ✅ Self-hosted

**Минусы:**
- ❌ SQLite (ограничения по производительности)
- ❌ Молодой проект

---

## 🎯 НАША АРХИТЕКТУРА (Hybrid: Supabase + GitHub)

### Phase 1: Текущая (localStorage)
```
┌─────────────────────────────────┐
│   DA Teens Web App (React)      │
│                                  │
│   ├── Modules (1-13)            │
│   ├── Check-in                  │
│   ├── Progress                  │
│   └── Cohorts                   │
│                                  │
│   Data Storage:                 │
│   └── localStorage (client)    │ ← Сейчас здесь
└─────────────────────────────────┘
```

### Phase 2: С Supabase (рекомендуется)
```
┌──────────────────────────────────────────────────────┐
│                    Frontend Layer                     │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │ Teen App    │  │ Curator     │  │ Teacher      │ │
│  │ (React PWA) │  │ Dashboard   │  │ Dashboard    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘ │
│         │                │                 │         │
│         └────────────────┴─────────────────┘         │
│                          │                           │
│                  @supabase/supabase-js               │
└──────────────────────────┬───────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────┐
│              Supabase Backend Layer                   │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         PostgreSQL Database                     │ │
│  │                                                 │ │
│  │  ┌─────────────┐  ┌──────────────┐            │ │
│  │  │ Auth        │  │ Public       │            │ │
│  │  │  - users    │  │  - modules   │            │ │
│  │  │  - roles    │  │  - lessons   │            │ │
│  │  └─────────────┘  │  - progress  │            │ │
│  │                   │  - cohorts   │            │ │
│  │  ┌─────────────┐  │  - checkins  │            │ │
│  │  │ RLS Policies│  │  - badges    │            │ │
│  │  │  - teen     │  │  - analytics │            │ │
│  │  │  - curator  │  └──────────────┘            │ │
│  │  │  - teacher  │                              │ │
│  │  └─────────────┘                              │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Realtime (WebSocket)                    │ │
│  │  - Progress updates                             │ │
│  │  - Check-in notifications                       │ │
│  │  - Cohort chat                                  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Edge Functions (Serverless)             │ │
│  │  - Adaptive recommendations                     │ │
│  │  - Analytics aggregation                        │ │
│  │  - Notifications                                │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

---

## 📁 СТРУКТУРА ПРОЕКТА (Feature-Based + Supabase)

```
da-teens-webapp-tele/
│
├── src/
│   ├── app/                          ← App configuration
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   │       ├── SupabaseProvider.tsx  ← Supabase context
│   │       ├── AuthProvider.tsx      ← Auth wrapper
│   │       └── TelegramProvider.tsx
│   │
│   ├── features/                     ← User-facing features
│   │   ├── auth/                     ← Authentication
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/                ← Teen dashboard
│   │   │   ├── components/
│   │   │   │   ├── DashboardHero.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── curator-dashboard/        ← Curator view
│   │   │   ├── components/
│   │   │   │   ├── CohortList.tsx
│   │   │   │   ├── StudentProgress.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── teacher-dashboard/        ← Teacher view
│   │   │   ├── components/
│   │   │   │   ├── ModuleEditor.tsx
│   │   │   │   ├── ContentLibrary.tsx
│   │   │   │   └── Reports.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── checkin/                  ← Check-in feature
│   │   └── wellness/                 ← SOS feature
│   │
│   ├── modules/                      ← Learning modules
│   │   ├── _shared/                  ← Shared module components
│   │   ├── 01-confidence/
│   │   ├── 02-friendship/
│   │   ├── ...
│   │   └── 13-boundaries/
│   │
│   ├── shared/                       ← Shared code
│   │   ├── ui/                       ← UI components
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── supabase/             ← Supabase client
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── database.ts
│   │   │   │   └── realtime.ts
│   │   │   ├── adaptiveLearning.ts
│   │   │   └── utils.ts
│   │   └── types/
│   │
│   └── main.tsx
│
├── supabase/                         ← Supabase configuration
│   ├── config.toml                   ← Supabase settings
│   ├── migrations/                   ← Database migrations (Git)
│   │   ├── 20250121000000_init.sql
│   │   ├── 20250121000001_add_modules.sql
│   │   ├── 20250121000002_add_progress.sql
│   │   └── ...
│   ├── functions/                    ← Edge Functions
│   │   ├── adaptive-recommend/
│   │   │   └── index.ts
│   │   └── analytics-aggregate/
│   │       └── index.ts
│   └── seed.sql                      ← Test data
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                ← Deploy to Pages
│       └── supabase-deploy.yml       ← Deploy migrations
│
└── docs/
    ├── ARCHITECTURE.md               ← This file
    └── API.md                        ← API documentation
```

---

## 🗄️ DATABASE SCHEMA (PostgreSQL)

### Core Tables:

```sql
-- Users & Auth (handled by Supabase Auth)
-- Расширяем профиль пользователя

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('teen', 'curator', 'teacher', 'admin')),
  full_name TEXT,
  age INTEGER,
  cohort_id UUID REFERENCES public.cohorts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules (12 модулей)
CREATE TABLE public.modules (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  total_lessons INTEGER DEFAULT 9,
  is_adaptive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons (уроки внутри модулей)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id INTEGER REFERENCES public.modules(id),
  order_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content JSONB,  -- Гибкий формат для разных типов контента
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress (прогресс по модулям)
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  module_id INTEGER REFERENCES public.modules(id),
  completed_lessons JSONB DEFAULT '[]',  -- [lesson_id, lesson_id, ...]
  current_lesson_id UUID,
  xp_earned INTEGER DEFAULT 0,
  skills_unlocked JSONB DEFAULT '[]',
  streak INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- Check-ins (эмоциональное состояние)
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  anxiety INTEGER CHECK (anxiety BETWEEN 1 AND 5),
  energy INTEGER CHECK (energy BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohorts (группы обучения)
CREATE TABLE public.cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  curator_id UUID REFERENCES auth.users(id),
  age_group TEXT,  -- '13-15', '16-18'
  start_date DATE,
  end_date DATE,
  meeting_schedule JSONB,  -- [{day: 'Monday', time: '18:00'}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges (достижения)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  badge_id TEXT NOT NULL,  -- 'first-step', 'check-in-streak-7', etc.
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Analytics (аналитика для учителей)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,  -- 'lesson_started', 'quiz_completed', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS):

```sql
-- Teens can only see their own data
CREATE POLICY "Teens can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Curators can see their cohort's data
CREATE POLICY "Curators can view cohort profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cohorts
      WHERE cohorts.id = profiles.cohort_id
      AND cohorts.curator_id = auth.uid()
    )
  );

-- Teachers can see all data
CREATE POLICY "Teachers can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );
```

---

## 🔄 GITHUB WORKFLOW

### 1. Development (локально)

```bash
# 1. Pull latest
git pull origin main

# 2. Create feature branch
git checkout -b feature/module-14

# 3. Run Supabase locally (optional)
supabase start

# 4. Develop
npm run dev

# 5. Test
npm run build

# 6. Commit
git add .
git commit -m "✨ Module 14: Add new content"

# 7. Push
git push origin feature/module-14

# 8. Create PR on GitHub
```

### 2. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

  deploy-supabase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## 📱 ПЕРСОНАЛИЗАЦИЯ (Adaptive Learning)

### Как работает:

```typescript
// shared/lib/adaptiveLearning.ts
export class AdaptiveLearningEngine {
  
  // 1. Анализ эмоционального состояния
  async analyzeCheckIn(userId: string): Promise<Recommendation> {
    const recentCheckIns = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    const avgMood = average(recentCheckIns.map(c => c.mood))
    const avgAnxiety = average(recentCheckIns.map(c => c.anxiety))
    
    // Если настроение низкое → легкие уроки
    if (avgMood < 3) {
      return { difficulty: 'easy', format: 'video' }
    }
    
    // Если тревожность высокая → практики релаксации
    if (avgAnxiety > 3) {
      return { difficulty: 'easy', format: 'practice' }
    }
    
    return { difficulty: 'medium', format: 'mixed' }
  }
  
  // 2. Рекомендации на основе прогресса
  async getNextLesson(userId: string, moduleId: number): Promise<Lesson> {
    const progress = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()
    
    const completedLessons = progress.completed_lessons
    const availableLessons = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .not('id', 'in', completedLessons)
      .order('order_number')
    
    // Адаптация по сложности
    const recommendation = await this.analyzeCheckIn(userId)
    
    return availableLessons.find(l => 
      l.difficulty === recommendation.difficulty
    ) || availableLessons[0]
  }
  
  // 3. Real-time персонализация
  subscribeToProgress(userId: string, callback: Function) {
    const channel = supabase.channel(`progress:${userId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'user_progress',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
    
    return channel
  }
}
```

---

## 👨‍🏫 CURATOR/TEACHER DASHBOARD

### Features для кураторов:

```typescript
// features/curator-dashboard/components/CohortProgress.tsx

export function CohortProgress({ cohortId }: Props) {
  // Real-time подписка на прогресс группы
  const { data: students, isLoading } = useQuery({
    queryKey: ['cohort-progress', cohortId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          *,
          user_progress (
            module_id,
            completed_lessons,
            xp_earned
          ),
          checkins (
            mood,
            created_at
          )
        `)
        .eq('cohort_id', cohortId)
      
      return data
    }
  })
  
  // Realtime updates
  useEffect(() => {
    const channel = supabase.channel(`cohort:${cohortId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_progress' },
        (payload) => {
          // Обновить UI
          queryClient.invalidateQueries(['cohort-progress'])
        }
      )
      .subscribe()
    
    return () => { channel.unsubscribe() }
  }, [cohortId])
  
  return (
    <div>
      {/* Показываем прогресс каждого ученика */}
      {students?.map(student => (
        <StudentCard
          key={student.id}
          name={student.full_name}
          progress={student.user_progress}
          mood={student.checkins[0]?.mood}
        />
      ))}
    </div>
  )
}
```

---

## 🚀 ПОЭТАПНЫЙ ПЛАН МИГРАЦИИ

### Phase 1: Подготовка (1 неделя)
- [ ] Создать Supabase проект
- [ ] Настроить миграции в Git
- [ ] Создать базовую схему БД
- [ ] Настроить RLS policies
- [ ] Добавить seed данные для тестов

### Phase 2: Auth интеграция (3 дня)
- [ ] Настроить Supabase Auth
- [ ] Создать LoginForm/SignupForm
- [ ] Интегрировать с Telegram (OAuth)
- [ ] Добавить role-based access

### Phase 3: Migration данных (2 дня)
- [ ] Создать migration script (localStorage → Supabase)
- [ ] Перенести user profiles
- [ ] Перенести progress data
- [ ] Тестировать миграцию

### Phase 4: Features (по 1-2 дня каждая)
- [ ] Curator Dashboard
- [ ] Teacher Dashboard
- [ ] Real-time updates
- [ ] Analytics
- [ ] Notifications

### Phase 5: Тестирование (1 неделя)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Load testing
- [ ] User testing

---

## 💰 СТОИМОСТЬ

### Supabase (рекомендуется):
- **Free tier:** $0/месяц
  - 500MB база данных
  - 2GB storage
  - 50,000 активных юзеров/месяц
  - Realtime connections
  
- **Pro tier:** $25/месяц
  - 8GB база
  - 100GB storage
  - 500,000 активных юзеров
  - Priority support

### Альтернатива: Self-hosted
- **VPS (DigitalOcean):** $12/месяц
  - 2 CPU, 4GB RAM
  - 80GB SSD
  - Можно развернуть Supabase самому

---

## ✅ РЕКОМЕНДАЦИЯ

**Используем Supabase + Feature-Based Architecture:**

1. ✅ **Простая интеграция** - всего несколько строк кода
2. ✅ **GitHub workflow** - миграции версионируются
3. ✅ **Realtime** - живые обновления из коробки
4. ✅ **Безопасность** - RLS на уровне базы
5. ✅ **Масштабируемость** - от 0 до 100k пользователей
6. ✅ **Бесплатный старт** - $0 для разработки

**Следующий шаг:** Начать с Phase 1 - создать Supabase проект и настроить первую миграцию

Готов начать? 🚀
