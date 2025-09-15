import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, CheckCircle, Lock, Calendar } from '@phosphor-icons/react'

interface Module {
  id: number
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  isCurrent: boolean
  completionRate: number
  weekCount: number
}

interface ModuleGridProps {
  currentModule: number
  onModuleSelect: (moduleId: number) => void
}

// 12 modules curriculum for DA Teens
const modules: Module[] = [
  {
    id: 1,
    title: "Confidence & Self-Discovery",
    description: "Explore your strengths and build inner confidence",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: false,
    isCurrent: true,
    completionRate: 45,
    weekCount: 3
  },
  {
    id: 2, 
    title: "Healthy Friendships",
    description: "Build meaningful connections with empathy and boundaries",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 3,
    title: "Communication Skills", 
    description: "Master active listening and assertive expression",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 4,
    title: "Stress Management",
    description: "Learn breathing techniques and coping strategies",
    duration: "3 weeks", 
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 5,
    title: "Body Image & Self-Acceptance",
    description: "Develop a healthy relationship with your body and self",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 6,
    title: "Time Management & Focus",
    description: "Build productive habits and manage priorities",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 7,
    title: "Financial Literacy",
    description: "Learn budgeting basics and money mindset",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 8,
    title: "Career Exploration",
    description: "Discover interests and explore future paths",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 9,
    title: "Digital Wellness",
    description: "Healthy social media and screen time habits",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 10,
    title: "Healthy Lifestyle",
    description: "Sleep, nutrition, and movement for wellbeing",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 11,
    title: "Decision Making",
    description: "Learn to make thoughtful choices and handle consequences",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  },
  {
    id: 12,
    title: "Resilience & Growth",
    description: "Bounce back from setbacks and embrace challenges",
    duration: "3 weeks",
    isCompleted: false,
    isLocked: true,
    isCurrent: false,
    completionRate: 0,
    weekCount: 3
  }
]

export default function ModuleGrid({ currentModule, onModuleSelect }: ModuleGridProps) {
  // Update module states based on current progress
  const updatedModules = modules.map(module => ({
    ...module,
    isLocked: module.id > currentModule,
    isCurrent: module.id === currentModule,
    isCompleted: module.id < currentModule
  }))

  return (
    <div className="space-y-6">
      {/* Current Module Highlight */}
      {updatedModules.find(m => m.isCurrent) && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle className="text-lg">Continue Your Journey</CardTitle>
            </div>
            <CardDescription>You're currently working on Module {currentModule}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => onModuleSelect(currentModule)}
            >
              Continue Module {currentModule}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Grid */}
      <div className="grid gap-4">
        {updatedModules.map((module) => (
          <Card 
            key={module.id}
            className={`transition-all duration-200 ${
              module.isLocked 
                ? 'opacity-60 cursor-not-allowed' 
                : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
            } ${
              module.isCurrent ? 'ring-2 ring-primary/20' : ''
            }`}
            onClick={() => !module.isLocked && onModuleSelect(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Module {module.id}
                    </span>
                    {module.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                    )}
                    {module.isLocked && (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                  <CardDescription className="mt-1">{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {module.duration}
                </div>
                <Badge variant={module.isCurrent ? "default" : "secondary"}>
                  {module.isCompleted ? 'Completed' : 
                   module.isCurrent ? 'In Progress' : 
                   module.isLocked ? 'Locked' : 'Available'}
                </Badge>
              </div>

              {(module.isCurrent || module.isCompleted) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {module.isCompleted ? '100' : module.completionRate}%
                    </span>
                  </div>
                  <Progress 
                    value={module.isCompleted ? 100 : module.completionRate} 
                    className="h-2" 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Journey Progress Summary */}
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <div className="mb-2">
            <span className="text-2xl font-bold text-primary">
              {updatedModules.filter(m => m.isCompleted).length}
            </span>
            <span className="text-muted-foreground ml-1">/ 12 modules completed</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Each step forward is progress worth celebrating
          </p>
        </CardContent>
      </Card>
    </div>
  )
}