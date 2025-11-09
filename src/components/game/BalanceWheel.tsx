import { memo } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from 'recharts'

export interface BalanceWheelPoint {
  id: string
  label: string
  value: number
}

interface BalanceWheelProps {
  current: BalanceWheelPoint[]
  baseline?: Record<string, number> | null
  maxValue?: number
}

const DEFAULT_MAX = 10

export const BalanceWheel = memo(function BalanceWheel({ current, baseline, maxValue = DEFAULT_MAX }: BalanceWheelProps) {
  const chartData = current.map((item) => ({
    subject: item.label,
    current: item.value,
    baseline: baseline ? baseline[item.id] ?? 0 : undefined
  }))

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="80%" data={chartData} cx="50%" cy="50%">
          <PolarGrid stroke="#e5e7ff" strokeOpacity={0.6} strokeDasharray="4 6" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, maxValue]} tick={{ fill: '#cbd5f5', fontSize: 9 }} tickCount={maxValue} axisLine={false} />
          {baseline && (
            <Radar
              name="Старт"
              dataKey="baseline"
              stroke="#c7d2fe"
              strokeWidth={2}
              fill="#c7d2fe"
              fillOpacity={0.25}
              dot={false}
            />
          )}
          <Radar
            name="Сейчас"
            dataKey="current"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.35}
            dot={{ r: 2.5, fill: '#6366f1' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
})

