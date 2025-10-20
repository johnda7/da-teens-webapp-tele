import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Lock, Play, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ModuleGridProps {
  currentModule: number
  onModuleSelect: (moduleId: number) => void
}

const modules = [
  { id: 1, title: '🧠 Личные границы (Адаптивный)', description: 'Новая система обучения с учетом твоих эмоций • 9 уроков • Множественные форматы', color: 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300', icon: '�️', isAdaptive: true, badge: 'NEW!' },
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
  { id: 13, title: 'Уверенность', description: 'Самопознание, сильные стороны, работа с внутренним критиком', color: 'bg-blue-50 border-blue-200', icon: '�' },
]

export default function ModuleGrid({ currentModule, onModuleSelect }: ModuleGridProps) {
  const getModuleStatus = (moduleId: number) => {
    // Модуль #1 (адаптивный "Личные границы") всегда доступен для тестирования
    if (moduleId === 1) return 'current'
    
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

  const currentModuleData = modules.find(m => m.id === currentModule)

  return (
    <div className="space-y-6 safe-x">
      {/* Current Module Highlight - iOS 26 Liquid Glass */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="glass rounded-ios-lg overflow-hidden border-0">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle className="w-5 h-5 text-purple-600" weight="fill" />
                  <h3 className="text-ios-footnote font-medium text-purple-600 uppercase tracking-wide">
                    Текущий модуль
                  </h3>
                </div>
                <p className="text-ios-title1 font-bold text-foreground mt-1">
                  {currentModuleData?.title || 'Модуль не найден'}
                </p>
                <p className="text-ios-callout text-muted-foreground mt-2 leading-relaxed">
                  {currentModuleData?.description}
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => onModuleSelect(currentModule)}
                className="gap-2 touch-feedback rounded-ios-md h-touch-min min-w-[140px] text-ios-body font-semibold shadow-elevated"
              >
                <Play className="w-5 h-5" weight="fill" />
                Продолжить
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Modules Grid */}
      <div>
        <h3 className="text-ios-title2 font-semibold mb-6 px-1">Все модули программы</h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          initial="initial"
          animate="animate"
        >
          {modules.map((module, index) => {
            const status = getModuleStatus(module.id)
            const isClickable = status === 'current' || status === 'completed'
            const isAdaptive = (module as any).isAdaptive
            
            return (
              <motion.div
                key={module.id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.03
                }}
                whileHover={isClickable ? { scale: 1.02, y: -4 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <Card 
                  className={`
                    ${isAdaptive ? 'glass border-0' : module.color} 
                    ${isClickable ? 'cursor-pointer shadow-elevated hover:shadow-elevated-lg' : 'opacity-60'} 
                    transition-all duration-fast rounded-ios-lg overflow-hidden h-full
                  `}
                  onClick={() => isClickable && onModuleSelect(module.id)}
                >
                <CardHeader className="pb-4 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="mt-1">
                      {getStatusIcon(status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-ios-headline leading-tight">
                      {module.title}
                      {(module as any).badge && (
                        <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-ios-caption2 px-2 py-0.5">
                          {(module as any).badge}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-ios-footnote text-muted-foreground">Модуль {module.id}</span>
                      {getStatusBadge(status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-6 pb-6">
                  <CardDescription className="text-ios-subheadline leading-relaxed">
                    {module.description}
                  </CardDescription>
                  {status === 'completed' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-ios-footnote">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-semibold text-green-600">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  )}
                  {status === 'current' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-ios-footnote">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-semibold text-primary">33%</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}