import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Users, 
  Brain, 
  ChatCircle, 
  Target, 
  Clock, 
  CurrencyDollar, 
  Path,
  DeviceMobile,
  Leaf,
  TreeStructure,
  ShieldCheck
} from '@phosphor-icons/react'

interface ModuleGridProps {
  currentModule: number
  onModuleSelect?: (moduleId: number) => void
}

const modules = [
  { id: 1, title: 'Confidence', icon: Heart, description: 'Self-discovery and inner strength', color: 'bg-rose-100 text-rose-700' },
  { id: 2, title: 'Friendship', icon: Users, description: 'Building healthy relationships', color: 'bg-blue-100 text-blue-700' },
  { id: 3, title: 'Communication', icon: ChatCircle, description: 'Express yourself clearly', color: 'bg-green-100 text-green-700' },
  { id: 4, title: 'Stress Management', icon: Brain, description: 'Breathing and body techniques', color: 'bg-purple-100 text-purple-700' },
  { id: 5, title: 'Self-Image', icon: Target, description: 'Body positivity and acceptance', color: 'bg-orange-100 text-orange-700' },
  { id: 6, title: 'Time & Focus', icon: Clock, description: 'Productivity and study habits', color: 'bg-teal-100 text-teal-700' },
  { id: 7, title: 'Financial Literacy', icon: CurrencyDollar, description: 'Budgeting and money goals', color: 'bg-emerald-100 text-emerald-700' },
  { id: 8, title: 'Career Path', icon: Path, description: 'Explore interests and skills', color: 'bg-indigo-100 text-indigo-700' },
  { id: 9, title: 'Digital Wellness', icon: DeviceMobile, description: 'Healthy social media habits', color: 'bg-pink-100 text-pink-700' },
  { id: 10, title: 'Healthy Habits', icon: Leaf, description: 'Sleep, nutrition, and movement', color: 'bg-lime-100 text-lime-700' },
  { id: 11, title: 'Decision Making', icon: TreeStructure, description: 'Smart choices and consequences', color: 'bg-amber-100 text-amber-700' },
  { id: 12, title: 'Resilience', icon: ShieldCheck, description: 'Bounce back from setbacks', color: 'bg-cyan-100 text-cyan-700' }
]

export default function ModuleGrid({ currentModule, onModuleSelect }: ModuleGridProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Wellness Modules</h2>
        <p className="text-muted-foreground">12 modules designed specifically for teens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const isCompleted = module.id < currentModule
          const isCurrent = module.id === currentModule
          const isLocked = module.id > currentModule
          
          return (
            <Card 
              key={module.id}
              className={`transition-all duration-200 ${
                isCurrent 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : isCompleted 
                    ? 'bg-muted/50' 
                    : isLocked 
                      ? 'opacity-60' 
                      : ''
              } ${!isLocked ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}`}
              onClick={() => !isLocked && onModuleSelect?.(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center`}>
                    <module.icon className="w-6 h-6" weight={isCurrent ? 'fill' : 'regular'} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={isCompleted ? 'default' : isCurrent ? 'secondary' : 'outline'}>
                      {isCompleted ? 'Complete' : isCurrent ? 'Current' : `Week ${module.id}`}
                    </Badge>
                    {isCurrent && (
                      <div className="flex items-center gap-1">
                        <Progress value={66} className="w-16 h-1" />
                        <span className="text-xs text-muted-foreground">66%</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{module.title}</CardTitle>
                <CardDescription className="text-sm">{module.description}</CardDescription>
                
                {isCurrent && (
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onModuleSelect?.(module.id)
                    }}
                  >
                    Continue Week 2
                  </Button>
                )}
                
                {isCompleted && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onModuleSelect?.(module.id)
                    }}
                  >
                    Review Module
                  </Button>
                )}
                
                {isLocked && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">Unlocks after Module {module.id - 1}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}