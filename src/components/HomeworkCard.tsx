// Homework Card - домашние задания от Екатерины Карпенко
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Notebook, 
  Clock, 
  CheckCircle,
  Warning,
  PaperPlaneTilt,
  CalendarDots
} from '@phosphor-icons/react'

interface HomeworkCardProps {
  title: string
  description: string
  instructions?: string[]
  deadline: string // "18.10.2025 19:00"
  estimatedTime: number // минуты
  xpReward: number
  status: 'not-started' | 'in-progress' | 'submitted' | 'checked'
  feedback?: string // Feedback от Екатерины после проверки
  grade?: number // 1-10
  onStart?: () => void
  onSubmit?: () => void
  onViewFeedback?: () => void
}

export default function HomeworkCard({
  title,
  description,
  instructions,
  deadline,
  estimatedTime,
  xpReward,
  status,
  feedback,
  grade,
  onStart,
  onSubmit,
  onViewFeedback
}: HomeworkCardProps) {
  
  const isOverdue = new Date(deadline) < new Date() && status !== 'submitted' && status !== 'checked'
  
  const statusConfig = {
    'not-started': { 
      label: 'Не начато', 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Notebook
    },
    'in-progress': { 
      label: 'В процессе', 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Clock
    },
    'submitted': { 
      label: 'Отправлено', 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: PaperPlaneTilt
    },
    'checked': { 
      label: 'Проверено', 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle
    }
  }
  
  const config = statusConfig[status]
  const StatusIcon = config.icon
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className={`
        relative overflow-hidden bg-white/70 backdrop-blur-[40px] shadow-ios-soft
        ${isOverdue 
          ? 'border-red-200 ring-2 ring-red-100' 
          : 'border-purple-100/50'
        }
      `}>
        {/* Gradient overlay */}
        <div className={`
          absolute inset-0 pointer-events-none
          ${isOverdue 
            ? 'bg-gradient-to-br from-red-50/40 via-transparent to-orange-50/20' 
            : 'bg-gradient-to-br from-purple-50/20 via-transparent to-blue-50/20'
          }
        `} />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
              ${isOverdue ? 'bg-red-100' : 'bg-purple-100'}
            `}>
              <Notebook size={24} className={`${isOverdue ? 'text-red-600' : 'text-purple-600'}`} weight="fill" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className={`ios-caption2 ${config.color}`}>
                  <StatusIcon size={12} weight="fill" />
                  <span className="ml-1">{config.label}</span>
                </Badge>
                
                {isOverdue && (
                  <Badge className="bg-red-600 text-white ios-caption2 border-0 gap-1">
                    <Warning size={12} weight="fill" />
                    Просрочено
                  </Badge>
                )}
                
                {grade && status === 'checked' && (
                  <Badge className="bg-green-600 text-white ios-caption2 border-0">
                    Оценка: {grade}/10
                  </Badge>
                )}
              </div>
              
              <h3 className="ios-headline text-gray-900">
                {title}
              </h3>
            </div>
          </div>
          
          {/* Description */}
          <p className="ios-caption1 text-gray-600 mb-4">
            {description}
          </p>
          
          {/* Instructions */}
          {instructions && instructions.length > 0 && (
            <div className="bg-white/50 backdrop-blur-[10px] rounded-xl p-4 mb-4 border border-purple-100/30">
              <div className="ios-caption2 text-gray-500 mb-2 uppercase tracking-wide">
                Инструкция от Екатерины:
              </div>
              <ul className="space-y-2">
                {instructions.map((instruction, idx) => (
                  <li key={idx} className="ios-caption1 flex items-start gap-2">
                    <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className={`
              flex items-center gap-1.5 ios-caption1
              ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}
            `}>
              <CalendarDots size={14} weight="fill" />
              <span>До {deadline}</span>
            </div>
            
            <div className="flex items-center gap-1.5 ios-caption1 text-gray-600">
              <Clock size={14} />
              <span>~{estimatedTime} мин</span>
            </div>
            
            <div className="flex items-center gap-1.5 ios-caption1 text-orange-600 font-medium">
              <CheckCircle size={14} weight="fill" />
              <span>+{xpReward} XP</span>
            </div>
          </div>
          
          {/* Feedback section (if checked) */}
          {status === 'checked' && feedback && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-600" weight="fill" />
                </div>
                <div className="ios-body-emphasized text-green-900">
                  Feedback от Екатерины
                </div>
              </div>
              <p className="ios-caption1 text-green-700">
                {feedback}
              </p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {status === 'not-started' && (
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={onStart}
                  className="w-full h-[44px] bg-purple-600 text-white hover:bg-purple-700 ios-body-emphasized rounded-xl shadow-ios-soft gap-2"
                >
                  <Notebook size={18} weight="fill" />
                  Начать выполнение
                </Button>
              </motion.div>
            )}
            
            {status === 'in-progress' && (
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={onSubmit}
                  className="w-full h-[44px] bg-purple-600 text-white hover:bg-purple-700 ios-body-emphasized rounded-xl shadow-ios-soft gap-2"
                >
                  <PaperPlaneTilt size={18} weight="fill" />
                  Отправить домашку
                </Button>
              </motion.div>
            )}
            
            {status === 'submitted' && (
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  disabled
                  className="w-full h-[44px] bg-white/70 backdrop-blur-[20px] text-gray-700 ios-body-emphasized rounded-xl shadow-ios-soft gap-2"
                  variant="ghost"
                >
                  <Clock size={18} weight="fill" />
                  Ожидает проверки
                </Button>
              </motion.div>
            )}
            
            {status === 'checked' && (
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  onClick={onViewFeedback}
                  className="w-full h-[44px] bg-green-600 text-white hover:bg-green-700 ios-body-emphasized rounded-xl shadow-ios-soft gap-2"
                >
                  <CheckCircle size={18} weight="fill" />
                  Посмотреть feedback
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
