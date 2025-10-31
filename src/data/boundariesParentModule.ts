// МОДУЛЬ: Личные границы ДЛЯ РОДИТЕЛЕЙ
// Полная реализация на основе готовых материалов Кати Карпенко
// 5 готовых аудиоуроков будут добавлены

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
  emotionalContext?: string // контекст для родителей
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

// ============================================
// МОДУЛЬ: ЛИЧНЫЕ ГРАНИЦЫ ДЛЯ РОДИТЕЛЕЙ (5 уроков)
// ============================================

export const boundariesParentModule = {
  id: 'boundaries-parents',
  title: 'Личные границы для родителей',
  description: 'Как помогать подростку формировать здоровые границы, не нарушая собственные',
  icon: '👨‍👩‍👧‍👦',
  color: 'bg-indigo-50 border-indigo-200',
  estimatedDuration: '3-4 недели',
  
  lessons: [
    // ============================================
    // УРОК 1: [TODO] Название будет из материала Кати
    // ============================================
    {
      id: 'boundaries-parent-1',
      title: 'Урок 1: В разработке',
      subtitle: 'Адаптация материала Кати',
      learningObjectives: [
        'Цели будут добавлены после получения текста'
      ],
      emotionalTags: ['родительство', 'границы', 'поддержка'],
      difficulty: 'medium',
      
      formats: {
        text: {
          type: 'text',
          estimatedTime: 10,
          content: {
            sections: [
              {
                heading: 'Текст будет добавлен',
                body: 'Ждём материалы от Кати Карпенко'
              }
            ],
            examples: []
          }
        },
        
        audio: {
          type: 'audio',
          estimatedTime: 15,
          content: {
            url: '/audio/boundaries-parents/lesson1.mp3',
            transcript: 'Стенограмма будет добавлена после получения аудио',
            background: 'calm-music',
            narration: 'kata-voice'
          }
        }
      },
      
      quiz: [
        // Квизы будут добавлены после получения материалов
      ],
      
      practiceExercise: {
        title: 'Практика будет добавлена',
        description: 'Ожидаем материалы',
        type: 'reflection',
        steps: ['Материалы поступят'],
        duration: 10,
        tips: ['Ожидаем']
      }
    },

    // ============================================
    // УРОК 2: [TODO]
    // ============================================
    {
      id: 'boundaries-parent-2',
      title: 'Урок 2: В разработке',
      subtitle: 'Адаптация материала Кати',
      learningObjectives: ['Цели будут добавлены'],
      emotionalTags: ['родительство', 'границы', 'поддержка'],
      difficulty: 'medium',
      
      formats: {
        text: {
          type: 'text',
          estimatedTime: 10,
          content: {
            sections: [{ heading: 'Текст будет добавлен', body: 'Ждём материалы от Кати' }],
            examples: []
          }
        },
        
        audio: {
          type: 'audio',
          estimatedTime: 15,
          content: {
            url: '/audio/boundaries-parents/lesson2.mp3',
            transcript: 'Стенограмма будет добавлена',
            background: 'calm-music',
            narration: 'kata-voice'
          }
        }
      },
      
      quiz: [],
      
      practiceExercise: {
        title: 'Практика будет добавлена',
        description: 'Ожидаем материалы',
        type: 'reflection',
        steps: ['Материалы поступят'],
        duration: 10,
        tips: []
      }
    },

    // ============================================
    // УРОК 3: [TODO]
    // ============================================
    {
      id: 'boundaries-parent-3',
      title: 'Урок 3: В разработке',
      subtitle: 'Адаптация материала Кати',
      learningObjectives: ['Цели будут добавлены'],
      emotionalTags: ['родительство', 'границы', 'поддержка'],
      difficulty: 'medium',
      
      formats: {
        text: {
          type: 'text',
          estimatedTime: 10,
          content: {
            sections: [{ heading: 'Текст будет добавлен', body: 'Ждём материалы от Кати' }],
            examples: []
          }
        },
        
        audio: {
          type: 'audio',
          estimatedTime: 15,
          content: {
            url: '/audio/boundaries-parents/lesson3.mp3',
            transcript: 'Стенограмма будет добавлена',
            background: 'calm-music',
            narration: 'kata-voice'
          }
        }
      },
      
      quiz: [],
      
      practiceExercise: {
        title: 'Практика будет добавлена',
        description: 'Ожидаем материалы',
        type: 'reflection',
        steps: ['Материалы поступят'],
        duration: 10,
        tips: []
      }
    },

    // ============================================
    // УРОК 4: [TODO]
    // ============================================
    {
      id: 'boundaries-parent-4',
      title: 'Урок 4: В разработке',
      subtitle: 'Адаптация материала Кати',
      learningObjectives: ['Цели будут добавлены'],
      emotionalTags: ['родительство', 'границы', 'поддержка'],
      difficulty: 'medium',
      
      formats: {
        text: {
          type: 'text',
          estimatedTime: 10,
          content: {
            sections: [{ heading: 'Текст будет добавлен', body: 'Ждём материалы от Кати' }],
            examples: []
          }
        },
        
        audio: {
          type: 'audio',
          estimatedTime: 15,
          content: {
            url: '/audio/boundaries-parents/lesson4.mp3',
            transcript: 'Стенограмма будет добавлена',
            background: 'calm-music',
            narration: 'kata-voice'
          }
        }
      },
      
      quiz: [],
      
      practiceExercise: {
        title: 'Практика будет добавлена',
        description: 'Ожидаем материалы',
        type: 'reflection',
        steps: ['Материалы поступят'],
        duration: 10,
        tips: []
      }
    },

    // ============================================
    // УРОК 5: [TODO]
    // ============================================
    {
      id: 'boundaries-parent-5',
      title: 'Урок 5: В разработке',
      subtitle: 'Адаптация материала Кати',
      learningObjectives: ['Цели будут добавлены'],
      emotionalTags: ['родительство', 'границы', 'поддержка'],
      difficulty: 'medium',
      
      formats: {
        text: {
          type: 'text',
          estimatedTime: 10,
          content: {
            sections: [{ heading: 'Текст будет добавлен', body: 'Ждём материалы от Кати' }],
            examples: []
          }
        },
        
        audio: {
          type: 'audio',
          estimatedTime: 15,
          content: {
            url: '/audio/boundaries-parents/lesson5.mp3',
            transcript: 'Стенограмма будет добавлена',
            background: 'calm-music',
            narration: 'kata-voice'
          }
        }
      },
      
      quiz: [],
      
      practiceExercise: {
        title: 'Практика будет добавлена',
        description: 'Ожидаем материалы',
        type: 'reflection',
        steps: ['Материалы поступят'],
        duration: 10,
        tips: []
      }
    }
  ]
}

