/**
 * Universal Module Types
 * Используется для всех 13 модулей платформы
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
  emotionalTags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  prerequisites?: string[]
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
  duration: number
  tips: string[]
}

export interface HomeworkTask {
  title: string
  description: string
  tasks: string[]
  reflectionPrompts: string[]
}

export interface ModuleData {
  id: string | number
  title: string
  description: string
  icon: string
  color: string
  estimatedDuration: string
  lessons: Lesson[]
  isAdaptive?: boolean
  comingSoon?: boolean // для модулей в разработке
}
