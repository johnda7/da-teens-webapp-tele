# 🚀 Quick Start - Запуск адаптивной системы обучения

## За 5 минут запусти систему!

### Шаг 1: Проверь, что файлы созданы ✅

```bash
# Должны существовать:
src/data/boundariesModule.ts          # Модуль с 9 уроками
src/lib/adaptiveLearning.ts           # Адаптивный движок
src/lib/gamification.ts                # Геймификация
src/components/AdaptiveLessonViewer.tsx # UI компонент
```

### Шаг 2: Добавь в App.tsx (3 минуты)

#### 2.1 Импорты в начало файла:

```typescript
import boundariesModule from '@/data/boundariesModule'
import { adaptiveLearning } from '@/lib/adaptiveLearning'
import { gamification, TEEN_BADGES } from '@/lib/gamification'
import AdaptiveLessonViewer from '@/components/AdaptiveLessonViewer'
import type { LessonRecommendation } from '@/lib/adaptiveLearning'
```

#### 2.2 Добавь состояние (после существующих useState):

```typescript
const [currentLesson, setCurrentLesson] = useState<LessonRecommendation | null>(null)
```

#### 2.3 Добавь функцию выбора урока:

```typescript
const selectNextLesson = async () => {
  const lastCheckIn = checkIns[checkIns.length - 1]
  
  const recommendation = await adaptiveLearning.selectNextLesson(
    boundariesModule.lessons,
    {
      userId: user?.id?.toString() || 'demo',
      completedLessons: [],
      quizScores: {},
      timeSpent: {},
      practiceCompleted: {},
      checkIns: checkIns.map(ci => ({
        mood: ci.mood,
        anxiety: ci.anxiety,
        sleepHours: ci.sleepHours || 7,
        energy: 5,
        timestamp: new Date(ci.date)
      })),
      lastActiveDate: new Date(),
      streak: userProfile.streak
    },
    lastCheckIn ? {
      mood: lastCheckIn.mood,
      anxiety: lastCheckIn.anxiety,
      sleepHours: lastCheckIn.sleepHours || 7,
      energy: 5,
      timestamp: new Date(lastCheckIn.date)
    } : undefined
  )
  
  setCurrentLesson(recommendation)
}
```

#### 2.4 Замени в UI (найди секцию с ModuleGrid):

```typescript
{selectedModule && (
  <div className="space-y-4">
    <Button variant="outline" onClick={() => setSelectedModule(null)}>
      ← Назад к модулям
    </Button>
    
    {currentLesson ? (
      <AdaptiveLessonViewer
        recommendation={currentLesson}
        onComplete={(score) => {
          console.log('Урок завершен, результат:', score)
          setCurrentLesson(null)
          // TODO: Сохранить прогресс
        }}
        onSkip={() => {
          setCurrentLesson(null)
        }}
      />
    ) : (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold">Готов к обучению?</h3>
          <p className="text-gray-600">
            Я подберу урок специально для тебя на основе твоего настроения
          </p>
          <Button onClick={selectNextLesson} size="lg" className="gap-2">
            Начать урок <ArrowRight size={20} />
          </Button>
        </div>
      </Card>
    )}
  </div>
)}
```

### Шаг 3: Запусти! 🎉

```bash
npm run dev
```

### Шаг 4: Протестируй

1. **Сделай чек-ин** (вкладка "Дашборд" → заполни настроение/тревогу/сон)
2. **Открой модуль** (например, "Уверенность в себе")
3. **Нажми "Начать урок"**
4. **Система подберет урок** - ты увидишь почему именно этот
5. **Выбери формат** (текст/видео/аудио)
6. **Пройди урок** → тест → практику

## 🎯 Что должно работать

После интеграции ты должен увидеть:

✅ Кнопку "Начать урок" при открытии модуля  
✅ Рекомендацию урока с объяснением почему  
✅ Переключение между форматами (текст/видео/аудио)  
✅ Тест с немедленным фидбеком  
✅ Практические упражнения  
✅ Экран завершения с результатом  

## 🐛 Troubleshooting

**Ошибка**: Cannot find module '@/data/boundariesModule'
```bash
# Проверь, что файл существует:
ls src/data/boundariesModule.ts
```

**Ошибка**: Type errors с LessonRecommendation
```typescript
// Добавь импорт:
import type { LessonRecommendation } from '@/lib/adaptiveLearning'
```

**Урок не подбирается**:
```typescript
// Проверь, что есть хотя бы один чек-ин:
console.log('CheckIns:', checkIns)
```

## 📊 Проверь консоль

При выборе урока в консоли должно появиться:

```
Эмоциональное состояние: { capacity: 'high', stability: 'stable', ... }
Когнитивная нагрузка: low
Уровень мастерства: beginner
Выбран урок: "Что такое личные границы?"
Confidence: 85
```

## 🎨 Следующие шаги

После базовой интеграции:

1. **Добавь XP систему** (см. IMPLEMENTATION_GUIDE.md раздел "Gamification")
2. **Интегрируй бейджи** (раздел "BadgeGrid")
3. **Добавь Wellness Score** (раздел "ProgressStats")
4. **Сохраняй прогресс** (используй useKV для persistance)

## 💡 Полезные команды

```bash
# Проверить типы
npm run build

# Проверить линтер
npm run lint

# Запустить dev сервер
npm run dev
```

## 🆘 Нужна помощь?

Читай подробную документацию:
- **IMPLEMENTATION_GUIDE.md** - полная интеграция с кодом
- **SYSTEM_SUMMARY.md** - обзор системы
- **boundariesModule.ts** - структура уроков

---

**Время интеграции: ~5 минут**  
**Результат: Работающая адаптивная система обучения!** 🚀
