import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  Users, 
  VideoCamera, 
  ChatCircle, 
  BookOpen, 
  Upload,
  Phone
} from '@phosphor-icons/react'

interface CohortSession {
  id: string
  week: number
  title: string
  date: string
  time: string
  duration: string
  type: 'video' | 'chat' | 'assignment'
  status: 'upcoming' | 'live' | 'completed'
  joinUrl?: string
  description?: string
}

interface CohortScheduleProps {
  cohortId: string
}

export default function CohortSchedule({ cohortId }: CohortScheduleProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  // Mock data for cohort schedule
  const cohortInfo = {
    name: "Teens 14-16 Group A",
    currentModule: "Confidence & Self-Discovery", 
    currentWeek: 2,
    mentor: "Dr. Sarah Chen",
    curator: "Alex M.",
    groupSize: 8,
    nextSession: "2024-01-15T18:00:00"
  }

  const sessions: CohortSession[] = [
    {
      id: "s1",
      week: 1,
      title: "Welcome & Strengths Discovery",
      date: "2024-01-08",
      time: "18:00",
      duration: "45 min",
      type: "video",
      status: "completed",
      description: "Get to know your group and explore individual strengths"
    },
    {
      id: "s2", 
      week: 2,
      title: "Building Confidence Together",
      date: "2024-01-15",
      time: "18:00", 
      duration: "45 min",
      type: "video",
      status: "upcoming",
      joinUrl: "https://meet.example.com/teens-group-a",
      description: "Practice confidence techniques and share experiences"
    },
    {
      id: "s3",
      week: 3,
      title: "Positive Self-Talk Workshop", 
      date: "2024-01-22",
      time: "18:00",
      duration: "45 min",
      type: "video",
      status: "upcoming",
      description: "Transform your inner voice and support each other"
    },
    {
      id: "a1",
      week: 1,
      title: "Week 1 Reflection Assignment",
      date: "2024-01-10",
      time: "Any time",
      duration: "10 min",
      type: "assignment", 
      status: "completed"
    },
    {
      id: "a2",
      week: 2,
      title: "Confidence Practice Log",
      date: "2024-01-17",
      time: "Due by 23:59",
      duration: "5 min daily",
      type: "assignment",
      status: "upcoming"
    }
  ]

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming')
  const nextSession = upcomingSessions.find(s => s.type === 'video')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'live': return 'text-red-600 bg-red-50 border-red-200'
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return VideoCamera
      case 'chat': return ChatCircle
      case 'assignment': return BookOpen
      default: return Calendar
    }
  }

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (isToday(dateStr)) return "Today"
    if (dateStr === tomorrow.toISOString().split('T')[0]) return "Tomorrow"
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Group Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{cohortInfo.name}</CardTitle>
          <CardDescription>
            Current Module: {cohortInfo.currentModule} • Week {cohortInfo.currentWeek}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{cohortInfo.groupSize} members</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>Mentor: {cohortInfo.mentor}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Session Highlight */}
      {nextSession && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <VideoCamera className="w-5 h-5 text-primary" weight="fill" />
              Next Group Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{nextSession.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {nextSession.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(nextSession.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {nextSession.time} ({nextSession.duration})
              </div>
            </div>

            {nextSession.joinUrl && (
              <Button className="w-full" size="lg">
                <VideoCamera className="w-4 h-4 mr-2" />
                Join Session
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <ChatCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Group Chat</h3>
            <p className="text-sm text-muted-foreground">Message your cohort</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Upload className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-medium">Submit Work</h3>
            <p className="text-sm text-muted-foreground">Share your assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule by Week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3-Week Schedule</CardTitle>
          <CardDescription>All sessions and assignments for this module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map(weekNum => {
              const weekSessions = sessions.filter(s => s.week === weekNum)
              const isCurrentWeek = weekNum === cohortInfo.currentWeek
              
              return (
                <div key={weekNum}>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className={`font-medium ${isCurrentWeek ? 'text-primary' : 'text-foreground'}`}>
                      Week {weekNum}
                    </h4>
                    {isCurrentWeek && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {weekSessions.map(session => {
                      const IconComponent = getTypeIcon(session.type)
                      
                      return (
                        <div 
                          key={session.id}
                          className={`p-3 rounded-lg border ${
                            isToday(session.date) ? 'bg-accent/10 border-accent/30' : 'bg-card'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <IconComponent className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{session.title}</h5>
                                {session.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {session.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span>{formatDate(session.date)}</span>
                                  <span>{session.time}</span>
                                  <span>{session.duration}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(session.status)}`}
                            >
                              {session.status === 'completed' ? '✓ Done' : 
                               session.status === 'live' ? '🔴 Live' : 
                               'Upcoming'}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need Support?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ChatCircle className="w-4 h-4 mr-2" />
            Message Curator: {cohortInfo.curator}
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Phone className="w-4 h-4 mr-2" />
            Schedule 1:1 with Mentor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}