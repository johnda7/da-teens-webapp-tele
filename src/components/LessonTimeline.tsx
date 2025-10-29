// Вертикальная дорожная карта уроков модуля "Границы"
import { useState, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Circle, 
  Lock,
  Play,
  Clock,
  Lightning
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { Lesson } from '@/data/boundariesModule'

interface LessonTimelineProps {
  lessons: Lesson[]
  completedLessons: string[]
  currentLesson?: string
  onLessonClick: (lessonId: string) => void
}

const LessonTimeline = memo(function LessonTimeline({ 
  lessons, 
  completedLessons, 
  currentLesson,
  onLessonClick 
}: LessonTimelineProps) {
  
  // Упрощенная навигация - показываем все уроки сразу
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all')
  
  // 🛠️ Режим разработчика: открывает все уроки
  // Включить: localStorage.setItem('devMode', 'true')
  // Выключить: localStorage.removeItem('devMode')
  const isDevMode = import.meta.env.DEV || localStorage.getItem('devMode') === 'true'
  
  const getLessonStatus = (lesson: Lesson, index: number): string => {
    if (completedLessons.includes(lesson.id)) return 'completed'
    if (lesson.id === currentLesson) return 'current'
    
    // 🔓 Режим разработчика: все уроки доступны
    if (isDevMode) {
      return 'available'
    }
    
    // 🔒 Production режим: проверка prerequisites
    if (lesson.prerequisites && lesson.prerequisites.length > 0) {
      const allPrereqsMet = lesson.prerequisites.every(prereqId =>
        completedLessons.includes(prereqId)
      )
      if (!allPrereqsMet) return 'locked'
    }
    
    // Последовательное открытие уроков
    const prevLesson = lessons[index - 1]
    if (index === 0) return 'available' // Первый урок всегда доступен
    if (prevLesson && completedLessons.includes(prevLesson.id)) {
      return 'available'
    }
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={24} weight="fill" className="text-green-500" />
      case 'current':
        return <Play size={24} weight="fill" className="text-blue-500" />
      case 'available':
        return <Circle size={24} weight="bold" className="text-blue-400" />
      default:
        return <Lock size={24} weight="fill" className="text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 hover:bg-green-100'
      case 'current':
        return 'border-blue-300 bg-blue-50 hover:bg-blue-100 ring-2 ring-blue-200'
      case 'available':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100'
      default:
        return 'border-gray-200 bg-gray-50 opacity-60'
    }
  }

  const getDifficultyBadge = (difficulty: Lesson['difficulty']) => {
    const configs = {
      easy: { label: 'Легко', color: 'bg-green-100 text-green-700 border-green-300' },
      medium: { label: 'Средне', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      hard: { label: 'Сложно', color: 'bg-red-100 text-red-700 border-red-300' }
    }
    const config = configs[difficulty]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getEstimatedTime = (lesson: Lesson) => {
    // Считаем среднее время из доступных форматов
    const times = Object.values(lesson.formats)
      .filter(format => format)
      .map(format => format!.estimatedTime)
    
    if (times.length === 0) return 15
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  // Упрощенная схема - показываем все уроки сразу
  const filteredLessons = lessons

  return (
    <div className="space-y-4">
      {/* Упрощенный заголовок */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Все уроки модуля</h2>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5">
          {completedLessons.length} / {lessons.length}
        </Badge>
      </div>

      <div className="relative">
        {/* Vertical connecting line - синяя */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-100 to-gray-200" />

        <div className="space-y-1">
          {filteredLessons.map((lesson, filteredIndex) => {
            // Найти реальный индекс урока в полном списке
            const realIndex = lessons.findIndex(l => l.id === lesson.id)
            const status = getLessonStatus(lesson, realIndex)
            const isClickable = status === 'completed' || status === 'current' || status === 'available'
            const estimatedTime = getEstimatedTime(lesson)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: filteredIndex * 0.03 }}
                className="relative"
              >
                {/* Timeline dot - супер компактный */}
                <div className="absolute left-0 top-3 z-10">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getStatusIcon(status)}
                  </div>
                </div>

                {/* Lesson card - Telegram Wallet Style (супер компактный) */}
                <div className="ml-10">
                  <motion.div
                    whileHover={isClickable ? { scale: 1.01, y: -2 } : {}}
                    whileTap={isClickable ? { scale: 0.99 } : {}}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      mass: 0.8
                    }}
                    style={{ willChange: 'transform' }}
                  >
                    <Card 
                      className={`transition-all duration-200 ${
                        status === 'completed' 
                          ? 'bg-white border-green-200 shadow-sm'
                          : status === 'current'
                          ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-200'
                          : status === 'available'
                          ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                          : 'bg-gray-50 border-gray-200 shadow-sm opacity-60'
                      } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => {
                        if (isClickable) {
                          // Haptic feedback как в Telegram
                          if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                          }
                          onLessonClick(lesson.id)
                        }
                      }}
                    >
                    <CardContent className="p-2.5">
                      {/* Subtle gradient - синий */}
                      {status !== 'locked' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 pointer-events-none rounded-lg" />
                      )}
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-500 font-medium">
                              Урок {realIndex + 1}
                            </span>
                            {status === 'current' && (
                              <Badge className="bg-blue-600 text-white text-[9px] border-0 px-1.5 py-0.5">
                                Текущий
                              </Badge>
                            )}
                            {status === 'completed' && (
                              <Badge className="bg-green-600 text-white text-[9px] border-0 px-1.5 py-0.5">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock size={10} />
                            <span>{estimatedTime}м</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-0.5 line-clamp-1">
                          {lesson.title}
                        </h3>
                        <p className="text-[10px] text-gray-600 mb-2 line-clamp-1">
                          {lesson.subtitle}
                        </p>

                        {/* Meta - супер компактно */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {getDifficultyBadge(lesson.difficulty)}
                            <div className="flex items-center gap-0.5">
                              <Lightning size={10} className="text-orange-500" weight="fill" />
                              <span className="text-[9px] text-orange-600 font-medium">
                                50-100 XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>




                    </CardContent>
                  </Card>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Completion celebration - iOS 26 Liquid Glass */}
      {completedLessons.length === lessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-green-100/50 shadow-[0_8px_32px_rgba(34,197,94,0.2)]">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 pointer-events-none" />
            
            <CardContent className="relative p-8 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="ios-title2 text-green-900 mb-2">
                Поздравляем! Модуль завершён!
              </h3>
              <p className="ios-body text-green-700 mb-6 max-w-md mx-auto">
                Ты прошёл все 9 уроков модуля "Личные границы". Это большое достижение!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="h-[44px] bg-green-600 hover:bg-green-700 text-white ios-body-emphasized rounded-xl shadow-ios-soft">
                  Получить сертификат
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* 🛠️ Dev Mode Indicator */}
      {isDevMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge variant="outline" className="bg-yellow-100 border-yellow-400 text-yellow-800 px-3 py-2 shadow-lg">
            🛠️ Режим разработчика: Все уроки открыты
          </Badge>
        </div>
      )}
    </div>
  )
})

export default LessonTimeline
