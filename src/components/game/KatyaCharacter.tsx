import { memo } from 'react'
import { motion } from 'framer-motion'

type KatyaEmotion = 'happy' | 'supportive' | 'celebrating' | 'sad'

type KatyaVariant = 'primary' | 'companion'

interface KatyaCharacterProps {
  emotion: KatyaEmotion
  message: string
  variant?: KatyaVariant
}

const emotionVariants: Record<KatyaEmotion, { scale: number; rotate: number; shadow: string }> = {
  happy: { scale: 1, rotate: 0, shadow: 'shadow-blue-200' },
  supportive: { scale: 1.02, rotate: -2, shadow: 'shadow-purple-200' },
  celebrating: { scale: 1.08, rotate: 2, shadow: 'shadow-amber-200' },
  sad: { scale: 0.95, rotate: 0, shadow: 'shadow-cyan-200' }
}

const emotionAccent: Record<KatyaEmotion, string> = {
  happy: 'from-[#34C759] to-[#5AC8FA]',
  supportive: 'from-[#007AFF] to-[#5AC8FA]',
  celebrating: 'from-[#FF9500] to-[#FFCC00]',
  sad: 'from-[#8E8E93] to-[#5AC8FA]'
}

const variantStyles: Record<KatyaVariant, { container: string; bubble: string; nameplate: string }> = {
  primary: {
    container: 'max-w-[260px] p-5',
    bubble: 'w-24 h-24 text-4xl',
    nameplate: 'text-xs'
  },
  companion: {
    container: 'max-w-[220px] p-4 border-dashed',
    bubble: 'w-20 h-20 text-3xl',
    nameplate: 'text-[11px]'
  }
}

export const KatyaCharacter = memo(({ emotion, message, variant = 'primary' }: KatyaCharacterProps) => {
  const emotionStyle = emotionVariants[emotion]
  const variantStyle = variantStyles[variant]

  return (
    <div className="w-full">
      <motion.div
        key={emotion}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: emotionStyle.scale, rotate: emotionStyle.rotate }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className={`relative mx-auto rounded-3xl bg-white/90 backdrop-blur-md border border-white/40 ${emotionStyle.shadow} ${variantStyle.container}`}
      >
        <motion.div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br ${emotionAccent[emotion]} flex items-center justify-center shadow-lg ${variantStyle.bubble}`}
          animate={{
            y: emotion === 'celebrating' ? [0, -4, 0] : [0, 2, 0],
            rotate: emotion === 'supportive' ? [-2, 2, -2] : 0
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            role="img"
            aria-label="Психолог Катя"
            className={variantStyle.bubble.includes('text-3xl') ? 'text-3xl' : 'text-4xl'}
            animate={{
              rotate: emotion === 'celebrating' ? [0, 6, -6, 0] : emotion === 'sad' ? [0, -3, 3, 0] : 0,
              scale: emotion === 'happy' ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🧠
          </motion.span>
        </motion.div>

        <div className="pt-16 text-center space-y-3">
          <motion.div
            className={`inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1 font-medium text-slate-600 ${variantStyle.nameplate}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>Психолог Катя</span>
            {emotion === 'celebrating' && <span>🎉</span>}
            {emotion === 'sad' && <span>💛</span>}
          </motion.div>

          <motion.p
            key={message}
            className="text-sm font-medium leading-relaxed text-slate-900"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
})

KatyaCharacter.displayName = 'KatyaCharacter'

export type { KatyaEmotion, KatyaVariant }

