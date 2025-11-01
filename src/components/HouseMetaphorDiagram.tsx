/**
 * House Metaphor Diagram
 * Визуальная метафора "Дом с дверью" для понимания типов границ
 * Философия: Jobs Simplicity + Google Visual Learning
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, DoorOpen, LockSimple, Users } from '@phosphor-icons/react'

interface HouseType {
  id: string
  title: string
  description: string
  characteristics: string[]
  pros: string[]
  cons: string[]
  recommendation: string
  icon: React.ReactNode
  color: string
}

const houseTypes: HouseType[] = [
  {
    id: 'open-house',
    title: 'Дом без стен',
    description: 'Ты впускаешь всех, кто хочет. Твои границы прозрачны или отсутствуют.',
    characteristics: [
      'Ты не можешь сказать "нет"',
      'Чувствуешь себя использованным',
      'Другие решают за тебя',
      'Устаёшь от общения'
    ],
    pros: ['Много друзей', 'Всегда в центре внимания'],
    cons: [
      'Эмоциональное выгорание',
      'Нет личного пространства',
      'Сложно сказать "нет"'
    ],
    recommendation: 'Попробуй установить базовые правила и практикуйся говорить "нет" в маленьких ситуациях.',
    icon: <Users className="w-6 h-6" />,
    color: 'from-red-400 to-red-600'
  },
  {
    id: 'fortress-house',
    title: 'Крепость',
    description: 'Ты никого не впускаешь. Твои границы слишком жёсткие и высокие.',
    characteristics: [
      'Ты изолируешь себя ото всех',
      'Боишься близости',
      'Сложно заводить друзей',
      'Одиночество становится нормой'
    ],
    pros: ['Безопасность', 'Полный контроль'],
    cons: [
      'Одиночество',
      'Нет близких отношений',
      'Сложно просить помощь'
    ],
    recommendation: 'Начни с одного доверенного человека. Постепенно открывайся, проверяя границы.',
    icon: <LockSimple className="w-6 h-6" />,
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'home-with-door',
    title: 'Дом с дверью',
    description: 'У тебя есть выбор. Ты решаешь, кого впускать и когда.',
    characteristics: [
      'Ты умеешь говорить "нет"',
      'Знаешь, когда нужен отдых',
      'Просишь помощи, когда нужно',
      'Чувствуешь баланс'
    ],
    pros: [
      'Здоровые отношения',
      'Эмоциональное здоровье',
      'Личное пространство + близость'
    ],
    cons: ['Требует практики', 'Нужно учиться'],
    recommendation: 'Это идеальный тип! Продолжай практиковать и быть гибким.',
    icon: <DoorOpen className="w-6 h-6" />,
    color: 'from-green-400 to-green-600'
  }
]

interface HouseMetaphorDiagramProps {
  onTypeSelect?: (typeId: string) => void
}

export default function HouseMetaphorDiagram({ onTypeSelect }: HouseMetaphorDiagramProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleTypeClick = (typeId: string) => {
    setSelectedType(typeId)
    setShowDetails(true)
    onTypeSelect?.(typeId)
  }

  const selectedInfo = houseTypes.find(h => h.id === selectedType)

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Какие у тебя границы?
        </h3>
        <p className="text-sm text-gray-600">
          Представь свой дом. Какая у него дверь?
        </p>
      </div>

      {/* Три типа домов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {houseTypes.map((house, index) => {
          const isSelected = selectedType === house.id

          return (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card
                className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-2 border-blue-500 shadow-lg scale-105'
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleTypeClick(house.id)}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-br ${house.color} p-6 text-white relative overflow-hidden`}>
                  {/* Задний фон — SVG домик */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Домик простой */}
                      <path
                        d="M 50 80 L 100 30 L 150 80 L 150 120 L 50 120 Z"
                        fill="white"
                        opacity="0.3"
                      />
                      {house.id === 'open-house' && (
                        <rect x="90" y="80" width="20" height="30" fill="none" stroke="white" strokeWidth="2" />
                      )}
                      {house.id === 'fortress-house' && (
                        <rect x="90" y="80" width="20" height="30" fill="white" opacity="0.8" />
                      )}
                      {house.id === 'home-with-door' && (
                        <>
                          <rect x="90" y="80" width="20" height="30" fill="none" stroke="white" strokeWidth="2" />
                          <circle cx="95" cy="95" r="2" fill="white" />
                          <line x1="100" y1="80" x2="100" y2="110" stroke="white" strokeWidth="2" />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Иконка и название */}
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      {house.icon}
                    </div>
                    <h4 className="text-lg font-bold text-center">{house.title}</h4>
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 text-center min-h-[60px]">
                    {house.description}
                  </p>

                  {/* Badge "Это про меня" */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3"
                    >
                      <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full text-center">
                        ✓ Это про меня
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Детальная информация */}
      <AnimatePresence>
        {showDetails && selectedInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-br ${selectedInfo.color} text-white rounded-full p-3`}>
                    {selectedInfo.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedInfo.title}</h4>
                    <p className="text-sm text-gray-600">{selectedInfo.description}</p>
                  </div>
                </div>

                {/* Характеристики */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">🔍 Признаки:</h5>
                  <div className="space-y-1">
                    {selectedInfo.characteristics.map((char, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-gray-400">•</span>
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Плюсы и минусы */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-semibold text-green-700 mb-2">✅ Плюсы:</h5>
                    <div className="space-y-1">
                      {selectedInfo.pros.map((pro, idx) => (
                        <div key={idx} className="text-xs text-gray-700">• {pro}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-red-700 mb-2">⚠️ Минусы:</h5>
                    <div className="space-y-1">
                      {selectedInfo.cons.map((con, idx) => (
                        <div key={idx} className="text-xs text-gray-700">• {con}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Рекомендация */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-semibold text-blue-900 mb-1">
                        💡 Что делать?
                      </h5>
                      <p className="text-sm text-gray-800">{selectedInfo.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Кнопка закрытия */}
                <button
                  onClick={() => {
                    setShowDetails(false)
                    setSelectedType(null)
                  }}
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
      {!selectedType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            👆 Выбери дом, который больше похож на твои границы
          </p>
        </motion.div>
      )}
    </div>
  )
}

