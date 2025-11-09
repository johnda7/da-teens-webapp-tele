import { memo } from 'react'
import { motion } from 'framer-motion'
import { Crown, Flame, Lightning, Sparkle } from '@phosphor-icons/react'

import { AnimatedKatya } from './AnimatedKatya'
import { Button } from '@/components/ui/button'

interface GameHeroCardProps {
  xp: number
  streak: number
  hearts: number
  title: string
  subtitle?: string
  message?: string
  onContinue?: () => void
  mood: Parameters<typeof AnimatedKatya>[0]['mood']
}

const heroStats = [
  {
    id: 'xp' as const,
    label: 'XP',
    Icon: Lightning,
    tone: 'from-emerald-400/20 to-emerald-300/10 text-emerald-600'
  },
  {
    id: 'streak' as const,
    label: 'Стик',
    Icon: Flame,
    tone: 'from-amber-400/20 to-amber-300/10 text-amber-600'
  },
  {
    id: 'level' as const,
    label: 'Уровень',
    Icon: Crown,
    tone: 'from-indigo-400/20 to-indigo-300/10 text-indigo-600'
  }
]

export const GameHeroCard = memo(function GameHeroCard({
  xp,
  streak,
  hearts,
  title,
  subtitle,
  message,
  onContinue,
  mood
}: GameHeroCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#F8F4FF] via-[#F1F6FF] to-[#ECFBFF] p-6 shadow-[0_40px_80px_0_rgba(79,70,229,0.08)] sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-[#C3F0FF]/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[#F6D8FF]/45 blur-3xl" />
        <motion.div
          className="absolute -top-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#A855F7]/25 via-[#60A5FA]/20 to-[#F97316]/20 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        />
      </div>

      <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 shadow-md shadow-indigo-200/40 backdrop-blur">
            <Sparkle className="h-4 w-4 text-indigo-500" weight="fill" />
            Катя в эфире
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="text-2xl font-bold leading-tight text-slate-900 sm:text-[32px]"
          >
            {title}
          </motion.h2>

          {subtitle && <p className="text-sm text-slate-600 sm:text-base">{subtitle}</p>}

          <div className="flex flex-wrap gap-3">
            {heroStats.map((stat) => {
              const value =
                stat.id === 'xp' ? `${xp} XP` : stat.id === 'streak' ? `${streak} дней` : hearts >= 4 ? 'Ур. 3' : 'Ур. 2'
              return (
                <div
                  key={stat.id}
                  className={`flex min-w-[132px] flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br px-4 py-3 shadow-sm backdrop-blur ${stat.tone}`}
                >
                  <stat.Icon weight="fill" className="h-5 w-5" />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</div>
                    <div className="text-sm font-bold text-slate-900">{value}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {typeof onContinue === 'function' && (
            <Button
              onClick={onContinue}
              className="rounded-2xl bg-indigo-500 px-6 py-5 text-base font-semibold shadow-lg shadow-indigo-200/60 transition hover:bg-indigo-600"
            >
              Продолжить путь
            </Button>
          )}
        </div>

        <motion.div
          className="relative mx-auto flex w-full max-w-xs items-center justify-center md:mx-0"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-white/50 via-white/20 to-white/10 blur-xl" />
          <AnimatedKatya mood={mood} message={message} animate />
          <motion.div
            className="pointer-events-none absolute -bottom-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-2xl"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3.6, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
})

