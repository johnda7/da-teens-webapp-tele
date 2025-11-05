import { useState } from 'react'
import { CheckCircle, Question } from '@phosphor-icons/react'

interface SectionFeedbackProps {
  sectionKey: string
  onComplete?: () => void
}

/**
 * Небольшой контрол «Понятно / Есть вопрос?» для конца секции.
 * Дает мгновенную обратную связь и триггерит onComplete (для XP/прогресса).
 */
export default function SectionFeedback({ sectionKey, onComplete }: SectionFeedbackProps) {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="mt-2 inline-flex items-center gap-1 text-emerald-700 text-xs">
        <CheckCircle size={14} className="text-emerald-600" weight="fill" />
        Отмечено как понятное
      </div>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={() => { setDone(true); onComplete?.() }}
        className="px-2.5 py-1.5 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 active:scale-[0.98]"
      >
        <CheckCircle size={14} className="inline mr-1" weight="fill" /> Понятно
      </button>
      <button
        onClick={() => { setDone(true); onComplete?.() }}
        className="px-2.5 py-1.5 text-xs rounded-lg bg-blue-50 border border-blue-200 text-blue-700 active:scale-[0.98]"
      >
        <Question size={14} className="inline mr-1" /> Есть вопрос
      </button>
    </div>
  )
}

