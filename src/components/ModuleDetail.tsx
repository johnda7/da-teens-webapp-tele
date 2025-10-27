import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen } from '@phosphor-icons/react'

interface ModuleDetailProps {
  moduleId: number
  onBack: () => void
}

const moduleData = {
  1: {
    title: 'Уверенность',
    description: 'Изучение своих сильных сторон, работа с самокритикой и развитие здоровой самооценки',
    weeks: [
      {
        title: 'Неделя 1: Твои сильные стороны',
        description: 'Определяем, в чём ты действительно хорош, и учимся это ценить',
        videoUrl: '#',
        practices: [
          {
            title: 'Колесо сильных сторон',
            steps: [
              'Нарисуй круг и раздели его на 8 частей',
              'В каждой части напиши одну свою сильную сторону',
              'Оцени каждую от 1 до 10 по уровню развития',
              'Закрась сектора согласно оценкам'
            ]
          }
        ],
        reflection: [
          'Какая сильная сторона удивила тебя больше всего?',
          'В какой ситуации ты последний раз использовал свои сильные стороны?',
          'Как ты можешь развить свою самую слабую сторону на 1 балл?'
        ]
      },
      {
        title: 'Неделя 2: Внутренний критик',
        description: 'Учимся распознавать негативные мысли и заменять их конструктивными',
        videoUrl: '#',
        practices: [
          {
            title: 'Техника "Стоп-мысль"',
            steps: [
              'Заметь негативную мысль о себе',
              'Мысленно скажи "Стоп!"',
              'Задай себе вопрос: "Это правда или мнение?"',
              'Переформулируй мысль более справедливо'
            ]
          }
        ],
        reflection: [
          'Какие фразы чаще всего говорит твой внутренний критик?',
          'Откуда могли появиться эти убеждения?',
          'Что бы ты сказал другу, если бы он думал о себе также?'
        ]
      },
      {
        title: 'Неделя 3: План уверенности',
        description: 'Создаём персональную стратегию для поддержания уверенности в себе',
        videoUrl: '#',
        practices: [
          {
            title: 'Маленький смелый шаг',
            steps: [
              'Выбери ситуацию, где хочешь быть увереннее',
              'Придумай самое маленькое действие в эту сторону',
              'Сделай это действие сегодня',
              'Отметь, как ты себя чувствуешь после'
            ]
          }
        ],
        reflection: [
          'Какой шаг оказался для тебя самым сложным?',
          'Что помогло тебе его сделать?',
          'Как ты будешь поддерживать уверенность каждый день?'
        ]
      }
    ]
  }
}

export default function ModuleDetail({ moduleId, onBack }: ModuleDetailProps) {
  const [currentWeek, setCurrentWeek] = useState(1)
  const module = moduleData[moduleId as keyof typeof moduleData]

  if (!module) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Модуль не найден</h2>
        <p className="text-muted-foreground mt-2">Этот модуль ещё в разработке</p>
        <Button onClick={onBack} className="mt-4" variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к модулям
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{module.title}</h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Прогресс по модулю
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Неделя {currentWeek} из 3</span>
              <span className="font-medium">{Math.round((currentWeek / 3) * 100)}%</span>
            </div>
            <Progress value={(currentWeek / 3) * 100} className="h-3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((week) => (
                <Badge 
                  key={week}
                  variant={week <= currentWeek ? "default" : "secondary"}
                  className="gap-1"
                >
                  {week < currentWeek && <CheckCircle className="w-3 h-3" weight="fill" />}
                  {week === currentWeek && <Clock className="w-3 h-3" />}
                  Неделя {week}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Content */}
      <Tabs value={`week-${currentWeek}`} onValueChange={(value) => setCurrentWeek(parseInt(value.split('-')[1]))}>
        <TabsList className="grid w-full grid-cols-3">
          {module.weeks.map((_, index) => (
            <TabsTrigger key={index} value={`week-${index + 1}`}>
              Неделя {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {module.weeks.map((week, index) => (
          <TabsContent key={index} value={`week-${index + 1}`} className="space-y-6">
            {/* Week Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{week.title}</CardTitle>
                <CardDescription>{week.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="gap-2" size="lg">
                  <Play className="w-4 h-4" weight="fill" />
                  Начать неделю {index + 1}
                </Button>
              </CardContent>
            </Card>

            {/* Video */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📹 Видео урок</CardTitle>
                <CardDescription>5-7 минут</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Видео урок</p>
                    <p className="text-sm text-muted-foreground">"{week.title}"</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Посмотреть видео
                </Button>
              </CardContent>
            </Card>

            {/* Practice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🧘 Практика</CardTitle>
                <CardDescription>10-15 минут</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {week.practices.map((practice, practiceIndex) => (
                  <div key={practiceIndex}>
                    <h4 className="font-medium mb-3">{practice.title}</h4>
                    <ol className="space-y-2">
                      {practice.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Начать практику
                </Button>
              </CardContent>
            </Card>

            {/* Reflection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💭 Рефлексия</CardTitle>
                <CardDescription>3-5 минут на размышления</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {week.reflection.map((question, questionIndex) => (
                    <div key={questionIndex} className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-foreground">
                        {questionIndex + 1}. {question}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Ответить на вопросы
                </Button>
              </CardContent>
            </Card>

            {/* Week Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📝 Задание на неделю</CardTitle>
                <CardDescription>Практическое применение</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm">
                    Каждый день записывай одну ситуацию, где ты использовал свои сильные стороны. 
                    В конце недели проанализируй, как это влияло на твоё настроение.
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Сдать задание
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}