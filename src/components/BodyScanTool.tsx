/**
 * Body Scan Tool - Интерактивный инструмент сканирования тела
 * Для Урока 2: "Как понять, что границы нарушены?"
 * Философия: Jobs Simplicity + iOS 26 Liquid Glass
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Heart, ArrowRight, ArrowLeft, Sparkle, PencilSimple, Eye } from '@phosphor-icons/react'

interface BodyPart {
  id: string
  name: string
  position: { x: number; y: number }
  sensations: string[]
}

interface SelectedSensation {
  partId: string
  sensation: string
}

interface BodyScanToolProps {
  onComplete?: (data: { sensations: SelectedSensation[], emotions: string[], note: string }) => void
}

export default function BodyScanTool({ onComplete }: BodyScanToolProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [selectedSensations, setSelectedSensations] = useState<SelectedSensation[]>([])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const bodyParts: BodyPart[] = [
    {
      id: 'head',
      name: 'Голова',
      position: { x: 50, y: 15 },
      sensations: ['Напряжение', 'Головная боль', 'Давление']
    },
    {
      id: 'throat',
      name: 'Горло',
      position: { x: 50, y: 30 },
      sensations: ['Комок', 'Сжатие', 'Сухость']
    },
    {
      id: 'chest',
      name: 'Грудь',
      position: { x: 50, y: 45 },
      sensations: ['Сжатие', 'Боль', 'Давление', 'Учащённое сердцебиение']
    },
    {
      id: 'stomach',
      name: 'Живот',
      position: { x: 50, y: 60 },
      sensations: ['Сжатие', 'Боль', 'Бабочки']
    },
    {
      id: 'shoulders',
      name: 'Плечи',
      position: { x: 35, y: 40 },
      sensations: ['Напряжение', 'Скованность', 'Боль']
    },
    {
      id: 'hands',
      name: 'Руки',
      position: { x: 25, y: 65 },
      sensations: ['Дрожь', 'Сжатость', 'Жар']
    }
  ]

  const emotions = ['Злость 😤', 'Грусть 😔', 'Страх 😰', 'Тревога 😟', 'Вина 😖', 'Стыд 🤐', 'Онемение 😶', 'Раздражение 😠']

  const steps = [
    {
      title: 'Шаг 1: Вспомни ситуацию',
      description: 'Подумай о недавней некомфортной ситуации'
    },
    {
      title: 'Шаг 2: Отметь ощущения',
      description: 'Кликни на часть тела, где чувствуешь дискомфорт'
    },
    {
      title: 'Шаг 3: Выбери эмоции',
      description: 'Какие эмоции ты испытывал в той ситуации?'
    },
    {
      title: 'Шаг 4: Запиши разницу',
      description: 'Как изменились ощущения после?'
    }
  ]

  const handleBodyPartClick = (partId: string) => {
    if (selectedParts.includes(partId)) {
      setSelectedParts(prev => prev.filter(p => p !== partId))
      setSelectedSensations(prev => prev.filter(s => s.partId !== partId))
    } else {
      setSelectedParts(prev => [...prev, partId])
    }
  }

  const handleSensationSelect = (partId: string, sensation: string) => {
    setSelectedSensations(prev => {
      const existing = prev.filter(s => s.partId !== partId)
      return [...existing, { partId, sensation }]
    })
  }

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsComplete(true)
      onComplete?.({
        sensations: selectedSensations,
        emotions: selectedEmotions,
        note
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getSelectedPart = (partId: string) => bodyParts.find(p => p.id === partId)

  return (
    <div className="space-y-2">
      {/* Progress - compact */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} />
        <h3 className="font-semibold text-sm mt-1">{steps[currentStep].title}</h3>
        <p className="text-xs text-gray-600">{steps[currentStep].description}</p>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="text-center">
                <Heart size={36} className="mx-auto mb-2 text-purple-600" weight="duotone" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  Вспомни ситуацию, когда что-то было "не так". Возможно, кто-то нарушил твои границы?
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-2"
          >
            <Card className="p-2 bg-white">
              {/* Interactive Body Diagram - more compact */}
              <div className="relative h-40 max-w-xs mx-auto mb-2 bg-gradient-to-b from-gray-50 to-blue-50 rounded-xl overflow-hidden border-2 border-gray-200">
                {/* Simple body outline */}
                <svg viewBox="0 0 100 200" className="w-full h-full">
                  <defs>
                    <radialGradient id="bodyGlow" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Body silhouette with gradient */}
                  <path
                    d="M 50 10 Q 45 10 40 20 L 35 40 Q 30 70 25 80 Q 20 100 18 150 Q 20 180 25 190 L 30 195 Q 40 200 50 200 Q 60 200 70 195 L 75 190 Q 80 180 82 150 Q 80 100 75 80 Q 70 70 65 40 L 60 20 Q 55 10 50 10 Z"
                    fill="url(#bodyGlow)"
                    opacity="0.5"
                  />
                  <path
                    d="M 50 10 Q 45 10 40 20 L 35 40 Q 30 70 25 80 Q 20 100 18 150 Q 20 180 25 190 L 30 195 Q 40 200 50 200 Q 60 200 70 195 L 75 190 Q 80 180 82 150 Q 80 100 75 80 Q 70 70 65 40 L 60 20 Q 55 10 50 10 Z"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  
                  {/* Body parts circles with animations */}
                  {bodyParts.map(part => {
                    const isSelected = selectedParts.includes(part.id)
                    return (
                      <g key={part.id}>
                        {isSelected && (
                          <motion.circle
                            cx={part.position.x}
                            cy={part.position.y}
                            r="12"
                            fill="#8b5cf6"
                            opacity={0.3}
                            filter="url(#glow)"
                            animate={{ r: [12, 15, 12] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        <motion.circle
                          cx={part.position.x}
                          cy={part.position.y}
                          r="10"
                          fill={isSelected ? '#8b5cf6' : '#e2e8f0'}
                          stroke={isSelected ? '#6366f1' : '#cbd5e1'}
                          strokeWidth={isSelected ? '2.5' : '1'}
                          className="cursor-pointer"
                          filter={isSelected ? 'url(#glow)' : ''}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleBodyPartClick(part.id)}
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Labels */}
                {bodyParts.map(part => (
                  <div
                    key={`label-${part.id}`}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${part.position.x}%`,
                      top: `${part.position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleBodyPartClick(part.id)}
                  >
                    <div className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      selectedParts.includes(part.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/80 text-gray-700'
                    }`}>
                      {part.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sensations for selected parts */}
              {selectedParts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs">Какие ощущения ты чувствуешь?</h4>
                  {selectedParts.map(partId => {
                    const part = getSelectedPart(partId)
                    if (!part) return null
                    return (
                      <div key={partId} className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">
                          {part.name}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {part.sensations.map(sensation => {
                            const isSelected = selectedSensations.some(
                              s => s.partId === partId && s.sensation === sensation
                            )
                            return (
                              <motion.button
                                key={sensation}
                                onClick={() => handleSensationSelect(partId, sensation)}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isSelected && '✓ '}{sensation}
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {selectedParts.length === 0 && (
                <div className="text-center py-4">
                  <Eye size={32} className="mx-auto mb-2 text-gray-400" weight="duotone" />
                  <p className="text-gray-500 text-xs">
                    Кликни на часть тела, где чувствуешь дискомфорт
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-green-50 to-blue-50">
              <h4 className="font-semibold mb-2 text-xs">Какие эмоции ты испытывал?</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {emotions.map(emotion => {
                  const isSelected = selectedEmotions.includes(emotion)
                  return (
                    <motion.button
                      key={emotion}
                      onClick={() => handleEmotionToggle(emotion)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all relative ${
                        isSelected
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-700 rounded-full border-2 border-white" />}
                      {emotion}
                    </motion.button>
                  )
                })}
              </div>
              {selectedEmotions.length > 0 && (
                <div className="mt-2 p-2 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-800">
                    ✅ Выбрано: {selectedEmotions.length}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h4 className="font-semibold mb-2 text-xs">Запиши свои наблюдения:</h4>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Как изменились ощущения? Что заметил?"
                className="w-full h-20 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Поможет лучше понимать сигналы тела
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - better contrast */}
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex-1 text-xs h-8"
        >
          <ArrowLeft size={14} className="mr-1" />
          Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 1 && selectedParts.length === 0) ||
            (currentStep === 2 && selectedEmotions.length === 0)
          }
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md h-8"
        >
          {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
          {currentStep !== steps.length - 1 && <ArrowRight size={14} className="ml-1" />}
        </Button>
      </div>

      {/* Completion message - compact */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CheckCircle size={36} className="mx-auto mb-2 text-green-600" weight="duotone" />
              <h3 className="text-base font-bold mb-1">Отличная работа! 🎉</h3>
              <p className="text-xs text-gray-700">
                Ты научился распознавать сигналы своего тела!
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick tip at bottom */}
      {currentStep === 1 && selectedParts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            💡 Выбери ощущение для каждой части тела
          </p>
        </motion.div>
      )}
    </div>
  )
}
