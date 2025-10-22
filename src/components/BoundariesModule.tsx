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
      <div className="min-h-screen relative bg-gray-50">
        {/* Liquid Glass Background - DA Teens Style */}
        <div className="fixed inset-0 -z-10">
          {/* Animated Orbs - ОЧЕНЬ прозрачные синие */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
              top: '-10%',
              left: '-10%'
            }}
            animate={{
              x: ['-10%', '10%', '-10%'],
              y: ['-10%', '15%', '-10%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(90, 200, 250, 0.06) 0%, transparent 70%)',
              filter: 'blur(80px)',
              right: '0',
              top: '25%'
            }}
            animate={{
              x: ['10%', '-15%', '10%'],
              y: ['5%', '-10%', '5%'],
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
              filter: 'blur(70px)',
              bottom: '0',
              left: '33%'
            }}
            animate={{
              x: ['-5%', '20%', '-5%'],
              y: ['10%', '-5%', '10%'],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <AdaptiveLessonViewer
          recommendation={{
            lesson,
            reason: 'Ты выбрал этот урок',
            emotionalFit: 'good',
            confidence: 0.8,
            adaptations: []
          }}
          onComplete={(xp) => handleLessonComplete(selectedLesson, xp)}
          onSkip={() => setSelectedLesson(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Liquid Glass Background - DA Teens фирменный стиль */}
      <div className="fixed inset-0 -z-10">
        {/* Animated gradient orbs - синие, прозрачные */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '0',
            left: '0'
          }}
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
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(90, 200, 250, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            right: '0',
            top: '33%'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
            filter: 'blur(70px)',
            bottom: '0',
            left: '33%'
          }}
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
      </div>

      {/* Content - Liquid Glass поверх */}
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
