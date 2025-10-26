import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Play, Pause, SpeakerHigh, SpeakerX, Heart, Wind, Leaf } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SleepContent {
  id: string
  title: string
  description: string
  duration: number
  type: 'sleep' | 'meditation' | 'breathing' | 'nature'
  mood: 'anxious' | 'energetic' | 'focused' | 'calm' | 'excited'
  icon: string
  color: string
}

interface SleepIntegrationProps {
  currentMood: 'anxious' | 'energetic' | 'focused' | 'calm' | 'excited'
  onComplete: (contentId: string, duration: number) => void
  onClose: () => void
}

export default function SleepIntegration({ currentMood, onComplete, onClose }: SleepIntegrationProps) {
  const [selectedContent, setSelectedContent] = useState<SleepContent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)

  // Контент для сна и медитации, адаптированный под настроение
  const sleepContent: SleepContent[] = [
    {
      id: 'calm-breathing',
      title: 'Дыхание для спокойствия',
      description: 'Простая техника дыхания для снятия стресса',
      duration: 5,
      type: 'breathing',
      mood: 'anxious',
      icon: '🫁',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'body-scan',
      title: 'Сканирование тела',
      description: 'Медитация для расслабления каждой части тела',
      duration: 10,
      type: 'meditation',
      mood: 'focused',
      icon: '🧘‍♀️',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'forest-sounds',
      title: 'Звуки леса',
      description: 'Успокаивающие звуки природы для глубокого сна',
      duration: 30,
      type: 'nature',
      mood: 'calm',
      icon: '🌲',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'star-journey',
      title: 'Путешествие по звёздному небу',
      description: 'Расслабляющая история о путешествии среди звёзд',
      duration: 15,
      type: 'sleep',
      mood: 'excited',
      icon: '⭐',
      color: 'from-purple-400 to-indigo-400'
    },
    {
      id: 'ocean-waves',
      title: 'Подводный мир',
      description: 'Морское путешествие в глубины океана',
      duration: 20,
      type: 'sleep',
      mood: 'energetic',
      icon: '🌊',
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  // Фильтруем контент по текущему настроению
  const recommendedContent = sleepContent.filter(content => 
    content.mood === currentMood || content.mood === 'calm'
  )

  const handleContentSelect = (content: SleepContent) => {
    setSelectedContent(content)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeToggle = () => {
    setVolume(volume === 0 ? 0.7 : 0)
  }

  const handleComplete = () => {
    if (selectedContent) {
      onComplete(selectedContent.id, selectedContent.duration)
    }
    setSelectedContent(null)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (selectedContent) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-2xl max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full"
              >
                ✕
              </Button>
              <Badge className={`bg-gradient-to-r ${selectedContent.color} text-white border-0`}>
                {selectedContent.type === 'sleep' ? 'Сон' : 
                 selectedContent.type === 'meditation' ? 'Медитация' :
                 selectedContent.type === 'breathing' ? 'Дыхание' : 'Природа'}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {selectedContent.title}
            </CardTitle>
            <p className="text-gray-600 text-sm">{selectedContent.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Large Icon */}
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedContent.icon}</div>
              <div className="text-2xl font-bold text-gray-700">
                {formatTime(currentTime)} / {formatTime(selectedContent.duration * 60)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`bg-gradient-to-r ${selectedContent.color} h-2 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / (selectedContent.duration * 60)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVolumeToggle}
                className="h-12 w-12 rounded-full"
              >
                {volume === 0 ? <SpeakerX size={24} /> : <SpeakerHigh size={24} />}
              </Button>

              <Button
                onClick={handlePlayPause}
                className={`h-16 w-16 rounded-full bg-gradient-to-r ${selectedContent.color} text-white shadow-lg`}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="h-12 w-12 rounded-full"
              >
                ✓
              </Button>
            </div>

            {/* Mood Indicator */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Рекомендовано для</div>
              <Badge variant="outline" className="text-xs">
                {currentMood === 'anxious' ? 'Тревожное состояние' :
                 currentMood === 'energetic' ? 'Энергичное состояние' :
                 currentMood === 'focused' ? 'Сосредоточенность' :
                 currentMood === 'calm' ? 'Спокойствие' : 'Возбуждение'}
              </Badge>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Moon className="w-6 h-6 text-indigo-500" />
            Сон и медитация
          </h3>
          <p className="text-gray-600 text-sm">Персонализированные программы для твоего настроения</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-full"
        >
          ✕
        </Button>
      </div>

      <div className="space-y-3">
        {recommendedContent.map((content) => (
          <motion.div
            key={content.id}
            className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleContentSelect(content)}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{content.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{content.title}</h4>
                <p className="text-sm text-gray-600">{content.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {content.duration} мин
                  </Badge>
                  <Badge className={`text-xs bg-gradient-to-r ${content.color} text-white border-0`}>
                    {content.type === 'sleep' ? 'Сон' : 
                     content.type === 'meditation' ? 'Медитация' :
                     content.type === 'breathing' ? 'Дыхание' : 'Природа'}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                className={`bg-gradient-to-r ${content.color} text-white border-0`}
              >
                <Play size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Интеграция с Calm и Headspace</span>
        </div>
        <p className="text-xs text-blue-600">
          Мы используем лучшие практики из ведущих приложений для сна и медитации. 
          Персонализированные рекомендации на основе твоего эмоционального состояния.
        </p>
      </div>
    </motion.div>
  )
}
