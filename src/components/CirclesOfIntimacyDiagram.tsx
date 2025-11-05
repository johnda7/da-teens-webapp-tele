/**
 * Circles of Intimacy Diagram
 * Интерактивная диаграмма "5 кругов близости" для Урока 1
 * Философия: Jobs Simplicity + iOS 26 Liquid Glass
 * УЛУЧШЕНО: drag-and-drop, изменение размера, персонализация
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useDragControls, PanInfo } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PencilSimple, ArrowsOut, Check, X, Sparkle, ArrowsClockwise } from '@phosphor-icons/react'

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
  mode?: 'view' | 'edit' // Режим просмотра или редактирования
  onComplete?: (data: any) => void // Callback при завершении
}

export default function CirclesOfIntimacyDiagram({ 
  onCircleClick, 
  mode = 'view',
  onComplete 
}: CirclesOfIntimacyDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null)
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(mode === 'edit')
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState('')
  const [circlePositions, setCirclePositions] = useState<Record<string, { x: number; y: number; size: number }>>(() => {
    // Начальные позиции кругов (расположены концентрически)
    const positions: Record<string, { x: number; y: number; size: number }> = {}
    circles.forEach((circle, index) => {
      const angle = (index - 1) * 0.8 - 0.4
      const radius = [80, 120, 160, 200, 240][index]
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      positions[circle.id] = { x, y, size: [80, 120, 160, 200, 240][index] }
    })
    return positions
  })

  const ringRadii = [80, 120, 160, 200, 240]

  const snapToRing = (x: number, y: number) => {
    const r = Math.sqrt(x * x + y * y)
    // найти ближайший радиус
    let nearest = ringRadii[0]
    let minDiff = Math.abs(r - nearest)
    for (const rr of ringRadii) {
      const d = Math.abs(r - rr)
      if (d < minDiff) {
        minDiff = d
        nearest = rr
      }
    }
    if (r === 0) return { x, y }
    const k = nearest / r
    return { x: x * k, y: y * k }
  }

  const handleCircleClick = (circleId: string) => {
    if (isEditingLabel && selectedCircle === circleId) return
    if (selectedCircle === circleId) {
      setSelectedCircle(null)
    } else {
      setSelectedCircle(circleId)
      onCircleClick?.(circleId)
    }
  }

  const handleEditLabel = () => {
    if (selectedCircle) {
      setEditedLabel(circles.find(c => c.id === selectedCircle)?.label || '')
      setIsEditingLabel(true)
    }
  }

  const handleSaveLabel = () => {
    // Здесь можно добавить логику сохранения изменений
    setIsEditingLabel(false)
    setSelectedCircle(null)
  }

  const handleCancelEdit = () => {
    setIsEditingLabel(false)
    setEditedLabel('')
  }

  const handleReset = () => {
    // Сброс к начальным позициям
    const positions: Record<string, { x: number; y: number; size: number }> = {}
    circles.forEach((circle, index) => {
      const angle = (index - 1) * 0.8 - 0.4
      const radius = [80, 120, 160, 200, 240][index]
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      positions[circle.id] = { x, y, size: [80, 120, 160, 200, 240][index] }
    })
    setCirclePositions(positions)
  }

  const selectedInfo = circles.find(c => c.id === selectedCircle)

  // Размеры кругов (от центра к краю)
  const sizes = [80, 120, 160, 200, 240]
  const lineWidths = [3, 2.5, 2, 1.5, 1]
  const baseSize = 300 // Размер холста

  // Presets
  function applyPreset(name: 'family' | 'school' | 'online') {
    setCirclePositions(prev => {
      const sizesLocal: Record<string, number> = {}
      Object.keys(prev).forEach(k => sizesLocal[k] = prev[k].size)
      const p: Record<string, { x: number; y: number; size: number }> = { ...prev }
      if (name === 'family') {
        p.self = { x: 0, y: 0, size: sizesLocal.self }
        p.family = { x: 90, y: 10, size: sizesLocal.family }
        p.friends = { x: -120, y: 40, size: sizesLocal.friends }
        p.acquaintances = { x: -170, y: -30, size: sizesLocal.acquaintances }
        p.strangers = { x: 210, y: -20, size: sizesLocal.strangers }
      } else if (name === 'school') {
        p.self = { x: 0, y: 0, size: sizesLocal.self }
        p.friends = { x: 90, y: 0, size: sizesLocal.friends }
        p.acquaintances = { x: 160, y: 40, size: sizesLocal.acquaintances }
        p.family = { x: -140, y: -20, size: sizesLocal.family }
        p.strangers = { x: -210, y: 10, size: sizesLocal.strangers }
      } else {
        // online
        p.self = { x: 0, y: 0, size: sizesLocal.self }
        p.strangers = { x: 230, y: 0, size: sizesLocal.strangers }
        p.acquaintances = { x: 170, y: 60, size: sizesLocal.acquaintances }
        p.friends = { x: 110, y: -40, size: sizesLocal.friends }
        p.family = { x: -120, y: -10, size: sizesLocal.family }
      }
      return p
    })
  }

  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* Кнопки управления (только в режиме редактирования) */}
      {isEditMode && (
        <div className="flex flex-col gap-2 mb-2 items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => applyPreset('family')}>Семья</Button>
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => applyPreset('school')}>Школа</Button>
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => applyPreset('online')}>Онлайн</Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs h-7"
          >
            <ArrowsClockwise size={12} className="mr-1" />
            Сбросить
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(false)}
            className="text-xs h-7"
          >
            Завершить
          </Button>
        </div>
      )}

      {/* SVG Диаграмма */}
      <div ref={containerRef} className="relative h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden border border-gray-200">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Концентрические круги (фон) */}
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
                opacity={isSelected || isHovered ? 0.5 : 0.2}
                className="pointer-events-none"
                animate={{ 
                  opacity: isSelected || isHovered ? 0.5 : 0.2
                }}
              />
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

        {/* Интерактивные метки-круги */}
        <div className="absolute inset-0">
          {circles.map((circle, index) => {
            const pos = circlePositions[circle.id]
            const isSelected = selectedCircle === circle.id
            const isHovered = hoveredCircle === circle.id

            return (
              <motion.div
                key={circle.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  cursor: isEditMode ? 'grab' : 'pointer'
                }}
                whileHover={isEditMode ? {} : { scale: 1.1 }}
                whileTap={isEditMode ? {} : { scale: 0.95 }}
                onClick={() => handleCircleClick(circle.id)}
                onMouseEnter={() => setHoveredCircle(circle.id)}
                onMouseLeave={() => setHoveredCircle(null)}
                drag={isEditMode}
                dragMomentum={false}
                dragElastic={0.1}
                dragConstraints={containerRef}
                onDragEnd={(event, info) => {
                  if (isEditMode) {
                    const newX = pos.x + info.offset.x
                    const newY = pos.y + info.offset.y
                    const snapped = snapToRing(newX, newY)
                    setCirclePositions(prev => ({
                      ...prev,
                      [circle.id]: { ...prev[circle.id], x: snapped.x, y: snapped.y }
                    }))
                  }
                }}
              >
                {/* Круг-метка */}
                <motion.div
                  className={`w-16 h-16 ${circle.color} rounded-full flex items-center justify-center text-white shadow-lg ${
                    isSelected ? 'ring-4 ring-blue-400 ring-offset-2' : ''
                  } ${isHovered ? 'shadow-xl' : ''}`}
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                    boxShadow: isSelected 
                      ? '0 0 0 4px rgba(59, 130, 246, 0.5), 0 10px 20px rgba(0, 0, 0, 0.2)'
                      : isHovered
                      ? '0 10px 20px rgba(0, 0, 0, 0.15)'
                      : '0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-2xl">{circle.icon}</div>
                </motion.div>

                {/* Label */}
                {!isEditMode && (
                  <motion.div
                    className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    animate={{ opacity: isSelected || isHovered ? 1 : 0.7 }}
                  >
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {circle.label}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}

          {/* Центральная точка */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              cursor: isEditMode ? 'grab' : 'pointer'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCircleClick('self')}
            drag={isEditMode}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={containerRef}
            onDragEnd={(event, info) => {
              if (isEditMode) {
                const pos = circlePositions.self
                const newX = pos.x + info.offset.x
                const newY = pos.y + info.offset.y
                setCirclePositions(prev => ({
                  ...prev,
                  self: { ...prev.self, x: newX, y: newY }
                }))
              }
            }}
          >
            <motion.div
              className="w-14 h-14 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              }}
              animate={{
                opacity: [0.9, 1, 0.9],
                boxShadow: ['0 4px 15px rgba(0, 122, 255, 0.4)', '0 6px 20px rgba(0, 122, 255, 0.6)', '0 4px 15px rgba(0, 122, 255, 0.4)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-2xl">🔵</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Индикатор режима редактирования */}
        {isEditMode && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <Sparkle size={10} weight="fill" />
            Редактирование
          </div>
        )}
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
            <Card className="mt-3 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 ${selectedInfo.color} rounded-full flex items-center justify-center text-xl`}>
                      {selectedInfo.icon}
                    </div>
                    {isEditingLabel && selectedCircle === selectedInfo.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedLabel}
                          onChange={(e) => setEditedLabel(e.target.value)}
                          className="text-sm font-bold border-b-2 border-blue-500 outline-none px-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveLabel()
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                        />
                        <Button size="sm" variant="ghost" onClick={handleSaveLabel} className="h-6 w-6 p-0">
                          <Check size={14} className="text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                          <X size={14} className="text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-bold text-gray-900">{selectedInfo.label}</h3>
                    )}
                  </div>
                  {isEditMode && !isEditingLabel && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditLabel}
                      className="h-7 w-7 p-0"
                    >
                      <PencilSimple size={14} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-700 mb-3">{selectedInfo.description}</p>
                
                {/* Примеры */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Примеры:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedInfo.examples.map((example, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {example}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Кнопка закрытия */}
                <button
                  onClick={() => {
                    setSelectedCircle(null)
                    setIsEditingLabel(false)
                  }}
                  className="mt-3 w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Скрыть детали
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подсказка */}
      {!selectedCircle && !isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-center"
        >
          <p className="text-xs text-gray-500">
            👆 Нажми на любой круг, чтобы узнать больше
          </p>
        </motion.div>
      )}

      {/* Кнопка включения режима редактирования */}
      {!isEditMode && !selectedCircle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-2"
        >
          <Button
            variant="outline"
            onClick={() => setIsEditMode(true)}
            className="w-full text-xs h-8"
            size="sm"
          >
            <ArrowsOut size={14} className="mr-1" />
            Настроить свою карту
          </Button>
        </motion.div>
      )}
    </div>
  )
}
