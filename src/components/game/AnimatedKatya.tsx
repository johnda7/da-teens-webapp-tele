import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import katyaCelebrate from '@/assets/katya-celebrate.svg'
import katyaDefaultPng from '@/assets/katya/katya-mascot.png'
import katyaSupportPng from '@/assets/katya/katya-support.png'
import katyaThinkingPng from '@/assets/katya/katya-thinking.png'

type KatyaMood = 'default' | 'celebrate' | 'thinking' | 'support'

interface AnimatedKatyaProps {
  mood?: KatyaMood
  message?: string
  className?: string
  animate?: boolean
}

const KATYA_IMAGES: Record<KatyaMood, string> = {
  default: katyaDefaultPng,
  celebrate: katyaCelebrate,
  thinking: katyaThinkingPng,
  support: katyaSupportPng
}

export function AnimatedKatya({
  mood = 'default',
  message,
  className = '',
  animate = true
}: AnimatedKatyaProps) {
  const [currentMood, setCurrentMood] = useState<KatyaMood>(mood)

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={animate ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={animate ? { scale: 1.05 } : undefined}
        className="relative"
      >
        <motion.img
          key={currentMood}
          src={KATYA_IMAGES[currentMood]}
          alt="Психолог Катя"
          className="h-full w-full object-contain"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        />

        {animate && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            {mood === 'celebrate' && <span className="text-4xl">✨</span>}
            {mood === 'support' && <span className="text-4xl">💜</span>}
          </motion.div>
        )}
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mt-4 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 bg-white" />
          <p className="text-sm font-medium text-slate-800">{message}</p>
        </motion.div>
      )}
    </div>
  )
}

export type { KatyaMood }

