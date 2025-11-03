import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Shield, Sword, Home, Lock, Trophy, Star, Crown } from 'lucide-react'

interface CastlePart {
  id: string
  name: string
  description: string
  icon: string
  lessonNumber: number
  isUnlocked: boolean
  level: number
  color: string
}

interface CastleGameProps {
  completedLessons: string[]
  totalXP?: number
}

// Base castle parts configuration
const baseCastleParts: Omit<CastlePart, 'isUnlocked' | 'level'>[] = [
  {
    id: 'foundation',
    name: 'Фундамент',
    description: 'Базовые границы - основа твоего замка',
    icon: '🏛️',
    lessonNumber: 1,
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'walls',
    name: 'Стены',
    description: 'Распознавание нарушений - первая линия защиты',
    icon: '🧱',
    lessonNumber: 2,
    color: 'from-stone-600 to-stone-800'
  },
  {
    id: 'towers',
    name: 'Башни',
    description: 'Права на границы - возвышенность силы',
    icon: '🗼',
    lessonNumber: 3,
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'gates',
    name: 'Ворота',
    description: 'Как сказать "нет" - вход под контролем',
    icon: '🚪',
    lessonNumber: 4,
    color: 'from-amber-600 to-amber-800'
  },
  {
    id: 'bridge',
    name: 'Мост',
    description: 'Сложные ситуации - переходы в отношениях',
    icon: '🌉',
    lessonNumber: 5,
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 'fortress',
    name: 'Крепость',
    description: 'Реакции других - внутренняя защита',
    icon: '🏰',
    lessonNumber: 6,
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'courtyard',
    name: 'Двор',
    description: 'Уважение чужих границ - пространство общения',
    icon: '🏛️',
    lessonNumber: 7,
    color: 'from-green-600 to-green-800'
  },
  {
    id: 'cyber-defense',
    name: 'Кибер-защита',
    description: 'Цифровые границы - стены онлайн мира',
    icon: '🛡️',
    lessonNumber: 8,
    color: 'from-cyan-600 to-cyan-800'
  },
  {
    id: 'kingdom',
    name: 'Королевство',
    description: 'Полный план - твоя территория под контролем',
    icon: '👑',
    lessonNumber: 9,
    color: 'from-yellow-600 to-orange-600'
  }
]

export default function CastleGame({ completedLessons = [], totalXP = 0 }: CastleGameProps) {
  const [selectedPart, setSelectedPart] = useState<CastlePart | null>(null)

  // Calculate castle parts based on real progress
  const castleParts = useMemo<CastlePart[]>(() => {
    return baseCastleParts.map((part, idx) => {
      const lessonId = `boundaries-${part.lessonNumber}`
      const isUnlocked = completedLessons.includes(lessonId)
      
      // Level: 3 if completed, 0 if locked
      const level = isUnlocked ? 3 : 0
      
      return {
        ...part,
        isUnlocked,
        level
      }
    })
  }, [completedLessons])

  const unlockedParts = castleParts.filter(p => p.isUnlocked)
  const totalLevel = castleParts.reduce((sum, part) => sum + part.level, 0)
  const maxLevel = castleParts.length * 3 // 3 уровня на каждую часть
  const castleStrength = Math.round((totalLevel / maxLevel) * 100)

  const getLevelBadge = (level: number) => {
    if (level === 0) return { text: 'Начато', color: 'bg-gray-100 text-gray-700 border-gray-300' }
    if (level === 1) return { text: 'Уровень 1', color: 'bg-green-100 text-green-700 border-green-300' }
    if (level === 2) return { text: 'Уровень 2', color: 'bg-blue-100 text-blue-700 border-blue-300' }
    if (level === 3) return { text: 'МАКСИМУМ', color: 'bg-purple-100 text-purple-700 border-purple-300' }
    return { text: 'Начато', color: 'bg-gray-100 text-gray-700 border-gray-300' }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Сила замка</div>
            <div className="text-lg font-bold text-purple-700">{castleStrength}%</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Открыто</div>
            <div className="text-lg font-bold text-green-700">{unlockedParts.length}/{castleParts.length}</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Уровень</div>
            <div className="text-lg font-bold text-yellow-700">{totalLevel}/{maxLevel}</div>
          </div>
        </Card>
      </div>

      {/* Castle Visualization */}
      <Card className="glass rounded-xl p-4 border border-white/40 mb-3 overflow-hidden">
        <div className="relative bg-gradient-to-b from-sky-200 to-blue-300 rounded-lg p-8 min-h-[200px] flex items-end justify-center">
          {/* Castle Parts Visual */}
          <div className="flex items-end gap-2">
            {castleParts.map((part, idx) => {
              const level = part.isUnlocked ? part.level : 0
              const height = part.isUnlocked ? 40 + (level * 20) : 20
              
              return (
                <motion.div
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`relative cursor-pointer transition-all ${
                    selectedPart?.id === part.id ? 'scale-110 z-10' : 'hover:scale-105'
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Castle Block */}
                  <div
                    className={`w-12 rounded-t-lg border-2 border-white/50 shadow-lg ${
                      part.isUnlocked
                        ? `bg-gradient-to-t ${part.color}`
                        : 'bg-gray-400 opacity-50'
                    }`}
                    style={{ height: `${height}px` }}
                  >
                    {/* Icon on top */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
                      {part.icon}
                    </div>
                  </div>
                  
                  {/* Flag or Lock */}
                  {!part.isUnlocked && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-700 to-green-500" />
        </div>

        {/* Description */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600">
            {unlockedParts.length === 0 
              ? 'Начни строить свой замок границ!'
              : unlockedParts.length < castleParts.length
              ? `Твой замок растёт! ${unlockedParts.length}/${castleParts.length} частей`
              : 'У тебя полный замок! Ты мастер границ! 🏆'
            }
          </p>
        </div>
      </Card>

      {/* Parts Grid */}
      <div className="grid grid-cols-3 gap-2">
        {castleParts.map((part) => {
          const levelBadge = getLevelBadge(part.level)
          
          return (
            <motion.div
              key={part.id}
              onClick={() => setSelectedPart(selectedPart?.id === part.id ? null : part)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                part.isUnlocked
                  ? selectedPart?.id === part.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
              whileHover={part.isUnlocked ? { scale: 1.02 } : {}}
            >
              <div className="p-2">
                {/* Icon and Level */}
                <div className="text-center mb-2">
                  <div className="text-3xl">{part.icon}</div>
                  {part.isUnlocked && (
                    <div className="mt-1">
                      <Progress value={(part.level / 3) * 100} className="h-1 mb-1" />
                      <Badge className={`text-[9px] px-1.5 py-0 h-4 ${levelBadge.color}`}>
                        {levelBadge.text}
                      </Badge>
                    </div>
                  )}
                  {!part.isUnlocked && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-gray-500">
                      <Lock className="w-3 h-3" />
                      Урок {part.lessonNumber}
                    </div>
                  )}
                </div>

                {/* Name and Description */}
                <h4 className={`text-xs font-bold text-center mb-1 ${
                  part.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {part.name}
                </h4>
                <p className={`text-[10px] text-center leading-relaxed ${
                  part.isUnlocked ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {part.description}
                </p>

                {/* Level Stars */}
                {part.isUnlocked && part.level > 0 && (
                  <div className="flex justify-center gap-0.5 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < part.level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Indicator */}
              {selectedPart?.id === part.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Crown className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Selected Part Details */}
      {selectedPart && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 p-3">
            <div className="flex items-start gap-2 mb-2">
              <div className="text-3xl">{selectedPart.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-purple-900 mb-0.5">{selectedPart.name}</h4>
                <p className="text-xs text-purple-700 leading-relaxed mb-2">
                  {selectedPart.description}
                </p>
                
                {selectedPart.isUnlocked && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Укрепление:</span>
                      <span className="font-bold text-purple-900">
                        Уровень {selectedPart.level} / 3
                      </span>
                    </div>
                    <Progress value={(selectedPart.level / 3) * 100} className="h-2" />
                  </div>
                )}

                {!selectedPart.isUnlocked && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-[10px] text-amber-800">
                      🔒 Откроется после завершения Урока {selectedPart.lessonNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Completion Message */}
      {unlockedParts.length === castleParts.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-bold text-yellow-800">Твой замок готов!</h4>
          </div>
          <p className="text-xs text-yellow-700 mb-2">
            Ты построил полный замок границ! Твоя территория под контролем! 🏆
          </p>
        </motion.div>
      )}
    </div>
  )
}
