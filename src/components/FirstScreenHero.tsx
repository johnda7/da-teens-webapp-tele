import { motion } from 'framer-motion'
import { ShieldCheck, UsersThree, ClockAfternoon, Heartbeat, Play } from '@phosphor-icons/react'

interface FirstScreenHeroProps {
  onStartLearning: () => void
  userProgress?: {
    lessonsCompleted: number
    totalLessons: number
    xpEarned: number
  }
  showProgress?: boolean
}

/**
 * FirstScreenHero — короткий эмоциональный «hook» для первого экрана модуля
 * Фокус: 1) боль 2) обещание результата 3) CTA 4) social proof
 * Компактная верстка с легкими анимациями (без тяжёлых зависимостей)
 */
export default function FirstScreenHero({ onStartLearning, userProgress, showProgress = true }: FirstScreenHeroProps) {
  const completed = userProgress?.lessonsCompleted ?? 0
  const total = userProgress?.totalLessons ?? 9
  const percent = Math.round((completed / Math.max(1, total)) * 100)

  return (
    <div className="relative overflow-hidden">
      {/* Liquid Glass background orbs */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-10 -left-10 w-[260px] h-[260px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,122,255,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
          animate={{ x: [0, 20, -10, 0], y: [0, 10, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-12 right-0 w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(90,200,250,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ x: [0, -30, 10, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="px-4 py-4">
        {/* Заголовок-хук */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px]">
            <ShieldCheck size={14} weight="fill" />
            Защита личных границ
          </div>
          <h1 className="mt-2 text-[22px] leading-6 font-bold text-gray-900">
            Тяжело сказать «нет»?
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Научись защищать себя за 3 недели. 5 минут в день — и ты уже увереннее.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStartLearning}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 active:scale-[0.99] transition-all shadow-glass"
        >
          <Play size={16} weight="fill" />
          {completed === 0 ? 'Начать бесплатно' : 'Продолжить'}
        </button>

        {/* Социальное доказательство / мини-прогресс */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-gray-700">
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md border rounded-lg px-2 py-1">
            <UsersThree size={14} className="text-blue-600" />
            <span>50,000+ подростков</span>
          </div>
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md border rounded-lg px-2 py-1">
            <ClockAfternoon size={14} className="text-blue-600" />
            <span>5 мин/день</span>
          </div>
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md border rounded-lg px-2 py-1">
            <Heartbeat size={14} className="text-blue-600" />
            <span>от психолога</span>
          </div>
        </div>

        {showProgress && (
          <div className="mt-3 text-xs text-gray-600">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-1 text-right font-medium text-gray-700">{percent}%</div>
          </div>
        )}
      </div>
    </div>
  )
}
