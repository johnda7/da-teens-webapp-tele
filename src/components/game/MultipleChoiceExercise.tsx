import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Option {
  id: string
  text: string
}

interface MultipleChoiceExerciseProps {
  question: string
  options: Option[]
  correctAnswer: string
  explanation: string
  onAnswer: (isCorrect: boolean) => void
  showFeedback: boolean
}

export default function MultipleChoiceExercise({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  showFeedback
}: MultipleChoiceExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (optionId: string) => {
    if (showFeedback) return
    
    setSelected(optionId)
    const isCorrect = optionId === correctAnswer
    onAnswer(isCorrect)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <Card className="p-6 bg-white border-2 border-purple-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {question}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {options.map((option, idx) => {
            const isSelected = selected === option.id
            const isCorrect = option.id === correctAnswer
            const showResult = showFeedback && isSelected

            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-800 font-medium">
                    {option.text}
                  </span>
                  {showResult && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      {isCorrect ? '✅' : '❌'}
                    </motion.span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200"
          >
            <p className="text-sm text-blue-900">{explanation}</p>
          </motion.div>
        )}
      </Card>
    </div>
  )
}

