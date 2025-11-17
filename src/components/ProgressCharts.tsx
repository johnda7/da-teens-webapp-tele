/**
 * ProgressCharts Component
 * Визуализация прогресса детей для родителей
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendUp, ChartLine, Smiley } from '@phosphor-icons/react'

interface ProgressChartProps {
  childName: string
  xpData?: Array<{ date: string; xp: number }>
  moodData?: Array<{ date: string; mood: number; anxiety: number }>
  quizScores?: Array<{ lesson: string; score: number }>
}

export function ProgressCharts({ 
  childName, 
  xpData = [], 
  moodData = [],
  quizScores = []
}: ProgressChartProps) {
  
  // Sample data if none provided
  const defaultXpData = [
    { date: 'Пн', xp: 50 },
    { date: 'Вт', xp: 80 },
    { date: 'Ср', xp: 120 },
    { date: 'Чт', xp: 150 },
    { date: 'Пт', xp: 200 },
    { date: 'Сб', xp: 250 },
    { date: 'Вс', xp: 280 }
  ]

  const defaultMoodData = [
    { date: 'Пн', mood: 7, anxiety: 4 },
    { date: 'Вт', mood: 8, anxiety: 3 },
    { date: 'Ср', mood: 6, anxiety: 5 },
    { date: 'Чт', mood: 9, anxiety: 2 },
    { date: 'Пт', mood: 8, anxiety: 3 }
  ]

  const defaultQuizScores = [
    { lesson: 'Урок 1', score: 85 },
    { lesson: 'Урок 2', score: 90 },
    { lesson: 'Урок 3', score: 78 },
    { lesson: 'Урок 4', score: 95 }
  ]

  const displayXpData = xpData.length > 0 ? xpData : defaultXpData
  const displayMoodData = moodData.length > 0 ? moodData : defaultMoodData
  const displayQuizScores = quizScores.length > 0 ? quizScores : defaultQuizScores

  return (
    <div className="space-y-4">
      {/* XP Progress Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendUp className="w-5 h-5 text-blue-600" weight="fill" />
            <CardTitle className="text-base">Динамика XP</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayXpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="xp" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2">
            {childName} зарабатывает XP стабильно 📈
          </p>
        </CardContent>
      </Card>

      {/* Mood & Anxiety Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smiley className="w-5 h-5 text-purple-600" weight="fill" />
            <CardTitle className="text-base">Настроение и тревога</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayMoodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 4 }}
                name="Настроение"
              />
              <Line 
                type="monotone" 
                dataKey="anxiety" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Тревога"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2">
            Отслеживайте эмоциональное состояние ребенка
          </p>
        </CardContent>
      </Card>

      {/* Quiz Scores Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-green-600" weight="fill" />
            <CardTitle className="text-base">Результаты викторин</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={displayQuizScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="lesson" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="score" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2">
            Средний балл: {Math.round(displayQuizScores.reduce((acc, curr) => acc + curr.score, 0) / displayQuizScores.length)}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
