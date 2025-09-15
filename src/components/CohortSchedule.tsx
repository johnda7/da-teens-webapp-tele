import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, VideoCamera, ChatCircle, FileText, Users } from '@phosphor-icons/react'

interface CohortScheduleProps {
  cohortId: string
}

const upcomingSessions = [
  {
    id: 1,
    title: 'Week 2: Inner Strength Building',
    date: '2024-01-15',
    time: '16:00',
    type: 'group-session',
    mentor: 'Dr. Sarah Chen',
    description: 'Exploring your unique strengths and building confidence',
    participants: 12
  },
  {
    id: 2,
    title: 'Peer Discussion: Confidence Challenges',
    date: '2024-01-17',
    time: '17:30',
    type: 'peer-chat',
    mentor: 'Alex (Curator)',
    description: 'Share experiences and support each other',
    participants: 5
  },
  {
    id: 3,
    title: 'Week 3: Confidence in Action',
    date: '2024-01-22',
    time: '16:00',
    type: 'group-session',
    mentor: 'Dr. Sarah Chen',
    description: 'Putting confidence skills into practice',
    participants: 12
  }
]

const assignments = [
  {
    id: 1,
    title: 'Strengths Discovery Worksheet',
    dueDate: '2024-01-16',
    type: 'reflection',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Confidence Action Plan',
    dueDate: '2024-01-18',
    type: 'planning',
    status: 'not-started'
  }
]

export default function CohortSchedule({ cohortId }: CohortScheduleProps) {
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'group-session':
        return <VideoCamera className="w-5 h-5" />
      case 'peer-chat':
        return <ChatCircle className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Teens 14-16 Group A</h2>
        <p className="text-muted-foreground">Your cohort schedule and assignments</p>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Live sessions with your mentor and group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getSessionIcon(session.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{session.date} at {session.time}</span>
                      <span>•</span>
                      <span>{session.mentor}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {session.participants} participants
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={session.type === 'group-session' ? 'default' : 'secondary'}>
                  {session.type === 'group-session' ? 'Live Session' : 'Peer Chat'}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Join Session
                </Button>
                <Button variant="outline" size="sm">
                  Add to Calendar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assignments
          </CardTitle>
          <CardDescription>Complete these to get the most from your module</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(assignment.status)}>
                  {assignment.status === 'pending' ? 'In Progress' : 
                   assignment.status === 'completed' ? 'Completed' : 'Not Started'}
                </Badge>
                <Button size="sm" variant="outline">
                  {assignment.status === 'completed' ? 'View' : 'Start'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <ChatCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Group Chat</h3>
            <p className="text-sm text-muted-foreground">Connect with peers</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-medium">Meet Your Curator</h3>
            <p className="text-sm text-muted-foreground">Get personalized support</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}