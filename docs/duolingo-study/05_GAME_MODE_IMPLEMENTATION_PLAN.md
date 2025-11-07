# ПЛАН РЕАЛИЗАЦИИ: ИГРОВАЯ СТРАНИЦА С КАТЕЙ (DUOLINGO-СТИЛЬ)

## ЦЕЛЬ

Создать **новую альтернативную страницу** (прототип) с игровой механикой в стиле Duolingo, где:
- **Психолог Катя** - главный персонаж (вместо зеленого человечка)
- **Уроки выглядят как игра** - короткие упражнения, мгновенная обратная связь
- **Основные фичи доступны**: чекин, чат, группа, записи
- **Но в начале** - это игра, как Duolingo

---

## СТРУКТУРА НОВОЙ СТРАНИЦЫ

### ФАЙЛ: `src/pages/GameModePage.tsx`

**Роутинг:**
- `/game` - новая игровая страница
- Не привязана к текущей структуре (прототип)
- Потом интегрируем в основное приложение

---

## КОМПОНЕНТЫ ДЛЯ СОЗДАНИЯ

### 1. **KatyaCharacter.tsx** - Персонаж Катя

**Расположение:** `src/components/game/KatyaCharacter.tsx`

**Функционал:**
- Аватар/изображение Кати (можно использовать emoji или SVG)
- Анимации:
  - Приветствие (wave)
  - Поддержка (thumbs up)
  - Празднование (celebration)
  - Грусть (sad - при ошибке)
- Реплики:
  - "Привет! Готов начать урок?"
  - "Отлично! Продолжай!"
  - "Почти! Попробуй еще раз"
  - "Поздравляю! Ты справился!"
- Эмоции: радость, поддержка, празднование, сочувствие

**Props:**
```typescript
interface KatyaCharacterProps {
  emotion: 'happy' | 'supportive' | 'celebrating' | 'sad'
  message?: string
  show: boolean
}
```

---

### 2. **DuolingoLesson.tsx** - Игровой урок

**Расположение:** `src/components/game/DuolingoLesson.tsx`

**Структура урока:**
```
1. Вступление (Катя приветствует)
2. 5-7 коротких упражнений:
   - Multiple Choice (из quiz)
   - Role-play (из practiceExercise)
   - Matching (из examples)
   - Fill in the Blanks
   - True/False
3. Прогресс-бар (1/7, 2/7...)
4. Hearts система (5 жизней)
5. Мгновенная обратная связь
6. Завершение (Катя поздравляет + XP)
```

**Props:**
```typescript
interface DuolingoLessonProps {
  lesson: Lesson // из boundariesModule
  onComplete: (xp: number, score: number) => void
  onExit: () => void
}
```

**Состояния:**
- `currentExerciseIndex` - текущее упражнение (0-6)
- `hearts` - количество жизней (5)
- `score` - количество правильных ответов
- `exercises` - массив упражнений (преобразованные из lesson)

---

### 3. **ExerciseTypes.tsx** - Типы упражнений

**Расположение:** `src/components/game/ExerciseTypes.tsx`

#### 3.1. **MultipleChoiceExercise**
- 4 варианта ответа
- Мгновенная обратная связь (зеленый/красный)
- Анимация правильного/неправильного ответа
- Источник: `lesson.quiz[0]`, `lesson.quiz[1]`...

#### 3.2. **RolePlayExercise**
- Ситуация от Кати
- Выбор ответа (3-4 варианта)
- Feedback от Кати
- Источник: `lesson.practiceExercise` (если type === 'roleplay')

#### 3.3. **MatchingExercise**
- Сопоставь пары
- "Здоровая граница" ↔ Пример
- Источник: `lesson.formats.text.content.examples`

#### 3.4. **FillInBlanksExercise**
- Заполни пропуски в фразе
- Выбор слова из вариантов
- Источник: ключевые фразы из `lesson.formats.text.content.sections`

#### 3.5. **TrueFalseExercise**
- Верно/Неверно
- Быстрые вопросы
- Источник: упрощенные `lesson.quiz`

---

### 4. **GamePath.tsx** - Игровой путь

**Расположение:** `src/components/game/GamePath.tsx`

**Основа:** Использовать `LearningPath.tsx`, но адаптировать:
- Горизонтальный скролл (как в Duolingo)
- Цветовая индикация:
  - 🟢 Зеленый = пройден (perfect)
  - 🟡 Желтый = нужно повторить (cracked)
  - ⚪ Серый = заблокирован
  - 🔵 Синий = текущий урок
- Катя появляется рядом с текущим уроком
- Анимации при unlock

**Props:**
```typescript
interface GamePathProps {
  lessons: Lesson[]
  completedLessons: string[]
  currentLesson: string
  onLessonClick: (lessonId: string) => void
}
```

---

### 5. **GameHeader.tsx** - Шапка игры

**Расположение:** `src/components/game/GameHeader.tsx`

**Элементы:**
- XP счетчик
- Hearts (жизни) - только во время урока
- Streak (дни подряд)
- Кнопка меню (чекин, чат, группа, записи)

---

### 6. **GameMenu.tsx** - Меню с основными фичами

**Расположение:** `src/components/game/GameMenu.tsx`

**Фичи:**
- **Check-in** - чекин настроения
- **Chat** - чат с Катей/группой
- **Group** - группа участников
- **Records** - записи прогресса

**Но в начале** - это выглядит как игра, меню доступно через кнопку в шапке.

---

## ПРЕОБРАЗОВАНИЕ ДАННЫХ

### Как превратить текущий урок в игровой:

**Файл:** `src/lib/lessonToGameExercises.ts`

```typescript
function lessonToGameExercises(lesson: Lesson): GameExercise[] {
  const exercises: GameExercise[] = []
  
  // 1. Quiz → Multiple Choice (первые 3-4 вопроса)
  lesson.quiz.slice(0, 4).forEach((q, idx) => {
    exercises.push({
      type: 'multiple-choice',
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: idx + 1
    })
  })
  
  // 2. Practice Exercise → Role-play (если есть)
  if (lesson.practiceExercise.type === 'roleplay') {
    exercises.push({
      type: 'role-play',
      scenario: lesson.practiceExercise.description,
      choices: [...], // из practiceExercise
      order: exercises.length + 1
    })
  }
  
  // 3. Examples → Matching
  if (lesson.formats.text?.content.examples) {
    exercises.push({
      type: 'matching',
      pairs: lesson.formats.text.content.examples.map(ex => ({
        left: ex.title,
        right: ex.text
      })),
      order: exercises.length + 1
    })
  }
  
  // 4. Fill in the Blanks (из ключевых фраз)
  const keyPhrases = extractKeyPhrases(lesson.formats.text?.content.sections)
  exercises.push({
    type: 'fill-blanks',
    sentence: keyPhrases[0],
    blanks: [...],
    order: exercises.length + 1
  })
  
  return exercises.slice(0, 7) // Максимум 7 упражнений
}
```

---

## СТРУКТУРА СТРАНИЦЫ

### GameModePage.tsx

```typescript
export default function GameModePage() {
  const [currentView, setCurrentView] = useState<'path' | 'lesson' | 'menu'>('path')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<GameProgress>({...})
  
  return (
    <div className="game-mode-page">
      {/* Шапка */}
      <GameHeader 
        xp={progress.xp}
        streak={progress.streak}
        onMenuClick={() => setCurrentView('menu')}
      />
      
      {/* Основной контент */}
      {currentView === 'path' && (
        <GamePath 
          lessons={boundariesModule.lessons}
          completedLessons={progress.completedLessons}
          currentLesson={progress.currentLesson}
          onLessonClick={(lessonId) => {
            const lesson = boundariesModule.lessons.find(l => l.id === lessonId)
            setSelectedLesson(lesson)
            setCurrentView('lesson')
          }}
        />
      )}
      
      {currentView === 'lesson' && selectedLesson && (
        <DuolingoLesson 
          lesson={selectedLesson}
          onComplete={(xp, score) => {
            // Обновить прогресс
            setProgress(prev => ({
              ...prev,
              xp: prev.xp + xp,
              completedLessons: [...prev.completedLessons, selectedLesson.id]
            }))
            setCurrentView('path')
          }}
          onExit={() => setCurrentView('path')}
        />
      )}
      
      {currentView === 'menu' && (
        <GameMenu 
          onClose={() => setCurrentView('path')}
          onCheckIn={() => {/* открыть чекин */}}
          onChat={() => {/* открыть чат */}}
          onGroup={() => {/* открыть группу */}}
          onRecords={() => {/* открыть записи */}}
        />
      )}
    </div>
  )
}
```

---

## ДИЗАЙН ПРИНЦИПЫ

### 1. **Минимализм**
- Фокус на контенте
- Минимум отвлекающих элементов

### 2. **Большие элементы**
- Кнопки минимум 44pt (iOS стандарт)
- Легко нажимать на мобильных

### 3. **Яркие цвета**
- Зеленый = правильно ✅
- Красный = неправильно ❌
- Синий = текущий/активный
- Фиолетовый = Катя/бренд

### 4. **Анимации**
- Плавные, но не отвлекающие
- Мгновенная обратная связь
- Празднование успехов

### 5. **Катя везде**
- Появляется в начале урока
- Комментирует прогресс
- Празднует успехи
- Поддерживает при ошибках

---

## ПЛАН РЕАЛИЗАЦИИ

### ЭТАП 1: Базовые компоненты (1-2 дня)
1. ✅ Создать `KatyaCharacter.tsx`
2. ✅ Создать `GameHeader.tsx`
3. ✅ Создать `GamePath.tsx` (на основе LearningPath)
4. ✅ Создать структуру `GameModePage.tsx`

### ЭТАП 2: Игровой урок (2-3 дня)
1. ✅ Создать `DuolingoLesson.tsx`
2. ✅ Создать `ExerciseTypes.tsx` (все типы упражнений)
3. ✅ Создать `lessonToGameExercises.ts` (преобразование данных)
4. ✅ Интегрировать Hearts систему
5. ✅ Добавить мгновенную обратную связь

### ЭТАП 3: Интеграция (1 день)
1. ✅ Подключить к роутингу (`/game`)
2. ✅ Интегрировать с текущими данными (`boundariesModule`)
3. ✅ Добавить сохранение прогресса (localStorage)

### ЭТАП 4: Основные фичи (1-2 дня)
1. ✅ Создать `GameMenu.tsx`
2. ✅ Интегрировать Check-in
3. ✅ Добавить Chat (заглушка)
4. ✅ Добавить Group (заглушка)
5. ✅ Добавить Records (заглушка)

### ЭТАП 5: Полировка (1 день)
1. ✅ Анимации Кати
2. ✅ Звуки/вибро (опционально)
3. ✅ Празднования
4. ✅ Оптимизация производительности

---

## ТЕХНИЧЕСКИЕ ДЕТАЛИ

### Роутинг

**В `App.tsx` или роутере:**
```typescript
import GameModePage from '@/pages/GameModePage'

// Добавить роут
<Route path="/game" element={<GameModePage />} />
```

### Данные

**Использовать существующие:**
- `boundariesModule` - источник уроков
- `localStorage` - сохранение прогресса
- `useKV` - для синхронизации (если нужно)

### Стили

**Использовать существующие:**
- Tailwind CSS
- shadcn/ui компоненты
- Framer Motion для анимаций

---

## ПРИМЕРЫ КОДА

### KatyaCharacter.tsx (упрощенный)

```typescript
import { motion } from 'framer-motion'

interface KatyaCharacterProps {
  emotion: 'happy' | 'supportive' | 'celebrating' | 'sad'
  message?: string
  show: boolean
}

export default function KatyaCharacter({ emotion, message, show }: KatyaCharacterProps) {
  if (!show) return null
  
  const avatars = {
    happy: '👩‍🏫',
    supportive: '💪',
    celebrating: '🎉',
    sad: '😔'
  }
  
  const defaultMessages = {
    happy: 'Привет! Готов начать урок?',
    supportive: 'Отлично! Продолжай!',
    celebrating: 'Поздравляю! Ты справился!',
    sad: 'Почти! Попробуй еще раз'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2 p-4"
    >
      <div className="text-6xl">{avatars[emotion]}</div>
      {message && (
        <p className="text-sm text-gray-700 text-center">{message}</p>
      )}
    </motion.div>
  )
}
```

### MultipleChoiceExercise.tsx (пример)

```typescript
interface MultipleChoiceExerciseProps {
  question: string
  options: QuizOption[]
  correctAnswer: string
  explanation: string
  onAnswer: (isCorrect: boolean) => void
}

export default function MultipleChoiceExercise({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer
}: MultipleChoiceExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  
  const handleSelect = (optionId: string) => {
    if (showFeedback) return
    
    setSelected(optionId)
    setShowFeedback(true)
    
    const isCorrect = optionId === correctAnswer
    onAnswer(isCorrect)
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{question}</h3>
      
      <div className="space-y-2">
        {options.map(option => {
          const isSelected = selected === option.id
          const isCorrect = option.id === correctAnswer
          const showResult = showFeedback && isSelected
          
          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-lg border-2 text-left ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              whileTap={!showFeedback ? { scale: 0.98 } : {}}
            >
              {option.text}
              {showResult && (
                <span className="ml-2 text-xl">
                  {isCorrect ? '✅' : '❌'}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-blue-50 border border-blue-200"
        >
          <p className="text-sm">{explanation}</p>
        </motion.div>
      )}
    </div>
  )
}
```

---

## СЛЕДУЮЩИЕ ШАГИ

1. **Изучить текущую структуру** ✅ (сделано)
2. **Создать документ с анализом Duolingo** ✅ (сделано)
3. **Создать план реализации** ✅ (сделано)
4. **Начать реализацию** - создать базовые компоненты

---

*Документ создан: 2025-01-06*  
*Цель: Создать игровую страницу в стиле Duolingo с психологом Катей*  
*Статус: План готов, можно начинать реализацию*

