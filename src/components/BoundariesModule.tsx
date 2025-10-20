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

export default function BoundariesModule({ onBack }: Props) {
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressData>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('boundaries-progress')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      completedLessons: [],
      currentLesson: boundariesModule.lessons[0].id,
      xpEarned: 0,
      skillsUnlocked: 0,
      streak: 0,
      totalLessons: boundariesModule.lessons.length,
      checkIns: []
    }
  })

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('boundaries-progress', JSON.stringify(progress))
  }, [progress])

  const handleStartLearning = () => {
    // Find first incomplete lesson
    const firstIncomplete = boundariesModule.lessons.find(
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
      const lessonIndex = boundariesModule.lessons.findIndex(l => l.id === lessonId)
      const nextLesson = boundariesModule.lessons[lessonIndex + 1]
      
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

  const progressPercentage = Math.round(
    (progress.completedLessons.length / progress.totalLessons) * 100
  )

  const previousCheckIn = progress.checkIns[progress.checkIns.length - 1]

  // Show lesson viewer if a lesson is selected
  if (selectedLesson) {
    const lesson = boundariesModule.lessons.find(l => l.id === selectedLesson)
    if (!lesson) return null

    return (
      <AdaptiveLessonViewer
        recommendation={{
          lesson,
          reason: 'User selected this lesson',
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
            Back to Modules
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
          lessons={boundariesModule.lessons}
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
