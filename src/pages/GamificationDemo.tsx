import { useState } from 'react'
import { motion } from 'framer-motion'
import GamificationPanel from '@/components/GamificationPanel'
import BadgeUnlockModal from '@/components/BadgeUnlockModal'
import { Button } from '@/components/ui/button'
import { TEEN_BADGES } from '@/lib/gamification'
import type { GamificationProgress, Badge } from '@/lib/gamification'

export default function GamificationDemo() {
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null)

  // Mock data для демонстрации
  const mockProgress: GamificationProgress = {
    userId: 'demo-user',
    xp: 2450,
    level: 7,
    streak: 12,
    longestStreak: 24,
    freezesUsed: 1,
    maxFreezes: 3,
    badges: [
      { badgeId: 'first-lesson', earnedDate: new Date('2025-10-01'), tier: 'bronze' },
      { badgeId: 'module-master', earnedDate: new Date('2025-10-10'), tier: 'silver' },
      { badgeId: 'week-warrior', earnedDate: new Date('2025-10-08'), tier: 'bronze' },
      { badgeId: 'boundary-guardian', earnedDate: new Date('2025-10-15'), tier: 'gold' },
      { badgeId: 'practice-consistent', earnedDate: new Date('2025-10-12'), tier: 'silver' },
      { badgeId: 'helped-peer', earnedDate: new Date('2025-10-18'), tier: 'bronze' },
      { badgeId: 'perfect-quiz', earnedDate: new Date('2025-10-14'), tier: 'gold' },
      { badgeId: 'anxiety-warrior', earnedDate: new Date('2025-10-20'), tier: 'silver' },
    ],
    wellnessScore: 78,
    emotionalGrowthMetrics: {
      anxietyReduction: 35,
      moodImprovement: 42,
      boundaryConfidence: 68,
      selfAwarenessLevel: 72,
      communicationSkills: 65,
      emotionalRegulation: 58
    },
    lastCheckIn: new Date('2025-10-21'),
    totalLessonsCompleted: 12,
    totalPracticesCompleted: 8,
    totalMinutesLearned: 340
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 40, 0],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center space-y-4 pt-8"
        >
          <h1 className="ios-largetitle text-gray-900">
            🎮 Геймификация
          </h1>
          <p className="ios-body text-gray-600 max-w-2xl mx-auto">
            Система мотивации с фокусом на психологическое благополучие подростков
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                const randomBadge = TEEN_BADGES[Math.floor(Math.random() * Math.min(5, TEEN_BADGES.length))]
                setUnlockedBadge(randomBadge)
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ios-body"
            >
              🎉 Разблокировать случайный бейдж
            </Button>
          </div>
        </motion.div>

        {/* Gamification Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <GamificationPanel progress={mockProgress} />
        </motion.div>

        {/* Compact Bar Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="ios-headline text-gray-900 text-center">Компактная версия (для header)</h3>
          <div className="flex justify-center">
            <GamificationPanel progress={mockProgress} compact={true} />
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          className="bg-white/60 backdrop-blur-[20px] rounded-3xl p-8 border border-gray-100 shadow-lg"
        >
          <h3 className="ios-headline text-gray-900 mb-6 text-center">📊 Статистика прогресса</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              label="Уроков пройдено"
              value={mockProgress.totalLessonsCompleted}
              icon="📚"
            />
            <StatCard 
              label="Практик завершено"
              value={mockProgress.totalPracticesCompleted}
              icon="💪"
            />
            <StatCard 
              label="Минут обучения"
              value={mockProgress.totalMinutesLearned}
              icon="⏱️"
            />
            <StatCard 
              label="Достижений"
              value={mockProgress.badges.length}
              icon="🏆"
            />
          </div>
        </motion.div>

        {/* Design Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-[20px] rounded-3xl p-8 border border-purple-100 shadow-lg"
        >
          <h3 className="ios-headline text-gray-900 mb-4">✨ Философия дизайна</h3>
          <div className="space-y-3 ios-body text-gray-700">
            <p>
              <strong className="text-purple-600">🍎 iOS 26 Liquid Glass:</strong> backdrop-blur-[40px], spring-анимации (stiffness: 260, damping: 20), 8px grid
            </p>
            <p>
              <strong className="text-blue-600">🎯 Duolingo-inspired:</strong> Streak mechanics, XP progression, badge collection
            </p>
            <p>
              <strong className="text-green-600">🧘 Wellness-focused:</strong> Wellness Score, emotional growth metrics, soft aesthetics
            </p>
            <p>
              <strong className="text-pink-600">💜 Teen-focused:</strong> Мотивирующие сообщения, психологическое благополучие, не токсичная конкуренция
            </p>
          </div>
        </motion.div>
      </div>

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal 
        badge={unlockedBadge}
        onClose={() => setUnlockedBadge(null)}
      />
    </div>
  )
}

// ============================================
// Stat Card
// ============================================

interface StatCardProps {
  label: string
  value: number
  icon: string
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-[20px] rounded-2xl p-4 text-center border border-gray-100 shadow-sm"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="ios-title2 font-bold text-gray-900">{value}</div>
      <div className="ios-caption1 text-gray-600">{label}</div>
    </motion.div>
  )
}
