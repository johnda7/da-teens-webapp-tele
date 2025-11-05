import { CheckCircle, ListChecks, GameController } from '@phosphor-icons/react'

interface QuestTrailProps {
  steps: { id: string; title: string; done?: boolean; onJump?: () => void }[]
}

/**
 * Небольшой «квест-трек» для урока: 3 шага, которые видит подросток.
 */
export default function QuestTrail({ steps }: QuestTrailProps) {
  return (
    <div className="mb-3 rounded-xl border bg-white/70 backdrop-blur p-2">
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <ListChecks size={14} /> План на сегодня
      </div>
      <div className="grid grid-cols-3 gap-2">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={s.onJump}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs border ${
              s.done ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            {s.done ? <CheckCircle size={14} className="text-emerald-600" weight="fill" /> : <GameController size={14} />}
            {s.title}
          </button>
        ))}
      </div>
    </div>
  )
}

