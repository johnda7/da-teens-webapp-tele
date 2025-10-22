import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Moon, Brain, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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
      
      // Success feedback with celebration
      toast.success('Чек-ин сохранён!', {
        description: 'Спасибо, что поделился своими ощущениями 💙'
      })
      
      // Reset form if it's a new check-in
      if (!hasCheckedInToday) {
        setNote('')
      }
    } catch (error) {
      toast.error('Что-то пошло не так', {
        description: 'Попробуй ещё раз через минутку'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSleepFeedback = (hours: number) => {
    if (hours < 6) return { text: 'Маловато сна', color: 'text-red-600', emoji: '😴' }
    if (hours < 7) return { text: 'Можно больше', color: 'text-orange-600', emoji: '😪' }
    if (hours <= 9) return { text: 'Отлично!', color: 'text-green-600', emoji: '😊' }
    return { text: 'Много сна', color: 'text-blue-600', emoji: '😴' }
  }

  const getAnxietyFeedback = (level: number) => {
    if (level <= 2) return { text: 'Спокойно', color: 'text-green-600', emoji: '😌' }
    if (level <= 4) return { text: 'Немного волнуешься', color: 'text-yellow-600', emoji: '😐' }
    if (level <= 6) return { text: 'Заметное беспокойство', color: 'text-orange-600', emoji: '😟' }
    if (level <= 8) return { text: 'Сильная тревога', color: 'text-red-600', emoji: '😰' }
    return { text: 'Очень тревожно', color: 'text-red-700', emoji: '😱' }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Gradient для Liquid Glass эффекта */}
      <div className="fixed inset-0 -z-10">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div> {/* End of background gradient wrapper */}

      <motion.div 
        className="relative space-y-8 px-4 md:px-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header - iOS 26 Style */}
        <div className="text-center pt-6 pb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-6xl mb-4">💙</div>
            <h2 className="text-[34px] leading-[41px] tracking-tight font-bold mb-3">
              Ежедневный чек-ин
            </h2>
            <p className="text-[17px] leading-[22px] tracking-tight text-gray-600 dark:text-gray-400">
              {hasCheckedInToday ? 'Обновить сегодняшние ощущения' : 'Как дела сегодня?'}
            </p>
          </motion.div>
        </div>

        {/* Today's Status - Success Badge */}
        {hasCheckedInToday && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
            style={{
              boxShadow: '0 4px 16px 0 rgba(52, 199, 89, 0.2)'
            }}
          >
            <div 
              className="absolute inset-0 bg-green-500/10"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            />
            <div className="absolute inset-0 rounded-2xl border border-green-500/30" />
            <div className="relative p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" weight="fill" />
              <span className="text-[15px] leading-[20px] font-semibold text-green-800 dark:text-green-600">
                Чек-ин на сегодня уже есть
              </span>
            </div>
          </motion.div>
        )}

        {/* All Cards Container */}
        <div className="space-y-8">
        {/* Mood Check - Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
          }}
        >
          {/* Liquid Glass Background */}
          <div 
            className="absolute inset-0 bg-white/70 dark:bg-black/30"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          />
          {/* Gradient overlay для видимости */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5" />
          
          <div className="absolute inset-0 rounded-2xl border border-white/30 dark:border-white/10" />
          
          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-[#FF2D55]" weight="fill" />
                <h3 className="text-[20px] leading-[25px] font-bold text-gray-900 dark:text-white">
                  Настроение
                </h3>
              </div>
              <p className="text-[15px] leading-[20px] text-gray-700 dark:text-gray-300">
                Как ты себя чувствуешь прямо сейчас?
              </p>
            </div>

            {/* Emoji Grid - 2 rows × 5 columns */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-5 gap-3">
                {moodEmojis.slice(0, 5).map((emoji, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setMood(index + 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      relative p-4 rounded-xl transition-all flex items-center justify-center
                      ${mood === index + 1 
                        ? 'bg-[#007AFF]/20 ring-2 ring-[#007AFF] shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80 dark:bg-gray-800/60 dark:hover:bg-gray-800/80'
                      }
                    `}
                    style={{
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="text-3xl leading-none">{emoji}</div>
                  </motion.button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-3">
                {moodEmojis.slice(5, 10).map((emoji, index) => (
                  <motion.button
                    key={index + 5}
                    onClick={() => setMood(index + 6)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      relative p-4 rounded-xl transition-all flex items-center justify-center
                      ${mood === index + 6 
                        ? 'bg-[#007AFF]/20 ring-2 ring-[#007AFF] shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80 dark:bg-gray-800/60 dark:hover:bg-gray-800/80'
                      }
                    `}
                    style={{
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="text-3xl leading-none">{emoji}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Current Selection - Bigger Display */}
            <motion.div
              key={mood}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-center p-6 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(90, 200, 250, 0.15) 100%)',
                border: '1px solid rgba(0, 122, 255, 0.3)'
              }}
            >
              <div className="text-6xl mb-3 leading-none">{moodEmojis[mood - 1]}</div>
              <div className="text-[17px] leading-[22px] font-semibold text-[#007AFF]">
                {moodLabels[mood - 1]}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Anxiety Level - Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div 
            className="absolute inset-0 bg-white/80 dark:bg-black/20"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          />
          <div className="absolute inset-0 rounded-2xl border border-white/20" />
          
          <div className="relative z-10 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-[#FF9500]" weight="fill" />
                <h3 className="text-[20px] leading-[25px] font-bold">Уровень тревоги</h3>
              </div>
              <p className="text-[15px] leading-[20px] text-gray-600 dark:text-gray-400">
                От 0 (совсем спокойно) до 10 (очень тревожно)
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <Slider
                value={anxiety}
                onValueChange={setAnxiety}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[13px] leading-[18px] text-gray-600 dark:text-gray-400">
                <span>0 · Спокойно</span>
                <span>5 · Средне</span>
                <span>10 · Тревожно</span>
              </div>
            </div>
            
            <motion.div
              key={anxiety[0]}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 159, 10, 0.1) 100%)',
                border: '1px solid rgba(255, 149, 0, 0.2)'
              }}
            >
              <div className="text-5xl mb-2">{getAnxietyFeedback(anxiety[0]).emoji}</div>
              <div className="text-[28px] leading-[34px] font-bold text-[#FF9500] mb-1">
                {anxiety[0]}/10
              </div>
              <div className={`text-[15px] leading-[20px] font-semibold ${getAnxietyFeedback(anxiety[0]).color}`}>
                {getAnxietyFeedback(anxiety[0]).text}
              </div>
            </motion.div>

            {anxiety[0] > 7 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
              >
                <p className="text-[15px] leading-[20px] text-orange-800 dark:text-orange-600">
                  <strong>💙 Поддержка рядом:</strong> Кажется, ты сильно волнуешься. Попробуй дыхательную практику или обратись к куратору.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Sleep Hours - Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div 
            className="absolute inset-0 bg-white/80 dark:bg-black/20"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          />
          <div className="absolute inset-0 rounded-2xl border border-white/20" />
          
          <div className="relative z-10 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-6 h-6 text-[#AF52DE]" weight="fill" />
                <h3 className="text-[20px] leading-[25px] font-bold">Сон прошлой ночью</h3>
              </div>
              <p className="text-[15px] leading-[20px] text-gray-600 dark:text-gray-400">
                Сколько часов ты спал?
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <Slider
                value={sleepHours}
                onValueChange={setSleepHours}
                max={12}
                min={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-[13px] leading-[18px] text-gray-600 dark:text-gray-400">
                <span>3 ч</span>
                <span>7-8 ч</span>
                <span>12 ч</span>
              </div>
            </div>
            
            <motion.div
              key={sleepHours[0]}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.1) 0%, rgba(191, 90, 242, 0.1) 100%)',
                border: '1px solid rgba(175, 82, 222, 0.2)'
              }}
            >
              <div className="text-5xl mb-2">{getSleepFeedback(sleepHours[0]).emoji}</div>
              <div className="text-[28px] leading-[34px] font-bold text-[#AF52DE] mb-1">
                {sleepHours[0]} ч
              </div>
              <div className={`text-[15px] leading-[20px] font-semibold ${getSleepFeedback(sleepHours[0]).color}`}>
                {getSleepFeedback(sleepHours[0]).text}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Notes - Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div 
            className="absolute inset-0 bg-white/80 dark:bg-black/20"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          />
          <div className="absolute inset-0 rounded-2xl border border-white/20" />
          
          <div className="relative z-10 p-8">
            <div className="mb-6">
              <h3 className="text-[20px] leading-[25px] font-bold mb-2">Быстрая заметка</h3>
              <p className="text-[15px] leading-[20px] text-gray-600 dark:text-gray-400">
                Что-то важное, что хочешь запомнить? (необязательно)
              </p>
            </div>
            
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: 'Хорошо прошла контрольная' или 'Поссорился с другом'..."
              className="min-h-[120px] resize-none text-[17px] leading-[22px] rounded-xl border-gray-300 dark:border-gray-700"
              style={{
                backdropFilter: 'blur(10px)',
              }}
              maxLength={200}
            />
            <div className="text-[13px] leading-[18px] text-gray-600 dark:text-gray-400 mt-3 text-right">
              {note.length}/200 символов
            </div>
          </div>
        </motion.div>

        {/* Submit Button - iOS 26 Style */}
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 rounded-2xl text-[17px] leading-[22px] font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isSubmitting 
              ? 'linear-gradient(135deg, #A3A3A3 0%, #737373 100%)'
              : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
          }}
        >
          {isSubmitting ? '⏳ Сохраняем...' : hasCheckedInToday ? '✓ Обновить чек-ин' : '💙 Сохранить чек-ин'}
        </motion.button>

        {/* Weekly Progress - Liquid Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div 
            className="absolute inset-0 bg-white/80 dark:bg-black/20"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          />
          <div className="absolute inset-0 rounded-2xl border border-white/20" />
          
          <div className="relative z-10 p-8">
            <h3 className="text-[20px] leading-[25px] font-bold mb-6">Твоя неделя</h3>
            
            <div className="grid grid-cols-7 gap-3 mb-6">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                const isCompleted = index <= 2
                return (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="text-[13px] leading-[18px] text-gray-600 dark:text-gray-400 mb-2">
                      {day}
                    </div>
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-semibold transition-all
                        ${isCompleted 
                          ? 'bg-[#34C759] text-white shadow-lg' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? '✓' : ''}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="text-center">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[15px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(48, 209, 88, 0.1) 100%)',
                  border: '1px solid rgba(52, 199, 89, 0.3)',
                  color: '#34C759'
                }}
              >
                <CheckCircle className="w-4 h-4" weight="fill" />
                3 дня подряд
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </div>
  )
}