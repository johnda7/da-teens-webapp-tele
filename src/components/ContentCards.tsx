import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  BookOpen, 
  PenTool, 
  CheckCircle, 
  Clock, 
  Star,
  ArrowRight,
  Video,
  FileText,
  Target
} from 'lucide-react'

interface ContentCardProps {
  type: 'video' | 'practice' | 'homework'
  title: string
  description: string
  duration: number
  completed?: boolean
  locked?: boolean
  onStart: () => void
  progress?: number
}

export function ContentCard({ 
  type, 
  title, 
  description, 
  duration, 
  completed = false, 
  locked = false,
  onStart,
  progress = 0
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCardConfig = () => {
    switch (type) {
      case 'video':
        return {
          icon: Video,
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          label: 'Видео'
        }
      case 'practice':
        return {
          icon: Target,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600',
          label: 'Практика'
        }
      case 'homework':
        return {
          icon: PenTool,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          label: 'Домашка'
        }
    }
  }

  const config = getCardConfig()
  const Icon = config.icon

  return (
    <motion.div
      className={`
        relative rounded-2xl border-2 p-6 cursor-pointer
        ${config.bgColor} ${config.borderColor}
        ${locked ? 'opacity-50 cursor-not-allowed' : ''}
        ${completed ? 'ring-2 ring-green-500/20' : ''}
      `}
      whileHover={!locked ? { scale: 1.02, y: -4 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={!locked ? onStart : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.color} opacity-0 transition-opacity duration-300 ${
        isHovered ? 'opacity-5' : ''
      }`} />

      {/* Status indicators */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${config.bgColor}`}>
            <Icon size={20} className={config.iconColor} />
          </div>
          <span className={`text-sm font-medium ${config.iconColor}`}>
            {config.label}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {completed && (
            <CheckCircle size={20} className="text-green-600" />
          )}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock size={14} />
            <span className="text-xs">{duration} мин</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>

        {/* Progress bar (for practice/homework) */}
        {(type === 'practice' || type === 'homework') && progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Прогресс</span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className={`h-1.5 rounded-full bg-gradient-to-r ${config.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <motion.div
          className="flex items-center justify-between"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-medium text-gray-700">
            {locked ? 'Заблокировано' : completed ? 'Повторить' : 'Начать'}
          </span>
          {!locked && (
            <ArrowRight 
              size={16} 
              className={`${config.iconColor} transition-transform duration-200 ${
                isHovered ? 'translate-x-1' : ''
              }`} 
            />
          )}
        </motion.div>
      </div>

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <Star size={16} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Заверши предыдущий урок</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Container for multiple cards
interface ContentCardsProps {
  cards: Array<{
    type: 'video' | 'practice' | 'homework'
    title: string
    description: string
    duration: number
    completed?: boolean
    locked?: boolean
    progress?: number
  }>
  onCardStart: (index: number) => void
}

export default function ContentCards({ cards, onCardStart }: ContentCardsProps) {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ContentCard
            {...card}
            onStart={() => onCardStart(index)}
          />
        </motion.div>
      ))}
    </div>
  )
}
