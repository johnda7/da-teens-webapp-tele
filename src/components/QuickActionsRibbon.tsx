import { ReactNode } from 'react'
import { ShieldCheck, Headphones, Bed, ChatsCircle, FireSimple, GameController } from '@phosphor-icons/react'

interface QuickActionsRibbonProps {
  onStartLesson: () => void
  onCheckIn: () => void
  onOpenSleep: () => void
  onOpenDuolingo?: () => void
  onOpenRoleplay?: () => void
}

const ActionChip = ({ icon, label, onClick, color }: { icon: ReactNode; label: string; onClick: () => void; color: 'blue'|'purple'|'cyan'|'indigo'|'amber' }) => (
  <button
    onClick={onClick}
    className={`shrink-0 inline-flex items-center gap-2 px-3 h-11 min-h-[44px] rounded-xl text-sm active:scale-[0.98] glass-tint-${color}`}
  >
    {icon}
    <span className="whitespace-nowrap">{label}</span>
  </button>
)

/**
 * Горизонтальная лента быстрых действий (1–2 минуты).
 */
export default function QuickActionsRibbon({ onStartLesson, onCheckIn, onOpenSleep, onOpenDuolingo, onOpenRoleplay }: QuickActionsRibbonProps) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 pr-2">
        <ActionChip color="blue" icon={<ShieldCheck size={18} className="text-[#007AFF]" />} label="Быстрый урок" onClick={onStartLesson} />
        <ActionChip color="purple" icon={<ChatsCircle size={18} className="text-purple-600" />} label="Чек‑ин" onClick={onCheckIn} />
        <ActionChip color="cyan" icon={<Headphones size={18} className="text-cyan-600" />} label="3‑минутная аудио‑пауза" onClick={onOpenSleep} />
        <ActionChip color="indigo" icon={<Bed size={18} className="text-indigo-600" />} label="Сон и медитации" onClick={onOpenSleep} />
        {onOpenDuolingo && (
          <ActionChip color="blue" icon={<GameController size={18} className="text-[#34C759]" />} label="Duolingo режим" onClick={onOpenDuolingo} />
        )}
        {onOpenRoleplay && (
          <ActionChip color="amber" icon={<FireSimple size={18} className="text-amber-600" />} label="Скажи «нет» (практика)" onClick={onOpenRoleplay} />
        )}
      </div>
    </div>
  )
}
