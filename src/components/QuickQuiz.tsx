/**
 * QuickQuiz - Быстрый интерактивный квиз для первого экрана
 * Показывает 3 вопроса из урока для демонстрации интерактивности
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from '@phosphor-icons/react'
import type { QuizQuestion } from '@/data/boundariesModule'

interface QuickQuizProps {
  questions: QuizQuestion[]
  onComplete?: (score: number) => void
}

export default function QuickQuiz({ questions, onComplete }: QuickQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return

    const currentAnswer = selectedAnswers[currentQuestion.id] || 
      (currentQuestion.type === 'multiple' ? [] : '')

    if (currentQuestion.type === 'multiple') {
      const answers = Array.isArray(currentAnswer) ? currentAnswer : []
      const newAnswers = answers.includes(answerId)
        ? answers.filter(id => id !== answerId)
        : [...answers, answerId]
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: newAnswers })
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: answerId })
    }
  }

  const handleSubmit = () => {
    if (showFeedback) {
      if (isLastQuestion) {
        setCompleted(true)
        onComplete?.(score)
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
        setShowFeedback(false)
      }
      return
    }

    const userAnswer = selectedAnswers[currentQuestion.id]
    const correctAnswer = currentQuestion.correctAnswer
    const isCorrect = Array.isArray(correctAnswer)
      ? Array.isArray(userAnswer) && 
        correctAnswer.every(id => userAnswer.includes(id)) &&
        userAnswer.length === correctAnswer.length
      : userAnswer === correctAnswer

    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setShowFeedback(true)
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" weight="fill" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Отлично! 🎉
            </h3>
            <p className="text-gray-700 mb-4">
              Ты ответил правильно на {score} из {questions.length} вопросов!
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {Math.round((score / questions.length) * 100)}% правильных ответов
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const userAnswer = selectedAnswers[currentQuestion.id]
  const correctAnswer = currentQuestion.correctAnswer
  const isCorrect = showFeedback && (
    Array.isArray(correctAnswer)
      ? Array.isArray(userAnswer) && 
        correctAnswer.every(id => userAnswer.includes(id)) &&
        userAnswer.length === correctAnswer.length
      : userAnswer === correctAnswer
  )

  const isSelected = (answerId: string) => {
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(userAnswer) && userAnswer.includes(answerId)
    }
    return userAnswer === answerId
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Попробуй прямо сейчас
        </h2>
        <p className="text-gray-600 mb-2">
          Быстрый квиз: проверь свои знания
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Вопрос */}
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Варианты ответов */}
          {currentQuestion.options.map((option) => {
            const selected = isSelected(option.id)
            const showAsCorrect = showFeedback && (
              (Array.isArray(correctAnswer) && correctAnswer.includes(option.id)) ||
              (!Array.isArray(correctAnswer) && correctAnswer === option.id)
            )
            const showAsIncorrect = showFeedback && selected && !showAsCorrect

            return (
              <motion.button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showFeedback}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${selected 
                    ? showAsCorrect 
                      ? 'bg-green-50 border-green-500' 
                      : showAsIncorrect
                        ? 'bg-red-50 border-red-500'
                        : 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                  }
                  ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                `}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  {showFeedback && showAsCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" weight="fill" />
                  )}
                  {showFeedback && showAsIncorrect && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" weight="fill" />
                  )}
                  <span className={`
                    ${selected 
                      ? showAsCorrect 
                        ? 'text-green-800 font-medium' 
                        : showAsIncorrect
                          ? 'text-red-800 font-medium'
                          : 'text-blue-800 font-medium'
                      : 'text-gray-700'
                    }
                  `}>
                    {option.text}
                  </span>
                </div>
              </motion.button>
            )
          })}

          {/* Обратная связь */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <Card className={`
                  ${isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                  }
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className={`
                        w-5 h-5 flex-shrink-0 mt-0.5
                        ${isCorrect ? 'text-green-600' : 'text-yellow-600'}
                      `} weight="fill" />
                      <div>
                        <p className={`
                          font-medium mb-1
                          ${isCorrect ? 'text-green-800' : 'text-yellow-800'}
                        `}>
                          {isCorrect ? 'Правильно! 🎉' : 'Попробуй еще раз'}
                        </p>
                        <p className={`
                          text-sm
                          ${isCorrect ? 'text-green-700' : 'text-yellow-700'}
                        `}>
                          {currentQuestion.explanation}
                        </p>
                        {currentQuestion.emotionalContext && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            {currentQuestion.emotionalContext}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка продолжить */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-4"
            size="lg"
          >
            {showFeedback 
              ? (isLastQuestion ? 'Завершить' : 'Следующий вопрос')
              : 'Ответить'
            }
            {!showFeedback && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}




