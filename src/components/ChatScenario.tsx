import { useEffect, useRef, useState } from 'react'
import { PaperPlaneRight, UserCircle, ChatDots, CheckCircle, XCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

type Msg = { id: string; role: 'friend' | 'you' | 'system'; text: string }
type Option = { id: string; text: string; isHealthy: boolean; feedback: string }

interface ChatScenarioProps {
  title: string
  intro: Msg[]
  options: Option[]
  onComplete: (opt: Option) => void
}

export default function ChatScenario({ title, intro, options, onComplete }: ChatScenarioProps) {
  const [messages, setMessages] = useState<Msg[]>(intro)
  const [answered, setAnswered] = useState<Option | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, answered])

  const handlePick = (opt: Option) => {
    setMessages(m => [...m, { id: 'you', role: 'you', text: opt.text }])
    setAnswered(opt)
    // Добавим реакцию «друга»
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { id: 'fb', role: 'friend', text: opt.isHealthy ? 'Ок, давай завтра. Спасибо, что сказал честно.' : 'Эй… ладно…' }
      ])
    }, 500)
  }

  const Bubble = ({ role, children }: { role: Msg['role']; children: any }) => (
    <div className={`flex ${role === 'you' ? 'justify-end' : 'justify-start'} my-1`}>
      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow ${
        role === 'you' ? 'bg-blue-600 text-white rounded-br-sm' : role === 'friend' ? 'bg-white border' : 'bg-gray-50'
      }`}>
        {children}
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-b from-white to-blue-50/40 rounded-xl border p-3">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
        <ChatDots size={16} className="text-[#007AFF]" weight="fill" /> {title}
      </div>
      <div className="h-64 overflow-y-auto pr-1">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role}>{m.text}</Bubble>
        ))}
        {answered && (
          <div className={`mt-2 text-sm flex items-start gap-2 ${answered.isHealthy ? 'text-green-700' : 'text-orange-700'}`}>
            {answered.isHealthy ? <CheckCircle size={16} className="text-green-600" weight="fill" /> : <XCircle size={16} className="text-orange-600" weight="fill" />}
            <span>{answered.feedback}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!answered ? (
        <div className="mt-3 grid grid-cols-1 gap-2">
          {options.map(opt => (
            <button key={opt.id} onClick={() => handlePick(opt)} className="text-left px-3 py-2 rounded-xl border bg-white hover:bg-blue-50 active:scale-[0.99]">
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={() => onComplete(answered)} className="mt-3 w-full px-3 py-2 rounded-xl bg-blue-600 text-white active:scale-[0.99]">Продолжить</button>
      )}
    </div>
  )
}

