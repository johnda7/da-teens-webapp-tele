import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from '@phosphor-icons/react'

interface ExampleItem { title: string; text: string }
interface ExampleChipsProps {
  items: ExampleItem[]
  onAcknowledge?: (idx: number) => void
}

export default function ExampleChips({ items, onAcknowledge }: ExampleChipsProps) {
  const [open, setOpen] = useState<number | null>(null)
  const [ack, setAck] = useState<Record<number, boolean>>({})

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((ex, i) => (
          <button
            key={i}
            className={`px-3 py-2 rounded-full text-xs border active:scale-[0.99] ${ack[i] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-700'}`}
            onClick={() => setOpen(open === i ? null : i)}
            onDoubleClick={() => { setAck(prev => ({ ...prev, [i]: !prev[i] })); onAcknowledge?.(i) }}
            title="Клик — раскрыть, двойной клик — отметить как про меня"
          >
            {ack[i] && <CheckCircle size={12} className="inline mr-1 text-emerald-600" weight="fill" />}
            {ex.title}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
          >
            {items[open].text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

