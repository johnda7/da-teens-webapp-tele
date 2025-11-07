import { motion, AnimatePresence } from 'framer-motion'

interface KatyaCharacterProps {
  emotion: 'happy' | 'supportive' | 'celebrating' | 'sad' | 'neutral'
  message?: string
  show: boolean
}

const avatars = {
  happy: '👩‍🏫',
  supportive: '💪',
  celebrating: '🎉',
  sad: '😔',
  neutral: '👋'
}

const defaultMessages = {
  happy: 'Привет! Готов начать урок?',
  supportive: 'Отлично! Продолжай!',
  celebrating: 'Поздравляю! Ты справился! 🎊',
  sad: 'Почти! Попробуй еще раз 💪',
  neutral: 'Давай начнем!'
}

export default function KatyaCharacter({ emotion, message, show }: KatyaCharacterProps) {
  if (!show) return null

  const displayMessage = message || defaultMessages[emotion]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center gap-3 p-4"
      >
        <motion.div
          className="text-6xl"
          animate={{
            scale: emotion === 'celebrating' ? [1, 1.2, 1] : 1,
            rotate: emotion === 'celebrating' ? [0, 10, -10, 0] : 0
          }}
          transition={{
            duration: 0.5,
            repeat: emotion === 'celebrating' ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {avatars[emotion]}
        </motion.div>
        {displayMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-purple-200">
              <p className="text-sm font-medium text-gray-800">{displayMessage}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

