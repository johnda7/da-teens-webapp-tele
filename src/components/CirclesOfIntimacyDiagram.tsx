/**
 * Circles of Intimacy Diagram
 * Интерактивная диаграмма "5 кругов близости" для Урока 1
 * Философия: Jobs Simplicity + iOS 26 Liquid Glass
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface CircleInfo {
  id: string
  label: string
  description: string
  color: string
  icon: string
  examples: string[]
}

const circles: CircleInfo[] = [
  {
    id: 'self',
    label: 'Я',
    description: 'Твой внутренний мир: мысли, чувства, решения. Только ты определяешь, кто туда впускать.',
    color: 'bg-blue-500',
    icon: '🔵',
    examples: ['Мои мысли', 'Мои чувства', 'Мои решения']
  },
  {
    id: 'family',
    label: 'Семья',
    description: 'Родители, братья, сёстры. С ними границы устанавливаются сложнее всего, но это возможно!',
    color: 'bg-green-500',
    icon: '🟢',
    examples: ['Родители', 'Братья и сёстры', 'Близкие родственники']
  },
  {
    id: 'friends',
    label: 'Друзья',
    description: 'Близкие друзья, которых ты выбираешь сам. С ними легче устанавливать и защищать границы.',
    color: 'bg-yellow-500',
    icon: '🟡',
    examples: ['Лучший друг', 'Близкие друзья', 'Доверенные люди']
  },
  {
    id: 'acquaintances',
    label: 'Знакомые',
    description: 'Одноклассники, соседи, знакомые родителей. С ними нужны более строгие границы.',
    color: 'bg-orange-500',
    icon: '🟠',
    examples: ['Одноклассники', 'Соседи', 'Знакомые']
  },
  {
    id: 'strangers',
    label: 'Незнакомые',
    description: 'Люди, которых ты не знаешь. Максимальные границы!',
    color: 'bg-red-500',
    icon: '🔴',
    examples: ['Незнакомцы', 'Люди в интернете', 'Люди на улице']
  }
]

interface CirclesOfIntimacyDiagramProps {
  onCircleClick?: (circleId: string) => void
}

export default function CirclesOfIntimacyDiagram({ onCircleClick }: CirclesOfIntimacyDiagramProps) {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null)
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null)

  const handleCircleClick = (circleId: string) => {
    if (selectedCircle === circleId) {
      setSelectedCircle(null)
    } else {
      setSelectedCircle(circleId)
      onCircleClick?.(circleId)
    }
  }

  const selectedInfo = circles.find(c => c.id === selectedCircle)

  // Размеры кругов (от центра к краю)
  const sizes = [80, 120, 160, 200, 240]
  const lineWidths = [3, 2.5, 2, 1.5, 1]

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* SVG Диаграмма */}
      <div className="relative aspect-square">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Концентрические круги */}
          {circles.map((circle, index) => {
            const size = sizes[index]
            const strokeWidth = lineWidths[index]
            const isSelected = selectedCircle === circle.id
            const isHovered = hoveredCircle === circle.id

            return (
              <motion.circle
                key={circle.id}
                cx="150"
                cy="150"
                r={size}
                fill="none"
                stroke={circle.color}
                strokeWidth={strokeWidth}
                strokeDasharray={isSelected || isHovered ? '0' : '5,5'}
                opacity={isSelected || isHovered ? 1 : 0.3}
                className="cursor-pointer transition-all"
                whileHover={{ opacity: 0.6 }}
                onClick={() => handleCircleClick(circle.id)}
                onMouseEnter={() => setHoveredCircle(circle.id)}
                onMouseLeave={() => setHoveredCircle(null)}
              />
            )
          })}

          {/* Центральная точка */}
          <motion.circle
            cx="150"
            cy="150"
            r="30"
            fill="url(#gradient-center)"
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCircleClick('self')}
          >
            <motion.animate
              attributeName="opacity"
              values={[0.9, 1, 0.9]}
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* Labels для кругов */}
          {circles.map((circle, index) => {
            const angle = (index - 1) * 0.8 - 0.4 // Распределяем по кругу
            const radius = sizes[index] + 15
            const x = 150 + Math.cos(angle) * radius
            const y = 150 + Math.sin(angle) * radius
            const isSelected = selectedCircle === circle.id

            return (
              <motion.text
                key={`label-${circle.id}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="cursor-pointer select-none"
                fill={isSelected ? '#007AFF' : '#666'}
                fontSize={isSelected ? 14 : 12}
                fontWeight={isSelected ? 'bold' : 'normal'}
                onClick={() => handleCircleClick(circle.id)}
              >
                {circle.icon} {circle.label}
              </motion.text>
            )
          })}

          {/* Gradient определения */}
          <defs>
            <radialGradient id="gradient-center" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#5AC8FA" stopOpacity="0.7" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Информационная панель */}
      <AnimatePresence mode="wait">
        {selectedInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 ${selectedInfo.color} rounded-full flex items-center justify-center text-2xl`}>
                    {selectedInfo.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedInfo.label}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{selectedInfo.description}</p>
                
                {/* Примеры */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Примеры:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInfo.examples.map((example, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {example}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Кнопка закрытия */}
                <button
                  onClick={() => setSelectedCircle(null)}
                  className="mt-4 w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Скрыть детали
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подсказка */}
      {!selectedCircle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-gray-500">
            👆 Нажми на любой круг, чтобы узнать больше
          </p>
        </motion.div>
      )}
    </div>
  )
}

