import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, Trophy } from 'lucide-react'

interface WeekTabsProps {
  currentWeek: number
  onWeekChange: (week: number) => void
  progress: {
    week1: number // процент завершения недели 1
    week2: number
    week3: number
  }
}

export default function WeekTabs({ currentWeek, onWeekChange, progress }: WeekTabsProps) {
  const weeks = [
    {
      id: 1,
      title: 'Неделя 1',
      subtitle: 'Основы границ',
      lessons: 'Уроки 1-3',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      progress: progress.week1
    },
    {
      id: 2,
      title: 'Неделя 2', 
      subtitle: 'Защита границ',
      lessons: 'Уроки 4-6',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      progress: progress.week2
    },
    {
      id: 3,
      title: 'Неделя 3',
      subtitle: 'Мастерство',
      lessons: 'Уроки 7-9',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
      progress: progress.week3
    }
  ]

  return (
    <div className="w-full">
      {/* iOS 26 Segmented Control Style */}
      <div className="relative mx-4 mb-6 rounded-[28px] overflow-hidden">
        {/* Glass container */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[40px] border border-white/20 shadow-lg" />
        
        {/* Animated indicator */}
        <motion.div
          className="absolute h-full rounded-[24px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
          style={{ width: '33.333%' }}
          animate={{ x: `${(currentWeek - 1) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        
        {/* Week buttons */}
        <div className="relative grid grid-cols-3 gap-1 p-2">
          {weeks.map((week) => {
            const Icon = week.icon
            const isActive = currentWeek === week.id
            
            return (
              <motion.button
                key={week.id}
                onClick={() => onWeekChange(week.id)}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 py-4 rounded-[20px] relative"
              >
                {/* Progress ring */}
                <div className="relative w-8 h-8 mb-1">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      className={isActive ? 'text-blue-600' : 'text-gray-400'}
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - week.progress / 100)}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - week.progress / 100) }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </svg>
                  <Icon 
                    size={16} 
                    weight={isActive ? 'fill' : 'regular'} 
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      isActive ? 'text-blue-600' : 'text-gray-600'
                    }`} 
                  />
                </div>
                
                <span className={`text-[11px] font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {week.title}
                </span>
                <span className={`text-[9px] ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {week.lessons}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Week content header */}
      <motion.div
        key={currentWeek}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 mb-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {weeks[currentWeek - 1].title}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            {weeks[currentWeek - 1].subtitle}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${weeks[currentWeek - 1].progress}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {weeks[currentWeek - 1].progress}% завершено
          </p>
        </div>
      </motion.div>
    </div>
  )
}
