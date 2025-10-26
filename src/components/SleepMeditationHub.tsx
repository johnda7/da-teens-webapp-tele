import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Moon, 
  Play, 
  Pause, 
  Timer, 
  Heart, 
  Brain, 
  Wind, 
  Tree, 
  Waves,
  Star,
  Clock,
  VolumeHigh,
  VolumeX
} from '@phosphor-icons/react'
import { useState } from 'react'

interface SleepContent {
  id: string
  title: string
  description: string
  duration: number
  type: 'sleep_story' | 'meditation' | 'breathing' | 'nature_sounds'
  category: 'calm' | 'headspace' | 'custom'
  image?: string
  audioUrl?: string
}

interface SleepMeditationHubProps {
  onContentSelect?: (content: SleepContent) => void
  currentMood?: 'stressed' | 'anxious' | 'tired' | 'energetic' | 'calm'
}

const sleepContent: SleepContent[] = [
  {
    id: 'sleep-story-1',
    title: 'Путешествие по звёздному небу',
    description: 'Расслабляющая история о путешествии среди звёзд',
    duration: 15,
    type: 'sleep_story',
    category: 'calm',
    image: '/images/sleep/stars.jpg'
  },
  {
    id: 'meditation-1',
    title: 'Дыхание для спокойствия',
    description: 'Простая техника дыхания для снятия стресса',
    duration: 10,
    type: 'meditation',
    category: 'headspace',
    image: '/images/meditation/breathing.jpg'
  },
  {
    id: 'nature-1',
    title: 'Звуки леса',
    description: 'Успокаивающие звуки природы для глубокого сна',
    duration: 30,
    type: 'nature_sounds',
    category: 'calm',
    image: '/images/nature/forest.jpg'
  },
  {
    id: 'breathing-1',
    title: '4-7-8 Дыхание',
    description: 'Техника дыхания для быстрого засыпания',
    duration: 5,
    type: 'breathing',
    category: 'custom',
    image: '/images/breathing/478.jpg'
  },
  {
    id: 'sleep-story-2',
    title: 'Подводный мир',
    description: 'Морское путешествие в глубины океана',
    duration: 20,
    type: 'sleep_story',
    category: 'calm',
    image: '/images/sleep/ocean.jpg'
  },
  {
    id: 'meditation-2',
    title: 'Сканирование тела',
    description: 'Медитация для расслабления каждой части тела',
    duration: 12,
    type: 'meditation',
    category: 'headspace',
    image: '/images/meditation/body-scan.jpg'
  }
]

const typeIcons = {
  sleep_story: { icon: Moon, color: 'bg-purple-500', label: 'Сон' },
  meditation: { icon: Brain, color: 'bg-blue-500', label: 'Медитация' },
  breathing: { icon: Wind, color: 'bg-green-500', label: 'Дыхание' },
  nature_sounds: { icon: Tree, color: 'bg-emerald-500', label: 'Природа' }
}

const categoryColors = {
  calm: 'bg-purple-100 text-purple-700 border-purple-200',
  headspace: 'bg-blue-100 text-blue-700 border-blue-200',
  custom: 'bg-green-100 text-green-700 border-green-200'
}

export default function SleepMeditationHub({ onContentSelect, currentMood = 'calm' }: SleepMeditationHubProps) {
  const [selectedContent, setSelectedContent] = useState<SleepContent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)

  const getMoodRecommendations = () => {
    switch (currentMood) {
      case 'stressed':
        return sleepContent.filter(c => c.type === 'breathing' || c.type === 'meditation')
      case 'anxious':
        return sleepContent.filter(c => c.type === 'breathing' || c.type === 'nature_sounds')
      case 'tired':
        return sleepContent.filter(c => c.type === 'sleep_story' || c.type === 'nature_sounds')
      case 'energetic':
        return sleepContent.filter(c => c.type === 'meditation' || c.type === 'breathing')
      default:
        return sleepContent
    }
  }

  const handleContentSelect = (content: SleepContent) => {
    setSelectedContent(content)
    onContentSelect?.(content)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}ч ${mins}мин`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Сон и Медитация
          </h2>
        </motion.div>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Персонализированные программы для сна и медитации, вдохновлённые Calm и Headspace
        </p>
      </div>

      {/* Mood-based recommendations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold text-gray-800">Рекомендации для твоего настроения</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {getMoodRecommendations().slice(0, 4).map((content) => {
            const typeConfig = typeIcons[content.type]
            const Icon = typeConfig.icon
            
            return (
              <motion.div
                key={content.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => handleContentSelect(content)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`${typeConfig.color} rounded-full p-2 w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                    <p className="text-xs text-gray-500">{formatDuration(content.duration)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* All content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sleepContent.map((content, index) => {
          const typeConfig = typeIcons[content.type]
          const Icon = typeConfig.icon
          const isSelected = selectedContent?.id === content.id

          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm ${
                  isSelected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => handleContentSelect(content)}
              >
                <CardContent className="p-0">
                  {/* Image placeholder */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">{content.title}</p>
                    </div>
                    
                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${typeConfig.color} text-white text-xs`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className={`text-xs ${categoryColors[content.category]}`}>
                        {content.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{content.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Timer className="w-4 h-4" />
                        {formatDuration(content.duration)}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsPlaying(!isPlaying)
                        }}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Player (when content is selected) */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 rounded-full p-3">
              {(() => {
                const Icon = typeIcons[selectedContent.type].icon
                return <Icon className="w-6 h-6" />
              })()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedContent.title}</h3>
              <p className="text-white/80">{selectedContent.description}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <div className="flex items-center gap-2 flex-1">
              <VolumeX className="w-4 h-4" />
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${volume}%` }}
                />
              </div>
              <VolumeHigh className="w-4 h-4" />
            </div>

            <div className="text-sm text-white/80">
              {formatDuration(selectedContent.duration)}
            </div>
          </div>
        </motion.div>
      )}

      {/* Calm & Headspace integration info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
      >
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <Star className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">
              Интеграция с Calm и Headspace
            </h4>
            <p className="text-sm text-green-700">
              Мы используем лучшие практики из ведущих приложений для сна и медитации. 
              Персонализированные рекомендации на основе твоего эмоционального состояния.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
