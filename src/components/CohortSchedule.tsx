import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  VideoCamera, 
  Users, 
  ChatCircle, 
  BookOpen, 
  Clock,
  Phone
} from '@phosphor-icons/react'

interface CohortScheduleProps {
  cohortId: string
}

const mockCohortData = {
  'teens-14-16-cohort-a': {
    name: 'Группа A (14-16 лет)',
    curator: 'Анна Петрова',
    mentor: 'Дмитрий Иванов',
    participants: 12,
    schedule: [
      {
        id: 1,
        title: 'Групповая встреча: Уверенность',
        type: 'meeting',
        date: '2024-01-15',
        time: '18:00',
        duration: 60,
        status: 'upcoming',
        description: 'Обсуждаем итоги первой недели модуля "Уверенность"',
        meetingLink: '#'
      },
      {
        id: 2,
        title: 'Практикум: Дыхательные техники',
        type: 'practice',
        date: '2024-01-17',
        time: '19:00',
        duration: 45,
        status: 'upcoming',
        description: 'Изучаем технику 4-7-8 и квадратное дыхание',
        meetingLink: '#'
      },
      {
        id: 3,
        title: 'Рефлексия и планирование',
        type: 'reflection',
        date: '2024-01-19',
        time: '18:30',
        duration: 45,
        status: 'upcoming',
        description: 'Подводим итоги недели и планируем следующую',
        meetingLink: '#'
      }
    ],
    chatInfo: {
      participantsCount: 12,
      lastMessage: 'Привет всем! Готовы к сегодняшней встрече? 😊',
      lastMessageTime: '14:30'
    }
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'upcoming':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Предстоит</Badge>
    case 'live':
      return <Badge className="bg-green-100 text-green-800 border-green-300">В эфире</Badge>
    case 'completed':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Завершено</Badge>
    default:
      return <Badge variant="secondary">Запланировано</Badge>
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return <Users className="w-4 h-4 text-primary" />
    case 'practice':
      return <BookOpen className="w-4 h-4 text-accent" />
    case 'reflection':
      return <ChatCircle className="w-4 h-4 text-purple-600" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return 'Сегодня'
  if (date.toDateString() === tomorrow.toDateString()) return 'Завтра'
  
  return date.toLocaleDateString('ru-RU', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  })
}

export default function CohortSchedule({ cohortId }: CohortScheduleProps) {
  const [activeTab, setActiveTab] = useState('schedule')
  const cohort = mockCohortData[cohortId as keyof typeof mockCohortData]

  if (!cohort) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Группа не найдена</h2>
        <p className="text-muted-foreground mt-2">Проверь код группы или обратись к куратору</p>
      </div>
    )
  }

  const nextMeeting = cohort.schedule.find(event => event.status === 'upcoming')

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{cohort.name}</CardTitle>
              <CardDescription className="mt-1">
                Куратор: {cohort.curator} • Ментор: {cohort.mentor}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {cohort.participants} участников
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Next Meeting Highlight */}
      {nextMeeting && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-accent">Ближайшая встреча</CardTitle>
              {getStatusBadge(nextMeeting.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">{nextMeeting.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{nextMeeting.description}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(nextMeeting.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{nextMeeting.time} ({nextMeeting.duration} мин)</span>
              </div>
            </div>

            <Button size="lg" className="w-full gap-2">
              <VideoCamera className="w-4 h-4" weight="fill" />
              Подключиться к встрече
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule" className="gap-1">
            <Calendar className="w-4 h-4" />
            Расписание
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1">
            <ChatCircle className="w-4 h-4" />
            Чат группы
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-1">
            <BookOpen className="w-4 h-4" />
            Материалы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="space-y-3">
            {cohort.schedule.map((event) => (
              <Card key={event.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {getTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(event.date)} в {event.time}</span>
                          <span>{event.duration} минут</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {event.status === 'upcoming' && (
                    <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
                      <VideoCamera className="w-3 h-3" />
                      Добавить в календарь
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircle className="w-5 h-5" />
                Чат группы
              </CardTitle>
              <CardDescription>
                {cohort.chatInfo.participantsCount} участников онлайн
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">А</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Анна (Куратор)</span>
                    <span className="text-xs text-muted-foreground ml-2">{cohort.chatInfo.lastMessageTime}</span>
                  </div>
                </div>
                <p className="text-sm">{cohort.chatInfo.lastMessage}</p>
              </div>
              
              <Button className="w-full gap-2">
                <ChatCircle className="w-4 h-4" />
                Открыть чат в Telegram
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="w-3 h-3" />
                  Материалы
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-3 h-3" />
                  SOS-связь
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Конспект: Техники уверенности</h4>
                    <p className="text-sm text-muted-foreground">PDF • 2.3 МБ</p>
                  </div>
                  <Button variant="outline" size="sm">Скачать</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <VideoCamera className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Запись: Групповая медитация</h4>
                    <p className="text-sm text-muted-foreground">MP4 • 45 минут</p>
                  </div>
                  <Button variant="outline" size="sm">Смотреть</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChatCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Дневник рефлексии</h4>
                    <p className="text-sm text-muted-foreground">Шаблон для записей</p>
                  </div>
                  <Button variant="outline" size="sm">Открыть</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}