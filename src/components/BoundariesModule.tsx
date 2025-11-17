import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserProgress } from '@/hooks/useUserProgress'
import BoundariesHero from './BoundariesHero'
import LessonTimeline from './LessonTimeline'
import CheckInModal from './CheckInModal'
import AdaptiveLessonViewer from './AdaptiveLessonViewer'
import WeekTabs from './WeekTabs'
import ContentCards from './ContentCards'
import AdaptiveRecommendation from './AdaptiveRecommendation'
import VisualLessonCard from './VisualLessonCard'
import InteractiveExercise from './InteractiveExercise'
import MultimodalContent from './MultimodalContent'
import LessonImages from './LessonImages'
import SleepMeditationHub from './SleepMeditationHub'
import RolePlayScenarios from './RolePlayScenarios'
import SkillsTree from './SkillsTree'
import WeeklyChallenges from './WeeklyChallenges'
import CastleGame from './CastleGame'
import LearningPath from './LearningPath'
import { useEmotionalState } from './EmotionalDesignSystem'
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
  const [currentWeek, setCurrentWeek] = useState(1)
  const [showAdaptiveRecommendations, setShowAdaptiveRecommendations] = useState(false)
  const [showVisualLessons, setShowVisualLessons] = useState(false)
  const [showInteractiveExercise, setShowInteractiveExercise] = useState(false)
  const [showMultimodalContent, setShowMultimodalContent] = useState(false)
  const [showLessonImages, setShowLessonImages] = useState(false)
  const [showSleepMeditation, setShowSleepMeditation] = useState(false)
  const [showRolePlayScenarios, setShowRolePlayScenarios] = useState(false)
  const [showSkillsTree, setShowSkillsTree] = useState(false)
  const [showWeeklyChallenges, setShowWeeklyChallenges] = useState(false)
  const [showCastleGame, setShowCastleGame] = useState(false)
  const [showLearningPath, setShowLearningPath] = useState(false)
  
  // Эмоциональное состояние
  const { emotionalState, updateEmotionalState } = useEmotionalState()
  
  // ✨ User Progress from CloudStorage
  const {
    progress: userProgress,
    isLoading: isLoadingProgress,
    completeLesson,
    isLessonCompleted,
    getQuizScore,
    addCheckIn
  } = useUserProgress()
  
  const [progress, setProgress] = useState<ProgressData>(() => {
    return {
      completedLessons: userProgress.completedLessons,
      currentLesson: boundariesModule.lessons[0].id,
      xpEarned: userProgress.totalXP,
      skillsUnlocked: 0,
      streak: userProgress.streak,
      totalLessons: boundariesModule.lessons.length,
      checkIns: userProgress.checkIns.map(ci => ({
        mood: ci.mood,
        anxiety: ci.anxiety,
        energy: 7,
        sleepHours: ci.sleepHours,
        note: ci.note,
        timestamp: new Date(ci.date)
      }))
    }
  })

  // Sync progress with CloudStorage
  useEffect(() => {
    if (!isLoadingProgress) {
      setProgress(prev => ({
        ...prev,
        completedLessons: userProgress.completedLessons,
        xpEarned: userProgress.totalXP,
        streak: userProgress.streak,
        checkIns: userProgress.checkIns.map(ci => ({
          mood: ci.mood,
          anxiety: ci.anxiety,
          energy: 7,
          sleepHours: ci.sleepHours,
          note: ci.note,
          timestamp: new Date(ci.date)
        }))
      }))
    }
  }, [userProgress, isLoadingProgress])

  // Auto-scroll to sleep section when opened
  useEffect(() => {
    if (showSleepMeditation) {
      setTimeout(() => {
        const element = document.querySelector('[data-sleep-section]')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [showSleepMeditation])

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

  const handleLessonComplete = async (lessonId: string, xpEarned: number) => {
    const lessonIndex = boundariesModule.lessons.findIndex(l => l.id === lessonId)
    
    // ✨ Save to CloudStorage via useUserProgress
    await completeLesson(
      1, // moduleId = 1 (Личные границы)
      lessonIndex,
      xpEarned, // quiz score
      10 // estimated time in minutes
    )
    
    // Update local UI state
    setProgress(prev => {
      const newCompleted = [...prev.completedLessons, lessonId]
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

  const handleCheckInSubmit = async (data: CheckInData) => {
    // ✨ Save to CloudStorage
    await addCheckIn({
      date: new Date().toISOString(),
      mood: data.mood,
      anxiety: data.anxiety,
      sleepHours: 8, // default
      note: data.notes
    })
    
    setProgress(prev => ({
      ...prev,
      checkIns: [...prev.checkIns, data]
    }))
    setShowCheckIn(false)
    
    // Обновляем эмоциональное состояние на основе CheckIn
    if (data.anxiety > 3) {
      updateEmotionalState('anxious')
    } else if (data.energy > 3) {
      updateEmotionalState('energetic')
    } else if (data.mood > 3) {
      updateEmotionalState('focused')
    } else {
      updateEmotionalState('calm')
    }
  }

  // Функции для новых компонентов
  const handleVisualLessonStart = (lessonId: string) => {
    setSelectedLesson(lessonId)
    setShowVisualLessons(true)
  }

  const handleInteractiveExerciseStart = (exerciseId: string) => {
    setShowInteractiveExercise(true)
  }

  const handleMultimodalContentStart = (contentId: string) => {
    setShowMultimodalContent(true)
  }

  const progressPercentage = Math.round(
    (progress.completedLessons.length / progress.totalLessons) * 100
  )

  const previousCheckIn = progress.checkIns[progress.checkIns.length - 1]

  // Get current emotional state for adaptive recommendations
  const getCurrentEmotionalState = () => {
    if (previousCheckIn) {
      return {
        mood: previousCheckIn.mood,
        anxiety: previousCheckIn.anxiety,
        energy: previousCheckIn.energy,
        stress: Math.round((previousCheckIn.anxiety + (6 - previousCheckIn.energy)) / 2)
      }
    }
    return {
      mood: 3,
      anxiety: 3,
      energy: 3,
      stress: 3
    }
  }

  // Calculate week progress
  const getWeekProgress = () => {
    const lessonsPerWeek = 3
    const week1Lessons = boundariesModule.lessons.slice(0, 3)
    const week2Lessons = boundariesModule.lessons.slice(3, 6)
    const week3Lessons = boundariesModule.lessons.slice(6, 9)

    const week1Completed = week1Lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length
    const week2Completed = week2Lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length
    const week3Completed = week3Lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length

    return {
      week1: Math.round((week1Completed / lessonsPerWeek) * 100),
      week2: Math.round((week2Completed / lessonsPerWeek) * 100),
      week3: Math.round((week3Completed / lessonsPerWeek) * 100)
    }
  }

  const weekProgress = getWeekProgress()

  // Get lessons for current week
  const getCurrentWeekLessons = () => {
    const startIndex = (currentWeek - 1) * 3
    return boundariesModule.lessons.slice(startIndex, startIndex + 3)
  }

  const currentWeekLessons = getCurrentWeekLessons()

  // Generate content cards for current week
  const getContentCards = () => {
    return currentWeekLessons.map(lesson => {
      const isCompleted = progress.completedLessons.includes(lesson.id)
      const isLocked = lesson.prerequisites && lesson.prerequisites.some(prereq => 
        !progress.completedLessons.includes(prereq)
      )

      return {
        type: 'video' as const,
        title: lesson.title,
        description: lesson.subtitle,
        duration: 15,
        completed: isCompleted,
        locked: isLocked,
        progress: isCompleted ? 100 : 0
      }
    })
  }

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
          onBack={() => setSelectedLesson(null)}
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
      {/* Header - компактнее */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b"
      >
        <div className="container mx-auto px-4 py-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-1.5 h-8 text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
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

      {/* Week Tabs Navigation - компактнее */}
      <div className="container mx-auto px-4 py-2">
        <WeekTabs
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
          progress={weekProgress}
        />
      </div>

      {/* Adaptive Recommendations - компактнее */}
      {progress.checkIns.length > 0 && (
        <div className="container mx-auto px-4 py-2">
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAdaptiveRecommendations(!showAdaptiveRecommendations)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-transform duration-200"
            >
              <span>🧠</span>
              <span>AI Рекомендации</span>
              <span className={`transform transition-transform duration-200 ${
                showAdaptiveRecommendations ? 'rotate-180' : ''
              }`}>
                ↓
              </span>
            </button>
          </div>
          
          {showAdaptiveRecommendations && (
            <AdaptiveRecommendation
              emotionalState={getCurrentEmotionalState()}
              completedLessons={progress.completedLessons}
              onRecommendationSelect={(rec) => {
                if (rec.type === 'lesson') {
                  // Find and start the recommended lesson
                  const lesson = boundariesModule.lessons.find(l => l.title.includes(rec.title.split(':')[1]?.trim()))
                  if (lesson) {
                    handleLessonClick(lesson.id)
                  }
                } else if (rec.type === 'checkin') {
                  setShowCheckIn(true)
                }
                setShowAdaptiveRecommendations(false)
              }}
            />
          )}
        </div>
      )}

      {/* Content Cards for Current Week - компактнее */}
      <div className="container mx-auto px-4 py-2">
        <ContentCards
          cards={getContentCards()}
          onCardStart={(index) => {
            const lesson = currentWeekLessons[index]
            if (lesson) {
              handleLessonClick(lesson.id)
            }
          }}
        />
      </div>

      {/* Новые компоненты - демо версия - компактнее */}
      <div className="container mx-auto px-4 py-2">
        <div className="mb-2">
          <h2 className="text-sm font-bold text-gray-900 mb-1">🎨 Визуальные уроки</h2>
          <p className="text-[10px] text-gray-600">Демо версия компонентов</p>
        </div>

        {/* Кнопки для демо - Telegram Wallet Style (супер компактные) */}
        <div className="grid grid-cols-4 md:grid-cols-9 gap-1.5 mb-4">
          <motion.button
            onClick={() => setShowCastleGame(!showCastleGame)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🏰</div>
            <span className="text-[10px] font-medium leading-tight text-center">Замок</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowLearningPath(!showLearningPath)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🛤️</div>
            <span className="text-[10px] font-medium leading-tight text-center">Путь</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowVisualLessons(!showVisualLessons)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🎨</div>
            <span className="text-[10px] font-medium leading-tight text-center">Визуальные</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowSkillsTree(!showSkillsTree)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-teal-500 to-green-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🌳</div>
            <span className="text-[10px] font-medium leading-tight text-center">Навыки</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowWeeklyChallenges(!showWeeklyChallenges)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🎪</div>
            <span className="text-[10px] font-medium leading-tight text-center">Челлендж</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowRolePlayScenarios(!showRolePlayScenarios)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🎭</div>
            <span className="text-[10px] font-medium leading-tight text-center">Ролевые</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowInteractiveExercise(!showInteractiveExercise)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🎮</div>
            <span className="text-[10px] font-medium leading-tight text-center">Упражнения</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowMultimodalContent(!showMultimodalContent)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">🎵</div>
            <span className="text-[10px] font-medium leading-tight text-center">Мультик</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowSleepMeditation(!showSleepMeditation)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-sm">💤</div>
            <span className="text-[10px] font-medium leading-tight text-center">Сон</span>
          </motion.button>
        </div>

        {/* Демо компонентов */}
        {showLearningPath && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-900 mb-0.5">🛤️ Learning Path</h3>
              <p className="text-[10px] text-gray-600">Твой путь обучения как в Duolingo</p>
            </div>
            <LearningPath completedLessons={progress.completedLessons} currentLesson={progress.currentLesson} />
          </div>
        )}
        
        {showCastleGame && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-900 mb-0.5">🏰 Castle Game</h3>
              <p className="text-[10px] text-gray-600">Защити свой замок границ</p>
            </div>
            <CastleGame completedLessons={progress.completedLessons} totalXP={progress.xpEarned} />
          </div>
        )}
        
        {showWeeklyChallenges && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-900 mb-0.5">🎪 Weekly Challenges</h3>
              <p className="text-[10px] text-gray-600">7-дневные микро-миссии</p>
            </div>
            <WeeklyChallenges />
          </div>
        )}
        
        {showSkillsTree && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-900 mb-0.5">🌳 Skills Tree</h3>
              <p className="text-[10px] text-gray-600">Дерево навыков RPG-стиль</p>
            </div>
            <SkillsTree completedLessons={progress.completedLessons} totalXP={progress.xpEarned} />
          </div>
        )}
        
        {showRolePlayScenarios && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-xs font-bold text-gray-900 mb-0.5">🎭 Role-Play Scenarios</h3>
              <p className="text-[10px] text-gray-600">Интерактивные диалоги с AI персонажами</p>
            </div>
            <RolePlayScenarios />
          </div>
        )}
        
        {showVisualLessons && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Демо визуального урока</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VisualLessonCard
                id="demo-1"
                title="Что такое личные границы?"
                subtitle="Первый шаг к пониманию себя"
                description="Узнай, что такое личные границы и почему они важны для подростков"
                type="video"
                duration="5-7 мин"
                progress={75}
                isLocked={false}
                isCompleted={false}
                emotionalState={emotionalState}
                visualElements={{
                  heroImage: '/images/boundaries/hero-boundaries.jpg',
                  emotionalVariants: {
                    anxious: { colors: { primary: '#FF6B6B', secondary: '#FFE66D' }, image: '/images/emotions/anxious-hero.jpg', animation: 'gentle' },
                    energetic: { colors: { primary: '#4ECDC4', secondary: '#45B7D1' }, image: '/images/emotions/energetic-hero.jpg', animation: 'dynamic' },
                    focused: { colors: { primary: '#96CEB4', secondary: '#FFEAA7' }, image: '/images/emotions/focused-hero.jpg', animation: 'smooth' }
                  },
                  culturalContext: {
                    russian: 'Российские примеры границ',
                    international: 'Международные стандарты'
                  }
                }}
                interactiveElements={{
                  clickableZones: [
                    { id: 'zone-1', title: 'Физические границы', description: 'Личное пространство', position: { x: 30, y: 40 } },
                    { id: 'zone-2', title: 'Эмоциональные границы', description: 'Защита чувств', position: { x: 70, y: 60 } }
                  ],
                  scenarios: [
                    { id: 'scenario-1', title: 'Друзья и границы', image: '/images/scenarios/friends.jpg', description: 'Как сказать нет другу' }
                  ]
                }}
                audioElements={{
                  narration: 'Добро пожаловать в урок о личных границах',
                  emotionalTone: emotionalState === 'anxious' ? 'calm' : emotionalState === 'energetic' ? 'energetic' : 'focused',
                  russianAccent: true,
                  duration: 5
                }}
                culturalContext="russian"
                onStart={handleVisualLessonStart}
                onPreview={handleVisualLessonStart}
              />
            </div>
          </div>
        )}

        {showInteractiveExercise && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Демо интерактивного упражнения</h3>
            <InteractiveExercise
              id="demo-exercise"
              title="Ролевая игра: Как сказать 'нет'"
              description="Практикуйся говорить 'нет' в разных ситуациях"
              type="roleplay"
              steps={[]}
              scenarios={[
                {
                  id: 'scenario-1',
                  title: 'Подруга просит списать',
                  description: 'Твоя подруга просит списать домашнее задание',
                  image: '/images/scenarios/homework.jpg',
                  situation: 'Подруга: "Пожалуйста, дай списать математику, я не успела!"',
                  options: [
                    { id: 'opt-1', text: 'Конечно, держи!', isCorrect: false, feedback: 'Это нарушает твои границы', emotionalImpact: 'negative' },
                    { id: 'opt-2', text: 'Извини, но я не могу', isCorrect: true, feedback: 'Отлично! Ты защищаешь свои границы', emotionalImpact: 'positive' },
                    { id: 'opt-3', text: 'Может быть в следующий раз', isCorrect: false, feedback: 'Неопределенность может создать проблемы', emotionalImpact: 'neutral' }
                  ],
                  culturalContext: {
                    russian: 'В России дружба очень важна, но границы тоже важны',
                    international: 'Friendship is important, but boundaries matter too'
                  }
                }
              ]}
              emotionalState={emotionalState}
              culture="russian"
              onComplete={(id, score) => console.log('Exercise completed:', id, score)}
              onStepComplete={(stepId, isCorrect) => console.log('Step completed:', stepId, isCorrect)}
            />
          </div>
        )}

        {showMultimodalContent && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">MultimodalContent Demo</h3>
            <MultimodalContent
              id="demo-multimodal"
              title="Аудио урок с визуалами"
              description="Комбинированный контент с аудио и интерактивными элементами"
              audioContent={{
                id: 'audio-1',
                title: 'Введение в личные границы',
                description: 'Слушай и изучай одновременно',
                audioUrl: '/audio/boundaries-intro.mp3',
                duration: 300,
                emotionalTone: emotionalState === 'anxious' ? 'calm' : 'focused',
                russianAccent: true,
                transcript: 'Добро пожаловать в урок о личных границах. Личные границы - это...',
                timestamps: [
                  { time: 0, text: 'Введение' },
                  { time: 60, text: 'Что такое границы' },
                  { time: 120, text: 'Примеры' }
                ]
              }}
              visualContent={{
                id: 'visual-1',
                title: 'Схема личных границ',
                description: 'Интерактивная схема для изучения',
                imageUrl: '/images/boundaries/scheme.jpg',
                type: 'diagram',
                emotionalVariant: emotionalState,
                culturalContext: 'russian',
                interactiveElements: [
                  { id: 'elem-1', type: 'click', position: { x: 25, y: 30 }, content: 'Физические границы' },
                  { id: 'elem-2', type: 'click', position: { x: 75, y: 70 }, content: 'Эмоциональные границы' }
                ]
              }}
              mindMap={[
                { id: 'node-1', title: 'Границы', description: 'Основное понятие', position: { x: 50, y: 50 }, connections: ['node-2'], color: '#4ECDC4', size: 'large' },
                { id: 'node-2', title: 'Типы', description: 'Виды границ', position: { x: 30, y: 70 }, connections: ['node-1'], color: '#96CEB4', size: 'medium' }
              ]}
              emotionalState={emotionalState}
              culture="russian"
              onComplete={(id, progress) => console.log('Content completed:', id, progress)}
              onProgress={(progress) => console.log('Progress:', progress)}
            />
          </div>
        )}
      </div>

      {/* Lesson Timeline (Alternative View) - компактнее */}
      <div className="container mx-auto px-4 py-2">
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Все уроки модуля
          </h3>
          <p className="text-[10px] text-gray-600">
            Прогресс по всем 9 урокам
          </p>
        </div>
        <LessonTimeline
          lessons={boundariesModule.lessons}
          completedLessons={progress.completedLessons}
          currentLesson={progress.currentLesson}
          onLessonClick={handleLessonClick}
        />
      </div>

        {/* Демо LessonImages */}
        {showLessonImages && (
          <div className="mb-2">
            <h3 className="text-xl font-semibold mb-4">🖼️ Картинки к урокам (Google Learn Your Way стиль)</h3>
            <LessonImages
              lessonId="boundaries-lesson-1"
              images={[
                {
                  id: 'hero-boundaries',
                  src: '/images/boundaries/hero-boundaries.jpg',
                  alt: 'Главное изображение о личных границах',
                  type: 'hero',
                  caption: 'Визуальное представление концепции личных границ'
                },
                {
                  id: 'concept-fence',
                  src: '/images/boundaries/concept-fence.jpg',
                  alt: 'Забор как метафора границ',
                  type: 'concept',
                  caption: 'Метафора невидимого забора вокруг личности'
                },
                {
                  id: 'example-saying-no',
                  src: '/images/boundaries/example-saying-no.jpg',
                  alt: 'Пример как сказать нет',
                  type: 'example',
                  caption: 'Практический пример установки границ'
                },
                {
                  id: 'exercise-boundary-map',
                  src: '/images/boundaries/exercise-boundary-map.jpg',
                  alt: 'Упражнение карта границ',
                  type: 'exercise',
                  caption: 'Интерактивное упражнение для определения границ'
                }
              ]}
              onImageClick={(image) => console.log('Image clicked:', image)}
            />
          </div>
        )}

        {/* Демо SleepMeditationHub */}
        {showSleepMeditation && (
          <div className="mb-2" data-sleep-section>
            <SleepMeditationHub
              currentMood={emotionalState.mood}
              onContentSelect={(content) => console.log('Sleep content selected:', content)}
            />
          </div>
        )}

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
