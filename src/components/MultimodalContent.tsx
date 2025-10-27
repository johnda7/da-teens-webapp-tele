import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SpeakerHigh, SpeakerSlash, SkipBack, SkipForward, Gear, Heart, Brain, Target } from '@phosphor-icons/react'

// Типы для мультимодального контента
interface AudioContent {
  id: string
  title: string
  description: string
  audioUrl: string
  duration: number
  emotionalTone: 'calm' | 'energetic' | 'focused' | 'gentle' | 'cheerful'
  russianAccent: boolean
  transcript: string
  timestamps: { time: number, text: string }[]
}

interface VisualContent {
  id: string
  title: string
  description: string
  imageUrl: string
  type: 'hero' | 'diagram' | 'scenario' | 'metaphor'
  emotionalVariant: 'anxious' | 'energetic' | 'focused' | 'calm' | 'excited'
  culturalContext: 'russian' | 'international'
  interactiveElements: {
    id: string
    type: 'click' | 'hover' | 'drag'
    position: { x: number, y: number }
    content: string
  }[]
}

interface MindMapNode {
  id: string
  title: string
  description: string
  position: { x: number, y: number }
  connections: string[]
  color: string
  size: 'small' | 'medium' | 'large'
}

interface MultimodalContentProps {
  id: string
  title: string
  description: string
  audioContent: AudioContent
  visualContent: VisualContent
  mindMap?: MindMapNode[]
  emotionalState: 'anxious' | 'energetic' | 'focused' | 'calm' | 'excited'
  culture: 'russian' | 'international'
  onComplete: (contentId: string, progress: number) => void
  onProgress: (progress: number) => void
}

export default function MultimodalContent({
  id,
  title,
  description,
  audioContent,
  visualContent,
  mindMap,
  emotionalState,
  culture,
  onComplete,
  onProgress
}: MultimodalContentProps) {
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [activeInteractiveElement, setActiveInteractiveElement] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Получаем эмоциональные стили
  const getEmotionalStyles = () => {
    const styles = {
      anxious: { colors: ['#FF6B6B', '#FFE66D'], animation: 'gentle' },
      energetic: { colors: ['#4ECDC4', '#45B7D1'], animation: 'dynamic' },
      focused: { colors: ['#96CEB4', '#FFEAA7'], animation: 'smooth' },
      calm: { colors: ['#A8E6CF', '#FFD93D'], animation: 'soft' },
      excited: { colors: ['#FF8A80', '#FFB74D'], animation: 'bouncy' }
    }
    return styles[emotionalState]
  }

  const emotionalStyles = getEmotionalStyles()

  // Обработка аудио
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      const newProgress = (audio.currentTime / audio.duration) * 100
      setProgress(newProgress)
      onProgress(newProgress)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete(id, 100)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [id, onComplete, onProgress])

  // Управление воспроизведением
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Перемотка
  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = time
    setCurrentTime(time)
  }

  // Управление громкостью
  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Форматирование времени
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Получение иконки для эмоционального тона
  const getEmotionalIcon = () => {
    switch (audioContent.emotionalTone) {
      case 'calm': return <Heart className="w-5 h-5" />
      case 'energetic': return <Target className="w-5 h-5" />
      case 'focused': return <Brain className="w-5 h-5" />
      case 'gentle': return <Heart className="w-5 h-5" />
      case 'cheerful': return <Target className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(135deg, ${emotionalStyles.colors.primary}20, ${emotionalStyles.colors.secondary}20)`
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {getEmotionalIcon()}
              <span className="capitalize">{audioContent.emotionalTone}</span>
            </div>
            {audioContent.russianAccent && (
              <div className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                🇷🇺 Русский акцент
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Content */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={visualContent.imageUrl}
                alt={visualContent.title}
                className="w-full h-64 object-cover rounded-xl"
              />
              
              {/* Interactive Elements */}
              {visualContent.interactiveElements.map((element) => (
                <motion.button
                  key={element.id}
                  className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-blue-600 transition-colors"
                  style={{
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveInteractiveElement(
                    activeInteractiveElement === element.id ? null : element.id
                  )}
                >
                  {element.id}
                </motion.button>
              ))}
            </div>

            {/* Interactive Element Details */}
            <AnimatePresence>
              {activeInteractiveElement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <p className="text-blue-800">
                    {visualContent.interactiveElements.find(el => el.id === activeInteractiveElement)?.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mind Map */}
            {mindMap && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Структура урока</h4>
                <div className="relative h-32">
                  {mindMap.map((node) => (
                    <motion.div
                      key={node.id}
                      className="absolute bg-white rounded-lg p-2 shadow-sm border"
                      style={{
                        left: `${node.position.x}%`,
                        top: `${node.position.y}%`,
                        backgroundColor: node.color
                      }}
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-xs font-medium text-white">{node.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Content */}
          <div className="space-y-4">
            {/* Audio Player */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:opacity-90"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{audioContent.title}</h4>
                  <p className="text-sm text-gray-600">{audioContent.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div
                  ref={progressRef}
                  className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                  onClick={(e) => {
                    const rect = progressRef.current?.getBoundingClientRect()
                    if (rect) {
                      const clickX = e.clientX - rect.left
                      const newTime = (clickX / rect.width) * duration
                      seek(newTime)
                    }
                  }}
                >
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => seek(Math.max(0, currentTime - 10))}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => seek(Math.min(duration, currentTime + 10))}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    {isMuted ? <SpeakerSlash className="w-5 h-5" /> : <SpeakerHigh className="w-5 h-5" />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Транскрипт</h4>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showTranscript ? 'Скрыть' : 'Показать'}
                </button>
              </div>
              
              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto"
                  >
                    {audioContent.transcript}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioContent.audioUrl}
        preload="metadata"
      />
    </motion.div>
  )
}
