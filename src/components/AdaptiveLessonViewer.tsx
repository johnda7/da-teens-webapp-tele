// Компонент адаптивного урока с учетом эмоционального состояния
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Heart, 
  Clock, 
  BookOpen, 
  Headphones, 
  Video,
  Sparkle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Users,
  Target,
  Path
} from '@phosphor-icons/react'
import type { Lesson, LessonFormat } from '@/data/boundariesModule'
import type { LessonRecommendation } from '@/lib/adaptiveLearning'
import MicroLearningCard from './MicroLearningCard'
import RealWorldScenario, { exampleScenarios } from './RealWorldScenario'
import PeerLearningFeed, { examplePeerStories } from './PeerLearningFeed'
import SkillsTracker, { boundariesSkills, type Skill } from './SkillsTracker'

interface AdaptiveLessonViewerProps {
  recommendation: LessonRecommendation
  onComplete: (score: number) => void
  onSkip: () => void
}

export default function AdaptiveLessonViewer({
  recommendation,
  onComplete,
  onSkip
}: AdaptiveLessonViewerProps) {
  const { lesson, reason, emotionalFit, adaptations } = recommendation
  const [currentFormat, setCurrentFormat] = useState<keyof Lesson['formats']>('text')
  const [progress, setProgress] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [viewMode, setViewMode] = useState<'lesson' | 'quiz' | 'practice' | 'scenarios' | 'peer-learning' | 'skills' | 'completed'>('lesson')
  const [userSkills, setUserSkills] = useState<Skill[]>(boundariesSkills)

  // Доступные форматы для этого урока
  const availableFormats = Object.keys(lesson.formats).filter(
    key => lesson.formats[key as keyof Lesson['formats']]
  ) as (keyof Lesson['formats'])[]

  // Иконки для форматов
  const formatIcons = {
    text: <BookOpen size={20} />,
    video: <Video size={20} />,
    audio: <Headphones size={20} />,
    interactive: <Sparkle size={20} />,
    mindmap: <Brain size={20} />
  }

  const formatLabels = {
    text: 'Текст',
    video: 'Видео',
    audio: 'Аудио',
    interactive: 'Интерактив',
    mindmap: 'Карта'
  }

  // Цвета для emotionalFit
  const fitColors = {
    perfect: 'bg-green-50 border-green-200 text-green-700',
    good: 'bg-blue-50 border-blue-200 text-blue-700',
    okay: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    challenging: 'bg-orange-50 border-orange-200 text-orange-700'
  }

  const fitLabels = {
    perfect: 'Идеально подходит',
    good: 'Хорошо подходит',
    okay: 'Нормально',
    challenging: 'Может быть вызовом'
  }

  useEffect(() => {
    // Авто-выбор оптимального формата на основе адаптаций
    if (adaptations.includes('Предложить аудио-формат') && lesson.formats.audio) {
      setCurrentFormat('audio')
    } else if (adaptations.includes('Предложить формат "слушай и отдыхай"') && lesson.formats.audio) {
      setCurrentFormat('audio')
    }
  }, [adaptations, lesson.formats])

  const handleLessonComplete = () => {
    setViewMode('quiz')
    setProgress(50)
  }

  const handleQuizAnswer = (questionId: string, answer: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleQuizSubmit = () => {
    // Подсчет результата
    let correct = 0
    lesson.quiz.forEach(question => {
      const userAnswer = selectedAnswers[question.id]
      if (Array.isArray(question.correctAnswer)) {
        // Multiple choice
        if (Array.isArray(userAnswer) && 
            question.correctAnswer.length === userAnswer.length &&
            question.correctAnswer.every(ans => userAnswer.includes(ans))) {
          correct++
        }
      } else {
        // Single choice
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })
    
    const score = Math.round((correct / lesson.quiz.length) * 100)
    setQuizScore(score)
    setShowExplanation(true)
  }

  const handleMoveToNextQuestion = () => {
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      setViewMode('practice')
      setProgress(75)
    }
  }

  const handlePracticeComplete = () => {
    setViewMode('completed')
    setProgress(100)
    onComplete(quizScore)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Прогресс */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Прогресс урока</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Заголовок урока */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <CardDescription className="text-base">{lesson.subtitle}</CardDescription>
            </div>
            <Badge variant="outline" className={fitColors[emotionalFit]}>
              {fitLabels[emotionalFit]}
            </Badge>
          </div>
          
          {/* Причина выбора */}
          <Alert className="mt-4 bg-purple-50 border-purple-200">
            <Heart className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-900">
              <strong>Почему этот урок:</strong> {reason}
            </AlertDescription>
          </Alert>

          {/* Адаптации */}
          {adaptations.length > 0 && (
            <Alert className="mt-2 bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Адаптировано для тебя:</strong>
                <ul className="mt-2 space-y-1">
                  {adaptations.map((adapt, idx) => (
                    <li key={idx} className="text-sm">• {adapt}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Цели обучения */}
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Ты научишься:</h4>
            <ul className="space-y-1">
              {lesson.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </CardHeader>
      </Card>

      {/* Основной контент */}
      {viewMode === 'lesson' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Выбери формат обучения</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>
                  ~{lesson.formats[currentFormat]?.estimatedTime || 5} мин
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Переключатель форматов */}
            <Tabs value={currentFormat} onValueChange={(val) => setCurrentFormat(val as any)}>
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableFormats.length}, 1fr)` }}>
                {availableFormats.map(format => (
                  <TabsTrigger key={format} value={format} className="flex items-center gap-2">
                    {formatIcons[format]}
                    <span className="hidden sm:inline">{formatLabels[format]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Контент форматов */}
              {availableFormats.map(format => (
                <TabsContent key={format} value={format} className="mt-6">
                  {format === 'text' && lesson.formats.text && (
                    <TextLessonContent content={lesson.formats.text.content} />
                  )}
                  {format === 'video' && lesson.formats.video && (
                    <VideoLessonContent content={lesson.formats.video.content} />
                  )}
                  {format === 'audio' && lesson.formats.audio && (
                    <AudioLessonContent content={lesson.formats.audio.content} />
                  )}
                  {format === 'interactive' && lesson.formats.interactive && (
                    <InteractiveLessonContent content={lesson.formats.interactive.content} />
                  )}
                  {format === 'mindmap' && lesson.formats.mindmap && (
                    <MindmapLessonContent content={lesson.formats.mindmap.content} />
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Дополнительные материалы */}
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                Дополнительно:
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('scenarios')}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <Path size={20} className="text-purple-600" weight="fill" />
                  <span className="text-xs">Сценарии</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('peer-learning')}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <Users size={20} className="text-blue-600" weight="fill" />
                  <span className="text-xs">Истории</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('skills')}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <Target size={20} className="text-green-600" weight="fill" />
                  <span className="text-xs">Навыки</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onSkip}>
                Пропустить урок
              </Button>
              <Button onClick={handleLessonComplete} className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Перейти к тесту <ArrowRight size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Квиз */}
      {viewMode === 'quiz' && (
        <QuizView
          quiz={lesson.quiz}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswers={selectedAnswers}
          showExplanation={showExplanation}
          onAnswer={handleQuizAnswer}
          onSubmit={handleQuizSubmit}
          onNext={handleMoveToNextQuestion}
        />
      )}

      {/* Практика */}
      {viewMode === 'practice' && (
        <PracticeView
          exercise={lesson.practiceExercise}
          onComplete={handlePracticeComplete}
        />
      )}

      {/* Реальные сценарии */}
      {viewMode === 'scenarios' && exampleScenarios.length > 0 && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setViewMode('lesson')}
            className="mb-2"
          >
            ← Вернуться к уроку
          </Button>
          <RealWorldScenario
            scenario={exampleScenarios[0]}
            onComplete={(choice) => {
              console.log('Scenario completed:', choice)
              setViewMode('lesson')
            }}
          />
        </div>
      )}

      {/* Истории ровесников */}
      {viewMode === 'peer-learning' && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setViewMode('lesson')}
            className="mb-2"
          >
            ← Вернуться к уроку
          </Button>
          <PeerLearningFeed
            stories={examplePeerStories}
            onShare={() => console.log('Share story')}
          />
        </div>
      )}

      {/* Отслеживание навыков */}
      {viewMode === 'skills' && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setViewMode('lesson')}
            className="mb-2"
          >
            ← Вернуться к уроку
          </Button>
          <SkillsTracker
            skills={userSkills}
            highlightedSkills={['saying-no', 'assertive-communication']}
          />
        </div>
      )}

      {/* Завершение */}
      {viewMode === 'completed' && (
        <CompletionView
          lesson={lesson}
          score={quizScore}
          onContinue={() => {/* Переход к следующему уроку */}}
        />
      )}
    </div>
  )
}

// ============================================
// Компоненты форматов
// ============================================

function TextLessonContent({ content }: { content: any }) {
  return (
    <div className="prose prose-sm max-w-none">
      {content.sections?.map((section: any, idx: number) => (
        <div key={idx} className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{section.heading}</h3>
          <div className="whitespace-pre-line text-gray-700">{section.body}</div>
        </div>
      ))}

      {content.examples && (
        <div className="mt-6 space-y-3">
          {content.examples.map((example: any, idx: number) => (
            <Card key={idx} className="p-4">
              <div className="font-medium mb-2">{example.title}</div>
              <div className="text-sm text-gray-600">{example.text}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function VideoLessonContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video size={48} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Видео загружается...</p>
          <p className="text-xs text-gray-400 mt-1">{content.url}</p>
        </div>
      </div>
      {content.transcript && (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Показать транскрипт</summary>
          <p className="mt-2 text-gray-600">{content.transcript}</p>
        </details>
      )}
    </div>
  )
}

function AudioLessonContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Headphones size={48} className="mx-auto mb-4 text-purple-600" />
          <h3 className="font-semibold mb-2">Аудио-урок</h3>
          <p className="text-sm text-gray-600 mb-4">Расслабься и просто слушай</p>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">{content.url}</div>
            <div className="h-2 bg-gray-200 rounded-full mb-2">
              <div className="h-2 bg-purple-500 rounded-full w-1/3"></div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm">Назад 10с</Button>
              <Button size="sm">▶ Play</Button>
              <Button variant="outline" size="sm">Вперед 10с</Button>
            </div>
          </div>
        </div>
      </Card>
      {content.transcript && (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Показать текст</summary>
          <p className="mt-2 text-gray-600">{content.transcript}</p>
        </details>
      )}
    </div>
  )
}

function InteractiveLessonContent({ content }: { content: any }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <Sparkle size={48} className="mx-auto mb-4 text-green-600" />
        <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{content.instructions}</p>
        <Button size="lg" className="gap-2">
          Начать интерактив <ArrowRight size={20} />
        </Button>
      </div>
    </Card>
  )
}

function MindmapLessonContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-center font-bold text-lg mb-6">{content.centralTopic}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.branches?.map((branch: any, idx: number) => (
            <Card key={idx} className="p-4 bg-blue-50">
              <h4 className="font-semibold mb-2">{branch.topic}</h4>
              <ul className="space-y-1">
                {branch.subtopics.map((subtopic: string, subIdx: number) => (
                  <li key={subIdx} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    {subtopic}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============================================
// Quiz View
// ============================================

function QuizView({ 
  quiz, 
  currentQuestionIndex, 
  selectedAnswers, 
  showExplanation,
  onAnswer, 
  onSubmit,
  onNext
}: any) {
  const question = quiz[currentQuestionIndex]
  const userAnswer = selectedAnswers[question.id]
  const isAnswered = userAnswer !== undefined

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Вопрос {currentQuestionIndex + 1} из {quiz.length}</CardTitle>
          <Badge>{question.type === 'single' ? 'Один ответ' : 'Несколько ответов'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        
        <div className="space-y-2">
          {question.options.map((option: any) => {
            const isSelected = Array.isArray(userAnswer) 
              ? userAnswer.includes(option.id)
              : userAnswer === option.id
            
            const isCorrect = Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(option.id)
              : question.correctAnswer === option.id

            return (
              <Button
                key={option.id}
                variant={isSelected ? 'default' : 'outline'}
                className={`w-full justify-start text-left h-auto py-3 ${
                  showExplanation && isCorrect ? 'border-green-500 bg-green-50' : ''
                } ${
                  showExplanation && isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''
                }`}
                onClick={() => {
                  if (!showExplanation) {
                    if (question.type === 'multiple') {
                      const current = (userAnswer as string[]) || []
                      const updated = current.includes(option.id)
                        ? current.filter((id: string) => id !== option.id)
                        : [...current, option.id]
                      onAnswer(question.id, updated)
                    } else {
                      onAnswer(question.id, option.id)
                    }
                  }
                }}
                disabled={showExplanation}
              >
                {option.text}
              </Button>
            )
          })}
        </div>

        {showExplanation && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>Объяснение:</strong> {question.explanation}
              {question.emotionalContext && (
                <p className="mt-2 text-sm italic">💙 {question.emotionalContext}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 justify-end">
          {!showExplanation && (
            <Button onClick={onSubmit} disabled={!isAnswered}>
              Проверить ответ
            </Button>
          )}
          {showExplanation && (
            <Button onClick={onNext}>
              {currentQuestionIndex < quiz.length - 1 ? 'Следующий вопрос' : 'К практике'} 
              <ArrowRight size={20} className="ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// Practice View
// ============================================

function PracticeView({ exercise, onComplete }: any) {
  const [completed, setCompleted] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise.title}</CardTitle>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>~{exercise.duration} минут</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold">Инструкция:</h4>
          <ol className="space-y-2">
            {exercise.steps.map((step: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700">
                {step.startsWith('**') ? (
                  <strong>{step.replace(/\*\*/g, '')}</strong>
                ) : step.startsWith('  ') ? (
                  <span className="ml-4">{step.trim()}</span>
                ) : (
                  <span>{idx + 1}. {step}</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {exercise.tips && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Советы:</strong>
              <ul className="mt-2 space-y-1">
                {exercise.tips.map((tip: string, idx: number) => (
                  <li key={idx} className="text-sm">• {tip}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="practice-completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="practice-completed" className="text-sm cursor-pointer">
            Я выполнил(а) эту практику
          </label>
        </div>

        <Button 
          onClick={onComplete} 
          disabled={!completed}
          className="w-full gap-2"
        >
          Завершить урок <CheckCircle size={20} />
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================
// Completion View
// ============================================

function CompletionView({ lesson, score, onContinue }: any) {
  return (
    <Card className="border-2 border-green-200">
      <CardContent className="pt-8 pb-8 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Урок завершен! 🎉</h2>
          <p className="text-gray-600">Ты отлично справился с "{lesson.title}"</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
          <div className="text-sm text-gray-600">Результат теста</div>
        </div>

        <Alert className="text-left">
          <Heart className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            {score >= 90 ? 'Невероятно! Ты отлично усвоил(а) материал! 🌟' :
             score >= 70 ? 'Отличная работа! Ты хорошо понял(а) урок! 💪' :
             score >= 50 ? 'Неплохо! Но стоит повторить некоторые моменты 📚' :
             'Ничего страшного! Попробуй пройти урок ещё раз 💙'}
          </AlertDescription>
        </Alert>

        {lesson.homework && (
          <div className="text-left bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Домашнее задание</h4>
            <p className="text-sm text-gray-700 mb-2">{lesson.homework.description}</p>
            <Button variant="outline" size="sm">Подробнее</Button>
          </div>
        )}

        <Button onClick={onContinue} size="lg" className="w-full gap-2">
          Продолжить обучение <ArrowRight size={20} />
        </Button>
      </CardContent>
    </Card>
  )
}
