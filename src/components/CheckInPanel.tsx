import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Moon, Brain, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CheckInPanelProps {
  onCheckIn: (data: CheckInData) => void
  lastCheckIn: CheckInData | null
}

interface CheckInData {
  date: string
  mood: number
  anxiety: number
  sleepHours: number
  note?: string
}

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤗', '😍', '🥰', '✨']
const moodLabels = ['Очень плохо', 'Плохо', 'Грустно', 'Нормально', 'Хорошо', 'Отлично', 'Прекрасно', 'Вдохновлённо', 'Счастлив', 'На высоте']

export default function CheckInPanel({ onCheckIn, lastCheckIn }: CheckInPanelProps) {
  const [mood, setMood] = useState<number>(5)
  const [anxiety, setAnxiety] = useState<number[]>([3])
  const [sleepHours, setSleepHours] = useState<number[]>([7])
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const hasCheckedInToday = lastCheckIn?.date === today

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const checkInData: CheckInData = {
        date: today,
        mood,
        anxiety: anxiety[0],
        sleepHours: sleepHours[0],
        note: note.trim() || undefined
      }
      
      onCheckIn(checkInData)
      
      // Success feedback
      toast.success('Чек-ин сохранён!', {
        description: 'Спасибо, что поделился своими ощущениями 💙'
      })
      
      // Reset form if it's a new check-in
      if (!hasCheckedInToday) {
        setNote('')
      }
    } catch (_error) {
      toast.error('Что-то пошло не так', {
        description: 'Попробуй ещё раз через минутку'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSleepFeedback = (hours: number) => {
    if (hours < 6) return { text: 'Маловато сна', color: 'text-red-600' }
    if (hours < 7) return { text: 'Можно больше', color: 'text-orange-600' }
    if (hours <= 9) return { text: 'Отлично!', color: 'text-green-600' }
    return { text: 'Много сна', color: 'text-blue-600' }
  }

  const getAnxietyFeedback = (level: number) => {
    if (level <= 2) return { text: 'Спокойно', color: 'text-green-600' }
    if (level <= 4) return { text: 'Немного волнуешься', color: 'text-yellow-600' }
    if (level <= 6) return { text: 'Заметное беспокойство', color: 'text-orange-600' }
    if (level <= 8) return { text: 'Сильная тревога', color: 'text-red-600' }
    return { text: 'Очень тревожно', color: 'text-red-700' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Ежедневный чек-ин</h2>
        <p className="text-muted-foreground mt-1">
          {hasCheckedInToday ? 'Обновить сегодняшние ощущения' : 'Как дела сегодня?'}
        </p>
      </div>

      {/* Today's Status */}
      {hasCheckedInToday && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
              <span className="text-green-800 font-medium">Чек-ин на сегодня уже есть</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Mood Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Настроение
            </CardTitle>
            <CardDescription>Как ты себя чувствуешь прямо сейчас?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Emoji Scale */}
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setMood(index + 1)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mood === index + 1 
                      ? 'border-primary bg-primary/10 scale-110' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl">{emoji}</div>
                </button>
              ))}
            </div>
            
            {/* Current Selection */}
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-3xl mb-1">{moodEmojis[mood - 1]}</div>
              <div className="text-sm font-medium">{moodLabels[mood - 1]}</div>
            </div>
          </CardContent>
        </Card>

        {/* Anxiety Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-500" />
              Уровень тревоги
            </CardTitle>
            <CardDescription>От 0 (совсем спокойно) до 10 (очень тревожно)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Slider
                value={anxiety}
                onValueChange={setAnxiety}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 - Спокойно</span>
                <span>5 - Средне</span>
                <span>10 - Очень тревожно</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{anxiety[0]}/10</div>
              <div className={`text-sm font-medium ${getAnxietyFeedback(anxiety[0]).color}`}>
                {getAnxietyFeedback(anxiety[0]).text}
              </div>
            </div>

            {anxiety[0] > 7 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  Кажется, ты сильно волнуешься. Попробуй дыхательную практику или обратись к куратору 💙
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sleep Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Сон прошлой ночью
            </CardTitle>
            <CardDescription>Сколько часов ты спал?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Slider
                value={sleepHours}
                onValueChange={setSleepHours}
                max={12}
                min={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3 часа</span>
                <span>7-8 часов</span>
                <span>12 часов</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{sleepHours[0]} ч</div>
              <div className={`text-sm font-medium ${getSleepFeedback(sleepHours[0]).color}`}>
                {getSleepFeedback(sleepHours[0]).text}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрая заметка</CardTitle>
            <CardDescription>Что-то важное, что хочешь запомнить? (необязательно)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: 'Хорошо прошла контрольная' или 'Поссорился с другом'..."
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {note.length}/200
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="lg" 
          className="w-full"
        >
          {isSubmitting ? 'Сохраняем...' : hasCheckedInToday ? 'Обновить чек-ин' : 'Сохранить чек-ин'}
        </Button>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Твоя неделя</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index <= 2 ? 'bg-green-100 text-green-600' : 'bg-muted'
                  }`}>
                    {index <= 2 ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                3 дня подряд
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}