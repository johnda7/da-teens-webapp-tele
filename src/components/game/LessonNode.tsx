import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, LockSimple, Star, Sparkle, Target } from '@phosphor-icons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedKatya } from './AnimatedKatya'

type LessonStatus = 'locked' | 'available' | 'current' | 'completed'

interface LessonNodeProps {
  title: string
  status: LessonStatus
  xp: number
  index: number
  total: number
  onStart?: () => void
}

const STATUS_THEME: Record<
  LessonStatus,
  { gradient: string; glow: string; iconTone: string; badgeTone: string; label: string }
> = {
  completed: {
    gradient: 'from-emerald-100 via-emerald-50 to-white',
    glow: 'shadow-[0_18px_36px_rgba(16,185,129,0.22)]',
    iconTone: 'bg-gradient-to-br from-emerald-500 to-emerald-400 text-white',
    badgeTone: 'bg-emerald-500 text-white',
    label: 'Готово'
  },
  current: {
    gradient: 'from-amber-100 via-amber-50 to-white',
    glow: 'shadow-[0_20px_44px_rgba(245,158,11,0.25)]',
    iconTone: 'bg-gradient-to-br from-amber-500 to-amber-400 text-white',
    badgeTone: 'bg-amber-500 text-white',
    label: 'Сейчас'
  },
  available: {
    gradient: 'from-sky-100 via-sky-50 to-white',
    glow: 'shadow-[0_20px_44px_rgba(14,165,233,0.2)]',
    iconTone: 'bg-gradient-to-br from-sky-500 to-sky-400 text-white',
    badgeTone: 'bg-sky-500 text-white',
    label: 'Есть силы'
  },
  locked: {
    gradient: 'from-slate-100 via-slate-50 to-white',
    glow: 'shadow-[0_18px_32px_rgba(148,163,184,0.18)]',
    iconTone: 'bg-slate-200 text-slate-500',
    badgeTone: 'bg-slate-200 text-slate-600',
    label: 'Закрыто'
  }
}

const statusIcon = {
  completed: CheckCircle,
  current: Target,
  available: BookOpen,
  locked: LockSimple
} satisfies Record<LessonStatus, typeof CheckCircle>

export function LessonNode({ title, status, xp, index, total, onStart }: LessonNodeProps) {
  const theme = STATUS_THEME[status]
  const Icon = statusIcon[status]
  const isLeftAligned = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeftAligned ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120, damping: 16 }}
      className={`relative ${isLeftAligned ? 'mr-auto' : 'ml-auto'} w-[92%] max-w-xl`}
    >
      {index < total - 1 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 64 }}
          transition={{ delay: index * 0.08 + 0.3, type: 'spring', stiffness: 150, damping: 18 }}
          className={`absolute ${isLeftAligned ? 'right-0 translate-x-5' : 'left-0 -translate-x-5'} top-full w-0.5 rounded-full ${
            status === 'completed'
              ? 'bg-gradient-to-b from-emerald-300 via-sky-300 to-indigo-300'
              : 'bg-gradient-to-b from-slate-200 via-slate-200/80 to-transparent'
          }`}
        />
      )}

      <motion.div
        whileHover={status !== 'locked' ? { scale: 1.03, y: -4 } : undefined}
        whileTap={status !== 'locked' ? { scale: 0.98 } : undefined}
        className={`relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br ${theme.gradient} px-6 py-6 transition-shadow duration-300 ${theme.glow}`}
      >
        <div className="pointer-events-none absolute -top-14 left-6 h-20 w-20 rounded-full bg-white/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-6 h-24 w-24 rounded-full bg-white/40 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <motion.div
            animate={
              status === 'current'
                ? {
                    rotate: [0, -8, 8, -6, 0],
                    scale: [1, 1.05, 1]
                  }
                : undefined
            }
            transition={{ duration: 2.4, repeat: status === 'current' ? Infinity : 0, repeatDelay: 0.4 }}
            className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-3xl text-2xl ${theme.iconTone}`}
          >
            <Icon weight="fill" className="h-8 w-8" />
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={`text-base font-semibold ${status === 'locked' ? 'text-slate-500' : 'text-slate-900'}`}>
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className={`flex items-center gap-1 text-xs font-semibold ${theme.badgeTone}`}>
                  <Sparkle className="h-3.5 w-3.5" weight="fill" />
                  +{xp} XP
                </Badge>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{theme.label}</span>
              </div>
            </div>

            {status === 'locked' && <p className="text-xs text-slate-500">Сначала заверши предыдущий урок.</p>}
            {status === 'completed' && (
              <p className="text-xs font-medium text-emerald-600">Урок закрыт! Катя гордится твоей настойчивостью.</p>
            )}
            {status === 'current' && (
              <p className="text-xs font-medium text-slate-700">Катя предлагает закрепить материал на практике.</p>
            )}
            {status === 'available' && (
              <p className="text-xs text-slate-600">Можно взять в удобном темпе, когда чувствуешь ресурс.</p>
            )}

            {status !== 'locked' && (
              <Button
                size="sm"
                variant={status === 'available' ? 'outline' : 'default'}
                className={`w-full rounded-2xl ${status === 'current' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}
                onClick={onStart}
              >
                {status === 'completed' ? 'Повторить урок' : status === 'available' ? 'Открыть урок' : 'Продолжить'}
              </Button>
            )}
          </div>
        </div>

        {status === 'current' && (
          <motion.div
            className="pointer-events-none absolute -top-16 right-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-16 w-16 drop-shadow-[0_10px_24px_rgba(99,102,241,0.35)]"
            >
              <AnimatedKatya mood="thinking" animate />
            </motion.div>
          </motion.div>
        )}

        {status === 'completed' && (
          <motion.div
            className="absolute -top-3 -right-3 flex gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.08 * item, type: 'spring', stiffness: 260, damping: 16 }}
              >
                <Star weight="fill" className="h-5 w-5 text-amber-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export type { LessonStatus }

