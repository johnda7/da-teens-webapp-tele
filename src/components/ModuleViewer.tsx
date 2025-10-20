/**
 * Universal Module Viewer
 * Работает для ВСЕХ модулей единообразно
 * - Hero секция
 * - Timeline уроков
 * - Check-in интеграция
 * - Adaptive lesson viewer
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BoundariesHero from './BoundariesHero'
import LessonTimeline from './LessonTimeline'
import CheckInModal from './CheckInModal'
import AdaptiveLessonViewer from './AdaptiveLessonViewer'
import { boundariesModule } from '@/data/boundariesModule'
import type { CheckInData } from './CheckInModal'

type Props = {
  moduleId: number
  onBack: () => void
}

type ProgressData = {
  completedLessons: string[]
  currentLesson: string
  xpEarned: number
  skillsUnlocked: number
  streak: number
  totalLessons: number
  checkIns: CheckInData[]
}

export default function ModuleViewer({ moduleId, onBack }: Props) {
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  
  // Пока поддерживаем только модуль #1 (Личные границы)
  // TODO: Добавить поддержку остальных модулей
  const moduleData = moduleId === 1 ? boundariesModule : null
  
  const [progress, setProgress] = useState<ProgressData>(() => {
    // Load from localStorage with module-specific key
    const saved = localStorage.getItem(`module-${moduleId}-progress`)
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      completedLessons: [],
      currentLesson: moduleData?.lessons[0]?.id || '',
      xpEarned: 0,
      skillsUnlocked: 0,
      streak: 0,
      totalLessons: moduleData?.lessons.length || 0,
      checkIns: []
    }
  })

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`module-${moduleId}-progress`, JSON.stringify(progress))
  }, [moduleId, progress])

  // Если модуль еще не реализован
  if (!moduleData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Модуль #{moduleId}</h2>
          <p className="text-muted-foreground mb-6">Этот модуль скоро будет доступен</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к модулям
          </Button>
        </div>
      </div>
    )
  }

  const handleStartLearning = () => {
    // Find first incomplete lesson
    const firstIncomplete = moduleData.lessons.find(
      lesson => !progress.completedLessons.includes(lesson.id)
    )
    if (firstIncomplete) {
      setSelectedLesson(firstIncomplete.id)
    }
  }

  const handleLessonClick = (lessonId: string) => {
    setSelectedLesson(lessonId)
  }

  const handleLessonComplete = (lessonId: string, xpEarned: number) => {
    setProgress(prev => {
      const newCompleted = [...prev.completedLessons, lessonId]
      const lessonIndex = moduleData.lessons.findIndex(l => l.id === lessonId)
      const nextLesson = moduleData.lessons[lessonIndex + 1]
      
      // Count skills from completed lessons (estimate 3 skills per lesson)
      const skillsUnlocked = newCompleted.length * 3

      return {
        ...prev,
        completedLessons: newCompleted,
        currentLesson: nextLesson?.id || lessonId,
        xpEarned: prev.xpEarned + xpEarned,
        skillsUnlocked,
        streak: prev.streak + 1
      }
    })
    
    // Go back to timeline
    setSelectedLesson(null)
  }

  const handleCheckInSubmit = (data: CheckInData) => {
    setProgress(prev => ({
      ...prev,
      checkIns: [...prev.checkIns, data]
    }))
  }

  const previousCheckIn = progress.checkIns[progress.checkIns.length - 1]

  // Show lesson viewer if a lesson is selected
  if (selectedLesson) {
    const lesson = moduleData.lessons.find(l => l.id === selectedLesson)
    if (!lesson) return null

    return (
      <AdaptiveLessonViewer
        recommendation={{
          lesson,
          reason: 'Выбранный урок',
          emotionalFit: 'good',
          confidence: 0.8,
          adaptations: []
        }}
        onComplete={(xp) => handleLessonComplete(selectedLesson, xp)}
        onSkip={() => setSelectedLesson(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к модулям
          </Button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <BoundariesHero
        onStartLearning={handleStartLearning}
        progress={{
          lessonsCompleted: progress.completedLessons.length,
          totalLessons: progress.totalLessons,
          xpEarned: progress.xpEarned,
          skillsUnlocked: progress.skillsUnlocked,
          streak: progress.streak
        }}
        hasCheckIn={progress.checkIns.length === 0}
        onCheckIn={() => setShowCheckIn(true)}
      />

      {/* Lesson Timeline */}
      <div className="container mx-auto px-4 py-12">
        <LessonTimeline
          lessons={moduleData.lessons}
          completedLessons={progress.completedLessons}
          currentLesson={progress.currentLesson}
          onLessonClick={handleLessonClick}
        />
      </div>

      {/* CheckIn Modal */}
      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onSubmit={handleCheckInSubmit}
        previousCheckIn={previousCheckIn}
      />
    </div>
  )
}
