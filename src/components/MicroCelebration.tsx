import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Star, CheckCircle } from 'lucide-react'

interface MicroCelebrationProps {
  type: 'xp' | 'correct' | 'streak' | 'skill' | 'badge'
  value?: number
  message?: string
  onComplete?: () => void
}

export default function MicroCelebration({ type, value, message, onComplete }: MicroCelebrationProps) {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [onComplete])

  const getContent = () => {
    switch (type) {
      case 'xp':
        return {
          icon: '💎',
          text: value ? `+${value} XP!` : '+10 XP!',
          color: 'from-blue-500 to-cyan-500',
          emojis: ['✨', '💫', '⭐']
        }
      case 'correct':
        return {
          icon: '✅',
          text: 'Правильно!',
          color: 'from-green-500 to-emerald-500',
          emojis: ['🎉', '🌟', '💚']
        }
      case 'streak':
        return {
          icon: '🔥',
          text: 'Streak +1!',
          color: 'from-orange-500 to-red-500',
          emojis: ['🔥', '⚡', '💥']
        }
      case 'skill':
        return {
          icon: '🌟',
          text: 'Навык улучшен!',
          color: 'from-purple-500 to-pink-500',
          emojis: ['⭐', '✨', '💫']
        }
      case 'badge':
        return {
          icon: '🏆',
          text: 'Новый бейдж!',
          color: 'from-yellow-500 to-orange-500',
          emojis: ['👑', '💎', '⭐']
        }
      default:
        return {
          icon: '🎉',
          text: message || 'Отлично!',
          color: 'from-blue-500 to-cyan-500',
          emojis: ['✨', '💫', '⭐']
        }
    }
  }

  const content = getContent()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative"
        >
          {/* Sparkles Background */}
          <div className="absolute inset-0 -z-10">
            {content.emojis.map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                  x: [
                    '0px',
                    `${Math.cos((i * 2 * Math.PI) / content.emojis.length) * 100}px`
                  ],
                  y: [
                    '0px',
                    `${Math.sin((i * 2 * Math.PI) / content.emojis.length) * 100}px`
                  ]
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.2
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          {/* Main Celebration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10
            }}
            className={`bg-gradient-to-br ${content.color} rounded-2xl px-6 py-4 shadow-2xl border-4 border-white/50`}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-pulse">{content.icon}</span>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-xl font-bold"
              >
                {content.text}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Hook для легкого использования
export function useMicroCelebration() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'xp' | 'correct' | 'streak' | 'skill' | 'badge'>('xp')
  const [celebrationValue, setCelebrationValue] = useState<number>(0)

  const celebrate = (type: 'xp' | 'correct' | 'streak' | 'skill' | 'badge', value?: number) => {
    setCelebrationType(type)
    setCelebrationValue(value || 0)
    setShowCelebration(true)
  }

  return {
    celebrate,
    Celebration: showCelebration ? (
      <MicroCelebration
        type={celebrationType}
        value={celebrationValue}
        onComplete={() => setShowCelebration(false)}
      />
    ) : null
  }
}
