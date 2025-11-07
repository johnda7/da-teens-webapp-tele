# ГЛУБОКИЙ АНАЛИЗ DUOLINGO: ИССЛЕДОВАНИЕ ИГРОВОЙ МЕХАНИКИ

## ЧТО Я ИЗУЧИЛ

### 1. ТЕКУЩЕЕ СОСТОЯНИЕ НА ЛОКАЛЕ

**Что создано:**
- ✅ `DUOLINGO_GAME_ANALYSIS.md` - базовый анализ (общие принципы)
- ✅ `GAME_MODE_IMPLEMENTATION_PLAN.md` - план реализации
- ❌ **Код еще не создан** - только документы

**Что нужно:**
- Изучить реальную структуру Duolingo (интерфейс, данные, механика)
- Найти примеры кода или открытые проекты
- Создать детальный анализ с примерами

---

## ИССЛЕДОВАНИЕ DUOLINGO

### ПРОБЛЕМА: Исходный код закрыт

Duolingo - закрытое приложение, исходный код недоступен. Но можно изучить:
1. Интерфейс через скриншоты/видео
2. Структуру данных через API (если доступно)
3. Аналогичные открытые проекты
4. Исследования и статьи

### ЧТО ИЗУЧАЮ:

#### 1. Структура урока Duolingo (из наблюдений)

**Экран урока:**
```
┌─────────────────────────────────────┐
│  [Duo совенок]  ❤️❤️❤️❤️❤️  XP: 150 │
├─────────────────────────────────────┤
│  Прогресс: ████░░░ 4/7              │
├─────────────────────────────────────┤
│                                     │
│  Упражнение 4/7                     │
│                                     │
│  "Hello" на русском:                │
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │ Привет  │  │ Здравствуй│        │
│  └─────────┘  └─────────┘         │
│  ┌─────────┐  ┌─────────┐         │
│  │ Пока   │  │ Спасибо  │         │
│  └─────────┘  └─────────┘         │
│                                     │
│  [Кнопка: Проверить]                │
└─────────────────────────────────────┘
```

**Типы упражнений:**
1. **Multiple Choice** - выбор из 4 вариантов
2. **Translation** - переведи фразу
3. **Word Selection** - выбери правильные слова
4. **Listening** - прослушай и выбери
5. **Speaking** - произнеси фразу
6. **Matching** - соедини пары
7. **Fill in the Blanks** - заполни пропуски

**Механика:**
- Мгновенная обратная связь (зеленый/красный)
- Hearts система (5 жизней, теряешь при ошибке)
- Прогресс-бар (1/7, 2/7...)
- XP за правильный ответ
- Duo комментирует (анимация)

---

## СТРУКТУРА ДАННЫХ (ПРЕДПОЛАГАЕМАЯ)

### Lesson Structure (JSON)

```typescript
interface DuolingoLesson {
  id: string
  title: string
  skillId: string
  exercises: Exercise[]
  totalExercises: number
  hearts: number // 5 по умолчанию
  xpReward: number // 10-20 XP
}

interface Exercise {
  id: string
  type: 'multiple-choice' | 'translation' | 'listening' | 'speaking' | 'matching' | 'fill-blanks'
  question: string
  options?: string[] // для multiple-choice
  correctAnswer: string | string[]
  explanation?: string
  audioUrl?: string // для listening
  imageUrl?: string // опционально
  order: number // 1, 2, 3...
}
```

### Exercise Types (Детально)

#### 1. Multiple Choice
```json
{
  "type": "multiple-choice",
  "question": "Что такое личные границы?",
  "options": [
    "Правила родителей",
    "Невидимый забор, защищающий твое пространство",
    "Способ избегать людей",
    "То, что делает тебя эгоистом"
  ],
  "correctAnswer": 1,
  "explanation": "Личные границы защищают твое пространство..."
}
```

#### 2. Translation / Fill in the Blanks
```json
{
  "type": "fill-blanks",
  "sentence": "Личные границы — это [BLANK], защищающий твое пространство",
  "options": ["забор", "стена", "правило", "закон"],
  "correctAnswer": "забор"
}
```

#### 3. Matching
```json
{
  "type": "matching",
  "pairs": [
    { "left": "Физические границы", "right": "Твое тело, личное пространство" },
    { "left": "Эмоциональные границы", "right": "Твои чувства, право на эмоции" }
  ]
}
```

#### 4. Role-play (адаптация для нас)
```json
{
  "type": "role-play",
  "scenario": "Друг просит списать домашку в 2 часа ночи",
  "character": "Друг",
  "message": "Эй, не спишь? Поможешь с домашкой?",
  "choices": [
    { "id": "a", "text": "Конечно, помогу!", "isHealthy": false },
    { "id": "b", "text": "Извини, сейчас не могу. Завтра помогу", "isHealthy": true },
    { "id": "c", "text": "Игнорирую сообщение", "isHealthy": false }
  ],
  "correctAnswer": "b",
  "explanation": "Устанавливаешь временные границы..."
}
```

---

## КОМПОНЕНТНАЯ СТРУКТУРА (React/TypeScript)

### 1. LessonScreen Component

```typescript
interface LessonScreenProps {
  lesson: DuolingoLesson
  onComplete: (xp: number, score: number) => void
  onExit: () => void
}

function LessonScreen({ lesson, onComplete, onExit }: LessonScreenProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  
  const currentExercise = lesson.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100
  
  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentExercise.correctAnswer
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      // Показать зеленую галочку
      // Анимация Duo (радость)
      // +2 XP
    } else {
      setHearts(prev => prev - 1)
      // Показать красный крестик
      // Анимация Duo (грусть)
      // Показать правильный ответ
    }
    
    setShowFeedback(true)
    
    // Автоматически перейти к следующему через 2 секунды
    setTimeout(() => {
      if (currentExerciseIndex < lesson.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1)
        setShowFeedback(false)
      } else {
        // Урок завершен
        onComplete(lesson.xpReward, score)
      }
    }, 2000)
  }
  
  return (
    <div className="lesson-screen">
      {/* Header */}
      <LessonHeader 
        hearts={hearts}
        xp={userXP}
        progress={progress}
        currentExercise={currentExerciseIndex + 1}
        totalExercises={lesson.exercises.length}
      />
      
      {/* Duo Character */}
      <DuoCharacter 
        emotion={showFeedback ? (isCorrect ? 'happy' : 'sad') : 'neutral'}
        message={getDuoMessage()}
      />
      
      {/* Exercise */}
      <ExerciseRenderer 
        exercise={currentExercise}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
      />
    </div>
  )
}
```

### 2. ExerciseRenderer Component

```typescript
interface ExerciseRendererProps {
  exercise: Exercise
  onAnswer: (answer: string) => void
  showFeedback: boolean
}

function ExerciseRenderer({ exercise, onAnswer, showFeedback }: ExerciseRendererProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} onAnswer={onAnswer} showFeedback={showFeedback} />
    case 'fill-blanks':
      return <FillBlanksExercise exercise={exercise} onAnswer={onAnswer} showFeedback={showFeedback} />
    case 'matching':
      return <MatchingExercise exercise={exercise} onAnswer={onAnswer} showFeedback={showFeedback} />
    case 'role-play':
      return <RolePlayExercise exercise={exercise} onAnswer={onAnswer} showFeedback={showFeedback} />
    default:
      return null
  }
}
```

### 3. MultipleChoiceExercise Component

```typescript
function MultipleChoiceExercise({ exercise, onAnswer, showFeedback }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  
  const handleSelect = (option: string) => {
    if (showFeedback) return
    setSelected(option)
    onAnswer(option)
  }
  
  return (
    <div className="exercise-container">
      <h2 className="question">{exercise.question}</h2>
      
      <div className="options-grid">
        {exercise.options.map((option, idx) => {
          const isSelected = selected === option
          const isCorrect = option === exercise.correctAnswer
          const showResult = showFeedback && isSelected
          
          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={showFeedback}
              className={`option-button ${
                showResult
                  ? isCorrect ? 'correct' : 'incorrect'
                  : 'default'
              }`}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              {option}
              {showResult && (
                <span className="result-icon">
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
          className="feedback"
        >
          <p>{exercise.explanation}</p>
        </motion.div>
      )}
    </div>
  )
}
```

---

## ПРЕОБРАЗОВАНИЕ НАШИХ ДАННЫХ

### Из boundariesModule в Duolingo-формат

```typescript
function lessonToDuolingoFormat(lesson: Lesson): DuolingoLesson {
  const exercises: Exercise[] = []
  
  // 1. Quiz → Multiple Choice (первые 3-4 вопроса)
  lesson.quiz.slice(0, 4).forEach((q, idx) => {
    exercises.push({
      id: `ex-${idx + 1}`,
      type: 'multiple-choice',
      question: q.question,
      options: q.options.map(opt => opt.text),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: idx + 1
    })
  })
  
  // 2. Examples → Matching
  if (lesson.formats.text?.content.examples) {
    const healthyExamples = lesson.formats.text.content.examples.filter(ex => ex.title.includes('✅'))
    const violatedExamples = lesson.formats.text.content.examples.filter(ex => ex.title.includes('❌'))
    
    exercises.push({
      id: 'ex-matching',
      type: 'matching',
      pairs: [
        { left: 'Здоровая граница', right: healthyExamples[0]?.text },
        { left: 'Нарушенная граница', right: violatedExamples[0]?.text }
      ],
      order: exercises.length + 1
    })
  }
  
  // 3. Practice Exercise → Role-play
  if (lesson.practiceExercise.type === 'roleplay') {
    exercises.push({
      id: 'ex-roleplay',
      type: 'role-play',
      scenario: lesson.practiceExercise.description,
      choices: [...], // из practiceExercise
      correctAnswer: 'b', // здоровый ответ
      explanation: 'Устанавливаешь границы...',
      order: exercises.length + 1
    })
  }
  
  // 4. Fill in the Blanks (из ключевых фраз)
  const keyPhrase = extractKeyPhrase(lesson.formats.text?.content.sections)
  exercises.push({
    id: 'ex-fill',
    type: 'fill-blanks',
    sentence: keyPhrase,
    options: ['забор', 'стена', 'правило'],
    correctAnswer: 'забор',
    order: exercises.length + 1
  })
  
  return {
    id: lesson.id,
    title: lesson.title,
    exercises: exercises.slice(0, 7), // Максимум 7 упражнений
    totalExercises: exercises.length,
    hearts: 5,
    xpReward: 20
  }
}
```

---

## ОТКРЫТЫЕ ПРОЕКТЫ ДЛЯ ИЗУЧЕНИЯ

### 1. CodeCombat
- Образовательная RPG для программирования
- Открытый исходный код
- Игровые механики

### 2. Dodona
- Система обучения программированию
- GitHub: доступен исходный код
- Адаптивные упражнения

### 3. Quizlet
- Карточки и игры
- Можно изучить структуру упражнений

---

## СЛЕДУЮЩИЕ ШАГИ

1. ✅ Создать детальный анализ структуры
2. 🔄 Найти скриншоты/видео интерфейса Duolingo
3. 🔄 Изучить открытые проекты (CodeCombat, Dodona)
4. ⏳ Создать прототип компонентов
5. ⏳ Преобразовать наши данные в игровой формат

---

*Документ создан: 2025-01-06*  
*Статус: Исследование в процессе*

