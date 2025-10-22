// Компонент адаптивного урока с учетом эмоционального состояния
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
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
    <div className="max-w-4xl mx-auto p-3 space-y-4">
      {/* Progress bar - Компактный синий */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="space-y-1.5"
      >
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Прогресс урока</span>
          <span className="font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Заголовок урока - Компактный */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 pointer-events-none" />
          
          <CardHeader className="relative p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg font-bold text-gray-900">{lesson.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{lesson.subtitle}</CardDescription>
              </div>
              <Badge variant="outline" className={`ios-caption2 ${fitColors[emotionalFit]} border-0 shadow-ios-soft`}>
                {fitLabels[emotionalFit]}
              </Badge>
            </div>
            
            {/* Причина выбора - Компактно */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Alert className="mt-3 bg-white/50 backdrop-blur-[10px] border-blue-200/50 py-2">
                <Heart className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900 text-sm">
                  <strong className="font-semibold">Почему этот урок:</strong> {reason}
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Адаптации */}
            {adaptations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Alert className="mt-2 bg-white/50 backdrop-blur-[10px] border-blue-200/50 py-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 text-sm">
                    <strong className="font-semibold">Адаптировано:</strong>
                    <ul className="mt-2 space-y-1">
                      {adaptations.map((adapt, idx) => (
                        <li key={idx} className="ios-caption1">• {adapt}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Цели обучения */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <h4 className="ios-body-emphasized text-gray-700 mb-2">Ты научишься:</h4>
              <ul className="space-y-2">
                {lesson.learningObjectives.map((obj, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex items-start gap-2 ios-caption1 text-gray-600"
                  >
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {obj}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Основной контент */}
      {viewMode === 'lesson' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />
            
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="ios-headline text-gray-900">Выбери формат обучения</CardTitle>
                <div className="flex items-center gap-2 ios-caption1 text-gray-600">
                  <Clock size={14} />
                  <span>
                    ~{lesson.formats[currentFormat]?.estimatedTime || 5} мин
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {/* Переключатель форматов - iOS 26 style */}
              <Tabs value={currentFormat} onValueChange={(val) => setCurrentFormat(val as any)}>
                <TabsList className="grid w-full bg-white/60 backdrop-blur-[20px] p-1" style={{ gridTemplateColumns: `repeat(${availableFormats.length}, 1fr)` }}>
                  {availableFormats.map(format => (
                    <TabsTrigger 
                      key={format} 
                      value={format} 
                      className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
                    >
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

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onSkip} className="text-xs px-3">
                Пропустить
              </Button>
              <Button onClick={handleLessonComplete} className="gap-1.5 text-xs px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                К тесту <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/20 pointer-events-none" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="ios-headline text-gray-900">Вопрос {currentQuestionIndex + 1} из {quiz.length}</CardTitle>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 ios-caption1">
              {question.type === 'single' ? 'Один ответ' : 'Несколько ответов'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <p className="ios-body text-gray-800 font-medium">{question.question}</p>
          
          <motion.div 
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {question.options.map((option: any, idx: number) => {
              const isSelected = Array.isArray(userAnswer) 
                ? userAnswer.includes(option.id)
                : userAnswer === option.id
              
              const isCorrect = Array.isArray(question.correctAnswer)
                ? question.correctAnswer.includes(option.id)
                : question.correctAnswer === option.id

              return (
                <motion.div
                  key={option.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                >
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    className={`w-full justify-start text-left h-auto py-4 px-5 ios-body transition-all ${
                      isSelected && !showExplanation
                        ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                        : ''
                    } ${
                      showExplanation && isCorrect 
                        ? 'border-green-500 bg-green-50/80 backdrop-blur-[20px] text-green-900' 
                        : ''
                    } ${
                      showExplanation && isSelected && !isCorrect 
                        ? 'border-red-500 bg-red-50/80 backdrop-blur-[20px] text-red-900' 
                        : ''
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
                </motion.div>
              )
            })}
          </motion.div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Alert className="bg-blue-50/80 backdrop-blur-[20px] border-blue-200">
                <AlertDescription className="ios-body">
                  <strong className="text-blue-900">Объяснение:</strong> {question.explanation}
                  {question.emotionalContext && (
                    <p className="mt-2 ios-caption1 italic text-blue-700">💙 {question.emotionalContext}</p>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            {!showExplanation && (
              <Button 
                onClick={onSubmit} 
                disabled={!isAnswered}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-sm"
              >
                Проверить ответ
              </Button>
            )}
            {showExplanation && (
              <Button 
                onClick={onNext}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm gap-2"
              >
                {currentQuestionIndex < quiz.length - 1 ? 'Следующий вопрос' : 'К практике'} 
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// Practice View
// ============================================

function PracticeView({ exercise, onComplete }: any) {
  const [completed, setCompleted] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/20 pointer-events-none" />
        
        <CardHeader className="relative">
          <CardTitle className="ios-headline text-gray-900">{exercise.title}</CardTitle>
          <CardDescription className="ios-body text-gray-600">{exercise.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="flex items-center gap-2 ios-caption1 text-gray-600">
            <Clock size={14} />
            <span>~{exercise.duration} минут</span>
          </div>

          <motion.div 
            className="bg-white/60 backdrop-blur-[20px] p-5 rounded-2xl space-y-4 border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="ios-body font-semibold text-gray-900">Инструкция:</h4>
            <ol className="space-y-3">
              {exercise.steps.map((step: string, idx: number) => (
                <motion.li 
                  key={idx} 
                  className="ios-caption1 text-gray-700 flex gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  {step.startsWith('**') ? (
                    <strong className="flex-1 ios-body">{step.replace(/\*\*/g, '')}</strong>
                  ) : step.startsWith('  ') ? (
                    <span className="ml-8 flex-1">{step.trim()}</span>
                  ) : (
                    <>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </>
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {exercise.tips && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Alert className="bg-yellow-50/80 backdrop-blur-[20px] border-yellow-200">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="ios-body">
                  <strong className="text-yellow-900">Советы:</strong>
                  <ul className="mt-3 space-y-2">
                    {exercise.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="ios-caption1 text-yellow-800 flex gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div 
            className="flex items-center gap-3 bg-white/60 backdrop-blur-[20px] p-4 rounded-xl border border-gray-100"
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              id="practice-completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
            />
            <label htmlFor="practice-completed" className="ios-body cursor-pointer flex-1 text-gray-700">
              Я выполнил(а) эту практику
            </label>
          </motion.div>

          <Button 
            onClick={onComplete} 
            disabled={!completed}
            className="w-full gap-2 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-sm"
          >
            Завершить урок <CheckCircle size={20} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// Completion View
// ============================================

function CompletionView({ lesson, score, onContinue }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-green-200/50 shadow-ios-soft">
        {/* Celebration gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-purple-50/30 to-blue-50/40 pointer-events-none" />
        
        <CardContent className="pt-10 pb-10 text-center space-y-8 relative">
          <motion.div 
            className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <CheckCircle size={56} className="text-white" weight="fill" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="ios-title2 font-bold mb-3 text-gray-900">Урок завершен! 🎉</h2>
            <p className="ios-body text-gray-600">Ты отлично справился с "{lesson.title}"</p>
          </motion.div>

          <motion.div 
            className="bg-blue-50/80 backdrop-blur-[20px] p-8 rounded-2xl border border-blue-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              {score}%
            </motion.div>
            <div className="ios-caption1 text-gray-600 font-medium">Результат теста</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Alert className="text-left bg-purple-50/80 backdrop-blur-[20px] border-purple-200">
              <Heart className="h-5 w-5 text-purple-600" weight="fill" />
              <AlertDescription className="ios-body text-purple-900">
                {score >= 90 ? 'Невероятно! Ты отлично усвоил(а) материал! 🌟' :
                 score >= 70 ? 'Отличная работа! Ты хорошо понял(а) урок! 💪' :
                 score >= 50 ? 'Неплохо! Но стоит повторить некоторые моменты 📚' :
                 'Ничего страшного! Попробуй пройти урок ещё раз 💙'}
              </AlertDescription>
            </Alert>
          </motion.div>

          {lesson.homework && (
            <motion.div 
              className="text-left bg-yellow-50/80 backdrop-blur-[20px] p-5 rounded-2xl border border-yellow-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="ios-body font-semibold mb-3 text-yellow-900">📝 Домашнее задание</h4>
              <p className="ios-caption1 text-yellow-800 mb-4">{lesson.homework.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                Подробнее
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={onContinue} 
              size="lg" 
              className="w-full gap-2 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-base"
            >
              Продолжить обучение <ArrowRight size={20} />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
