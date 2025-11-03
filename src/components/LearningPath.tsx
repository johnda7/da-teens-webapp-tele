import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Lock, CheckCircle, Circle, Crown, Sparkles } from 'lucide-react'
import { boundariesModule } from '@/data/boundariesModule'

interface LessonNode {
  id: string
  title: string
  lessonNumber: number
  isCompleted: boolean
  isUnlocked: boolean
  isCurrent: boolean
  mastery: number
  xpReward: number
}

interface LearningPathProps {
  completedLessons: string[]
  currentLesson?: string
}

export default function LearningPath({ completedLessons = [], currentLesson }: LearningPathProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonNode | null>(null)

  // Build learning path from real lessons
  const lessonPath = useMemo<LessonNode[]>(() => {
    return boundariesModule.lessons.map((lesson, idx) => {
      const lessonId = lesson.id
      const isCompleted = completedLessons.includes(lessonId)
      // Unlock if it's the first lesson OR previous is completed
      const isUnlocked = idx === 0 || completedLessons.includes(boundariesModule.lessons[idx - 1].id)
      const isCurrent = lessonId === currentLesson
      
      // Mock mastery for now (can be calculated later from quiz scores)
      const mastery = isCompleted ? 90 : 0
      // XP reward increases with lesson number
      const xpReward = 50 + (idx * 10)
      
      return {
        id: lessonId,
        title: lesson.title,
        lessonNumber: idx + 1,
        isCompleted,
        isUnlocked,
        isCurrent,
        mastery,
        xpReward
      }
    })
  }, [completedLessons, currentLesson])

  const completedCount = lessonPath.filter(l => l.isCompleted).length
  const totalLessons = lessonPath.length
  const progress = Math.round((completedCount / totalLessons) * 100)
  const totalMastery = lessonPath.reduce((sum, lesson) => sum + lesson.mastery, 0)
  const averageMastery = Math.round(totalMastery / completedCount || 1)

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Прогресс</div>
            <div className="text-lg font-bold text-blue-700">{completedLessons}/{totalLessons}</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Мастерство</div>
            <div className="text-lg font-bold text-purple-700">{averageMastery}%</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Освоено</div>
            <div className="text-lg font-bold text-green-700">{progress}%</div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 font-medium">Весь модуль</span>
          <span className="text-xs font-bold text-purple-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Learning Path Visualization */}
      <Card className="glass rounded-xl p-4 border border-white/40 overflow-hidden">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-16 left-4 right-4 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 z-0" />
          
          {/* Lessons Grid */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-2 relative z-10">
            {lessonPath.map((lesson, idx) => {
              const isSelected = selectedLesson?.id === lesson.id
              let iconComponent
              let bgColor
              
              if (lesson.isCompleted) {
                iconComponent = <CheckCircle className="w-8 h-8 text-green-600" weight="fill" />
                bgColor = 'bg-green-100 border-green-300'
              } else if (lesson.isCurrent) {
                iconComponent = <Sparkles className="w-8 h-8 text-blue-600" weight="fill" />
                bgColor = 'bg-blue-100 border-blue-400 ring-2 ring-blue-300'
              } else if (lesson.isUnlocked) {
                iconComponent = <Circle className="w-8 h-8 text-gray-400" />
                bgColor = 'bg-gray-100 border-gray-300'
              } else {
                iconComponent = <Lock className="w-8 h-8 text-gray-400" />
                bgColor = 'bg-gray-50 border-gray-200 opacity-60'
              }

              return (
                <motion.div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(isSelected ? null : lesson)}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Lesson Node */}
                  <motion.div
                    className={`cursor-pointer transition-all relative ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105'
                    }`}
                    whileHover={lesson.isUnlocked ? { y: -5 } : {}}
                  >
                    <div className={`${bgColor} rounded-full p-3 border-2 mb-2 flex items-center justify-center`}>
                      {iconComponent}
                    </div>

                    {/* Lesson Number */}
                    <div className={`text-center text-xs font-bold mb-1 ${
                      lesson.isCurrent ? 'text-blue-700' : lesson.isCompleted ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {lesson.lessonNumber}
                    </div>

                    {/* Completion Checkmark */}
                    {lesson.isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" weight="fill" />
                      </div>
                    )}

                    {/* Current Indicator */}
                    {lesson.isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
                      >
                        Сейчас
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Title Tooltip on Hover */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 z-30"
                    >
                      <div className="bg-gray-900 text-white text-xs p-2 rounded-lg shadow-xl text-center">
                        {lesson.title}
                        <div className="mt-1 text-[10px] text-gray-300">
                          {lesson.isCompleted ? `Мастерство: ${lesson.mastery}%` : `XP: ${lesson.xpReward}`}
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Current Lesson Card */}
      {lessonPath.find(l => l.isCurrent) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-600" weight="fill" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 mb-1">Следующий урок</h4>
                <p className="text-xs text-blue-700 mb-2">
                  {lessonPath.find(l => l.isCurrent)?.title}
                </p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-[10px]">
                  {lessonPath.find(l => l.isCurrent)?.xpReward} XP награда
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Completion Message */}
      {completedLessons === totalLessons && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-bold text-yellow-800">Весь путь пройден!</h4>
          </div>
          <p className="text-xs text-yellow-700">
            Ты освоил все уроки модуля "Личные границы"! 🏆
          </p>
        </motion.div>
      )}
    </div>
  )
}
