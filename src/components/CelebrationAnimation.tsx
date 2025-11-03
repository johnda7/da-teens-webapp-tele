import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkles, Star, Flame } from 'lucide-react'

interface CelebrationProps {
  milestone: number
  type: 'streak' | 'xp' | 'lesson' | 'week'
  onClose?: () => void
}

export default function CelebrationAnimation({ milestone, type, onClose }: CelebrationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        setShow(false)
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  const getMilestoneInfo = () => {
    switch (milestone) {
      case 7:
        return {
          title: 'Неделя силы! 🔥',
          message: '7 дней подряд! Ты молодец!',
          icon: '🔥',
          color: 'from-orange-500 to-red-500'
        }
      case 30:
        return {
          title: 'Месяц мастерства! 🏆',
          message: '30 дней! Это серьёзно!',
          icon: '🏆',
          color: 'from-yellow-500 to-orange-500'
        }
      case 100:
        return {
          title: 'Сто дней легенды! ⭐',
          message: '100 дней - ты легенда!',
          icon: '⭐',
          color: 'from-purple-500 to-pink-500'
        }
      default:
        return {
          title: 'Поздравляем! 🎉',
          message: `Достигнут рубеж ${milestone}!`,
          icon: '🎉',
          color: 'from-blue-500 to-cyan-500'
        }
    }
  }

  const info = getMilestoneInfo()

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-10 w-80 max-w-[90vw]"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r opacity-30 blur-2xl animate-pulse rounded-full" 
                 style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                 aria-hidden="true" />

            <div className={`relative bg-gradient-to-br ${info.color} rounded-3xl p-8 shadow-2xl border-4 border-white/50`}>
              {/* Sparkles Background */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ 
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      opacity: 0
                    }}
                    animate={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center text-white">
                {/* Icon Animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="text-7xl mb-4"
                >
                  {info.icon}
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-2"
                >
                  {info.title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg mb-4"
                >
                  {info.message}
                </motion.p>

                {/* Milestone Number */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.4,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className="inline-block bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4"
                >
                  <div className="text-4xl font-black">{milestone}</div>
                  {type === 'streak' && <div className="text-sm opacity-90">дней streak</div>}
                  {type === 'xp' && <div className="text-sm opacity-90">XP заработано</div>}
                  {type === 'lesson' && <div className="text-sm opacity-90">уроков</div>}
                  {type === 'week' && <div className="text-sm opacity-90">недель</div>}
                </motion.div>

                {/* Bonus Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Бонус +{milestone === 7 ? '50' : milestone === 30 ? '200' : '500'} XP</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

