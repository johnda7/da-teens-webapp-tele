// Микро-обучение в стиле Google Learn Your Way
// Короткие, усваиваемые кусочки контента

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Lightbulb, ArrowRight, Star } from '@phosphor-icons/react'

interface MicroLearningStep {
  id: string
  title: string
  content: string
  keyTakeaway: string
  example?: string
  quickTip?: string
  reflection?: string
}

interface MicroLearningCardProps {
  steps: MicroLearningStep[]
  onComplete: () => void
  lessonTitle: string
}

export default function MicroLearningCard({
  steps,
  onComplete,
  lessonTitle
}: MicroLearningCardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showReflection, setShowReflection] = useState(false)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    setShowReflection(false)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowReflection(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <span className="font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step indicator dots */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (completedSteps.has(index) || index <= currentStep) {
                setCurrentStep(index)
                setShowReflection(false)
              }
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentStep
                ? 'bg-primary scale-125'
                : completedSteps.has(index)
                ? 'bg-green-500'
                : index < currentStep
                ? 'bg-blue-300'
                : 'bg-gray-300'
            }`}
            disabled={!completedSteps.has(index) && index > currentStep}
          />
        ))}
      </div>

      {/* Main content card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {lessonTitle}
              </Badge>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </div>
            {completedSteps.has(currentStep) && (
              <CheckCircle className="w-6 h-6 text-green-500" weight="fill" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {step.content}
            </p>
          </div>

          {/* Example */}
          {step.example && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" weight="fill" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Пример</p>
                  <p className="text-sm text-blue-800">{step.example}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick tip */}
          {step.quickTip && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" weight="fill" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Лайфхак</p>
                  <p className="text-sm text-amber-800">{step.quickTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key takeaway */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <p className="font-semibold text-purple-900 mb-1">Главное</p>
                <p className="text-sm text-purple-800">{step.keyTakeaway}</p>
              </div>
            </div>
          </div>

          {/* Reflection */}
          {step.reflection && !showReflection && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowReflection(true)}
            >
              💭 Подумай об этом
            </Button>
          )}

          {step.reflection && showReflection && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 animate-in fade-in duration-300">
              <p className="font-semibold text-indigo-900 mb-2">Вопрос для размышления:</p>
              <p className="text-sm text-indigo-800 mb-3">{step.reflection}</p>
              <textarea
                className="w-full p-3 border border-indigo-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Напиши свои мысли здесь..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex-1"
        >
          ← Назад
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {currentStep === steps.length - 1 ? (
            <>Завершить <CheckCircle className="w-4 h-4 ml-2" /></>
          ) : (
            <>Далее <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  )
}
