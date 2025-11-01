// Hero-секция для модуля "Границы" в стиле Google Learn Your Way
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Lightning, 
  ChartLine, 
  Trophy,
  Heart,
  Brain,
  Shield
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import GamificationPanel from './GamificationPanel'
import type { GamificationProgress } from '@/lib/gamification'

interface BoundariesHeroProps {
  onStartLearning: () => void
  progress: {
    lessonsCompleted: number
    totalLessons: number
    xpEarned: number
    streak: number
    skillsUnlocked: number
  }
  gamificationProgress?: GamificationProgress // Новое!
  hasCheckIn: boolean
  onCheckIn?: () => void
}

export default function BoundariesHero({ 
  onStartLearning, 
  progress,
  gamificationProgress,
  onCheckIn,
  hasCheckIn 
}: BoundariesHeroProps) {
  const completionPercentage = (progress.lessonsCompleted / progress.totalLessons) * 100

  return (
    <div className="space-y-2">
      {/* Ultra-compact Header - Calm inspired */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" weight="fill" />
          </div>
          <div className="flex-1">
            <Badge className="text-[9px] bg-blue-100 text-blue-700 border-0 mb-0.5 px-1.5 py-0">
                  ✨ Адаптивный модуль
                </Badge>
            <h1 className="text-base font-bold text-gray-900">Личные границы</h1>
            <p className="text-[10px] text-gray-500">Научись говорить "нет"</p>
              </div>
            </div>

        {/* Compact Stats - 3 numbers inline - еще компактнее */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <div className="text-center bg-blue-50 rounded-lg py-1.5">
            <div className="text-sm font-bold text-blue-600">{progress.totalLessons}</div>
                <div className="text-[9px] text-gray-600">Уроков</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg py-1.5">
            <div className="text-sm font-bold text-green-600">5</div>
                <div className="text-[9px] text-gray-600">Форматов</div>
          </div>
          <div className="text-center bg-orange-50 rounded-lg py-1.5">
            <div className="text-sm font-bold text-orange-600">3-4</div>
                <div className="text-[9px] text-gray-600">Недели</div>
          </div>
            </div>

        {/* CTA Button - Simple Telegram style - компактнее */}
        <button 
                  onClick={onStartLearning}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
          <Play size={16} weight="fill" />
                  {progress.lessonsCompleted === 0 ? 'Начать' : 'Продолжить'}
        </button>
          </div>

      {/* Compact Progress Stats - только если есть прогресс */}
      {progress.lessonsCompleted > 0 && (
        <div className="px-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Прогресс модуля</span>
              <span className="text-xs font-semibold text-blue-600">
                {progress.lessonsCompleted}/{progress.totalLessons} уроков
                </span>
              </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
                />
              </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <Lightning size={12} className="text-orange-500" weight="fill" />
                <span>{progress.xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Brain size={12} className="text-green-500" weight="fill" />
                <span>{progress.skillsUnlocked} навыков</span>
              </div>
                  </div>
                </div>
              </div>
      )}
    </div>
  )
}
