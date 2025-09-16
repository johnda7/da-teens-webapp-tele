import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Lock, Play } from '@phosphor-icons/react'

interface ModuleGridProps {
  currentModule: number
  onModuleSelect: (moduleId: number) => void
}

const modules = [
  { id: 1, title: 'Уверенность', description: 'Самопознание, сильные стороны, работа с внутренним критиком', color: 'bg-blue-50 border-blue-200', icon: '💪' },
  { id: 2, title: 'Дружба', description: 'Эмпатия, доверие, границы, здоровые отношения', color: 'bg-green-50 border-green-200', icon: '🤝' },
  { id: 3, title: 'Общение', description: 'Я-сообщения, активное слушание, убеждение', color: 'bg-purple-50 border-purple-200', icon: '💬' },
  { id: 4, title: 'Стресс-менеджмент', description: 'Дыхательные техники, телесные практики', color: 'bg-orange-50 border-orange-200', icon: '🧘' },
  { id: 5, title: 'Самооценка', description: 'Принятие себя, работа с комплексами', color: 'bg-pink-50 border-pink-200', icon: '✨' },
  { id: 6, title: 'Тайм-менеджмент', description: 'Приоритеты, фокус, учебные ритуалы', color: 'bg-indigo-50 border-indigo-200', icon: '⏰' },
  { id: 7, title: 'Финансовая грамотность', description: 'Базовый бюджет, цели, проекты', color: 'bg-emerald-50 border-emerald-200', icon: '💰' },
  { id: 8, title: 'Карьерный путь', description: 'Интересы, сильные стороны, профориентация', color: 'bg-yellow-50 border-yellow-200', icon: '🎯' },
  { id: 9, title: 'Цифровая гигиена', description: 'Соцсети, скролл-детокс, кибербуллинг', color: 'bg-cyan-50 border-cyan-200', icon: '📱' },
  { id: 10, title: 'Здоровые привычки', description: 'Сон, питание, движение, экранное время', color: 'bg-teal-50 border-teal-200', icon: '🌱' },
  { id: 11, title: 'Принятие решений', description: 'Анализ последствий, эксперименты', color: 'bg-red-50 border-red-200', icon: '🤔' },
  { id: 12, title: 'Устойчивость', description: 'Работа с ошибками, план восстановления', color: 'bg-violet-50 border-violet-200', icon: '🛡️' },
]

export default function ModuleGrid({ currentModule, onModuleSelect }: ModuleGridProps) {
  const getModuleStatus = (moduleId: number) => {
    if (moduleId < currentModule) return 'completed'
    if (moduleId === currentModule) return 'current'
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
      case 'current':
        return <Play className="w-5 h-5 text-primary" weight="fill" />
      default:
        return <Lock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Завершен</Badge>
      case 'current':
        return <Badge className="bg-primary/10 text-primary border-primary/30">Текущий</Badge>
      default:
        return <Badge variant="secondary">Заблокирован</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Module Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Текущий модуль</h3>
              <p className="text-2xl font-bold text-primary mt-1">
                {modules.find(m => m.id === currentModule)?.title || 'Модуль не найден'}
              </p>
              <p className="text-muted-foreground mt-1">
                {modules.find(m => m.id === currentModule)?.description}
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => onModuleSelect(currentModule)}
              className="gap-2"
            >
              <Play className="w-4 h-4" weight="fill" />
              Продолжить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Modules Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Все модули программы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const status = getModuleStatus(module.id)
            const isClickable = status === 'current' || status === 'completed'
            
            return (
              <Card 
                key={module.id} 
                className={`${module.color} ${isClickable ? 'cursor-pointer hover:shadow-md' : 'opacity-60'} transition-all duration-200`}
                onClick={() => isClickable && onModuleSelect(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{module.icon}</div>
                    {getStatusIcon(status)}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Модуль {module.id}</span>
                      {getStatusBadge(status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                  {status === 'completed' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  )}
                  {status === 'current' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span className="font-medium">33%</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}