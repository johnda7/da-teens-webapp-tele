// Video Card - записи эфиров с Екатериной Карпенко
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Play, 
  Clock, 
  CalendarDots,
  User,
  CheckCircle
} from '@phosphor-icons/react'

interface VideoCardProps {
  title: string
  description?: string
  duration: string // "90 мин" or "30 мин"
  date: string // "14.10.2025"
  type: 'main' | 'additional' // Главный эфир (суббота) или дополнительный (пн/ср/пт)
  instructor: string // "Екатерина Карпенко"
  thumbnail?: string
  isWatched?: boolean
  onPlay: () => void
}

export default function VideoCard({
  title,
  description,
  duration,
  date,
  type,
  instructor,
  thumbnail,
  isWatched = false,
  onPlay
}: VideoCardProps) {
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
        {/* Gradient overlay для Liquid Glass */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/20 pointer-events-none" />
        
        {/* Thumbnail or gradient background */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 bg-white/20 rounded-full blur-2xl"
              />
              <Play size={64} weight="fill" className="absolute text-white/90" />
            </div>
          )}
          
          {/* Badge: Main vs Additional */}
          <div className="absolute top-4 left-4">
            <Badge className={`
              ios-caption2 border-0 shadow-ios-soft
              ${type === 'main' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/90 text-purple-700'
              }
            `}>
              {type === 'main' ? '🎓 Главный эфир' : '💡 Практика'}
            </Badge>
          </div>
          
          {/* Watched badge */}
          {isWatched && (
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Badge className="bg-green-600 text-white ios-caption2 border-0 shadow-ios-soft gap-1">
                  <CheckCircle size={12} weight="fill" />
                  Просмотрено
                </Badge>
              </motion.div>
            </div>
          )}
          
          {/* Duration overlay */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-black/60 backdrop-blur-[10px] text-white px-2 py-1 rounded-lg ios-caption2 flex items-center gap-1">
              <Clock size={12} />
              {duration}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          {/* Title */}
          <h3 className="ios-headline text-gray-900 mb-2">
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="ios-caption1 text-gray-600 mb-4 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 ios-caption1 text-gray-600">
              <User size={14} weight="fill" />
              <span>{instructor}</span>
            </div>
            <div className="flex items-center gap-1.5 ios-caption1 text-gray-600">
              <CalendarDots size={14} weight="fill" />
              <span>{date}</span>
            </div>
          </div>
          
          {/* Play button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              onClick={onPlay}
              className="w-full h-[44px] bg-purple-600 text-white hover:bg-purple-700 ios-body-emphasized rounded-xl shadow-ios-soft gap-2"
            >
              <Play size={18} weight="fill" />
              {isWatched ? 'Пересмотреть' : 'Смотреть эфир'}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
