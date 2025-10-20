/**
 * Module Grid Widget
 * 
 * FSD Layer: Widgets
 * Сетка всех модулей программы обучения (12 базовых + адаптивный)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Lock, Play, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ModuleGridProps {
  currentModule: number
  completedModules: number[]
  onModuleSelect: (moduleId: number) => void
}

const modules = [
  { id: 1, title: 'Уверенность', description: 'Самопознание, сильные стороны', color: 'bg-blue-50 border-blue-200', icon: '💪' },
  { id: 2, title: 'Дружба', description: 'Эмпатия, доверие, границы', color: 'bg-green-50 border-green-200', icon: '🤝' },
  { id: 3, title: 'Общение', description: 'Я-сообщения, активное слушание', color: 'bg-purple-50 border-purple-200', icon: '💬' },
  { id: 4, title: 'Стресс-менеджмент', description: 'Дыхательные техники, практики', color: 'bg-orange-50 border-orange-200', icon: '🧘' },
  { id: 5, title: 'Самооценка', description: 'Принятие себя, комплексы', color: 'bg-pink-50 border-pink-200', icon: '✨' },
  { id: 6, title: 'Тайм-менеджмент', description: 'Приоритеты, фокус, ритуалы', color: 'bg-indigo-50 border-indigo-200', icon: '⏰' },
  { id: 7, title: 'Финансовая грамотность', description: 'Бюджет, цели, проекты', color: 'bg-emerald-50 border-emerald-200', icon: '💰' },
  { id: 8, title: 'Карьерный путь', description: 'Интересы, профориентация', color: 'bg-yellow-50 border-yellow-200', icon: '🎯' },
  { id: 9, title: 'Цифровая гигиена', description: 'Соцсети, кибербуллинг', color: 'bg-cyan-50 border-cyan-200', icon: '📱' },
  { id: 10, title: 'Здоровые привычки', description: 'Сон, питание, движение', color: 'bg-teal-50 border-teal-200', icon: '🌱' },
  { id: 11, title: 'Принятие решений', description: 'Анализ, эксперименты', color: 'bg-red-50 border-red-200', icon: '🤔' },
  { id: 12, title: 'Устойчивость', description: 'Работа с ошибками', color: 'bg-violet-50 border-violet-200', icon: '🛡️' },
  { 
    id: 13, 
    title: 'Личные границы', 
    description: 'AI-адаптация под твоё состояние • 9 уроков',
    color: 'bg-gradient-to-r from-blue-50 to-[#e0f2fe] border-[#007AFF]',
    icon: '🛡️', 
    isAdaptive: true, 
    badge: 'AI' 
  },
]

export function ModuleGrid({ currentModule, completedModules, onModuleSelect }: ModuleGridProps) {
  const getModuleStatus = (moduleId: number): 'completed' | 'current' | 'available' | 'locked' => {
    if (completedModules.includes(moduleId)) return 'completed'
    if (moduleId === 13) return 'available' // Адаптивный модуль всегда доступен
    if (moduleId === currentModule) return 'current'
    if (moduleId < currentModule) return 'available'
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
      case 'current':
        return <Play className="w-5 h-5 text-[#007AFF]" weight="fill" />
      case 'available':
        return <Play className="w-5 h-5 text-gray-400" weight="regular" />
      default:
        return <Lock className="w-5 h-5 text-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✓ Завершён</Badge>
      case 'current':
        return <Badge style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007AFF', border: '1px solid rgba(0, 122, 255, 0.3)' }}>
          ▶ Текущий
        </Badge>
      case 'available':
        return <Badge variant="secondary">Доступен</Badge>
      default:
        return <Badge variant="secondary" className="opacity-50">🔒 Заблокирован</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => {
          const status = getModuleStatus(module.id)
          const isDisabled = status === 'locked'
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`
                  ${module.color} 
                  ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'} 
                  transition-all duration-200
                  ${module.isAdaptive ? 'border-2 shadow-md' : ''}
                  ${status === 'current' ? 'ring-2 ring-[#007AFF] ring-offset-2' : ''}
                `}
                onClick={() => !isDisabled && onModuleSelect(module.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {module.title}
                          {module.badge && (
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                                color: 'white',
                                border: 'none'
                              }}
                            >
                              {module.badge}
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs mb-3">
                    {module.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(status)}
                    
                    {module.isAdaptive && (
                      <div className="flex items-center gap-1 text-xs text-[#007AFF]">
                        <Sparkle className="w-3 h-3" weight="fill" />
                        <span>Адаптивный</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="backdrop-blur-xl bg-white/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
              <span>Завершён</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-[#007AFF]" weight="fill" />
              <span>Текущий</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-gray-400" />
              <span>Доступен</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-300" />
              <span>Заблокирован</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-[#007AFF]" weight="fill" />
              <span>AI-адаптация</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ModuleGrid
