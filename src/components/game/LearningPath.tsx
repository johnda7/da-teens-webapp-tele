import { motion } from 'framer-motion'

import { AnimatedKatya } from './AnimatedKatya'
import { LessonNode, type LessonStatus } from './LessonNode'

interface LearningPathLesson {
  id: string
  title: string
  status: LessonStatus
  xp: number
}

interface LearningPathProps {
  lessons: LearningPathLesson[]
  currentLessonIndex: number
  onLessonStart?: (lessonId: string) => void
  weekNumber?: number
}

export function LearningPath({
  lessons,
  currentLessonIndex,
  onLessonStart,
  weekNumber = 1
}: LearningPathProps) {
  const completedLessons = lessons.filter((lesson) => lesson.status === 'completed').length
  const progressPercentage = lessons.length ? (completedLessons / lessons.length) * 100 : 0

  const heroMood: Parameters<typeof AnimatedKatya>[0]['mood'] =
    completedLessons === lessons.length
      ? 'celebrate'
      : currentLessonIndex === 0
        ? 'default'
        : currentLessonIndex <= 2
          ? 'thinking'
          : 'support'

  const heroTitle =
    completedLessons === lessons.length
      ? 'Ура! Ты завершил(а) все уроки 🎉'
      : currentLessonIndex === 0
        ? 'Привет! Начнём путешествие 👋'
        : 'Продолжай, у тебя получается! 💪'

  return (
    <div className="relative pb-28">
      <div className="pointer-events-none absolute inset-x-[8%] top-0 bottom-12 hidden md:block">
        <motion.div
          className="absolute left-1/2 h-full w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#E8F1FF]/75 via-[#F5EBFF]/75 to-[#FFE6F2]/75 blur-3xl"
          initial={{ opacity: 0, scaleY: 0.6 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.svg
          viewBox="0 0 320 1000"
          className="absolute left-1/2 h-full w-40 -translate-x-1/2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 160 0 C 140 120 180 180 160 260 C 140 340 200 400 160 480 C 120 560 200 640 160 720 C 120 800 180 860 160 960"
            stroke="url(#pathGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-4 mb-12 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#F7F4FF] via-[#FDF8FF] to-[#F2FBFF] p-6 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.22)] ring-1 ring-white/60 md:mx-auto md:max-w-4xl md:p-9"
      >
        <div className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 h-64 w-64 rounded-full bg-rose-300/25 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
          <motion.div
            className="relative mx-auto w-28 md:mx-0 md:w-32"
            animate={{
              y: [0, -6, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute -top-5 -right-3 flex items-center justify-center">
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="text-3xl"
              >
                💜
              </motion.span>
            </div>
            <AnimatedKatya mood={heroMood} animate />
          </motion.div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{heroTitle}</h2>
            <div className="flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:text-base">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-500 shadow-sm md:text-sm">
                Неделя {weekNumber}
              </span>
              <span>
                Пройдено уроков: <strong>{completedLessons}</strong> / {lessons.length}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#34d399] via-[#60a5fa] to-[#f97316]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 space-y-10 md:mx-auto md:max-w-5xl">
        {lessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            title={lesson.title}
            status={lesson.status}
            xp={lesson.xp}
            index={index}
            total={lessons.length}
            onStart={() => onLessonStart?.(lesson.id)}
          />
        ))}
      </div>

      {completedLessons === lessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 18 }}
          className="relative z-10 mx-4 mt-12 overflow-hidden rounded-[30px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-xl md:mx-auto md:max-w-3xl"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="w-20 md:w-24">
              <AnimatedKatya mood="celebrate" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-slate-900">Отличная работа!</h3>
              <p className="text-sm text-slate-600">
                Ты завершил(а) всю неделю. Готов перейти к следующей или повторить любимые уроки?
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export type { LearningPathLesson }

