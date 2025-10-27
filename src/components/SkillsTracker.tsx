// Компонент отслеживания навыков
// Показывает развитие конкретных умений

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Star, 
  TrendUp,
  Target,
  Brain,
  Heart,
  Users,
  Shield
} from '@phosphor-icons/react'

export interface Skill {
  id: string
  name: string
  category: 'communication' | 'emotional' | 'social' | 'self-care'
  level: number // 0-100
  practiceCount: number
  lastPracticed?: Date
  milestones: SkillMilestone[]
}

export interface SkillMilestone {
  level: number
  title: string
  description: string
  unlocked: boolean
}

interface SkillsTrackerProps {
  skills: Skill[]
  highlightedSkills?: string[] // IDs навыков для подсветки
}

const categoryIcons = {
  communication: Shield,
  emotional: Heart,
  social: Users,
  'self-care': Brain
}

const categoryLabels = {
  communication: 'Коммуникация',
  emotional: 'Эмоциональный интеллект',
  social: 'Социальные навыки',
  'self-care': 'Самозабота'
}

const categoryColors = {
  communication: 'bg-blue-50 border-blue-200 text-blue-700',
  emotional: 'bg-pink-50 border-pink-200 text-pink-700',
  social: 'bg-purple-50 border-purple-200 text-purple-700',
  'self-care': 'bg-green-50 border-green-200 text-green-700'
}

export default function SkillsTracker({ skills, highlightedSkills = [] }: SkillsTrackerProps) {
  const getSkillLevel = (level: number): string => {
    if (level < 20) return 'Начинающий'
    if (level < 40) return 'Развивающийся'
    if (level < 60) return 'Практикующий'
    if (level < 80) return 'Опытный'
    return 'Мастер'
  }

  const getNextMilestone = (skill: Skill): SkillMilestone | undefined => {
    return skill.milestones.find(m => !m.unlocked && m.level > skill.level)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" weight="fill" />
          Твои навыки
        </h3>
        <Badge variant="secondary" className="text-xs">
          {skills.filter(s => s.level >= 80).length}/{skills.length} освоено
        </Badge>
      </div>

      <div className="grid gap-3">
        {skills.map(skill => {
          const Icon = categoryIcons[skill.category]
          const isHighlighted = highlightedSkills.includes(skill.id)
          const nextMilestone = getNextMilestone(skill)
          const unlockedMilestones = skill.milestones.filter(m => m.unlocked).length

          return (
            <Card
              key={skill.id}
              className={`transition-all ${
                isHighlighted 
                  ? 'ring-2 ring-purple-500 shadow-lg scale-[1.02]' 
                  : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${categoryColors[skill.category]}`}>
                      <Icon className="w-5 h-5" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{skill.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[skill.category]}
                      </Badge>
                    </div>
                  </div>
                  
                  {skill.level >= 80 && (
                    <Star className="w-6 h-6 text-yellow-500" weight="fill" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getSkillLevel(skill.level)}
                    </span>
                    <span className="font-medium text-primary">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendUp className="w-3 h-3" />
                    <span>{skill.practiceCount} практик</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{unlockedMilestones}/{skill.milestones.length} вех</span>
                  </div>
                </div>

                {/* Next milestone */}
                {nextMilestone && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <p className="text-xs font-semibold text-purple-900 mb-1">
                          Следующая веха: {nextMilestone.title}
                        </p>
                        <p className="text-xs text-purple-700">{nextMilestone.description}</p>
                        <div className="mt-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-purple-600 font-medium">
                              {skill.level}% / {nextMilestone.level}%
                            </span>
                            <Progress 
                              value={(skill.level / nextMilestone.level) * 100} 
                              className="h-1 flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last practiced */}
                {skill.lastPracticed && (
                  <p className="text-xs text-muted-foreground">
                    Последняя практика: {new Date(skill.lastPracticed).toLocaleDateString('ru-RU')}
                  </p>
                )}

                {/* Highlighted indicator */}
                {isHighlighted && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <p className="text-xs font-medium text-yellow-900 flex items-center gap-1">
                      <Star className="w-3 h-3" weight="fill" />
                      Этот навык был использован в последнем уроке!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Пример структуры навыков для модуля "Личные границы"
export const boundariesSkills: Skill[] = [
  {
    id: 'saying-no',
    name: 'Умение говорить "нет"',
    category: 'communication',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Первые шаги',
        description: 'Понимаешь, когда нужно сказать "нет"',
        unlocked: false
      },
      {
        level: 50,
        title: 'Уверенность',
        description: 'Говоришь "нет" без чувства вины',
        unlocked: false
      },
      {
        level: 75,
        title: 'Мастерство',
        description: 'Отказываешь деликатно и твёрдо',
        unlocked: false
      },
      {
        level: 100,
        title: 'Эксперт',
        description: 'Помогаешь другим учиться говорить "нет"',
        unlocked: false
      }
    ]
  },
  {
    id: 'recognizing-violations',
    name: 'Распознавание нарушений',
    category: 'emotional',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Осознание',
        description: 'Замечаешь дискомфорт',
        unlocked: false
      },
      {
        level: 50,
        title: 'Анализ',
        description: 'Понимаешь причины дискомфорта',
        unlocked: false
      },
      {
        level: 75,
        title: 'Предвидение',
        description: 'Предугадываешь потенциальные нарушения',
        unlocked: false
      },
      {
        level: 100,
        title: 'Защита',
        description: 'Предотвращаешь нарушения границ',
        unlocked: false
      }
    ]
  },
  {
    id: 'assertive-communication',
    name: 'Уверенная коммуникация',
    category: 'communication',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Базовые фразы',
        description: 'Используешь "Я-сообщения"',
        unlocked: false
      },
      {
        level: 50,
        title: 'Тон и язык тела',
        description: 'Контролируешь невербальное общение',
        unlocked: false
      },
      {
        level: 75,
        title: 'В конфликте',
        description: 'Остаёшься спокойным в напряжённых ситуациях',
        unlocked: false
      },
      {
        level: 100,
        title: 'Мастер диалога',
        description: 'Эффективно общаешься в любых условиях',
        unlocked: false
      }
    ]
  },
  {
    id: 'self-care',
    name: 'Самозабота',
    category: 'self-care',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Приоритеты',
        description: 'Ставишь свои нужды на первое место',
        unlocked: false
      },
      {
        level: 50,
        title: 'Баланс',
        description: 'Находишь баланс между собой и другими',
        unlocked: false
      },
      {
        level: 75,
        title: 'Устойчивость',
        description: 'Регулярно заботишься о себе',
        unlocked: false
      },
      {
        level: 100,
        title: 'Благополучие',
        description: 'Самозабота стала частью твоей жизни',
        unlocked: false
      }
    ]
  },
  {
    id: 'empathy-balance',
    name: 'Эмпатия с границами',
    category: 'emotional',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Понимание',
        description: 'Понимаешь чувства других',
        unlocked: false
      },
      {
        level: 50,
        title: 'Без слияния',
        description: 'Сочувствуешь, не теряя себя',
        unlocked: false
      },
      {
        level: 75,
        title: 'Здоровая помощь',
        description: 'Помогаешь, не жертвуя собой',
        unlocked: false
      },
      {
        level: 100,
        title: 'Мудрая забота',
        description: 'Баланс эмпатии и самосохранения',
        unlocked: false
      }
    ]
  },
  {
    id: 'conflict-resolution',
    name: 'Решение конфликтов',
    category: 'social',
    level: 0,
    practiceCount: 0,
    milestones: [
      {
        level: 25,
        title: 'Спокойствие',
        description: 'Сохраняешь самообладание',
        unlocked: false
      },
      {
        level: 50,
        title: 'Переговоры',
        description: 'Ищешь компромиссы',
        unlocked: false
      },
      {
        level: 75,
        title: 'Посредничество',
        description: 'Помогаешь другим решать конфликты',
        unlocked: false
      },
      {
        level: 100,
        title: 'Миротворец',
        description: 'Превращаешь конфликты в возможности',
        unlocked: false
      }
    ]
  }
]
