// Вертикальная дорожная карта уроков модуля "Границы"
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
  
  const getLessonStatus = (lesson: Lesson, index: number) => {
    if (completedLessons.includes(lesson.id)) return 'completed'
    if (lesson.id === currentLesson) return 'current'
    
    // Проверяем prerequisites
    if (lesson.prerequisites && lesson.prerequisites.length > 0) {
      const allPrereqsMet = lesson.prerequisites.every(prereqId =>
        completedLessons.includes(prereqId)
      )
      if (!allPrereqsMet) return 'locked'
    }
    
    // Первый урок всегда доступен
    if (index === 0) return 'available'
    
    // Следующий урок доступен, если предыдущий пройден
    const prevLesson = lessons[index - 1]
    if (prevLesson && completedLessons.includes(prevLesson.id)) {
      return 'available'
    }
    
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={32} weight="fill" className="text-green-500" />
      case 'current':
        return <Play size={32} weight="fill" className="text-purple-500" />
      case 'available':
        return <Circle size={32} weight="bold" className="text-blue-500" />
      default:
        return <Lock size={32} weight="fill" className="text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 hover:bg-green-100'
      case 'current':
        return 'border-purple-300 bg-purple-50 hover:bg-purple-100 ring-2 ring-purple-200'
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Дорожная карта обучения</h2>
        <Badge variant="outline" className="text-sm">
          {completedLessons.length} / {lessons.length} пройдено
        </Badge>
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 to-gray-200" />

        <div className="space-y-6">
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson, index)
            const isClickable = status === 'completed' || status === 'current' || status === 'available'
            const estimatedTime = getEstimatedTime(lesson)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 z-10">
                  <div className="w-16 h-16 flex items-center justify-center">
                    {getStatusIcon(status)}
                  </div>
                </div>

                {/* Lesson card */}
                <div className="ml-24">
                  <Card 
                    className={`transition-all duration-200 ${getStatusColor(status)} ${
                      isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                    onClick={() => isClickable && onLessonClick(lesson.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Урок {index + 1}
                            </span>
                            {status === 'current' && (
                              <Badge className="bg-purple-500 text-white">
                                Текущий
                              </Badge>
                            )}
                            {status === 'completed' && (
                              <Badge className="bg-green-500 text-white">
                                ✓ Пройден
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {lesson.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={16} />
                          <span>~{estimatedTime} мин</span>
                        </div>
                        {getDifficultyBadge(lesson.difficulty)}
                        <div className="flex items-center gap-1">
                          <Lightning size={16} className="text-orange-500" weight="fill" />
                          <span className="text-sm font-medium">
                            50-100 XP
                          </span>
                        </div>
                      </div>

                      {/* Learning objectives preview */}
                      {isClickable && lesson.learningObjectives.length > 0 && (
                        <div className="bg-white/50 rounded-lg p-3 mb-4">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">
                            Ты научишься:
                          </div>
                          <ul className="space-y-1">
                            {lesson.learningObjectives.slice(0, 2).map((objective, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            ))}
                            {lesson.learningObjectives.length > 2 && (
                              <li className="text-xs text-muted-foreground">
                                +{lesson.learningObjectives.length - 2} ещё...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Emotional tags */}
                      {lesson.emotionalTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lesson.emotionalTags.slice(0, 3).map((tag, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs bg-white/50"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action button */}
                      {isClickable && (
                        <Button 
                          className="w-full gap-2"
                          variant={status === 'current' ? 'default' : 'outline'}
                        >
                          {status === 'completed' ? (
                            <>
                              <CheckCircle size={20} weight="fill" />
                              Пересмотреть урок
                            </>
                          ) : status === 'current' ? (
                            <>
                              <Play size={20} weight="fill" />
                              Продолжить урок
                            </>
                          ) : (
                            <>
                              <Play size={20} weight="fill" />
                              Начать урок
                            </>
                          )}
                        </Button>
                      )}

                      {/* Locked message */}
                      {status === 'locked' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock size={16} />
                          <span>
                            {lesson.prerequisites && lesson.prerequisites.length > 0
                              ? 'Сначала пройди предыдущие уроки'
                              : 'Этот урок пока заблокирован'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Completion celebration */}
      {completedLessons.length === lessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Поздравляем! Модуль завершён!
              </h3>
              <p className="text-green-700 mb-4">
                Ты прошёл все 9 уроков модуля "Личные границы". Это большое достижение!
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Получить сертификат
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
