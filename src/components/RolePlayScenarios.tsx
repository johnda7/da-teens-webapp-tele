import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Scenario {
  id: string
  title: string
  description: string
  context: string
  character: {
    name: string
    avatar: string
    role: string
  }
  choices: Choice[]
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Choice {
  id: string
  text: string
  score: number // 0-10
  feedback: string
  type: 'confident' | 'soft' | 'aggressive' | 'avoidant'
}

// Mock data for demonstration
const scenarios: Scenario[] = [
  {
    id: 'friend-schoo-l-help',
    title: 'Друг просит списать',
    description: 'На контрольной лучший друг просит дать списать ответы',
    context: 'Урок идёт, контрольная по математике. У тебя ответы готовы.',
    character: {
      name: 'Макс',
      avatar: '👦',
      role: 'Лучший друг'
    },
    difficulty: 'easy',
    choices: [
      {
        id: 'a',
        text: 'Конечно, держи!',
        score: 2,
        feedback: 'Дружба важна, но это может создать проблемы для тебя и Макса. Можно помочь по-другому.',
        type: 'avoidant'
      },
      {
        id: 'b',
        text: 'Нет, извини, не могу. После уроков помогу разобрать.',
        score: 9,
        feedback: 'Отлично! Ты твёрд, но предложил альтернативу. Это лучший вариант!',
        type: 'confident'
      },
      {
        id: 'c',
        text: 'Эм... не сейчас, ок?',
        score: 5,
        feedback: 'Ты сказал нет, но звучишь неуверенно. Проблема останется. Попробуй быть твёрже.',
        type: 'soft'
      },
      {
        id: 'd',
        text: 'Сам решай свои проблемы!',
        score: 4,
        feedback: 'Ты защитил границу, но слишком агрессивно. Дружбу можно сохранить мягче.',
        type: 'aggressive'
      }
    ]
  },
  {
    id: 'parent-phone-check',
    title: 'Родители хотят проверить телефон',
    description: 'Мама настаивает посмотреть твою переписку',
    context: 'Дома, после школы. Мама подозревает что-то не так.',
    character: {
      name: 'Мама',
      avatar: '👩',
      role: 'Родитель'
    },
    difficulty: 'medium',
    choices: [
      {
        id: 'a',
        text: 'Окей, только не читай переписки с друзьями.',
        score: 5,
        feedback: 'Компромисс возможен, но важно объяснить что переписка - твоя приватность.',
        type: 'soft'
      },
      {
        id: 'b',
        text: 'Нет, моя переписка личная. Давай поговорим о твоих переживаниях.',
        score: 8,
        feedback: 'Отлично! Ты защитил границу и предложил конструктивный диалог.',
        type: 'confident'
      },
      {
        id: 'c',
        text: 'Никогда! Прячься и блокируй.',
        score: 3,
        feedback: 'Понимаю защиту приватности, но это создаст больше конфликтов. Лучше говорить.',
        type: 'aggressive'
      },
      {
        id: 'd',
        text: 'Берёт и даёт телефон сам.',
        score: 1,
        feedback: 'Твои границы нарушены. Это нормально чувствовать дискомфорт. Нужна стратегия защиты.',
        type: 'avoidant'
      }
    ]
  },
  {
    id: 'peer-pressure-party',
    title: 'Peer Pressure на вечеринке',
    description: 'Все пьют алкоголь, тебя тоже заставляют',
    context: 'День рождения друга. Все твои знакомые пьют.',
    character: {
      name: 'Группа друзей',
      avatar: '👥',
      role: 'Одноклассники'
    },
    difficulty: 'hard',
    choices: [
      {
        id: 'a',
        text: 'Нет, спасибо. У меня тренировка завтра.',
        score: 10,
        feedback: 'ИДЕАЛЬНО! Конкретная причина, вежливо, твёрдо. Твои границы защищены! 🏆',
        type: 'confident'
      },
      {
        id: 'b',
        text: 'Эм... давайте я немного...',
        score: 3,
        feedback: 'Ты сдаёшься под давлением. Помни: "Нет" - это целое предложение.',
        type: 'avoidant'
      },
      {
        id: 'c',
        text: 'Не приставайте ко мне!',
        score: 6,
        feedback: 'Защитил границу, но агрессивно. Можно твёрдо, но спокойнее.',
        type: 'aggressive'
      },
      {
        id: 'd',
        text: 'Хорошо, один раз можно.',
        score: 1,
        feedback: 'Твоя граница нарушена. Важно научиться выдерживать давление.',
        type: 'avoidant'
      }
    ]
  }
]

export default function RolePlayScenarios() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([])

  const currentScenario = scenarios[currentScenarioIndex]
  const selectedChoiceData = currentScenario.choices.find(c => c.id === selectedChoice)
  const isCompleted = completedScenarios.includes(currentScenario.id)

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (selectedChoice) {
      const choiceData = currentScenario.choices.find(c => c.id === selectedChoice)
      setScore(prev => prev + (choiceData?.score || 0))
      setCompletedScenarios(prev => [...prev, currentScenario.id])
      setShowFeedback(false)
      setSelectedChoice(null)
      
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1)
      } else {
        // All scenarios completed
        setCurrentScenarioIndex(0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(prev => prev - 1)
      setShowFeedback(false)
      setSelectedChoice(null)
    }
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200'
  }

  const typeIcons = {
    confident: '✅',
    soft: '😊',
    aggressive: '😤',
    avoidant: '😓'
  }

  const progress = Math.round((completedScenarios.length / scenarios.length) * 100)

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-600 font-medium">
            Сценарий {currentScenarioIndex + 1} из {scenarios.length}
          </span>
          <span className="text-[10px] font-bold text-purple-600">
            {score} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Scenario Card */}
      <Card className="glass rounded-xl p-3 border border-white/40 mb-2">
        {/* Scenario Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2">
            <div className="text-3xl">{currentScenario.character.avatar}</div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-gray-900">{currentScenario.title}</h3>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              </div>
              <p className="text-[10px] text-gray-600 mb-1">{currentScenario.description}</p>
              <Badge className={`text-[9px] px-1.5 py-0 h-4 ${difficultyColors[currentScenario.difficulty]}`}>
                {currentScenario.difficulty === 'easy' ? 'Легко' : 
                 currentScenario.difficulty === 'medium' ? 'Средне' : 'Сложно'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="bg-purple-50/50 rounded-lg p-2 mb-3 border border-purple-100">
          <p className="text-xs text-gray-700 leading-relaxed">{currentScenario.context}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {currentScenario.choices.map((choice, idx) => (
            <motion.button
              key={choice.id}
              onClick={() => !showFeedback && handleChoiceSelect(choice.id)}
              disabled={showFeedback}
              className={`w-full text-left p-2 rounded-lg border-2 transition-all ${
                selectedChoice === choice.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
              } ${showFeedback ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              whileTap={!showFeedback ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-xs text-gray-800 leading-relaxed">{choice.text}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && selectedChoiceData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 p-3 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50"
            >
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{typeIcons[selectedChoiceData.type]}</span>
                    <span className="text-xs font-bold text-purple-700">
                      {selectedChoiceData.type === 'confident' ? 'Уверенно' :
                       selectedChoiceData.type === 'soft' ? 'Мягко' :
                       selectedChoiceData.type === 'aggressive' ? 'Агрессивно' : 'Избегание'}
                    </span>
                    {selectedChoiceData.score >= 8 && (
                      <span className="text-lg">🏆</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedChoiceData.feedback}
                  </p>
                  {selectedChoiceData.score >= 8 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-700">
                        +{selectedChoiceData.score} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentScenarioIndex === 0}
            className="h-6 text-xs"
          >
            ← Назад
          </Button>
          
          <span className="text-[10px] text-gray-500">
            {currentScenarioIndex + 1} / {scenarios.length}
          </span>

          {showFeedback && (
            <Button
              onClick={handleNext}
              size="sm"
              className="h-6 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Далее <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </Card>

      {/* Completion Message */}
      {completedScenarios.length === scenarios.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h4 className="text-sm font-bold text-green-800">Все сценарии пройдены!</h4>
          </div>
          <p className="text-xs text-green-700 mb-2">
            Отличная работа! Ты освоил основы защиты границ в разных ситуациях.
          </p>
          <Button
            onClick={() => {
              setCurrentScenarioIndex(0)
              setCompletedScenarios([])
              setScore(0)
              setShowFeedback(false)
              setSelectedChoice(null)
            }}
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs border-green-300 text-green-700 hover:bg-green-100"
          >
            Пройти снова
          </Button>
        </motion.div>
      )}
    </div>
  )
}



