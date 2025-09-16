import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Timer, Play, Pause, ArrowCounterClockwise, CheckCircle } from '@phosphor-icons/react'
import { breathingPractices, quickPractices } from '@/data/practicesData'

interface PracticePlayerProps {
  practiceId?: string
  onComplete?: () => void
}

export default function PracticePlayer({ practiceId, onComplete }: PracticePlayerProps) {
  const [selectedPractice, setSelectedPractice] = useState<string | null>(practiceId || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const practice = breathingPractices.find(p => p.id === selectedPractice)
  const quickPractice = quickPractices.find(p => p.id === selectedPractice)

  const startTimer = (duration: number) => {
    setTimeLeft(duration)
    setIsPlaying(true)
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete?.()
  }

  const resetPractice = () => {
    setCurrentStep(0)
    setTimeLeft(0)
    setIsPlaying(false)
    setIsCompleted(false)
  }

  if (!selectedPractice) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Дыхательные практики</h2>
          <div className="grid gap-4">
            {breathingPractices.map(practice => (
              <Card 
                key={practice.id} 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedPractice(practice.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{practice.title}</CardTitle>
                      <CardDescription className="mt-1">{practice.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{practice.duration}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {practice.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Быстрые практики</h2>
          <div className="grid gap-3">
            {quickPractices.map(practice => (
              <Card 
                key={practice.id} 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedPractice(practice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{practice.instruction}</p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {practice.duration}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (quickPractice) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {quickPractice.title}
              </CardTitle>
              <CardDescription>Быстрая практика • {quickPractice.duration}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPractice(null)}>
              ← Назад
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <p className="text-lg leading-relaxed">{quickPractice.instruction}</p>
          </div>
          
          {isCompleted ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg font-medium">Отлично! Практика завершена</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetPractice} variant="outline">
                  <ArrowCounterClockwise className="w-4 h-4 mr-2" />
                  Повторить
                </Button>
                <Button onClick={() => setSelectedPractice(null)}>
                  Выбрать другую практику
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              {timeLeft > 0 ? (
                <div className="space-y-3">
                  <div className="text-4xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      const duration = parseInt(quickPractice.duration) * 60 || 60
                      startTimer(duration)
                    }}
                    size="lg"
                    className="px-8"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Начать практику
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Или просто следуй инструкции без таймера
                  </div>
                </div>
              )}
              
              <Button onClick={handleComplete} variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Завершить практику
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!practice) return null

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              {practice.title}
            </CardTitle>
            <CardDescription>{practice.description} • {practice.duration}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedPractice(null)}>
            ← Назад
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {practice.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isCompleted ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-lg font-medium">Отлично! Практика завершена</p>
            <p className="text-muted-foreground">
              Как ты себя чувствуешь? Заметил ли изменения в своем состоянии?
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetPractice} variant="outline">
                <ArrowCounterClockwise className="w-4 h-4 mr-2" />
                Повторить
              </Button>
              <Button onClick={() => setSelectedPractice(null)}>
                Выбрать другую практику
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold mb-3">Инструкция:</h3>
              <ol className="space-y-2">
                {practice.instructions.map((step, index) => (
                  <li 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      currentStep === index ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'
                    }`}
                  >
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Полезные советы:</h3>
              <ul className="space-y-2">
                {practice.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {currentStep < practice.instructions.length && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{currentStep + 1} из {practice.instructions.length}</span>
                  </div>
                  <Progress value={(currentStep / practice.instructions.length) * 100} />
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {currentStep > 0 && (
                  <Button 
                    onClick={() => setCurrentStep(prev => prev - 1)} 
                    variant="outline"
                  >
                    Предыдущий шаг
                  </Button>
                )}
                
                {currentStep < practice.instructions.length - 1 ? (
                  <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                    Следующий шаг
                  </Button>
                ) : (
                  <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Завершить практику
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}