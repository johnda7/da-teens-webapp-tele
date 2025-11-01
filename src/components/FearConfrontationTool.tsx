/**
 * Fear Confrontation Tool - Интерактивный инструмент для работы со страхами
 * Для Урока 3: "Почему так сложно сказать нет?"
 * Философия: Jobs Simplicity + iOS 26 Liquid Glass
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Warning, CheckCircle, Sparkle } from '@phosphor-icons/react'

interface FearConfrontationToolProps {
  activity?: any
  onComplete?: (data: any) => void
}

export default function FearConfrontationTool({ activity, onComplete }: FearConfrontationToolProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFear, setSelectedFear] = useState('')
  const [customFear, setCustomFear] = useState('')
  const [situation, setSituation] = useState('')
  const [worstCase, setWorstCase] = useState('')
  const [probability, setProbability] = useState(5)
  const [coping, setCoping] = useState('')
  const [reframe, setReframe] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const fears = [
    'Меня отвергнут',
    'Покажусь эгоистом',
    'Обижу другого',
    'Придется объясняться',
    'Будет конфликт'
  ]

  const realityChecks = [
    { id: 1, question: 'Насколько вероятно, что это действительно произошло бы?', type: 'slider' },
    { id: 2, question: 'Если бы это произошло, как бы ты справился?', type: 'textarea' },
    { id: 3, question: 'Что хуже: краткий дискомфорт или долгое молчание о своих границах?', type: 'choice' }
  ]

  const fearReframes = {
    'Меня отвергнут': 'Я узнаю, кто меня уважает',
    'Покажусь эгоистом': 'Я забочусь о себе, чтобы помочь другим',
    'Обижу другого': 'Я несу ответственность только за свои эмоции',
    'Придется объясняться': 'Я могу просто сказать "нет"',
    'Будет конфликт': 'Краткий дискомфорт лучше долгого выгорания'
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsComplete(true)
      onComplete?.({
        fear: selectedFear || customFear,
        situation,
        worstCase,
        probability,
        coping,
        reframe
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getSelectedFearText = () => selectedFear || customFear

  return (
    <div className="space-y-3">
      {/* Progress - compact */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">
            Шаг {currentStep + 1} из 5
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(((currentStep + 1) / 5) * 100)}%
          </span>
        </div>
        <Progress value={((currentStep + 1) / 5) * 100} />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Выбор страха */}
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="text-center mb-3">
                <Warning size={36} className="mx-auto mb-2 text-orange-600" weight="duotone" />
                <h3 className="font-semibold text-sm mb-1">Какой твой главный страх?</h3>
                <p className="text-xs text-gray-600">Когда думаешь сказать "нет"</p>
              </div>
              
              <div className="space-y-1.5">
                {fears.map(fear => (
                  <motion.button
                    key={fear}
                    onClick={() => setSelectedFear(fear)}
                    className={`w-full p-2 rounded-lg text-xs font-medium transition-all text-left ${
                      selectedFear === fear
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedFear === fear && '✓ '}{fear}
                  </motion.button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedFear('Другое')}
                  className={`w-full text-xs py-1.5 h-auto ${selectedFear === 'Другое' ? 'border-orange-600 bg-orange-50' : ''}`}
                >
                  {selectedFear === 'Другое' ? '✓ Другое' : 'Другое'}
                </Button>
                
                {selectedFear === 'Другое' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <input
                      type="text"
                      value={customFear}
                      onChange={e => setCustomFear(e.target.value)}
                      placeholder="Опиши свой страх"
                      className="w-full p-2 border-2 border-orange-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Ситуация */}
        {currentStep === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-sm mb-2">Вспомни ситуацию</h3>
              <p className="text-xs text-gray-600 mb-2">
                Когда ты хотел(а) сказать "нет", но не смог(ла)
              </p>
              <textarea
                value={situation}
                onChange={e => setSituation(e.target.value)}
                placeholder="Опиши ситуацию..."
                className="w-full h-20 p-2 border-2 border-blue-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Card>
          </motion.div>
        )}

        {/* Step 3: Худший сценарий */}
        {currentStep === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold text-sm mb-2">Что самого страшного?</h3>
              <p className="text-xs text-gray-600 mb-2">
                Могло произойти, если бы ты сказал(а) "нет"
              </p>
              <textarea
                value={worstCase}
                onChange={e => setWorstCase(e.target.value)}
                placeholder="Что могло случиться?"
                className="w-full h-20 p-2 border-2 border-purple-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </Card>
          </motion.div>
        )}

        {/* Step 4: Реальность */}
        {currentStep === 3 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkle size={16} className="text-green-600" weight="duotone" />
                А теперь реальность
              </h3>
              
              {/* Вероятность */}
              <div className="mb-3">
                <p className="text-xs text-gray-700 mb-1.5">
                  Насколько вероятно? <span className="font-bold text-green-700">{probability}/10</span>
                </p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={probability}
                  onChange={e => setProbability(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>

              {/* Как бы справился */}
              <div className="mb-2">
                <p className="text-xs text-gray-700 mb-1.5">Как бы ты справился?</p>
                <textarea
                  value={coping}
                  onChange={e => setCoping(e.target.value)}
                  placeholder="Что бы ты сделал?"
                  className="w-full h-16 p-2 border-2 border-green-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Что хуже */}
              <div className="p-2 bg-green-100 rounded-lg">
                <p className="text-xs font-semibold text-green-900 mb-1.5">Что хуже?</p>
                <div className="space-y-1.5">
                  {['Краткий дискомфорт', 'Долгое молчание'].map(choice => (
                    <motion.button
                      key={choice}
                      onClick={() => {}}
                      className="w-full p-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-green-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {choice}
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Переформулировка */}
        {currentStep === 4 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkle size={16} className="text-indigo-600" weight="duotone" />
                Переформулируй страх
              </h3>
              
              <div className="mb-3 p-2 bg-indigo-100 rounded-lg">
                <p className="text-xs font-semibold text-indigo-900 mb-1">Пример:</p>
                <p className="text-xs text-indigo-800">
                  Было: "Меня отвергнут" → Стало: "Я узнаю, кто меня уважает"
                </p>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-700 mb-1">
                  Было: "{getSelectedFearText()}"
                </p>
                <p className="text-xs text-gray-600 mb-1">Стало:</p>
                <textarea
                  value={reframe}
                  onChange={e => setReframe(e.target.value)}
                  placeholder={fearReframes[selectedFear as keyof typeof fearReframes] || 'Как по-другому можно подумать?'}
                  className="w-full h-16 p-2 border-2 border-indigo-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Подсказка */}
              {reframe && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-indigo-100 rounded-lg"
                >
                  <p className="text-xs text-indigo-900">
                    💡 Теперь страх превращается в возможность!
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
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
          disabled={
            (currentStep === 0 && !selectedFear && !customFear) ||
            (currentStep === 1 && !situation) ||
            (currentStep === 2 && !worstCase)
          }
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-md py-1.5 h-auto"
        >
          {currentStep === 4 ? 'Завершить' : 'Далее'}
          {currentStep !== 4 && <ArrowRight size={14} className="ml-1" />}
        </Button>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CheckCircle size={48} className="mx-auto mb-3 text-green-600" weight="duotone" />
              <h3 className="text-lg font-bold mb-2">Ты справился! 🎉</h3>
              <p className="text-sm text-gray-700">
                Теперь ты видишь, что страх — это не приговор, а возможность расти!
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
