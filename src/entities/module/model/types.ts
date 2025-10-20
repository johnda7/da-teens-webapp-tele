/**
 * Module Entity - Types
 * 
 * Описание структуры образовательного модуля
 * Основано на Google Learn Your Way принципах
 */

export interface LessonFormat {
  type: 'text' | 'video' | 'audio' | 'interactive' | 'mindmap'
  content: any
  estimatedTime: number // минуты
}

export interface Lesson {
  id: string
  title: string
  subtitle: string
  learningObjectives: string[]
  formats: {
    text?: LessonFormat
    video?: LessonFormat
    audio?: LessonFormat
    interactive?: LessonFormat
    mindmap?: LessonFormat
  }
  quiz: QuizQuestion[]
  practiceExercise: PracticeExercise
  homework?: HomeworkTask
  emotionalTags: string[] // какие эмоции помогает проработать
  difficulty: 'easy' | 'medium' | 'hard'
  prerequisites?: string[] // ID предыдущих уроков
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'single' | 'multiple' | 'scenario'
  options: QuizOption[]
  correctAnswer: string | string[]
  explanation: string
  emotionalContext?: string
}

export interface QuizOption {
  id: string
  text: string
  feedback?: string
}

export interface PracticeExercise {
  title: string
  description: string
  type: 'reflection' | 'roleplay' | 'journaling' | 'bodyscan' | 'visualization'
  steps: string[]
  duration: number // минуты
  tips: string[]
}

export interface HomeworkTask {
  title: string
  description: string
  tasks: string[]
  reflectionPrompts: string[]
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  color: string
  estimatedDuration: string
  lessons: Lesson[]
}
