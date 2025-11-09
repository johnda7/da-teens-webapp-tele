import { Fragment, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowsLeftRight,
  ChatsCircle,
  CheckCircle,
  Heart,
  Lightning,
  Pause,
  Question,
  ShootingStar,
  SquaresFour,
  TextT,
  XCircle
} from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Lesson } from '@/data/boundariesModule'
import { lessonToGameExercises, type GameExercise, type GameExerciseType } from '@/lib/game/lessonToGameExercises'
import type { KatyaEmotion } from './KatyaCharacter'

interface GameLessonProps {
  lesson: Lesson
  onComplete: (xp: number, score: number) => void
  onExit: () => void
  onEmotionChange: (emotion: KatyaEmotion, message: string) => void
  onHeartsChange?: (hearts: number) => void
}

const HEARTS_MAX = 5
const XP_PER_CORRECT = 15
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const POSITIVE_MESSAGES = [
  'Отлично! Ты чувствуешь границы лучше с каждым ответом.',
  'Класс! Это здоровый пример границ.',
  'Так держать! Ты говоришь про границы уверенно.'
]

const SUPPORT_MESSAGES = [
  'Почти! Давай рассмотрим другие варианты.',
  'Не переживай, мы для того и тренируемся.',
  'Хорошая попытка. Катя подскажет, как ответить.'
]

const EXERCISE_META: Record<GameExerciseType, { label: string; accent: string; icon: React.ReactNode }> = {
  'multiple-choice': {
    label: 'Выбор ответа',
    accent: 'from-indigo-500 to-sky-500',
    icon: <SquaresFour weight="fill" className="h-3.5 w-3.5 text-white" />
  },
  roleplay: {
    label: 'Диалог с Катей',
    accent: 'from-purple-500 to-pink-500',
    icon: <ChatsCircle weight="fill" className="h-3.5 w-3.5 text-white" />
  },
  matching: {
    label: 'Соотнеси примеры',
    accent: 'from-sky-500 to-cyan-500',
    icon: <ArrowsLeftRight weight="fill" className="h-3.5 w-3.5 text-white" />
  },
  'fill-in': {
    label: 'Заполни пропуск',
    accent: 'from-emerald-500 to-teal-500',
    icon: <TextT weight="fill" className="h-3.5 w-3.5 text-white" />
  },
  'true-false': {
    label: 'Верно / неверно',
    accent: 'from-amber-500 to-orange-500',
    icon: <Question weight="fill" className="h-3.5 w-3.5 text-white" />
  }
}

export function GameLesson({ lesson, onComplete, onExit, onEmotionChange, onHeartsChange }: GameLessonProps) {
  const exercises = useMemo<GameExercise[]>(() => lessonToGameExercises(lesson), [lesson])
  const totalExercises = exercises.length

  const [currentExercise, setCurrentExercise] = useState(0)
  const [hearts, setHearts] = useState(HEARTS_MAX)
  const [score, setScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string; explanation?: string } | null>(null)
  const [recentXp, setRecentXp] = useState<number | null>(null)
  const [lostHeartIndex, setLostHeartIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [combo, setCombo] = useState(0)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    onEmotionChange('happy', 'Привет! Сегодня разберём, что такое личные границы.')
    onHeartsChange?.(HEARTS_MAX)
    setCurrentExercise(0)
    setHearts(HEARTS_MAX)
    setScore(0)
    setXpEarned(0)
    setCombo(0)
    setSelectedOption(null)
    setFeedback(null)
    setRecentXp(null)
    setLostHeartIndex(null)
    setIsPaused(false)
  }, [lesson.id, onEmotionChange, onHeartsChange])

  useEffect(() => {
    onHeartsChange?.(hearts)
  }, [hearts, onHeartsChange])

  useEffect(() => {
    if (recentXp === null) return
    const timeout = setTimeout(() => setRecentXp(null), 1200)
    return () => clearTimeout(timeout)
  }, [recentXp])

  useEffect(() => {
    if (lostHeartIndex === null) return
    const timeout = setTimeout(() => setLostHeartIndex(null), 900)
    return () => clearTimeout(timeout)
  }, [lostHeartIndex])

  const handleAnswer = (optionId: string) => {
    if (selectedOption || isPaused) return

    const exercise = exercises[currentExercise]
    const correctAnswer = exercise.correctAnswer
    const isCorrect = Array.isArray(correctAnswer) ? correctAnswer.includes(optionId) : correctAnswer === optionId
    const chosenOption = exercise.options.find((option) => option.id === optionId)

    setSelectedOption(optionId)

    const heartsAfterAnswer = isCorrect ? hearts : Math.max(0, hearts - 1)
    setHearts(heartsAfterAnswer)

    let updatedScore = score
    let updatedXp = xpEarned
    let nextCombo = combo
    let xpGain = 0

    if (isCorrect) {
      const message = POSITIVE_MESSAGES[currentExercise % POSITIVE_MESSAGES.length]
      onEmotionChange('celebrating', message)
      nextCombo = combo + 1
      const comboBonus = nextCombo > 1 ? (nextCombo - 1) * 5 : 0
      xpGain = XP_PER_CORRECT + comboBonus
      updatedScore = score + 1
      updatedXp = xpEarned + xpGain
      setScore(updatedScore)
      setCombo(nextCombo)
      setXpEarned(updatedXp)
      setRecentXp(xpGain)
      setFeedback({
        type: 'success',
        text: 'Правильно! Ты уже начинаешь чувствовать, где твои границы.',
        explanation: chosenOption?.feedback || exercise.explanation
      })
    } else {
      const message = SUPPORT_MESSAGES[currentExercise % SUPPORT_MESSAGES.length]
      onEmotionChange('sad', message)
      setCombo(0)
      setRecentXp(null)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
      setFeedback({
        type: 'error',
        text: 'Ничего страшного. Давай разберёмся ещё раз.',
        explanation: chosenOption?.feedback || exercise.explanation
      })
      setLostHeartIndex(heartsAfterAnswer)
    }

    const completionScore = updatedScore
    const completionXp = updatedXp

    setTimeout(() => {
      const nextIndex = currentExercise + 1

      if (heartsAfterAnswer <= 0) {
        onEmotionChange('supportive', 'Ты справился, даже если было тяжело. Катя гордится тобой!')
        onComplete(Math.max(20, completionXp), completionScore)
        return
      }

      if (nextIndex >= totalExercises) {
        onEmotionChange('celebrating', 'Вау! Ты прошёл первый урок про границы.')
        onComplete(Math.max(30, completionXp), completionScore)
        return
      }

      setCurrentExercise(nextIndex)
      setSelectedOption(null)
      setFeedback(null)
      const supportiveMessage = 'Катя рядом. Посмотрим следующий пример!'
      onEmotionChange('supportive', supportiveMessage)
    }, 1600)
  }

  const renderOption = (optionId: string, text: string, optionIndex: number) => {
    const exercise = exercises[currentExercise]
    const isActive = selectedOption === optionId
    const isCorrect = Array.isArray(exercise.correctAnswer)
      ? exercise.correctAnswer.includes(optionId)
      : exercise.correctAnswer === optionId

    const stateClass = !selectedOption
      ? 'hover:border-slate-300 hover:bg-white/90'
      : isCorrect
        ? 'border-emerald-400 bg-emerald-50/80 text-emerald-700'
        : isActive
          ? 'border-rose-400 bg-rose-50/80 text-rose-600'
          : 'opacity-60'

    const isDisabled = !!selectedOption || isPaused

    return (
      <Button
        key={optionId}
        variant="outline"
        onClick={() => handleAnswer(optionId)}
        disabled={isDisabled}
        className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
          stateClass === 'hover:border-slate-300 hover:bg-white/90'
            ? 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300 hover:bg-white'
            : stateClass.includes('emerald')
              ? 'border-emerald-300 bg-emerald-50/80 text-emerald-700'
              : stateClass.includes('rose')
                ? 'border-rose-300 bg-rose-50/80 text-rose-600'
                : 'opacity-70 border-slate-200 bg-white/70 text-slate-500'
        }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-500 text-sm font-semibold text-white">
          {OPTION_LETTERS[optionIndex] ?? '?'}
        </span>
        <div className="flex flex-1 items-center justify-between gap-3">
          <span className="text-sm font-medium leading-relaxed">{text}</span>
          <AnimatePresence>
            {selectedOption &&
              (isCorrect ? (
                <motion.span
                  key={`${optionId}-correct`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-emerald-500"
                >
                  <CheckCircle weight="fill" className="h-5 w-5" />
                </motion.span>
              ) : (
                isActive && (
                  <motion.span
                    key={`${optionId}-incorrect`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-rose-500"
                  >
                    <XCircle weight="fill" className="h-5 w-5" />
                  </motion.span>
                )
              ))}
          </AnimatePresence>
        </div>
      </Button>
    )
  }

  const progressValue = ((currentExercise + 1) / totalExercises) * 100
  const current = exercises[currentExercise]
  const currentMeta = EXERCISE_META[current.type] ?? EXERCISE_META['multiple-choice']

  const renderSentenceWithGap = (sentence: string) => {
    const parts = sentence.split('____')
    if (parts.length === 1) return sentence

    return (
      <>
        {parts.map((part, index) => (
          <Fragment key={index}>
            {part}
            {index !== parts.length - 1 && (
              <span className="mx-1 inline-flex items-center rounded-full bg-slate-200/80 px-2 py-0.5 text-sm font-semibold text-slate-700">
                ____
              </span>
            )}
          </Fragment>
        ))}
      </>
    )
  }

  return (
    <Card className="relative w-full border-white/50 bg-white/80 backdrop-blur-xl shadow-[0_18px_60px_-30px_rgba(15,23,42,0.45)]">
      <CardHeader className="border-b border-white/60 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-white"
          >
            <ArrowLeft size={16} />
            Выйти
          </button>

          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <div className="relative inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1">
              <Lightning weight="fill" className="h-4 w-4 text-[#34C759]" />
              <span>{xpEarned} XP</span>
              <AnimatePresence>
                {recentXp !== null && (
                  <motion.span
                    key={`xp-${recentXp}-${currentExercise}`}
                    className="absolute -top-6 right-0 inline-flex rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: -2 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    +{recentXp}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {combo >= 2 && (
                <motion.div
                  key={`combo-${combo}`}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -6 }}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600 shadow-sm"
                >
                  <ShootingStar weight="fill" className="h-4 w-4" />
                  <span>{combo}x серия</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="inline-flex items-center gap-1 text-rose-500">
              {Array.from({ length: HEARTS_MAX }).map((_, index) => (
                <motion.span
                  key={index}
                  animate={
                    lostHeartIndex === index
                      ? { scale: [1, 1.4, 0.7, 1], rotate: [0, -10, 6, 0], opacity: [1, 0.6, 1] }
                      : { scale: 1, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <Heart
                    weight={index < hearts ? 'fill' : 'regular'}
                    className={`h-4 w-4 transition ${index < hearts ? 'text-rose-500' : 'text-rose-300'}`}
                  />
                </motion.span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsPaused(true)
                onEmotionChange('supportive', 'Сделаем микро-паузу: вдох на 4, выдох на 6.')
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-white"
            >
              <Pause className="h-3.5 w-3.5" />
              Пауза
            </button>
          </div>
        </div>

        <CardTitle className="mt-4 text-left text-lg font-semibold text-slate-900">
          {lesson.title}
        </CardTitle>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${currentMeta.accent} px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm`}>
            {currentMeta.icon}
            <span>{currentMeta.label}</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Вопрос {currentExercise + 1} / {totalExercises}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Прогресс</span>
            <span>
              {currentExercise + 1} из {totalExercises}
            </span>
          </div>
          <Progress value={progressValue} className="h-2.5 overflow-hidden rounded-full bg-slate-100 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#34C759] [&_[data-slot=progress-indicator]]:via-[#5AC8FA] [&_[data-slot=progress-indicator]]:to-[#0A84FF]" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-inner">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={
              isShaking
                ? { opacity: 1, y: 0, x: [-6, 6, -4, 4, 0] }
                : { opacity: 1, y: 0, x: 0 }
            }
            transition={{ duration: isShaking ? 0.6 : 0.3, ease: 'easeOut' }}
            className="space-y-4 text-base font-medium leading-relaxed text-slate-900"
          >
            <p>{current.prompt}</p>

            {current.context && (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 text-sm font-normal text-slate-700 shadow-sm">
                {current.context}
              </div>
            )}

            {current.sentence && (
              <div className="rounded-xl bg-slate-100/70 px-3 py-2 text-sm font-medium text-slate-800">
                {renderSentenceWithGap(current.sentence)}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid gap-3">
          {current.options.map((option, idx) => renderOption(option.id, option.text, idx))}
        </div>

        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback.text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              <p className="font-semibold">{feedback.text}</p>
              {feedback.explanation && (
                <p className="mt-1 text-xs text-slate-600">{feedback.explanation}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {isPaused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-3xl border border-white/50 bg-white/95 p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#5AC8FA] to-[#007AFF] text-2xl">
              🫁
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Минутка дыхания</h3>
            <p className="mt-2 text-sm text-slate-600">
              Закрой глаза. Сделай вдох на 4 счёта → задержка на 2 → медленный выдох на 6. Повтори три раза.
            </p>
            <ul className="mt-4 space-y-1 text-left text-sm text-slate-700">
              <li>• Чувствуешь, как тело расслабляется.</li>
              <li>• Скажи себе: «Я могу устанавливать границы».</li>
              <li>• Когда будешь готов — возвращайся к заданию.</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                setIsPaused(false)
                onEmotionChange('supportive', 'Отлично, двигаемся дальше. Ты справишься!')
              }}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#34C759] to-[#5AC8FA] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
            >
              Вернуться к уроку
            </button>
          </motion.div>
        </div>
      )}
    </Card>
  )
}

