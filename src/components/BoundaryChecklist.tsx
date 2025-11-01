/**
 * Boundary Checklist - Интерактивный чек-лист
 * Для Урока 3: "Почему так сложно сказать нет?"
 * Философия: Jobs Simplicity + iOS 26 Liquid Glass
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Warning, XCircle, Target } from '@phosphor-icons/react'

interface ChecklistItem {
  id: number
  question: string
}

const checklistItems: ChecklistItem[] = [
  { id: 1, question: 'Сложно отличить свои желания от желаний других?' },
  { id: 2, question: 'Стараешься соответствовать ожиданиям всех вокруг?' },
  { id: 3, question: 'С трудом говоришь "нет", даже когда хочешь?' },
  { id: 4, question: 'Доверяешь другим больше, чем себе?' },
  { id: 5, question: 'Чувствуешь вину, когда отстаиваешь свои интересы?' },
  { id: 6, question: 'Боишься конфликтов любой ценой?' },
  { id: 7, question: 'Решаешь чужие проблемы, игнорируя свои?' },
  { id: 8, question: 'Не знаешь, что тебе нравится/не нравится?' },
  { id: 9, question: 'Живёшь с ощущением, что "что-то не так"?' },
  { id: 10, question: 'Слишком много даёшь и мало получаешь?' }
]

interface BoundaryChecklistProps {
  onComplete?: (score: number) => void
}

export default function BoundaryChecklist({ onComplete }: BoundaryChecklistProps) {
  const [answers, setAnswers] = useState<Set<number>>(new Set())
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (answers.size === 10) {
      setScore(answers.size)
      setShowResult(true)
      onComplete?.(answers.size)
    }
  }, [answers, onComplete])

  const handleToggle = (id: number) => {
    setAnswers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getResultMessage = () => {
    if (score <= 3) return {
      emoji: '👍',
      title: 'Гибкие границы!',
      message: 'Ты на правильном пути! Продолжай в том же духе.',
      color: 'green'
    }
    if (score <= 7) return {
      emoji: '⚠️',
      title: 'Слабые границы',
      message: 'Нужна работа над границами. Начни с малого!',
      color: 'orange'
    }
    return {
      emoji: '🚨',
      title: 'Жёсткие границы',
      message: 'Нужна поддержка. Не стесняйся обращаться за помощью!',
      color: 'red'
    }
  }

  const result = showResult ? getResultMessage() : null
  const progress = (answers.size / 10) * 100

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Target size={24} className="text-blue-600" weight="duotone" />
            Проверь себя
          </h3>
          <span className="text-xs text-gray-600">
            {answers.size} / 10
          </span>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {checklistItems.map((item, idx) => (
            <motion.button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
                answers.has(item.id)
                  ? 'bg-purple-100 border-purple-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${
                  answers.has(item.id) ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {answers.has(item.id) ? (
                    <CheckCircle size={20} weight="fill" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <span className={`text-sm leading-relaxed ${
                  answers.has(item.id) ? 'font-medium text-purple-900' : 'text-gray-700'
                }`}>
                  {item.question}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl bg-${result.color}-50 border-2 border-${result.color}-200`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{result.emoji}</div>
                <div>
                  <h4 className={`font-bold text-base text-${result.color}-900 mb-1`}>
                    {result.title}
                  </h4>
                  <p className={`text-sm text-${result.color}-800`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
