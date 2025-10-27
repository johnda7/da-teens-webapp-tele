import { motion } from 'framer-motion'
import { BookOpen, Heart, Users, Trophy, Target } from '@phosphor-icons/react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: BookOpen, label: 'Модули' },
    { id: 'checkin', icon: Heart, label: 'Чек-ин' },
    { id: 'cohort', icon: Users, label: 'Группа' },
    { id: 'gamification', icon: Trophy, label: 'Награды' },
    { id: 'profile', icon: Target, label: 'Прогресс' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Liquid Glass Container */}
      <div className="relative mx-4 mb-4 rounded-[28px] overflow-hidden">
        {/* Glass effect */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[40px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" />
        
        {/* Animated gradient orb for active state */}
        <motion.div
          className="absolute h-full w-[20%] rounded-[24px] bg-gradient-to-br from-purple-500/20 to-blue-500/20"
          animate={{
            x: `${tabs.findIndex(t => t.id === activeTab) * 100}%`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />

        {/* Nav Buttons */}
        <div className="relative grid grid-cols-5 gap-1 p-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center gap-1 py-3 rounded-[20px] transition-colors"
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-[20px] shadow-lg"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  className="relative"
                >
                  <Icon
                    size={24}
                    weight={isActive ? "fill" : "regular"}
                    className={isActive ? "text-white" : "text-gray-600"}
                  />
                </motion.div>
                
                {/* Label */}
                <span
                  className={`relative text-[11px] font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
