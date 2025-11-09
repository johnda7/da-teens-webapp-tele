import type { Lesson, QuizQuestion } from '@/data/boundariesModule'

export type GameExerciseType =
  | 'multiple-choice'
  | 'roleplay'
  | 'matching'
  | 'fill-in'
  | 'true-false'

export interface GameExerciseOption {
  id: string
  text: string
  feedback?: string
}

export interface GameExercise {
  id: string
  type: GameExerciseType
  prompt: string
  options: GameExerciseOption[]
  correctAnswer: string | string[]
  explanation?: string
  sentence?: string
  context?: string
}

const MAX_EXERCISES = 6

function normalizeQuizQuestions(quiz: QuizQuestion[]): GameExercise[] {
  return quiz.slice(0, MAX_EXERCISES).map((question, idx) => ({
    id: question.id || `quiz-${idx}`,
    type: 'multiple-choice' as const,
    prompt: question.question,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
      feedback: option.feedback
    })),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  }))
}

function createRoleplayExercise(lesson: Lesson): GameExercise | null {
  if (!lesson.practiceExercise || lesson.practiceExercise.type !== 'roleplay') {
    return null
  }

  const steps = lesson.practiceExercise.steps.slice(0, 3)

  if (steps.length === 0) return null

  return {
    id: `${lesson.id}-roleplay`,
    type: 'roleplay',
    prompt: lesson.practiceExercise.title,
    options: steps.map((step, index) => ({
      id: `${lesson.id}-roleplay-step-${index + 1}`,
      text: step
    })),
    correctAnswer: steps[0],
    explanation: lesson.practiceExercise.tips?.[0],
    context: lesson.practiceExercise.description
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function createMatchingExercises(lesson: Lesson): GameExercise[] {
  const examples = lesson.formats.text?.content?.examples || []
  if (!examples.length) return []

  const trimmed = examples.slice(0, 4)
  const rightOptions = trimmed.map((example) => example.title)

  return trimmed.map((example, index) => {
    const shuffled = shuffleArray(rightOptions)
    const options = shuffled.map((title, optionIndex) => ({
      id: `${lesson.id}-matching-${index}-${optionIndex}`,
      text: title
    }))
    const correctOption = options.find((option) => option.text === example.title)

    return {
      id: `${lesson.id}-matching-${index}`,
      type: 'matching',
      prompt: 'Подбери правильный тип границы для примера',
      options,
      correctAnswer: correctOption ? correctOption.id : options[0].id,
      explanation: `Это пример: ${example.text}`,
      context: example.text
    }
  })
}

function createFillInExercises(lesson: Lesson): GameExercise[] {
  if (lesson.id !== 'boundaries-1') return []

  const templates = [
    {
      sentence: 'Мне нужно ____ после школы, чтобы восстановиться.',
      options: [
        { text: 'постоянно быть на связи', explanation: 'Это нарушает личные границы времени.' },
        { text: 'побыть одному', explanation: 'Ты выбираешь восстановиться — это здоровая граница.' },
        { text: 'ответить всем друзьям сразу', explanation: 'Необязательно отвечать моментально.' }
      ],
      correctIndex: 1
    },
    {
      sentence: 'Я отвечу, когда ____ и смогу сосредоточиться.',
      options: [
        { text: 'освобожусь', explanation: 'Ты показываешь уважение к своему времени.' },
        { text: 'буду в онлайне', explanation: 'Онлайн не значит готов говорить.' },
        { text: 'они напомнят ещё раз', explanation: 'Напоминания не должны управлять твоими границами.' }
      ],
      correctIndex: 0
    }
  ]

  return templates.map((template, templateIndex) => {
    const options = template.options.map((option, optionIndex) => ({
      id: `${lesson.id}-fill-${templateIndex}-${optionIndex}`,
      text: option.text,
      feedback: option.explanation
    }))
    const correctOption = options[template.correctIndex]

    return {
      id: `${lesson.id}-fill-${templateIndex}`,
      type: 'fill-in',
      prompt: 'Подбери слово, которое поддерживает твою границу',
      options,
      correctAnswer: correctOption.id,
      explanation: template.options[template.correctIndex].explanation,
      sentence: template.sentence
    }
  })
}

function createTrueFalseExercises(lesson: Lesson): GameExercise[] {
  if (lesson.id !== 'boundaries-1') return []

  const statements = [
    {
      statement: 'Личные границы бывают только физическими.',
      correct: 'false',
      explanation: 'Есть и эмоциональные, временные, цифровые границы — они так же важны.'
    },
    {
      statement: 'Право сказать «нет» — это часть здоровых границ.',
      correct: 'true',
      explanation: 'Говорить «нет» помогает защищать свои ресурсы и энергию.'
    }
  ]

  const options: GameExerciseOption[] = [
    { id: 'true', text: 'Верно' },
    { id: 'false', text: 'Неверно' }
  ]

  return statements.map((statement, index) => ({
    id: `${lesson.id}-true-false-${index}`,
    type: 'true-false',
    prompt: 'Верно или неверно?',
    options,
    correctAnswer: statement.correct,
    explanation: statement.explanation,
    sentence: statement.statement
  }))
}

export function lessonToGameExercises(lesson: Lesson): GameExercise[] {
  const baseQuiz = normalizeQuizQuestions(lesson.quiz)
  const roleplayExercise = createRoleplayExercise(lesson)
  const matchingExercises = createMatchingExercises(lesson)
  const fillInExercises = createFillInExercises(lesson)
  const trueFalseExercises = createTrueFalseExercises(lesson)

  const ordered: GameExercise[] = []

  if (roleplayExercise) ordered.push(roleplayExercise)
  if (matchingExercises.length) ordered.push(matchingExercises.shift()!)
  if (fillInExercises.length) ordered.push(fillInExercises.shift()!)
  if (trueFalseExercises.length) ordered.push(trueFalseExercises.shift()!)

  ordered.push(...baseQuiz)
  ordered.push(...matchingExercises, ...fillInExercises, ...trueFalseExercises)

  return ordered.slice(0, MAX_EXERCISES)
}

