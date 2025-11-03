import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Lock, CheckCircle, Trophy } from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  icon: string
  lessonRequired: number
  masteryLevel: number
  isUnlocked: boolean
  color: string
}

interface SkillBranch {
  id: string
  name: string
  icon: string
  color: string
  skills: Skill[]
}

interface SkillsTreeProps {
  completedLessons: string[]
  totalXP?: number
}

interface BaseSkill {
  id: string
  name: string
  description: string
  icon: string
  lessonRequired: number
  color: string
}

interface BaseBranch {
  id: string
  name: string
  icon: string
  color: string
  skills: BaseSkill[]
}

// Base skill tree configuration
const baseBranches: BaseBranch[] = [
  {
    id: 'protection',
    name: 'Защита',
    icon: '🛡️',
    color: 'from-red-500 to-orange-500',
    skills: [
      {
        id: 'basic-no',
        name: 'Базовое "Нет"',
        description: 'Умение говорить нет спокойно и уверенно',
        icon: '🚫',
        lessonRequired: 4,
        masteryLevel: 75,
        isUnlocked: true,
        color: 'bg-red-100 text-red-700 border-red-300'
      },
      {
        id: 'persistence',
        name: 'Настойчивость',
        description: 'Держаться своих границ под давлением',
        icon: '💪',
        lessonRequired: 4,
        masteryLevel: 45,
        isUnlocked: true,
        color: 'bg-orange-100 text-orange-700 border-orange-300'
      },
      {
        id: 'firmness',
        name: 'Твёрдость',
        description: 'Защита границ в конфликтах',
        icon: '⚔️',
        lessonRequired: 6,
        masteryLevel: 20,
        isUnlocked: true,
        color: 'bg-red-100 text-red-700 border-red-300'
      },
      {
        id: 'master-defense',
        name: 'Мастер защиты',
        description: 'Проактивная защита своих границ',
        icon: '🏆',
        lessonRequired: 9,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      }
    ]
  },
  {
    id: 'recognition',
    name: 'Распознавание',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      {
        id: 'physical-signals',
        name: 'Физические сигналы',
        description: 'Читать язык тела при нарушении границ',
        icon: '👁️',
        lessonRequired: 2,
        masteryLevel: 90,
        isUnlocked: true,
        color: 'bg-blue-100 text-blue-700 border-blue-300'
      },
      {
        id: 'emotional-signals',
        name: 'Эмоциональные сигналы',
        description: 'Распознавать внутренние реакции',
        icon: '💭',
        lessonRequired: 2,
        masteryLevel: 85,
        isUnlocked: true,
        color: 'bg-cyan-100 text-cyan-700 border-cyan-300'
      },
      {
        id: 'violation-patterns',
        name: 'Паттерны нарушений',
        description: 'Видеть повторяющиеся нарушения',
        icon: '🔍',
        lessonRequired: 9,
        masteryLevel: 10,
        isUnlocked: true,
        color: 'bg-blue-100 text-blue-700 border-blue-300'
      },
      {
        id: 'proactivity',
        name: 'Проактивность',
        description: 'Предвидеть нарушение заранее',
        icon: '⚡',
        lessonRequired: 9,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      }
    ]
  },
  {
    id: 'communication',
    name: 'Коммуникация',
    icon: '💬',
    color: 'from-green-500 to-emerald-500',
    skills: [
      {
        id: 'formulation',
        name: 'Формулировка',
        description: 'Чётко выражать свои границы',
        icon: '📝',
        lessonRequired: 3,
        masteryLevel: 60,
        isUnlocked: true,
        color: 'bg-green-100 text-green-700 border-green-300'
      },
      {
        id: 'assertive-no',
        name: 'Ассертивное "нет"',
        description: 'Уверенный отказ без оправданий',
        icon: '🎯',
        lessonRequired: 4,
        masteryLevel: 40,
        isUnlocked: true,
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300'
      },
      {
        id: 'empathetic-refusal',
        name: 'Эмпатический отказ',
        description: 'Отказ с пониманием чувств других',
        icon: '🤝',
        lessonRequired: 7,
        masteryLevel: 30,
        isUnlocked: true,
        color: 'bg-green-100 text-green-700 border-green-300'
      },
      {
        id: 'negotiation',
        name: 'Переговоры',
        description: 'Находить компромиссы',
        icon: '⚖️',
        lessonRequired: 5,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      }
    ]
  },
  {
    id: 'context',
    name: 'Контекст',
    icon: '🌐',
    color: 'from-purple-500 to-violet-500',
    skills: [
      {
        id: 'family',
        name: 'Семья',
        description: 'Границы с родителями и родными',
        icon: '👨‍👩‍👧',
        lessonRequired: 5,
        masteryLevel: 50,
        isUnlocked: true,
        color: 'bg-purple-100 text-purple-700 border-purple-300'
      },
      {
        id: 'friends',
        name: 'Друзья',
        description: 'Границы в дружбе',
        icon: '👥',
        lessonRequired: 6,
        masteryLevel: 35,
        isUnlocked: true,
        color: 'bg-violet-100 text-violet-700 border-violet-300'
      },
      {
        id: 'romance',
        name: 'Романтика',
        description: 'Здоровые отношения',
        icon: '💑',
        lessonRequired: 6,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      },
      {
        id: 'online',
        name: 'Онлайн',
        description: 'Цифровые границы',
        icon: '📱',
        lessonRequired: 7,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      }
    ]
  },
  {
    id: 'empathy',
    name: 'Эмпатия',
    icon: '❤️',
    color: 'from-pink-500 to-rose-500',
    skills: [
      {
        id: 'active-listening',
        name: 'Активное слушание',
        description: 'Понимать границы других',
        icon: '👂',
        lessonRequired: 7,
        masteryLevel: 55,
        isUnlocked: true,
        color: 'bg-pink-100 text-pink-700 border-pink-300'
      },
      {
        id: 'understanding',
        name: 'Понимание других',
        description: 'Эмпатизировать с разными мнениями',
        icon: '💝',
        lessonRequired: 7,
        masteryLevel: 25,
        isUnlocked: true,
        color: 'bg-rose-100 text-rose-700 border-rose-300'
      },
      {
        id: 'consent-culture',
        name: 'Культура согласия',
        description: 'Уважать выбор других',
        icon: '🤲',
        lessonRequired: 7,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      },
      {
        id: 'reciprocity',
        name: 'Взаимность',
        description: 'Баланс в отношениях',
        icon: '⚖️',
        lessonRequired: 9,
        masteryLevel: 0,
        isUnlocked: false,
        color: 'bg-gray-100 text-gray-500 border-gray-300'
      }
    ]
  }
]

export default function SkillsTree({ completedLessons = [], totalXP = 0 }: SkillsTreeProps) {
  const [selectedBranch, setSelectedBranch] = useState<number>(0)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  // Calculate branches with real progress
  const branches = useMemo<SkillBranch[]>(() => {
    return baseBranches.map(branch => ({
      ...branch,
      skills: branch.skills.map(skill => {
        const lessonId = `boundaries-${skill.lessonRequired}`
        const isUnlocked = completedLessons.includes(lessonId)
        // Mock mastery for now (can calculate from quiz scores later)
        const masteryLevel = isUnlocked ? 50 : 0
        
        return {
          ...skill,
          isUnlocked,
          masteryLevel
        }
      })
    }))
  }, [completedLessons])

  const currentBranch = branches[selectedBranch]
  const unlockedSkills = currentBranch.skills.filter(s => s.isUnlocked)
  const lockedSkills = currentBranch.skills.filter(s => !s.isUnlocked)
  const sortedSkills = [...unlockedSkills, ...lockedSkills]

  const totalSkills = branches.reduce((sum, branch) => sum + branch.skills.length, 0)
  const unlockedTotal = branches.reduce((sum, branch) => sum + branch.skills.filter(s => s.isUnlocked).length, 0)
  const totalMastery = branches.reduce((sum, branch) => 
    sum + branch.skills.reduce((skillSum, skill) => skillSum + skill.masteryLevel, 0), 0
  )
  const averageMastery = Math.round(totalMastery / totalSkills)

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Раскрыто</div>
            <div className="text-lg font-bold text-blue-700">{unlockedTotal}/{totalSkills}</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Мастерство</div>
            <div className="text-lg font-bold text-green-700">{averageMastery}%</div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Веток</div>
            <div className="text-lg font-bold text-purple-700">{branches.length}</div>
          </div>
        </Card>
      </div>

      {/* Branch Tabs */}
      <div className="mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {branches.map((branch, idx) => (
            <motion.button
              key={branch.id}
              onClick={() => setSelectedBranch(idx)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                selectedBranch === idx
                  ? `bg-gradient-to-r ${branch.color} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1">{branch.icon}</span>
              {branch.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <Card className="glass rounded-xl p-3 border border-white/40">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">{currentBranch.icon}</span>
          {currentBranch.name}
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {sortedSkills.map((skill, idx) => {
            const isSelected = selectedSkill === skill.id
            
            return (
              <motion.div
                key={skill.id}
                onClick={() => setSelectedSkill(isSelected ? null : skill.id)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  skill.isUnlocked
                    ? isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/30'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
                whileHover={skill.isUnlocked ? { scale: 1.02 } : {}}
              >
                {/* Skill Icon */}
                <div className="p-2 text-center">
                  <div className="text-3xl mb-1">{skill.icon}</div>
                  <h4 className={`text-xs font-bold mb-1 ${skill.isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {skill.name}
                  </h4>
                  
                  {/* Progress Bar */}
                  {skill.isUnlocked && (
                    <div className="mb-1">
                      <Progress value={skill.masteryLevel} className="h-1" />
                      <span className="text-[10px] text-gray-600">{skill.masteryLevel}%</span>
                    </div>
                  )}
                  
                  {/* Lock Icon */}
                  {!skill.isUnlocked && (
                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
                      <Lock className="w-3 h-3" />
                      Урок {skill.lessonRequired}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {skill.isUnlocked && (
                    <Badge className={`text-[9px] px-1.5 py-0 h-4 ${skill.color}`}>
                      {skill.masteryLevel === 0 ? 'Начато' : skill.masteryLevel === 100 ? 'Мастер' : 'В процессе'}
                    </Badge>
                  )}
                </div>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Selected Skill Details */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-3"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 p-3">
              {(() => {
                const skill = currentBranch.skills.find(s => s.id === selectedSkill)
                if (!skill) return null
                
                return (
                  <>
                    <div className="flex items-start gap-2 mb-2">
                      <div className="text-2xl">{skill.icon}</div>
                      <div>
                        <h4 className="text-sm font-bold text-purple-900 mb-0.5">{skill.name}</h4>
                        <p className="text-xs text-purple-700 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                    
                    {skill.masteryLevel > 0 && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-purple-900">Мастерство: {skill.masteryLevel}%</span>
                      </div>
                    )}
                  </>
                )
              })()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
