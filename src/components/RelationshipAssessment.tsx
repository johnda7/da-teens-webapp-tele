import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { CheckCircle, Heart, Users, Shield, ArrowRight } from '@phosphor-icons/react'

interface AssessmentQuestion {
  id: string
  question: string
  icon: 'support' | 'authenticity' | 'boundaries' | 'reciprocity'
}

interface AssessmentResult {
  level: 'excellent' | 'good' | 'needs-work' | 'danger'
  message: string
  color: string
  recommendations: string[]
}

interface RelationshipAssessmentProps {
  questions: AssessmentQuestion[]
  onComplete?: (data: { answers: Record<string, number>, result: AssessmentResult }) => void
}

export default function RelationshipAssessment({ questions, onComplete }: RelationshipAssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'support':
        return <Heart size={18} className="text-pink-600" weight="duotone" />
      case 'authenticity':
        return <Users size={18} className="text-blue-600" weight="duotone" />
      case 'boundaries':
        return <Shield size={18} className="text-purple-600" weight="duotone" />
      case 'reciprocity':
        return <CheckCircle size={18} className="text-green-600" weight="duotone" />
      default:
        return <Heart size={18} className="text-gray-600" weight="duotone" />
    }
  }

  const calculateResult = (): AssessmentResult => {
    const values = Object.values(answers)
    const average = values.reduce((sum, val) => sum + val, 0) / values.length

    if (average >= 8) {
      return {
        level: 'excellent',
        message: 'Отличные здоровые отношения! 💚',
        color: 'from-green-500 to-emerald-600',
        recommendations: [
          'Продолжай поддерживать эти отношения',
          'Празднуй, что у тебя такие качественные связи',
          'Стань примером для других'
        ]
      }
    } else if (average >= 6) {
      return {
        level: 'good',
        message: 'Хорошие отношения, есть место для роста 🌟',
        color: 'from-blue-500 to-indigo-600',
        recommendations: [
          'Поговори с человеком о том, что можно улучшить',
          'Установи четкие границы там, где нужно',
          'Продолжай развивать взаимность'
        ]
      }
    } else if (average >= 4) {
      return {
        level: 'needs-work',
        message: 'Отношения нуждаются во внимании ⚠️',
        color: 'from-yellow-500 to-orange-600',
        recommendations: [
          'Проведи открытый разговор о границах',
          'Определи, что конкретно нужно изменить',
          'Рассмотри возможность дистанцироваться, если не помогает'
        ]
      }
    } else {
      return {
        level: 'danger',
        message: 'Красные флаги: эти отношения токсичны 🚨',
        color: 'from-red-500 to-red-700',
        recommendations: [
          'Немедленно обратись за поддержкой к взрослым',
          'Рассмотри возможность прекращения отношений',
          'Помни: твоя безопасность важнее всего'
        ]
      }
    }
  }

  const handleSliderChange = (questionId: string, value: number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value[0]
    }))
  }

  const handleShowResult = () => {
    const result = calculateResult()
    setShowResult(true)
    onComplete?.({
      answers,
      result
    })
  }

  const result = showResult ? calculateResult() : null
  const progress = (Object.keys(answers).length / questions.length) * 100

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium">
            Вопросы: {Object.keys(answers).length}/{questions.length}
          </span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Questions */}
      {!showResult && (
        <div className="space-y-3">
          {questions.map((question, idx) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-3 bg-white border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(question.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xs text-gray-900 mb-3">
                      {question.question}
                    </h4>
                    <div className="px-2">
                      <Slider
                        value={[answers[question.id] || 5]}
                        onValueChange={(val) => handleSliderChange(question.id, val)}
                        min={0}
                        max={10}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span className="font-bold text-gray-700">
                          {answers[question.id] || 5}/10
                        </span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <Button
            onClick={handleShowResult}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
          >
            Посмотреть результат
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Result */}
      {result && showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className={`p-4 bg-gradient-to-br ${result.color} text-white shadow-lg`}>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">{result.message}</h3>
              <p className="text-sm opacity-90">
                Средняя оценка: {Math.round(Object.values(answers).reduce((sum, val) => sum + val, 0) / answers.length)}/10
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2">Рекомендации:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                setShowResult(false)
                setAnswers({})
              }}
              className="mt-4 w-full bg-white text-gray-900 hover:bg-gray-100 text-xs font-semibold"
            >
              Пройти ещё раз
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
