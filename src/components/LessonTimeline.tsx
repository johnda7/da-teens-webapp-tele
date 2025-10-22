// Вертикальная дорожная карта уроков модуля "Границы"
import { useState } from 'react'
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

export default function LessonTimeline({ 
  lessons, 
  completedLessons, 
  currentLesson,
  onLessonClick 
}: LessonTimelineProps) {
  
  // GOOGLE LEARN YOUR WAY: Пользователь выбирает свой путь (week-based chunking)
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

  // GOOGLE LEARN YOUR WAY + ЕКАТЕРИНА КАРПЕНКО: Week-based cohort learning
  // Неделя 1-3: каждую субботу главный эфир + 3 эфира (пн/ср/пт)
  const getWeekFromLesson = (lessonIndex: number): number => {
    if (lessonIndex < 3) return 1      // Week 1: Основы границ (уроки 1-3)
    if (lessonIndex < 6) return 2      // Week 2: Защита границ (уроки 4-6)
    return 3                            // Week 3: Мастерство (уроки 7-9)
  }

  const filteredLessons = selectedWeek === 'all' 
    ? lessons 
    : lessons.filter((_, index) => getWeekFromLesson(index) === selectedWeek)

  const weeks = [
    { 
      id: 'all' as const, 
      label: 'Все недели', 
      range: '9 уроков',
      description: 'Полный обзор программы'
    },
    { 
      id: 1, 
      label: 'Неделя 1', 
      range: 'Уроки 1-3',
      description: 'Основы границ + эфир с Екатериной' 
    },
    { 
      id: 2, 
      label: 'Неделя 2', 
      range: 'Уроки 4-6',
      description: 'Защита границ + практика'
    },
    { 
      id: 3, 
      label: 'Неделя 3', 
      range: 'Уроки 7-9',
      description: 'Мастерство + финал'
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header - iOS 26 Typography - Компактный */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Дорожная карта обучения</h2>
        <Badge variant="outline" className="text-xs bg-white/60 backdrop-blur-[20px] border-blue-100/50 text-blue-700 px-2 py-0.5">
          {completedLessons.length} / {lessons.length}
        </Badge>
      </div>

      {/* Week navigation - Компактный синий стиль */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-4"
      >
        <Card className="bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft p-1.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {weeks.map((week) => {
              const isActive = selectedWeek === week.id
              return (
                <motion.button
                  key={week.id}
                  onClick={() => setSelectedWeek(week.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`
                    relative px-3 py-2 rounded-lg transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-[0_4px_16px_rgba(0,122,255,0.3)]' 
                      : 'bg-white/40 text-gray-700 hover:bg-white/60'
                    }
                  `}
                >
                  <div className="text-xs font-semibold mb-0.5">{week.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                    {week.range}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeWeek"
                      className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </Card>
      </motion.div>

      <div className="relative">
        {/* Vertical connecting line - синяя */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-100 to-gray-200" />

        <div className="space-y-3">
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
                transition={{ duration: 0.3, delay: filteredIndex * 0.05 }}
                className="relative"
              >
                {/* Timeline dot - компактнее */}
                <div className="absolute left-0 top-4 z-10">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getStatusIcon(status)}
                  </div>
                </div>

                {/* Lesson card - Компактный синий стиль */}
                <div className="ml-16">
                  <motion.div
                    whileHover={isClickable ? { scale: 1.02, y: -4 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card 
                      className={`transition-all duration-200 ${
                        status === 'completed' 
                          ? 'bg-white/70 backdrop-blur-[40px] border-green-100/50 shadow-ios-soft'
                          : status === 'current'
                          ? 'bg-white/70 backdrop-blur-[40px] border-blue-200 shadow-[0_8px_32px_rgba(0,122,255,0.25)] ring-2 ring-blue-100'
                          : status === 'available'
                          ? 'bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft'
                          : 'bg-white/40 backdrop-blur-[20px] border-gray-200 shadow-ios-soft opacity-70'
                      } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => isClickable && onLessonClick(lesson.id)}
                    >
                    <CardContent className="p-4">
                      {/* Subtle gradient - синий */}
                      {status !== 'locked' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 pointer-events-none rounded-lg" />
                      )}
                      
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-gray-500 font-medium">
                            Урок {realIndex + 1}
                          </span>
                          {status === 'current' && (
                            <Badge className="bg-blue-600 text-white text-[10px] border-0 px-2 py-0.5">
                              Текущий
                            </Badge>
                          )}
                          {status === 'completed' && (
                            <Badge className="bg-green-600 text-white text-[10px] border-0 px-2 py-0.5">
                              ✓ Пройден
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {lesson.subtitle}
                        </p>

                        {/* Meta - компактно */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock size={12} />
                            <span>~{estimatedTime} мин</span>
                          </div>
                          {getDifficultyBadge(lesson.difficulty)}
                          <div className="flex items-center gap-1">
                            <Lightning size={12} className="text-orange-500" weight="fill" />
                            <span className="text-xs text-orange-600 font-medium">
                              50-100 XP
                            </span>
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
            🛠️ Dev Mode: Все уроки открыты
          </Badge>
        </div>
      )}
    </div>
  )
}
