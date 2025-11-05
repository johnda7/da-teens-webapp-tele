import { ReactNode } from 'react'
import { ShieldCheck, Headphones, Bed, ChatsCircle, FireSimple } from '@phosphor-icons/react'

interface QuickActionsRibbonProps {
  onStartLesson: () => void
  onCheckIn: () => void
  onOpenSleep: () => void
  onOpenRoleplay?: () => void
}

const ActionChip = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 backdrop-blur border shadow-glass text-sm active:scale-[0.98]"
  >
    {icon}
    <span className="whitespace-nowrap">{label}</span>
  </button>
)

/**
 * Горизонтальная лента быстрых действий (1–2 минуты).
 */
export default function QuickActionsRibbon({ onStartLesson, onCheckIn, onOpenSleep, onOpenRoleplay }: QuickActionsRibbonProps) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 pr-2">
        <ActionChip icon={<ShieldCheck size={16} className="text-blue-600" />} label="Быстрый урок" onClick={onStartLesson} />
        <ActionChip icon={<ChatsCircle size={16} className="text-purple-600" />} label="Чек-ин" onClick={onCheckIn} />
        <ActionChip icon={<Headphones size={16} className="text-cyan-600" />} label="3‑минутная аудио‑пауза" onClick={onOpenSleep} />
        <ActionChip icon={<Bed size={16} className="text-indigo-600" />} label="Сон и медитации" onClick={onOpenSleep} />
        {onOpenRoleplay && (
          <ActionChip icon={<FireSimple size={16} className="text-amber-600" />} label="Скажи «нет» (практика)" onClick={onOpenRoleplay} />
        )}
      </div>
    </div>
  )
}

