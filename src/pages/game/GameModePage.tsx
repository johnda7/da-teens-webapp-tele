import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  ChatsCircle,
  Crown,
  Flame,
  Heart,
  Lightning,
  Play,
  UsersThree,
  VideoCamera
} from '@phosphor-icons/react'

import type { KatyaMood } from '@/components/game/AnimatedKatya'
import type { LearningPathLesson } from '@/components/game/LearningPath'
import type { KatyaEmotion } from '@/components/game/KatyaCharacter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useKV } from '@/lib/kv'
import type { Lesson } from '@/data/boundariesModule'

const AnimatedKatya = lazy(() =>
  import('@/components/game/AnimatedKatya').then((module) => ({ default: module.AnimatedKatya }))
)
const GameLesson = lazy(() =>
  import('@/components/game/GameLesson').then((module) => ({ default: module.GameLesson }))
)
const LearningPath = lazy(() =>
  import('@/components/game/LearningPath').then((module) => ({ default: module.LearningPath }))
)
const GameHeroCard = lazy(() =>
  import('@/components/game/GameHeroCard').then((module) => ({ default: module.GameHeroCard }))
)
const BalanceWheel = lazy(() =>
  import('@/components/game/BalanceWheel').then((module) => ({ default: module.BalanceWheel }))
)
const loadBoundariesModule = () => import('@/data/boundariesModule')

const HeroCardSkeleton = () => (
  <div className="h-[260px] w-full animate-pulse rounded-[36px] bg-gradient-to-br from-white/70 via-white/40 to-white/20 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.18)]" />
)

const LearningPathSkeleton = () => (
  <div className="h-[520px] w-full animate-pulse rounded-[32px] bg-white/60 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.25)] backdrop-blur" />
)

const LessonSkeleton = () => (
  <div className="min-h-[620px] w-full animate-pulse rounded-[32px] bg-white/70 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur" />
)

const ChartSkeleton = () => (
  <div className="h-[260px] w-full animate-pulse rounded-3xl bg-white/65 shadow-inner backdrop-blur" />
)

type View = 'path' | 'lesson' | 'checkin' | 'chat' | 'group' | 'videos'

interface GameProgress {
  xp: number
  streak: number
  completedLessonIds: string[]
  lastLessonId: string | null
  heartsLeft: number
}

const EMOTION_TO_MOOD: Record<KatyaEmotion, KatyaMood> = {
  happy: 'default',
  supportive: 'support',
  celebrating: 'celebrate',
  sad: 'support'
}

export default function GameModePage() {
  const [view, setView] = useState<View>('path')
  const [gameProgress, setGameProgress] = useKV<GameProgress>('game-progress', {
    xp: 0,
    streak: 0,
    completedLessonIds: [],
    lastLessonId: null,
    heartsLeft: 5
  })
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(gameProgress.lastLessonId)
  const [hearts, setHearts] = useState(gameProgress.heartsLeft ?? 5)
  const [emotion, setEmotion] = useState<KatyaEmotion>('happy')
  const [katyaMessage, setKatyaMessage] = useState('Привет! Сегодня разберём, что такое личные границы.')
  const [companionEmotion, setCompanionEmotion] = useState<KatyaEmotion>('supportive')
  const [companionMessage, setCompanionMessage] = useState(
    'Я с тобой. Если чувствуешь напряжение — сделаем паузу и продолжим.'
  )

  const moodOptions = useMemo(
    () => [
      { id: 'energized', emoji: '⚡', label: 'Воодушевлён', note: 'Готов на новые вызовы' },
      { id: 'balanced', emoji: '😊', label: 'Спокойно', note: 'Сохраняю ровное настроение' },
      { id: 'stressed', emoji: '😕', label: 'Немного напряжён', note: 'Нужна поддержка и паузы' },
      { id: 'tired', emoji: '😴', label: 'Устал', note: 'Хочу восстановить ресурс' }
    ],
    []
  )
  const quickReplies = useMemo(
    () => [
      'Катя, помоги сформулировать «нет» для друга',
      'Как можно поддержать себя после сложного разговора?',
      'Есть ли упражнение на расслабление перед сном?'
    ],
    []
  )
  const videoEpisodes = useMemo(
    () => [
      { title: 'Введение в личные границы', date: '12.01.2025', duration: '45 мин', level: 'Новичок' },
      { title: 'Практика: говорим «нет»', date: '09.01.2025', duration: '30 мин', level: 'Практика' },
      { title: 'Границы в семье', date: '05.01.2025', duration: '50 мин', level: 'Поддержка' }
    ],
    []
  )

  interface BalanceDimension {
    id: string
    label: string
    description: string
    icon: string
  }

  interface BalanceProfile {
    initial: Record<string, number> | null
    current: Record<string, number>
    updatedAt: string | null
  }

  const balanceDimensions = useMemo<BalanceDimension[]>(
    () => [
      { id: 'family', label: 'Семья', description: 'Отношения с родителями и родственниками', icon: '🏡' },
      { id: 'friends', label: 'Друзья', description: 'Общение и поддержка друзей', icon: '🤝' },
      { id: 'school', label: 'Школа', description: 'Учёба и отношения с учителями', icon: '📚' },
      { id: 'online', label: 'Цифровые границы', description: 'Время онлайна и соцсети', icon: '🌐' },
      { id: 'selfcare', label: 'Время для себя', description: 'Личное пространство и интересы', icon: '🧘‍♀️' },
      { id: 'confidence', label: 'Уверенность', description: 'Способность говорить о своих чувствах', icon: '💪' },
      { id: 'boundaries', label: 'Границы', description: 'Умение говорить «нет» и защищать себя', icon: '🛡️' },
      { id: 'emotions', label: 'Эмоции', description: 'Осознанность и управление эмоциями', icon: '💜' },
      { id: 'stress', label: 'Стресс', description: 'Насколько удаётся расслабляться', icon: '🌿' },
      { id: 'energy', label: 'Энергия', description: 'Уровень сил и мотивации', icon: '⚡' },
      { id: 'sleep', label: 'Сон', description: 'Качество и регулярность сна', icon: '😴' },
      { id: 'support', label: 'Поддержка', description: 'Есть ли взрослые, которым можно доверять', icon: '🫶' }
    ],
    []
  )

  const defaultBalanceScores = useMemo(() => {
    const scores: Record<string, number> = {}
    balanceDimensions.forEach((dimension) => {
      scores[dimension.id] = 5
    })
    return scores
  }, [balanceDimensions])

  const [balanceProfile, setBalanceProfile] = useKV<BalanceProfile>('balance-profile', {
    initial: null,
    current: defaultBalanceScores,
    updatedAt: null
  })
  const [balanceFormValues, setBalanceFormValues] = useState<Record<string, number>>(defaultBalanceScores)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)

  const handleStartAssessment = useCallback(() => {
    setBalanceFormValues(balanceProfile.initial ? { ...balanceProfile.current } : { ...defaultBalanceScores })
    setIsAssessmentOpen(true)
  }, [balanceProfile.current, balanceProfile.initial, defaultBalanceScores])

  const handleCancelAssessment = useCallback(() => {
    setIsAssessmentOpen(false)
  }, [])

  const handleSaveAssessment = useCallback(() => {
    const timestamp = new Date().toISOString()
    if (!balanceProfile.initial) {
      setBalanceProfile({
        initial: { ...balanceFormValues },
        current: { ...balanceFormValues },
        updatedAt: timestamp
      })
    } else {
      setBalanceProfile({
        initial: balanceProfile.initial,
        current: { ...balanceFormValues },
        updatedAt: timestamp
      })
    }
    setIsAssessmentOpen(false)
  }, [balanceFormValues, balanceProfile.initial, setBalanceProfile])

  const initialAverage = useMemo(() => {
    if (!balanceProfile.initial) return null
    const scores = Object.values(balanceProfile.initial)
    return Math.round((scores.reduce((acc, value) => acc + value, 0) / scores.length) * 10) / 10
  }, [balanceProfile.initial])

  const currentAverage = useMemo(() => {
    const scores = Object.values(balanceProfile.current)
    return Math.round((scores.reduce((acc, value) => acc + value, 0) / scores.length) * 10) / 10
  }, [balanceProfile.current])

  const [selectedMood, setSelectedMood] = useState<string>('balanced')
  const [anxietyLevel, setAnxietyLevel] = useState(4)
  const [sleepHours, setSleepHours] = useState('')
  const [highlightNote, setHighlightNote] = useState('')
  const [checkinSaved, setCheckinSaved] = useState(false)
  const [draftMessage, setDraftMessage] = useState('')

  const handleSaveCheckin = useCallback(() => {
    setCheckinSaved(true)
    window.setTimeout(() => setCheckinSaved(false), 2200)
  }, [])

  const handleQuickReply = useCallback((reply: string) => {
    setDraftMessage(reply)
  }, [])

  const activeMood = useMemo(() => moodOptions.find((mood) => mood.id === selectedMood), [moodOptions, selectedMood])

  const xpEarned = gameProgress.xp ?? 0
  const streak = gameProgress.streak ?? 0
  const completedLessonIds = gameProgress.completedLessonIds ?? []
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLessonsLoading, setIsLessonsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    loadBoundariesModule()
      .then((module) => {
        const data = module.boundariesModule?.lessons ?? module.default?.lessons ?? []
        if (isActive) {
          setLessons(data)
          setIsLessonsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Не удалось загрузить данные модуля "Личные границы"', error)
        if (isActive) {
          setLessons([])
          setIsLessonsLoading(false)
        }
      })
    return () => {
      isActive = false
    }
  }, [])

  const handleEmotionChange = useCallback((nextEmotion: KatyaEmotion, message: string) => {
    setEmotion(nextEmotion)
    setKatyaMessage(message)
  }, [])

  const handleLessonComplete = useCallback(
    (xp: number, score: number) => {
      const lessonId = selectedLessonId
      const uniqueCompleted = lessonId
        ? Array.from(new Set([...(gameProgress.completedLessonIds ?? []), lessonId]))
        : gameProgress.completedLessonIds ?? []

      setGameProgress({
        xp: (gameProgress.xp ?? 0) + xp,
        streak: (gameProgress.streak ?? 0) + Math.max(1, score > 0 ? 1 : 0),
        completedLessonIds: uniqueCompleted,
        lastLessonId: lessonId ?? gameProgress.lastLessonId,
        heartsLeft: 5
      })
      setEmotion('celebrating')
      setKatyaMessage('Ты сделал первый шаг! Катя уже готовит новый челлендж.')
      setHearts(5)
      setView('path')
      setSelectedLessonId(null)
    },
    [selectedLessonId, gameProgress, setGameProgress]
  )

  useEffect(() => {
    if (hearts >= 4) {
      setCompanionEmotion('celebrating')
      setCompanionMessage('Высокий ресурс! Попробуем пройти без ошибок и собрать бонус XP.')
    } else if (hearts >= 2) {
      setCompanionEmotion('supportive')
      setCompanionMessage('Если сложно — вдох на 4, выдох на 6. Катя рядом.')
    } else {
      setCompanionEmotion('sad')
      setCompanionMessage('Даже одна жизнь — шанс всё изменить. Попробуем ещё раз вместе.')
    }
  }, [hearts])

  useEffect(() => {
    if ((gameProgress.heartsLeft ?? 5) !== hearts) {
      setGameProgress({
        ...gameProgress,
        heartsLeft: hearts
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hearts])

  useEffect(() => {
    setHearts(gameProgress.heartsLeft ?? 5)
    if (gameProgress.lastLessonId && view === 'path') {
      setSelectedLessonId(null)
    }
  }, [gameProgress.heartsLeft, gameProgress.lastLessonId, view])

  const currentLessonIndex = useMemo(() => {
    if (selectedLessonId) {
      const index = lessons.findIndex((lesson) => lesson.id === selectedLessonId)
      return index === -1 ? 0 : index
    }
    const firstIncomplete = lessons.findIndex((lesson) => !completedLessonIds.includes(lesson.id))
    if (firstIncomplete === -1) {
      return Math.max(lessons.length - 1, 0)
    }
    return firstIncomplete
  }, [lessons, selectedLessonId, completedLessonIds])

  const learningPathLessons = useMemo<LearningPathLesson[]>(() => {
    if (lessons.length === 0) {
      return []
    }
    const completedSet = new Set(completedLessonIds)
    const firstIncompleteIndex = lessons.findIndex((lesson) => !completedSet.has(lesson.id))

    return lessons.map((lesson, index) => {
      let status: LearningPathLesson['status'] = 'locked'

      if (completedSet.has(lesson.id)) {
        status = 'completed'
      } else if (selectedLessonId === lesson.id) {
        status = 'current'
      } else if (firstIncompleteIndex === -1) {
        status = 'completed'
      } else if (index === firstIncompleteIndex) {
        status = 'current'
      } else if (index === firstIncompleteIndex + 1) {
        status = 'available'
      }

      const xp =
        lesson.quiz.length >= 5 ? 70 : lesson.difficulty === 'hard' ? 80 : lesson.difficulty === 'medium' ? 60 : 50

      return {
        id: lesson.id,
        title: lesson.title,
        status,
        xp
      }
    })
  }, [lessons, completedLessonIds, selectedLessonId])

  const selectedLesson = useMemo(() => {
    if (!lessons.length) return undefined
    if (selectedLessonId) {
      return lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0]
    }
    return lessons[currentLessonIndex] ?? lessons[0]
  }, [lessons, selectedLessonId, currentLessonIndex])

  const handleStartLesson = useCallback(
    (lessonId: string) => {
      if (!lessons.length) return
      setSelectedLessonId(lessonId)
      setView('lesson')
      setEmotion('happy')
      setHearts(gameProgress.heartsLeft ?? 5)
      setKatyaMessage('Привет! Сегодня разберём, что такое личные границы.')
      setGameProgress({
        ...gameProgress,
        lastLessonId: lessonId
      })
    },
    [gameProgress, setGameProgress, lessons.length]
  )

  const handleExitLesson = useCallback(() => {
    setView('path')
    setSelectedLessonId(null)
  }, [])

  const heroMood: KatyaMood =
    completedLessonIds.length === lessons.length
      ? 'celebrate'
      : currentLessonIndex === 0
        ? 'default'
        : currentLessonIndex <= 2
          ? 'thinking'
          : 'support'

  const heroTitle =
    completedLessonIds.length === lessons.length
      ? 'Ура! Ты завершил(а) все уроки 🎉'
      : currentLessonIndex === 0
        ? 'Стартуем в Duolingo-режиме вместе с Катей'
        : 'Катя видит прогресс — идём дальше в своём темпе'

  const heroSubtitle =
    completedLessonIds.length === 0
      ? 'Впереди мягкий старт: познакомимся с личными границами и попробуем первую практику.'
      : completedLessonIds.length === lessons.length
        ? 'Все уроки недели закрыты. Хочешь повторить понравившиеся или заглянуть в следующее приключение?'
        : `Уже ${completedLessonIds.length} урок(ов) позади. Следующий шаг — «${lessons[currentLessonIndex]?.title ?? 'новый урок'}».`

  const heroMessage =
    hearts >= 4
      ? 'Чувствую высокий ресурс — можем смело взять следующий челлендж 💜'
      : hearts >= 2
        ? 'Если устал(а) — делаем паузу и возвращаемся когда почувствуешь силы.'
        : 'Катя рядом. Начнём с самого лёгкого и восстановим ресурс шаг за шагом.'

  const nextLessonForHero = useMemo(
    () =>
      learningPathLessons.find((lesson) => lesson.status === 'current') ??
      learningPathLessons.find((lesson) => lesson.status === 'available'),
    [learningPathLessons]
  )

  const handleContinuePath = useCallback(() => {
    if (nextLessonForHero) {
      handleStartLesson(nextLessonForHero.id)
    }
  }, [nextLessonForHero, handleStartLesson])

  const navView = view === 'lesson' ? 'path' : view

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF4FF] via-[#F1F7FF] to-[#E9FAFF]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-70">
        <motion.div
          className="absolute -top-24 -right-16 h-[320px] w-[320px] rounded-full bg-sky-400/15 blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-[-10%] h-[360px] w-[360px] rounded-full bg-emerald-300/15 blur-3xl"
          animate={{ opacity: [0.3, 0.55, 0.3], y: [0, -24, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-3 pb-24 pt-6 md:max-w-6xl md:px-8 md:pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/85 px-6 py-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md">
              <Play weight="fill" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Игровой режим</p>
              <h1 className="text-lg font-semibold text-slate-900">Катя помогает прокачать личные границы</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1.5 text-emerald-600 shadow-sm">
              <Lightning weight="fill" className="h-4 w-4" />
              <span>{xpEarned} XP</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 text-amber-600 shadow-sm">
              <Flame weight="fill" className="h-4 w-4" />
              <span>{streak} дней</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1.5 text-indigo-600 shadow-sm">
              <Crown weight="fill" className="h-4 w-4" />
              <span>Уровень 2</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-2xl bg-rose-50 px-3 py-1.5 text-rose-500 shadow-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <Heart
                  key={index}
                  weight={index < hearts ? 'fill' : 'regular'}
                  className="h-4 w-4 transition"
                />
              ))}
            </div>
          </div>
        </header>

        {view === 'path' && (
          isLessonsLoading && lessons.length === 0 ? (
            <div className="mt-12 flex flex-1 items-center justify-center">
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-500 shadow-lg">
                Загружаем уроки…
              </div>
            </div>
          ) : (
          <div className="mt-8 flex-1 space-y-8">
            <Card className="border-none bg-white/95 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightning weight="fill" className="h-5 w-5 text-indigo-500" />
                  Колесо баланса
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Отслеживай, как меняется твоё состояние в разных сферах жизни.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 shadow-inner">
                  <Suspense fallback={<ChartSkeleton />}>
                    <BalanceWheel
                      current={balanceDimensions.map((dimension) => ({
                        id: dimension.id,
                        label: dimension.label,
                        value: balanceProfile.current[dimension.id] ?? 0
                      }))}
                      baseline={balanceProfile.initial}
                    />
                  </Suspense>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm">
                      <p className="font-semibold uppercase tracking-wide text-slate-400">Средний уровень сейчас</p>
                      <p className="text-lg font-semibold text-slate-900">{currentAverage}</p>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm">
                      <p className="font-semibold uppercase tracking-wide text-slate-400">Стартовый уровень</p>
                      <p className="text-lg font-semibold text-slate-900">{initialAverage ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {balanceDimensions.slice(0, 4).map((dimension) => (
                      <div key={dimension.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2 text-xs text-slate-500">
                        <span className="text-lg" aria-hidden>
                          {dimension.icon}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{dimension.label}</p>
                          <p>{dimension.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      className="rounded-2xl bg-indigo-500 px-5 py-2 text-sm font-semibold shadow-lg shadow-indigo-200/60 transition hover:bg-indigo-600"
                      onClick={handleStartAssessment}
                    >
                      {balanceProfile.initial ? 'Обновить показатели' : 'Пройти стартовый замер'}
                    </Button>
                    {balanceProfile.updatedAt && (
                      <span className="text-xs font-medium text-slate-400">
                        Обновлено {new Date(balanceProfile.updatedAt).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isAssessmentOpen && (
                    <motion.div
                      key="assessment-form"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-5 rounded-[28px] border border-slate-100 bg-white/95 p-5 shadow-[0_16px_40px_-30px_rgba(79,70,229,0.4)]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-800">Оцени каждую область (1 — сложно, 10 — всё супер)</h4>
                        <button
                          type="button"
                          onClick={handleCancelAssessment}
                          className="text-xs font-semibold uppercase tracking-wide text-indigo-400 hover:text-indigo-500"
                        >
                          Отмена
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                        {balanceDimensions.map((dimension) => (
                          <div key={dimension.id} className="space-y-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg" aria-hidden>
                                  {dimension.icon}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{dimension.label}</p>
                                  <p className="text-xs text-slate-500">{dimension.description}</p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-indigo-500">
                                {balanceFormValues[dimension.id]}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={balanceFormValues[dimension.id]}
                              onChange={(event) =>
                                setBalanceFormValues((prev) => ({
                                  ...prev,
                                  [dimension.id]: Number(event.target.value)
                                }))
                              }
                              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-rose-200 via-indigo-200 to-emerald-200 accent-indigo-500"
                            />
                            <div className="flex justify-between text-[11px] font-medium text-slate-400">
                              <span>1</span>
                              <span>10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={handleSaveAssessment} className="rounded-2xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600">
                          Сохранить
                        </Button>
                        {balanceProfile.initial && (
                          <span className="text-xs text-slate-500">
                            Изменение среднего: {initialAverage ? Math.round((currentAverage - initialAverage) * 10) / 10 : '—'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Suspense fallback={<HeroCardSkeleton />}>
              <GameHeroCard
                xp={xpEarned}
                streak={streak}
                hearts={hearts}
                title={heroTitle}
                subtitle={heroSubtitle}
                mood={heroMood}
                message={heroMessage}
                onContinue={nextLessonForHero ? handleContinuePath : undefined}
              />
            </Suspense>
            <Suspense fallback={<LearningPathSkeleton />}>
              <LearningPath
                lessons={learningPathLessons}
                currentLessonIndex={currentLessonIndex}
                onLessonStart={handleStartLesson}
                weekNumber={1}
              />
            </Suspense>
          </div>
          )
        )}

        {view === 'lesson' && selectedLesson && (
          <Suspense fallback={<LessonSkeleton />}>
            <main className="mt-12 grid flex-1 gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="flex flex-col items-center justify-start gap-6">
                <AnimatedKatya mood={EMOTION_TO_MOOD[emotion]} animate />
                <AnimatedKatya mood={EMOTION_TO_MOOD[companionEmotion]} message={companionMessage} />
              </div>

              <motion.div
                key={selectedLesson.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <GameLesson
                  lesson={selectedLesson}
                  onComplete={handleLessonComplete}
                  onExit={handleExitLesson}
                  onEmotionChange={handleEmotionChange}
                  onHeartsChange={setHearts}
                />
              </motion.div>
            </main>
          </Suspense>
        )}

        {view === 'checkin' && (
          <section className="mt-10 flex-1">
            <Card className="mx-auto w-full max-w-5xl border-none bg-white/90 shadow-xl backdrop-blur-md">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar weight="fill" className="h-5 w-5 text-indigo-500" />
                  Ежедневный чек-ин
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Как ты себя чувствуешь сегодня? Катя подскажет, как поддержать ресурс.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <div className="space-y-6">
                    <div className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 shadow-inner">
                      <p className="text-sm font-semibold text-slate-700">
                        Какое настроение ближе всего?
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {moodOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedMood(option.id)}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                              selectedMood === option.id
                                ? 'border-indigo-400 bg-white shadow-[0_12px_30px_rgba(79,70,229,0.15)]'
                                : 'border-transparent bg-white/80 hover:border-indigo-200 hover:bg-white'
                            }`}
                          >
                            <span className="flex items-center gap-3 text-base font-semibold text-slate-800">
                              <span className="text-2xl" aria-hidden>
                                {option.emoji}
                              </span>
                              {option.label}
                            </span>
                            <span className="text-xs font-medium text-slate-500">{option.note}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-inner">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Уровень тревоги</span>
                            <span>{anxietyLevel}/10</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={10}
                            value={anxietyLevel}
                            onChange={(event) => setAnxietyLevel(Number(event.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-emerald-300 via-indigo-300 to-rose-300 accent-indigo-500"
                          />
                          <div className="flex justify-between text-[11px] font-medium text-slate-400">
                            <span>Спокойно</span>
                            <span>Есть напряжение</span>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Сон, ч</p>
                            <Input
                              type="number"
                              min={0}
                              max={14}
                              inputMode="decimal"
                              placeholder="8"
                              value={sleepHours}
                              onChange={(event) => setSleepHours(event.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Главный момент дня</p>
                            <textarea
                              rows={3}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              placeholder="Например: смог(ла) мягко отказать и сохранить границу"
                              value={highlightNote}
                              onChange={(event) => setHighlightNote(event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button className="rounded-2xl bg-indigo-500 px-6 py-2 text-sm font-semibold shadow-lg shadow-indigo-200/60 transition hover:bg-indigo-600" onClick={handleSaveCheckin}>
                            Сохранить чек-ин
                          </Button>
                          <AnimatePresence>
                            {checkinSaved && (
                              <motion.span
                                key="checkin-saved"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600"
                              >
                                <Lightning weight="fill" className="h-3.5 w-3.5" />
                                Супер! Записал.
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    key={selectedMood}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.35)]"
                  >
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-0 h-44 w-44 rounded-full bg-rose-200/30 blur-3xl" />

                    <div className="relative space-y-5">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Личный дайджест</h3>
                      <div className="space-y-2 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Настроение</p>
                        <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
                          <span className="text-xl">{activeMood?.emoji}</span>
                          {activeMood?.label}
                        </p>
                        <p className="text-sm text-slate-600">{activeMood?.note}</p>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Тревога</p>
                          <p className="text-sm font-semibold text-slate-900">{anxietyLevel}/10</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Сон</p>
                          <p className="text-sm font-semibold text-slate-900">{sleepHours || '—'} ч</p>
                        </div>
                      </div>
                      <div className="space-y-2 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Фокус дня</p>
                        <p className="text-sm text-slate-700">
                          {highlightNote || 'Поделись, чем ты гордишься сегодня — Катя добавит в дневник успехов.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {view === 'chat' && (
          <section className="mt-10 flex-1">
            <Card className="mx-auto w-full max-w-5xl border-none bg-white/90 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ChatsCircle weight="fill" className="h-5 w-5 text-purple-500" />
                  Чат с Катей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-[32px] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-sky-50 p-5 shadow-inner">
                  <div className="space-y-4 h-72 overflow-hidden rounded-3xl bg-white/70 p-4 shadow-inner">
                    <div className="flex gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-500 text-white">💜</div>
                      <div className="max-w-[70%] rounded-2xl rounded-tl-none bg-white/90 p-3 text-sm shadow">
                        Привет! Как прошёл сегодняшний день?
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <div className="max-w-[70%] rounded-2xl rounded-tr-none bg-indigo-500/90 p-3 text-sm text-white shadow">
                        Привет! Я сегодня сказал «нет» и сохранил своё время. Чувствую гордость.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Быстрые подсказки</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-500"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-[24px] border border-slate-100 bg-white/90 p-4 shadow-inner">
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Напиши сообщение..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button className="rounded-2xl bg-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-600">
                      Отправить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {view === 'group' && (
          <section className="mt-10 flex-1">
            <Card className="mx-auto w-full max-w-5xl border-none bg-white/90 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UsersThree weight="fill" className="h-5 w-5 text-sky-500" />
                  Группа поддержки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-inner">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 text-3xl text-white shadow-lg">
                      💬
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-900">«Личные границы» • 23 участника</p>
                      <p className="text-sm text-slate-600">
                        Общаемся, делимся победами, помогаем друг другу сохранять ресурс.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/80 bg-white/90 px-3 py-3 text-sm text-slate-600 shadow-sm">
                        <p className="font-semibold text-slate-900">🧡 Анонс встречи</p>
                        <p>В четверг обсуждаем «Как говорить «нет» мягко и уверенно».</p>
                      </div>
                      <div className="rounded-2xl border border-white/80 bg-white/90 px-3 py-3 text-sm text-slate-600 shadow-sm">
                        <p className="font-semibold text-slate-900">💡 Советы от Кати</p>
                        <p>Поделись победой недели — получишь поддержку и бонус XP.</p>
                      </div>
                    </div>
                    <Button className="rounded-2xl bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600">
                      Присоединиться к чату
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {view === 'videos' && (
          <section className="mt-10 flex-1">
            <Card className="mx-auto w-full max-w-5xl border-none bg-white/90 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <VideoCamera weight="fill" className="h-5 w-5 text-emerald-500" />
                  Записи встреч с Катей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoEpisodes.map((video) => (
                  <div
                    key={video.title}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm transition hover:border-slate-200"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-white">
                      <VideoCamera weight="fill" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900">{video.title}</p>
                      <p className="text-xs text-slate-500">
                        {video.date} • {video.duration} • уровень: {video.level}
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-2xl px-4 py-2 text-sm">
                      Смотреть
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        <nav className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 md:max-w-3xl">
          <div className="grid grid-cols-5 gap-2 rounded-3xl border border-white/60 bg-white/90 p-2 shadow-xl backdrop-blur-md">
            {[
              { id: 'path' as View, label: 'Дорога', icon: Play },
              { id: 'checkin' as View, label: 'Чек-ин', icon: Calendar },
              { id: 'chat' as View, label: 'Чат', icon: ChatsCircle },
              { id: 'group' as View, label: 'Группа', icon: UsersThree },
              { id: 'videos' as View, label: 'Записи', icon: VideoCamera }
            ].map((item) => {
              const Icon = item.icon
              const active = navView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium transition ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  <Icon weight="fill" className="h-5 w-5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

