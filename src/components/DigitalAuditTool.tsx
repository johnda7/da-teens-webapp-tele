import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { CheckCircle, DeviceMobile, Clock, Users, AlertTriangle, Sparkle } from '@phosphor-icons/react'

interface DigitalAuditToolProps {
  onComplete?: (data: any) => void
}

export default function DigitalAuditTool({ onComplete }: DigitalAuditToolProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [screenTime, setScreenTime] = useState(0)
  const [feelingsAfter, setFeelingsAfter] = useState<string[]>([])
  const [privacyScore, setPrivacyScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const steps = [
    'Время в телефоне',
    'Эмоции после соцсетей',
    'Приватность',
    'Результат'
  ]

  const feelings = [
    'Устал 😴',
    'Тревожно 😰',
    'Скучно 😐',
    'Хорошо 😊',
    'Подавлен 😔',
    'Мотивирован 💪',
    'Сравниваю себя 👀'
  ]

  const privacyQuestions = [
    'Кто может видеть твои фото и посты?',
    'Кто знает твой телефон или адрес?',
    'Есть ли у тебя пароли на всех аккаунтах?',
    'Проверяешь ли ты, что публикуешь другие?'
  ]

  const getRecommendations = () => {
    let recommendations: string[] = []

    if (screenTime > 5) {
      recommendations.push('📱 Используй функции "Экранное время" на телефоне')
      recommendations.push('⏰ Установи лимит 2 часа в день на соцсети')
    }

    const negativeFeelings = feelingsAfter.filter(f =>
      f.includes('Тревожно') || f.includes('Подавлен') || f.includes('Устал')
    )

    if (negativeFeelings.length >= 2) {
      recommendations.push('🔕 Отпишись от аккаунтов, вызывающих негатив')
      recommendations.push('💤 Не заходи в соцсети за час до сна')
    }

    if (privacyScore < 6) {
      recommendations.push('🔒 Закрой профиль, если тебе нужна приватность')
      recommendations.push('📝 Проверь настройки приватности аккаунтов')
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Ты уже хорошо управляешь своим цифровым пространством!')
    }

    return recommendations
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      const result = {
        screenTime,
        feelingsAfter,
        privacyScore,
        recommendations: getRecommendations()
      }
      setShowResult(true)
      onComplete?.(result)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const toggleFeeling = (feeling: string) => {
    setFeelingsAfter(prev =>
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    )
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: return screenTime === 0
      case 1: return feelingsAfter.length === 0
      case 2: return privacyScore === 0
      default: return false
    }
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium">
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <span className="text-gray-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start gap-3 mb-3">
                <DeviceMobile size={20} className="text-blue-600 flex-shrink-0 mt-0.5" weight="duotone" />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Сколько часов в день ты в телефоне?</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Примерно, включая игры, соцсети, сообщения
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  max="24"
                  value={screenTime || ''}
                  onChange={e => setScreenTime(Number(e.target.value))}
                  className="text-center text-lg font-bold w-20"
                />
                <span className="text-xs text-gray-600">часов</span>
              </div>
              {screenTime > 0 && (
                <div className="mt-3 p-2 bg-white/70 rounded-lg">
                  <p className="text-xs text-gray-700">
                    {screenTime > 5 ? (
                      <>⚠️ Это больше рекомендуемого (2-3 часа). Возможно стоит снизить.</>
                    ) : screenTime > 3 ? (
                      <>👍 Это в пределах нормы, но можно снизить.</>
                    ) : (
                      <>✅ Отличный баланс!</>
                    )}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start gap-3 mb-3">
                <Clock size={20} className="text-purple-600 flex-shrink-0 mt-0.5" weight="duotone" />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Как ты себя чувствуешь после листания ленты?</h4>
                  <p className="text-xs text-gray-600">
                    Выбери все, что подходит
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {feelings.map(feeling => {
                  const isSelected = feelingsAfter.includes(feeling)
                  return (
                    <Button
                      key={feeling}
                      onClick={() => toggleFeeling(feeling)}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`text-xs ${isSelected ? 'bg-purple-600' : ''}`}
                    >
                      {feeling}
                    </Button>
                  )
                })}
              </div>
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
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-3 mb-3">
                <Users size={20} className="text-green-600 flex-shrink-0 mt-0.5" weight="duotone" />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Приватность</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Оцени от 0 до 10, насколько ты защищаешь свою приватность
                  </p>
                </div>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={privacyScore || 5}
                  onChange={e => setPrivacyScore(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0 - Открыто</span>
                  <span className="font-bold text-green-700">{privacyScore || 5}/10</span>
                  <span>10 - Закрыто</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!showResult && (
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 text-xs py-1.5 h-auto"
          >
            <ArrowLeft size={14} className="mr-1" />
            Назад
          </Button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md py-1.5 h-auto"
          >
            Далее
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <div className="text-center mb-4">
              <Sparkle size={48} className="mx-auto mb-2 text-indigo-600" weight="duotone" />
              <h3 className="text-lg font-bold mb-2">Твой цифровой аудит готов! 📊</h3>
              <p className="text-sm text-gray-700">
                Вот что мы нашли:
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DeviceMobile size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">Экранное время:</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{screenTime} часов/день</span>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-purple-600" />
                  <span className="text-xs font-semibold text-purple-900">Эмоции после соцсетей:</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {feelingsAfter.map(feeling => (
                    <span key={feeling} className="text-xs px-2 py-0.5 bg-white rounded-full">
                      {feeling}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-900">Приватность:</span>
                  <span className="text-sm font-bold text-green-700 ml-auto">{privacyScore}/10</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-indigo-600" />
                Рекомендации:
              </h4>
              <ul className="space-y-1">
                {getRecommendations().map((rec, idx) => (
                  <li key={idx} className="text-xs text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}






