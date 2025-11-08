import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, ArrowLeft, ChatCircleText as MessageIcon, User, Sparkle } from '@phosphor-icons/react'

interface NPC {
  name: string
  messages: string[]
}

interface Scenario {
  id: string
  title: string
  context: string
  npc: NPC
  goodResponses: string[]
}

interface RoleplaySimulatorProps {
  scenarios: Scenario[]
  onComplete?: (data: any) => void
}

export default function RoleplaySimulator({ scenarios, onComplete }: RoleplaySimulatorProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [userResponse, setUserResponse] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const currentScenario = scenarios[currentScenarioIndex]
  const currentNPC = currentScenario.npc
  const currentMessage = currentNPC.messages[currentMessageIndex]
  const totalMessages = currentNPC.messages.length
  const totalScenarios = scenarios.length

  const handleResponse = () => {
    if (!userResponse.trim()) return

    // Простая проверка: ищем ключевые слова из goodResponses
    const isGood = currentScenario.goodResponses.some(response =>
      response.toLowerCase().includes(userResponse.toLowerCase()) ||
      userResponse.toLowerCase().includes('нет') ||
      userResponse.toLowerCase().includes('не могу') ||
      userResponse.toLowerCase().includes('не хочу')
    )

    if (isGood) {
      setCorrectAnswers(prev => prev + 1)
    }

    setShowFeedback(true)
  }

  const handleNextMessage = () => {
    if (currentMessageIndex < totalMessages - 1) {
      setCurrentMessageIndex(prev => prev + 1)
      setShowFeedback(false)
      setUserResponse('')
    } else {
      // Следующий сценарий
      if (currentScenarioIndex < totalScenarios - 1) {
        setCurrentScenarioIndex(prev => prev + 1)
        setCurrentMessageIndex(0)
        setShowFeedback(false)
        setUserResponse('')
      } else {
        // Завершено
        onComplete?.({
          scenariosCompleted: totalScenarios,
          correctAnswers
        })
      }
    }
  }

  const isGoodResponse = userResponse && showFeedback && (
    currentScenario.goodResponses.some(response =>
      response.toLowerCase().includes(userResponse.toLowerCase()) ||
      userResponse.toLowerCase().includes('нет') ||
      userResponse.toLowerCase().includes('не могу') ||
      userResponse.toLowerCase().includes('не хочу')
    )
  )

  return (
    <div className="space-y-2">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Сценарий {currentScenarioIndex + 1} из {totalScenarios}
        </span>
        <Badge variant={correctAnswers > 0 ? 'default' : 'secondary'} className="text-xs py-0">
          Правильных: {correctAnswers}
        </Badge>
      </div>

      {/* Context */}
      <Card className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="font-semibold text-xs mb-1 flex items-center gap-2">
          <MessageIcon size={14} className="text-blue-600" weight="duotone" />
          {currentScenario.title}
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed">{currentScenario.context}</p>
      </Card>

      {/* NPC Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentScenarioIndex}-${currentMessageIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex gap-2"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <User size={16} className="text-white" weight="fill" />
            </div>
          </div>
          <Card className="flex-1 p-3 bg-white border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xs text-purple-700">{currentNPC.name}</span>
              <span className="text-xs text-gray-500">
                сообщение {currentMessageIndex + 1}/{totalMessages}
              </span>
            </div>
            <p className="text-xs text-gray-800">{currentMessage}</p>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* User Response Input */}
      {!showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <label className="block text-xs font-semibold text-green-900 mb-2">
              Твой ответ:
            </label>
            <textarea
              value={userResponse}
              onChange={e => setUserResponse(e.target.value)}
              placeholder="Напиши свой ответ..."
              className="w-full h-20 p-2 border-2 border-green-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={handleResponse}
              disabled={!userResponse.trim()}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-md"
            >
              Отправить
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className={`p-3 border-2 ${
              isGoodResponse
                ? 'bg-green-50 border-green-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {isGoodResponse ? (
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
                ) : (
                  <Sparkle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" weight="duotone" />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold text-xs mb-1 ${
                    isGoodResponse ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    {isGoodResponse ? 'Отлично! 👍' : 'Можно лучше 💪'}
                  </h4>
                  <p className={`text-xs ${
                    isGoodResponse ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {isGoodResponse
                      ? 'Ты правильно защитил свои границы!'
                      : 'Попробуй быть более прямолинейным: скажи "нет" или "не могу" четко и без извинений.'}
                  </p>
                  {!isGoodResponse && currentScenario.goodResponses.length > 0 && (
                    <div className="mt-2 p-2 bg-white/70 rounded text-xs text-gray-700">
                      💡 Пример правильного ответа:
                      <br />
                      "{currentScenario.goodResponses[0]}"
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleNextMessage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
              >
                {currentMessageIndex < totalMessages - 1 ? 'Следующее сообщение' : 'Следующий сценарий'}
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {currentScenarioIndex === totalScenarios - 1 && currentMessageIndex === totalMessages - 1 && showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto mb-2 text-indigo-600" weight="duotone" />
              <h3 className="text-lg font-bold mb-2">Отличная работа! 🎉</h3>
              <p className="text-sm text-gray-700 mb-3">
                Ты завершил все сценарии!
              </p>
              <div className="text-xs text-gray-600">
                Правильных ответов: <span className="font-bold text-indigo-700">{correctAnswers}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
