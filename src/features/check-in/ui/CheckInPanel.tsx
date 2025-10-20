/**
 * Check-In Feature - UI Component
 * 
 * Migrated from src/components/CheckInPanel.tsx
 * Ежедневный чек-ин эмоционального состояния подростка
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Moon, Brain, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

import { 
  CheckInData, 
  MOOD_EMOJIS, 
  MOOD_LABELS,
  ANXIETY_LEVELS,
  getSleepQuality,
  hasCheckedInToday,
  getCheckInRecommendation,
  type CheckInFormState
} from '../model/types'

interface CheckInPanelProps {
  onCheckIn: (data: CheckInData) => void
  lastCheckIn: CheckInData | null
}

export function CheckInPanel({ onCheckIn, lastCheckIn }: CheckInPanelProps) {
  const [mood, setMood] = useState<number>(5)
  const [anxiety, setAnxiety] = useState<number[]>([3])
  const [sleepHours, setSleepHours] = useState<number[]>([7])
  const [note, setNote] = useState('')
  const [formState, setFormState] = useState<CheckInFormState>('idle')

  const today = new Date().toISOString().split('T')[0]
  const checkedInToday = hasCheckedInToday(lastCheckIn)

  const handleSubmit = async () => {
    setFormState('submitting')
    
    try {
      const checkInData: CheckInData = {
        date: today,
        mood,
        anxiety: anxiety[0],
        sleepHours: sleepHours[0],
        note: note.trim() || undefined,
        timestamp: Date.now()
      }
      
      onCheckIn(checkInData)
      
      // Success feedback
      setFormState('success')
      toast.success('Чек-ин сохранён! 🎉', {
        description: getCheckInRecommendation(checkInData)
      })
      
      // Reset form
      setTimeout(() => {
        setNote('')
        setFormState('idle')
      }, 1000)
      
    } catch (error) {
      console.error('Check-in error:', error)
      setFormState('error')
      toast.error('Ошибка сохранения', {
        description: 'Попробуй ещё раз через пару секунд'
      })
    }
  }

  if (checkedInToday) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle weight="fill" className="w-6 h-6" />
                Чек-ин завершён
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Ты уже отметился сегодня. Возвращайся завтра! 😊
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl mb-2">
                {MOOD_EMOJIS[Math.max(0, Math.min(9, (lastCheckIn?.mood || 5) - 1))]}
              </div>
              <div className="text-sm text-muted-foreground">Настроение</div>
              <div className="font-semibold">{lastCheckIn?.mood}/10</div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-sm text-muted-foreground">Тревожность</div>
              <div className="font-semibold">{lastCheckIn?.anxiety}/10</div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl mb-2">😴</div>
              <div className="text-sm text-muted-foreground">Сон</div>
              <div className="font-semibold">{lastCheckIn?.sleepHours}ч</div>
            </div>
          </div>
          
          {lastCheckIn?.note && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Твоя заметка:</div>
              <p className="text-sm">{lastCheckIn.note}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart weight="fill" className="w-6 h-6 text-red-500" />
          Как твои дела сегодня?
        </CardTitle>
        <CardDescription>
          Ежедневный чек-ин помогает отслеживать твоё состояние
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mood Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="text-2xl">{MOOD_EMOJIS[Math.max(0, Math.min(9, mood - 1))]}</span>
              Настроение
            </label>
            <Badge variant="outline" className="text-lg px-3">
              {mood}/10
            </Badge>
          </div>
          
          <Slider
            value={[mood]}
            onValueChange={(value) => setMood(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          
          <p className="text-xs text-center text-muted-foreground">
            {MOOD_LABELS[Math.max(0, Math.min(9, mood - 1))]}
          </p>
        </div>

        {/* Anxiety Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Brain weight="fill" className="w-5 h-5" />
              Уровень тревожности
            </label>
            <Badge 
              variant="outline" 
              className="text-lg px-3"
              style={{
                background: anxiety[0] >= 7 ? 'rgba(239, 68, 68, 0.1)' : 
                           anxiety[0] >= 5 ? 'rgba(251, 191, 36, 0.1)' : 
                           'rgba(34, 197, 94, 0.1)',
                color: anxiety[0] >= 7 ? '#dc2626' : 
                       anxiety[0] >= 5 ? '#f59e0b' : 
                       '#16a34a'
              }}
            >
              {anxiety[0]}/10
            </Badge>
          </div>
          
          <Slider
            value={anxiety}
            onValueChange={setAnxiety}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          
          <p className="text-xs text-center text-muted-foreground">
            {ANXIETY_LEVELS[Math.max(0, Math.min(9, anxiety[0] - 1))]}
          </p>
        </div>

        {/* Sleep Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Moon weight="fill" className="w-5 h-5" />
              Часов сна
            </label>
            <Badge variant="outline" className="text-lg px-3">
              {sleepHours[0]}ч
            </Badge>
          </div>
          
          <Slider
            value={sleepHours}
            onValueChange={setSleepHours}
            min={0}
            max={12}
            step={0.5}
            className="w-full"
          />
          
          <p className="text-xs text-center text-muted-foreground">
            {getSleepQuality(sleepHours[0]) === 'excellent' && '✨ Отлично выспался'}
            {getSleepQuality(sleepHours[0]) === 'good' && '😊 Хорошо выспался'}
            {getSleepQuality(sleepHours[0]) === 'ok' && '😐 Нормально'}
            {getSleepQuality(sleepHours[0]) === 'poor' && '😔 Не выспался'}
            {getSleepQuality(sleepHours[0]) === 'bad' && '😴 Очень плохо'}
          </p>
        </div>

        {/* Note (optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Заметки (необязательно)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Что-то важное произошло? Расскажи, если хочешь..."
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {note.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={formState === 'submitting'}
          className="w-full shadow-lg hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}
          size="lg"
        >
          {formState === 'submitting' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Сохранение...
            </>
          ) : (
            <>
              <CheckCircle weight="fill" className="w-5 h-5 mr-2" />
              Сохранить чек-ин
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default CheckInPanel
