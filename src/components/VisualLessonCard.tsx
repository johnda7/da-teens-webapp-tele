import React from 'react'
import { motion } from 'framer-motion'
import { Play, Lock, CheckCircle, Clock, Users, Heart } from '@phosphor-icons/react'

// Типы для визуальных элементов урока
interface VisualElements {
  heroImage: string
  emotionalVariants: {
    anxious: { colors: string[], image: string, animation: string }
    energetic: { colors: string[], image: string, animation: string }
    focused: { colors: string[], image: string, animation: string }
  }
  culturalContext: {
    russian: string
    international: string
  }
}

interface InteractiveElements {
  clickableZones: {
    id: string
    title: string
    description: string
    position: { x: number, y: number }
  }[]
  scenarios: {
    id: string
    title: string
    image: string
    description: string
  }[]
}

interface AudioElements {
  narration: string
  emotionalTone: 'calm' | 'energetic' | 'focused'
  russianAccent: boolean
  duration: number
}

interface VisualLessonCardProps {
  id: string
  title: string
  subtitle: string
  description: string
  type: 'video' | 'practice' | 'homework' | 'meditation' | 'sleep'
  duration: string
  progress: number
  isLocked: boolean
  isCompleted: boolean
  emotionalState: 'anxious' | 'energetic' | 'focused'
  visualElements: VisualElements
  interactiveElements: InteractiveElements
  audioElements: AudioElements
  culturalContext: 'russian' | 'international'
  onStart: (lessonId: string) => void
  onPreview: (lessonId: string) => void
}

export default function VisualLessonCard({
  id,
  title,
  subtitle,
  description,
  type,
  duration,
  progress,
  isLocked,
  isCompleted,
  emotionalState,
  visualElements,
  interactiveElements,
  audioElements,
  culturalContext,
  onStart,
  onPreview
}: VisualLessonCardProps) {
  
  // Получаем эмоциональные стили
  const getEmotionalStyles = () => {
    const variant = visualElements.emotionalVariants[emotionalState]
    return {
      colors: variant.colors,
      image: variant.image,
      animation: variant.animation
    }
  }

  const emotionalStyles = getEmotionalStyles()

  // Получаем иконку для типа урока
  const getTypeIcon = () => {
    switch (type) {
      case 'video': return <Play className="w-5 h-5" />
      case 'practice': return <Users className="w-5 h-5" />
      case 'homework': return <CheckCircle className="w-5 h-5" />
      case 'meditation': return <Heart className="w-5 h-5" />
      case 'sleep': return <Clock className="w-5 h-5" />
      default: return <Play className="w-5 h-5" />
    }
  }

  // Получаем цветовую схему для типа урока
  const getTypeColors = () => {
    switch (type) {
      case 'video': return 'from-blue-500 to-cyan-500'
      case 'practice': return 'from-green-500 to-emerald-500'
      case 'homework': return 'from-purple-500 to-violet-500'
      case 'meditation': return 'from-pink-500 to-rose-500'
      case 'sleep': return 'from-indigo-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      className="relative bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-lg overflow-hidden"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        background: `linear-gradient(135deg, ${emotionalStyles.colors.primary}20, ${emotionalStyles.colors.secondary}20)`
      }}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={emotionalStyles.image}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with emotional colors */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"
          style={{
            background: `linear-gradient(135deg, transparent, ${emotionalStyles.colors.primary}40)`
          }}
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getTypeColors()} text-white text-sm font-medium`}>
            {getTypeIcon()}
            <span className="capitalize">{type}</span>
          </div>
        </div>

        {/* Progress Ring */}
        {!isLocked && (
          <div className="absolute top-4 right-4">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Lock Icon */}
        {isLocked && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Cultural Context Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs font-medium">
              {culturalContext === 'russian' ? '🇷🇺' : '🌍'} {culturalContext}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Subtitle */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Interactive Elements Preview */}
        {interactiveElements.clickableZones.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Интерактивные зоны</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {interactiveElements.clickableZones.slice(0, 3).map((zone) => (
                <div key={zone.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {zone.title}
                </div>
              ))}
              {interactiveElements.clickableZones.length > 3 && (
                <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{interactiveElements.clickableZones.length - 3} ещё
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audio Elements Preview */}
        {audioElements.narration && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Аудио сопровождение</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {audioElements.emotionalTone === 'calm' ? '😌 Спокойно' : 
                 audioElements.emotionalTone === 'energetic' ? '⚡ Энергично' : '🎯 Сосредоточенно'}
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {audioElements.duration} мин
              </div>
              {audioElements.russianAccent && (
                <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  🇷🇺 Русский акцент
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Duration and Type */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              {getTypeIcon()}
              <span className="capitalize">{type}</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={() => isLocked ? onPreview(id) : onStart(id)}
            disabled={isLocked}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              isLocked 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : `bg-gradient-to-r ${getTypeColors()} text-white hover:opacity-90`
            }`}
            whileHover={!isLocked ? { scale: 1.05 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
          >
            {isLocked ? 'Предварительный просмотр' : isCompleted ? 'Повторить' : 'Начать'}
          </motion.button>
        </div>
      </div>

      {/* Emotional Animation Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `radial-gradient(circle at center, ${emotionalStyles.colors.primary}20, transparent 70%)`
        }}
      />
    </motion.div>
  )
}
