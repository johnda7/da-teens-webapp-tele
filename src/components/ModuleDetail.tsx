import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Calendar,
  FileText,
  Brain,
  ArrowLeft
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface ModuleDetailProps {
  moduleId: number
  onBack: () => void
}

interface ModuleContent {
  title: string
  description: string
  weeks: {
    title: string
    description: string
    video: {
      title: string
      description: string
      duration: string
    }
    practices: {
      title: string
      description: string
      duration: string
      type: string
    }[]
    assignments: {
      title: string
      description: string
      dueDate: string
      type: string
    }[]
  }[]
}

export default function ModuleDetail({ moduleId, onBack }: ModuleDetailProps) {
  const [activeWeek, setActiveWeek] = useState(0)
  const [moduleContent] = useKV<ModuleContent | null>(`module-${moduleId}-content`, null)
  const [weekProgress, setWeekProgress] = useKV<Record<number, number>>('week-progress', {})

  if (!moduleContent) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading module content...</p>
      </div>
    )
  }

  const currentWeek = moduleContent.weeks[activeWeek]
  const weekProgressPercent = (weekProgress && weekProgress[activeWeek]) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Modules
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">{moduleContent.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{moduleContent.description}</p>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>3-Week Journey</CardTitle>
          <CardDescription>Each week builds on the previous one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWeek.toString()} onValueChange={(value) => setActiveWeek(parseInt(value))}>
            <TabsList className="grid grid-cols-3 w-full">
              {moduleContent.weeks.map((week, index) => (
                <TabsTrigger key={index} value={index.toString()} className="flex flex-col gap-1">
                  <span className="text-xs">Week {index + 1}</span>
                  <span className="text-sm font-medium">{week.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {moduleContent.weeks.map((week, index) => (
              <TabsContent key={index} value={index.toString()} className="mt-6">
                <WeekContent 
                  week={week} 
                  weekNumber={index + 1}
                  progress={(weekProgress && weekProgress[index]) || 0}
                  onProgressUpdate={(progress) => 
                    setWeekProgress(prev => ({ ...prev, [index]: progress }))
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface WeekContentProps {
  week: ModuleContent['weeks'][0]
  weekNumber: number
  progress: number
  onProgressUpdate: (progress: number) => void
}

function WeekContent({ week, weekNumber, progress, onProgressUpdate }: WeekContentProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const toggleComplete = (itemId: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
    
    // Calculate progress (video + practices + assignments)
    const totalItems = 1 + week.practices.length + week.assignments.length
    const progressPercent = (newCompleted.size / totalItems) * 100
    onProgressUpdate(progressPercent)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Week {weekNumber}: {week.title}</h2>
        <p className="text-muted-foreground mb-4">{week.description}</p>
        <div className="flex items-center justify-center gap-4">
          <Progress value={progress} className="w-32 h-2" />
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Video Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                completedItems.has('video') ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'
              }`}>
                {completedItems.has('video') ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </div>
              <div>
                <CardTitle className="text-lg">{week.video.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {week.video.duration}
                </CardDescription>
              </div>
            </div>
            <Badge variant={completedItems.has('video') ? 'default' : 'secondary'}>
              {completedItems.has('video') ? 'Watched' : 'Watch'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{week.video.description}</p>
          <Button 
            onClick={() => toggleComplete('video')}
            variant={completedItems.has('video') ? 'outline' : 'default'}
            className="w-full"
          >
            {completedItems.has('video') ? 'Rewatch Video' : 'Start Video'}
          </Button>
        </CardContent>
      </Card>

      {/* Practices */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Practices</h3>
        {week.practices.map((practice, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    completedItems.has(`practice-${index}`) ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {completedItems.has(`practice-${index}`) ? <CheckCircle className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{practice.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {practice.duration} • {practice.type}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={completedItems.has(`practice-${index}`) ? 'default' : 'outline'}>
                  {completedItems.has(`practice-${index}`) ? 'Done' : 'Try it'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{practice.description}</p>
              <Button 
                onClick={() => toggleComplete(`practice-${index}`)}
                size="sm"
                variant={completedItems.has(`practice-${index}`) ? 'outline' : 'default'}
              >
                {completedItems.has(`practice-${index}`) ? 'Practice Again' : 'Start Practice'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assignments */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Assignments</h3>
        {week.assignments.map((assignment, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    completedItems.has(`assignment-${index}`) ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {completedItems.has(`assignment-${index}`) ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{assignment.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Due {assignment.dueDate} • {assignment.type}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={completedItems.has(`assignment-${index}`) ? 'default' : 'secondary'}>
                  {completedItems.has(`assignment-${index}`) ? 'Submitted' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{assignment.description}</p>
              <Button 
                onClick={() => toggleComplete(`assignment-${index}`)}
                size="sm"
                variant={completedItems.has(`assignment-${index}`) ? 'outline' : 'default'}
              >
                {completedItems.has(`assignment-${index}`) ? 'View Submission' : 'Start Assignment'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}