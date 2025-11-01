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
  SpeakerHigh,
  SpeakerX
} from '@phosphor-icons/react'
import { useState, useRef, useEffect } from 'react'

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

// Бесплатные аудио-ресурсы для медитаций
// 
// ИСТОЧНИКИ БЕСПЛАТНЫХ ЗВУКОВ:
// 1. Pixabay.com/music - бесплатные звуки природы, CC0 лицензия
// 2. Freesound.org - CC0 public domain звуки
// 3. Archive.org - публичные медитации
//
// Для треков без audioUrl используется синтетический розовый шум через Web Audio API
// (более приятный чем белый шум, с lowpass фильтром для успокаивающего эффекта)

const sleepContent: SleepContent[] = [
  {
    id: 'sleep-story-1',
    title: 'Путешествие по звёздному небу',
    description: 'Расслабляющая история о путешествии среди звёзд',
    duration: 15,
    type: 'sleep_story',
    category: 'calm',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&q=80', // Stars
    audioUrl: null
  },
  {
    id: 'meditation-1',
    title: 'Дыхание для спокойствия',
    description: 'Простая техника дыхания для снятия стресса',
    duration: 10,
    type: 'meditation',
    category: 'headspace',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // Mountain landscape
    audioUrl: null
  },
  {
    id: 'nature-1',
    title: 'Звуки леса',
    description: 'Успокаивающие звуки природы для глубокого сна',
    duration: 30,
    type: 'nature_sounds',
    category: 'calm',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', // Forest
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },
  {
    id: 'breathing-1',
    title: '4-7-8 Дыхание',
    description: 'Техника дыхания для быстрого засыпания',
    duration: 5,
    type: 'breathing',
    category: 'custom',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', // Sky with clouds
    audioUrl: null
  },
  {
    id: 'sleep-story-2',
    title: 'Подводный мир',
    description: 'Морское путешествие в глубины океана',
    duration: 20,
    type: 'sleep_story',
    category: 'calm',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', // Ocean
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 'meditation-2',
    title: 'Сканирование тела',
    description: 'Медитация для расслабления каждой части тела',
    duration: 12,
    type: 'meditation',
    category: 'headspace',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // Mountain landscape
    audioUrl: null
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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

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

  // Инициализация аудио при выборе контента
  useEffect(() => {
    if (!selectedContent) {
      // Очистка при сбросе выбора
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
        } catch (e) {}
        sourceNodeRef.current = null
      }
      gainNodeRef.current = null
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
      return
    }

    // Если есть URL - используем HTML5 audio
    if (selectedContent.audioUrl) {
      const audio = new Audio(selectedContent.audioUrl)
      audio.loop = true
      audio.volume = volume / 100
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
      
      audioRef.current = audio
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ''
        }
      }
    } else {
      // Для синтетических звуков просто устанавливаем длительность
      setDuration(selectedContent.duration * 60)
    }
  }, [selectedContent, volume])

  // Управление воспроизведением
  useEffect(() => {
    if (!selectedContent) return

    // HTML5 Audio
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
      return
    }

    // Web Audio API для синтетических звуков
    if (!selectedContent.audioUrl) {
      if (isPlaying) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          
          // Создаём контекст если его нет
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextClass()
          }
          
          const audioContext = audioContextRef.current
          
          // Возобновляем если приостановлен
          if (audioContext.state === 'suspended') {
            audioContext.resume()
          }
          
          // Генерируем успокаивающий звук (розовый шум)
          const bufferLength = audioContext.sampleRate * 2 // 2 секунды буфера для loop
          const buffer = audioContext.createBuffer(1, bufferLength, audioContext.sampleRate)
          const data = buffer.getChannelData(0)
          
          // Генерация розового шума
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
          for (let i = 0; i < bufferLength; i++) {
            const white = Math.random() * 2 - 1
            b0 = 0.99886 * b0 + white * 0.0555179
            b1 = 0.99332 * b1 + white * 0.0750759
            b2 = 0.96900 * b2 + white * 0.1538520
            b3 = 0.86650 * b3 + white * 0.3104856
            b4 = 0.55000 * b4 + white * 0.5329522
            b5 = -0.7616 * b5 - white * 0.0168980
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
            data[i] *= 0.11 // Нормализация
            b6 = white * 0.115926
          }
          
          const source = audioContext.createBufferSource()
          source.buffer = buffer
          source.loop = true
          
          // Добавляем фильтр для более приятного звука
          const filter = audioContext.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = 800
          filter.Q.value = 1
          
          const gainNode = audioContext.createGain()
          gainNode.gain.value = volume / 100
          gainNodeRef.current = gainNode
          
          source.connect(filter)
          filter.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          source.start(0)
          sourceNodeRef.current = source
        } catch (e) {
          console.error('Ошибка воспроизведения аудио:', e)
          setIsPlaying(false)
        }
      } else {
        // Останавливаем синтетический звук
        if (sourceNodeRef.current) {
          try {
            sourceNodeRef.current.stop()
          } catch (e) {}
          sourceNodeRef.current = null
        }
        gainNodeRef.current = null
      }
    }
  }, [isPlaying, selectedContent, volume])

  // Обновление громкости
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
    // Обновляем громкость для синтетического звука
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100
    }
  }, [volume])

  // Таймер для синтетического звука
  useEffect(() => {
    if (!selectedContent || !isPlaying || selectedContent.audioUrl) return
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1
        if (next >= duration) {
          setIsPlaying(false)
          return 0
        }
        return next
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [isPlaying, selectedContent, duration])

  const handleContentSelect = (content: SleepContent) => {
    // Останавливаем предыдущее воспроизведение
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
      } catch (e) {}
    }
    
    setSelectedContent(content)
    setCurrentTime(0)
    setIsPlaying(false)
    onContentSelect?.(content)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}ч ${mins}мин`
  }

  // Генерация градиентов для картинок на основе типа
  const getImageGradient = (type: string) => {
    const gradients: Record<string, string> = {
      sleep_story: 'from-blue-600 via-indigo-600 to-purple-600',
      meditation: 'from-cyan-600 via-blue-600 to-indigo-600',
      breathing: 'from-emerald-600 via-teal-600 to-cyan-600',
      nature_sounds: 'from-green-600 via-emerald-600 to-teal-600'
    }
    return gradients[type] || 'from-gray-600 to-gray-800'
  }

  return (
    <div className="space-y-4">
      {/* Header - более компактный */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2.5">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Сон и Медитация
          </h2>
        </motion.div>
        
        <p className="text-sm text-gray-600">
          Персонализированные программы для сна и медитации
        </p>
      </div>

      {/* Mood-based recommendations - горизонтальный скролл, 2 в ряд */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Heart className="w-4 h-4 text-pink-500" />
          <h3 className="text-sm font-semibold text-gray-800">Для твоего настроения</h3>
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {getMoodRecommendations().slice(0, 4).map((content) => {
            const typeConfig = typeIcons[content.type]
            const Icon = typeConfig.icon
            
            return (
              <motion.div
                key={content.id}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 border-0 w-[120px] bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md overflow-hidden"
                  onClick={() => handleContentSelect(content)}
                >
                  <CardContent className="p-0">
                    {/* Real image */}
                    {content.image ? (
                      <div className="relative h-16 w-full overflow-hidden">
                        <img 
                          src={content.image} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    ) : (
                      <div className={`bg-gradient-to-br ${getImageGradient(content.type)} rounded-xl h-16 w-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="p-1.5 text-center">
                      <h4 className="font-medium text-[10px] mb-0.5 leading-tight line-clamp-2">{content.title}</h4>
                      <p className="text-[9px] text-gray-500">{formatDuration(content.duration)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* All content - горизонтальный скролл, 2 видимые карточки */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 px-1">Все программы</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {sleepContent.map((content, index) => {
            const typeConfig = typeIcons[content.type]
            const Icon = typeConfig.icon
            const isSelected = selectedContent?.id === content.id

            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-0 w-[140px] bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleContentSelect(content)}
                >
                  <CardContent className="p-0">
                    {/* Real image */}
                    {content.image ? (
                      <div className="relative h-20 w-full overflow-hidden">
                        <img 
                          src={content.image} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* Type badge */}
                        <div className="absolute top-1 left-1">
                          <Badge className={`bg-black/40 text-white text-[9px] px-1 py-0 border-0 backdrop-blur-sm`}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className={`relative bg-gradient-to-br ${getImageGradient(content.type)} h-20 w-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white/90" />
                        {/* Type badge */}
                        <div className="absolute top-1 left-1">
                          <Badge className={`bg-black/40 text-white text-[9px] px-1 py-0 border-0 backdrop-blur-sm`}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Content info - компактнее */}
                    <div className="p-2">
                      <h3 className="font-semibold text-[10px] mb-0.5 leading-tight line-clamp-2">{content.title}</h3>
                      <p className="text-[9px] text-gray-600 mb-1 line-clamp-2 leading-tight">{content.description}</p>
                      
                      <div className="flex items-center gap-0.5 text-[9px] text-gray-500">
                        <Timer className="w-2.5 h-2.5" />
                        {formatDuration(content.duration)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Player (when content is selected) - Liquid Glass */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-white/40"
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Thumbnail */}
            {selectedContent.image ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={selectedContent.image} 
                  alt={selectedContent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = typeIcons[selectedContent.type].icon
                  return <Icon className="w-6 h-6 text-white" />
                })()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{selectedContent.title}</h3>
              <p className="text-xs text-gray-600 truncate">{selectedContent.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 flex-shrink-0"
              onClick={() => {
                handleContentSelect(selectedContent)
                setSelectedContent(null)
              }}
            >
              ✕
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/40 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || selectedContent.duration * 60)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 rounded-full h-10 w-10 p-0 shadow-md flex-shrink-0"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <div className="flex items-center gap-2 flex-1">
              <SpeakerX 
                className="w-3.5 h-3.5 text-gray-600 cursor-pointer flex-shrink-0" 
                onClick={() => handleVolumeChange(0)}
              />
              <div 
                className="flex-1 bg-white/40 rounded-full h-1.5 cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const newVolume = (x / rect.width) * 100
                  handleVolumeChange(newVolume)
                }}
              >
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full h-1.5 transition-all duration-300"
                  style={{ width: `${volume}%` }}
                />
              </div>
              <SpeakerHigh 
                className="w-3.5 h-3.5 text-gray-600 cursor-pointer flex-shrink-0"
                onClick={() => handleVolumeChange(100)}
              />
            </div>
          </div>

          {/* Скрытый audio элемент для URL-based аудио */}
          {selectedContent.audioUrl && (
            <audio
              ref={audioRef as any}
              src={selectedContent.audioUrl}
              loop
              preload="metadata"
            />
          )}
        </motion.div>
      )}

      {/* Integration info - более компактный */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100/50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 rounded-full p-1.5">
            <Star className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-xs">Персонализированные рекомендации</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
