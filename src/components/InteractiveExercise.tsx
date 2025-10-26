import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Lightbulb } from '@phosphor-icons/react'

// Типы для интерактивных упражнений
interface InteractiveStep {
  id: string
  title: string
  description: string
  type: 'click' | 'drag' | 'select' | 'input' | 'speak'
  content: any
  feedback: string
  isCorrect?: boolean
}

interface Scenario {
  id: string
  title: string
  description: string
  image: string
  situation: string
  options: {
    id: string
    text: string
    isCorrect: boolean
    feedback: string
    emotionalImpact: 'positive' | 'negative' | 'neutral'
  }[]
  culturalContext: {
    russian: string
    international: string
  }
}

interface InteractiveExerciseProps {
  id: string
  title: string
  description: string
  type: 'roleplay' | 'scenario' | 'simulation' | 'decision-tree'
  steps: InteractiveStep[]
  scenarios: Scenario[]
  emotionalState: 'anxious' | 'energetic' | 'focused' | 'calm' | 'excited'
  culture: 'russian' | 'international'
  onComplete: (exerciseId: string, score: number) => void
  onStepComplete: (stepId: string, isCorrect: boolean) => void
}

export default function InteractiveExercise({
  id,
  title,
  description,
  type,
  steps,
  scenarios,
  emotionalState,
  culture,
  onComplete,
  onStepComplete
}: InteractiveExerciseProps) {
  
  const [currentStep, setCurrentStep] = useState(0)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({})
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Получаем эмоциональные стили
  const getEmotionalStyles = () => {
    const styles = {
      anxious: { colors: ['#FF6B6B', '#FFE66D'], animation: 'gentle' },
      energetic: { colors: ['#4ECDC4', '#45B7D1'], animation: 'dynamic' },
      focused: { colors: ['#96CEB4', '#FFEAA7'], animation: 'smooth' },
      calm: { colors: ['#A8E6CF', '#FFD93D'], animation: 'soft' },
      excited: { colors: ['#FF8A80', '#FFB74D'], animation: 'bouncy' }
    }
    return styles[emotionalState]
  }

  const emotionalStyles = getEmotionalStyles()

  // Обработка выбора опции
  const handleOptionSelect = (scenarioId: string, optionId: string) => {
    const scenario = scenarios[currentScenario]
    const option = scenario.options.find(opt => opt.id === optionId)
    
    if (option) {
      setSelectedOptions(prev => ({ ...prev, [scenarioId]: optionId }))
      
      if (option.isCorrect) {
        setScore(prev => prev + 1)
        onStepComplete(scenarioId, true)
      } else {
        onStepComplete(scenarioId, false)
      }
      
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  // Переход к следующему сценарию
  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
    } else {
      setIsCompleted(true)
      onComplete(id, score)
    }
  }

  // Перезапуск упражнения
  const restartExercise = () => {
    setCurrentStep(0)
    setCurrentScenario(0)
    setSelectedOptions({})
    setScore(0)
    setIsCompleted(false)
    setShowFeedback(false)
  }

  // Получение анимации на основе эмоционального состояния
  const getAnimationVariants = () => {
    const baseVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }

    switch (emotionalStyles.animation) {
      case 'gentle':
        return { ...baseVariants, transition: { duration: 0.5, ease: "easeOut" } }
      case 'dynamic':
        return { ...baseVariants, transition: { duration: 0.3, ease: "easeInOut" } }
      case 'smooth':
        return { ...baseVariants, transition: { duration: 0.4, ease: "easeInOut" } }
      case 'soft':
        return { ...baseVariants, transition: { duration: 0.6, ease: "easeOut" } }
      case 'bouncy':
        return { ...baseVariants, transition: { duration: 0.4, ease: "easeOut", bounce: 0.3 } }
      default:
        return baseVariants
    }
  }

  const animationVariants = getAnimationVariants()

  if (isCompleted) {
    return (
      <motion.div
        className="bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(135deg, ${emotionalStyles.colors.primary}20, ${emotionalStyles.colors.secondary}20)`
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Упражнение завершено!</h3>
        <p className="text-gray-600 mb-4">Отличная работа! Ты справился с {score} из {scenarios.length} сценариев.</p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{score}</div>
            <div className="text-sm text-gray-600">Правильных ответов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{Math.round((score / scenarios.length) * 100)}%</div>
            <div className="text-sm text-gray-600">Точность</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={restartExercise}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:opacity-90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Повторить
          </motion.button>
        </div>
      </motion.div>
    )
  }

  const currentScenarioData = scenarios[currentScenario]

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-lg overflow-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animationVariants}
      style={{
        background: `linear-gradient(135deg, ${emotionalStyles.colors.primary}20, ${emotionalStyles.colors.secondary}20)`
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {currentScenario + 1} из {scenarios.length}
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              {score} очков
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scenario Image */}
            <div className="mb-6">
              <img
                src={currentScenarioData.image}
                alt={currentScenarioData.title}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            {/* Scenario Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{currentScenarioData.title}</h4>
              <p className="text-gray-700 mb-3">{currentScenarioData.description}</p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-800 font-medium">{currentScenarioData.situation}</p>
              </div>
            </div>

            {/* Cultural Context */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Культурный контекст</span>
              </div>
              <p className="text-sm text-gray-600">
                {culture === 'russian' ? currentScenarioData.culturalContext.russian : currentScenarioData.culturalContext.international}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentScenarioData.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleOptionSelect(currentScenarioData.id, option.id)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedOptions[currentScenarioData.id] === option.id
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedOptions[currentScenarioData.id] !== undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
                    {selectedOptions[currentScenarioData.id] === option.id && (
                      option.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && selectedOptions[currentScenarioData.id] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200"
                >
                  <p className="text-blue-800">
                    {currentScenarioData.options.find(opt => opt.id === selectedOptions[currentScenarioData.id])?.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              <motion.button
                onClick={restartExercise}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Начать заново
              </motion.button>

              {selectedOptions[currentScenarioData.id] && (
                <motion.button
                  onClick={nextScenario}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:opacity-90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentScenario < scenarios.length - 1 ? 'Следующий' : 'Завершить'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
