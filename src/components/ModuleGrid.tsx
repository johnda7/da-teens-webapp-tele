import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { LazyImage } from '@/components/ui/lazy-image'
import { CheckCircle, Circle, Lock, Play, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { getAllModules } from '@/data/modulesRegistry'
import { useState, useEffect } from 'react'

interface ModuleGridProps {
  currentModule: number
  onModuleSelect: (moduleId: number) => void
}

// Получаем модули из централизованного реестра
const allModules = getAllModules()

// Формируем упрощенные данные для UI
const modules = allModules.map(mod => ({
  id: mod.id,
  title: mod.id === 1 ? `${mod.icon} ${mod.title} (Адаптивный)` : mod.title,
  description: mod.id === 1 
    ? 'Новая система обучения с учетом твоих эмоций • 9 уроков • Множественные форматы'
    : mod.description,
  color: mod.id === 1 
    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300' 
    : mod.color,
  icon: mod.icon,
  isAdaptive: mod.id === 1,
  badge: mod.id === 1 ? 'NEW!' : undefined
}))

export default function ModuleGrid({ currentModule, onModuleSelect }: ModuleGridProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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

  // Show skeletons while loading
  if (isLoading) {
    return (
      <div className="space-y-8 px-4 md:px-6">
        {/* Hero Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 md:px-6">
      {/* Current Module Highlight - iOS 26 Liquid Glass Hero */}
      {currentModuleData && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Liquid Glass Card */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#5AC8FA] to-[#007AFF] opacity-95" />
          
          {/* Liquid Glass Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle className="w-5 h-5 text-white/90" weight="fill" />
                  <span className="text-[13px] leading-[18px] font-semibold text-white/80 uppercase tracking-wide">
                    Текущий модуль
                  </span>
                </div>
                <h2 className="text-[28px] leading-[34px] tracking-tight font-bold text-white mb-3">
                  {currentModuleData?.title || 'Модуль не найден'}
                </h2>
                <p className="text-[16px] leading-[21px] text-white/90">
                  {currentModuleData?.description}
                </p>
              </div>
              
              <motion.button
                onClick={() => onModuleSelect(currentModule)}
                className="bg-white text-[#007AFF] px-8 py-4 rounded-xl text-[17px] leading-[22px] font-semibold shadow-lg min-w-[160px] flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" weight="fill" />
                Продолжить
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      )}

      {/* All Modules Grid */}
      <div>
        <h3 className="text-[22px] leading-[28px] tracking-tight font-bold mb-8 px-1">
          Все модули программы
        </h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                whileHover={isClickable ? { scale: 1.03, y: -4 } : {}}
                whileTap={isClickable ? { scale: 0.97 } : {}}
              >
                {/* Liquid Glass Card */}
                <div 
                  className={`
                    relative overflow-hidden rounded-2xl h-full
                    ${isClickable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                    transition-all duration-200
                  `}
                  onClick={() => isClickable && onModuleSelect(module.id)}
                  style={{
                    boxShadow: isClickable 
                      ? '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                      : '0 4px 16px 0 rgba(31, 38, 135, 0.1)'
                  }}
                >
                  {/* Background with Liquid Glass effect */}
                  <div 
                    className={`
                      absolute inset-0 
                      ${isAdaptive 
                        ? 'bg-white/10' 
                        : 'bg-white/80 dark:bg-black/20'
                      }
                    `}
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  />
                  
                  {/* Border */}
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      border: isAdaptive 
                        ? '1px solid rgba(0, 122, 255, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                  
                  {/* Adaptive Module Gradient Overlay */}
                  {isAdaptive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/30" />
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{module.icon}</div>
                      <div className="mt-1">
                        {getStatusIcon(status)}
                      </div>
                    </div>
                    
                    {/* Title & Badge */}
                    <div className="space-y-3 mb-4">
                      <h3 className="text-[17px] leading-[22px] tracking-tight font-semibold">
                        {module.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] leading-[18px] text-gray-600 dark:text-gray-400">
                          Модуль {module.id}
                        </span>
                        {getStatusBadge(status)}
                      </div>
                      
                      {(module as any).badge && (
                        <div 
                          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] leading-[13px] font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, #AF52DE 0%, #FF2D55 100%)'
                          }}
                        >
                          {(module as any).badge}
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-[15px] leading-[20px] text-gray-700 dark:text-gray-300 mb-4">
                      {module.description}
                    </p>
                    
                    {/* Progress Bar */}
                    {status === 'completed' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[13px] leading-[18px]">
                          <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    )}
                    {status === 'current' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[13px] leading-[18px]">
                          <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
                          <span className="font-semibold text-[#007AFF]">33%</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}