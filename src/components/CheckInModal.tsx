import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Minus, Heart, Brain, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { toast } from 'react-hot-toast'

export type CheckInData = {
  mood: number // 1-5
  anxiety: number // 1-5
  energy: number // 1-5
  timestamp: Date
  notes?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CheckInData) => void
  previousCheckIn?: CheckInData
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊']
const anxietyEmojis = ['😰', '😟', '😐', '😌', '😎']
const energyEmojis = ['🔋', '🪫', '⚡', '✨', '🚀']

const getMoodLabel = (value: number) => {
  const labels = ['Very Bad', 'Not Great', 'Okay', 'Good', 'Great']
  return labels[value - 1]
}

const getAnxietyLabel = (value: number) => {
  const labels = ['Very High', 'High', 'Medium', 'Low', 'Very Low']
  return labels[value - 1]
}

const getEnergyLabel = (value: number) => {
  const labels = ['Exhausted', 'Low', 'Moderate', 'High', 'Energized']
  return labels[value - 1]
}

export default function CheckInModal({ isOpen, onClose, onSubmit, previousCheckIn }: Props) {
  const [mood, setMood] = useState(3)
  const [anxiety, setAnxiety] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const data: CheckInData = {
      mood,
      anxiety,
      energy,
      timestamp: new Date(),
      notes: notes.trim() || undefined
    }
    
    onSubmit(data)
    setSubmitted(true)
    
    toast.success('Чек-ин сохранён! �', {
      duration: 3000,
      style: {
        background: '#007AFF',
        color: '#fff',
      },
    })
    
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 1500)
  }

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null
    if (current > previous) return 'up'
    if (current < previous) return 'down'
    return 'same'
  }

  const moodTrend = getTrend(mood, previousCheckIn?.mood)
  const anxietyTrend = getTrend(anxiety, previousCheckIn?.anxiety)
  const energyTrend = getTrend(energy, previousCheckIn?.energy)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] bg-clip-text text-transparent">
              How are you feeling?
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              {/* Mood Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-lg font-semibold">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Mood
                  </label>
                  {moodTrend && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-sm"
                    >
                      {moodTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {moodTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {moodTrend === 'same' && <Minus className="h-4 w-4 text-gray-500" />}
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-center gap-2 mb-2">
                  {moodEmojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setMood(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-4xl transition-all flex items-center justify-center leading-none ${
                        mood === index + 1 
                          ? 'scale-125 drop-shadow-lg' 
                          : 'opacity-40 grayscale'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                
                <Slider
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                
                <p className="text-center text-sm text-muted-foreground">
                  {getMoodLabel(mood)}
                </p>
              </div>

              {/* Anxiety Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-lg font-semibold">
                    <Brain className="h-5 w-5 text-[#007AFF]" />
                    Anxiety Level
                  </label>
                  {anxietyTrend && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-sm"
                    >
                      {/* For anxiety, down is good, up is bad */}
                      {anxietyTrend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                      {anxietyTrend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {anxietyTrend === 'same' && <Minus className="h-4 w-4 text-gray-500" />}
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-center gap-2 mb-2">
                  {anxietyEmojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setAnxiety(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-4xl transition-all flex items-center justify-center leading-none ${
                        anxiety === index + 1 
                          ? 'scale-125 drop-shadow-lg' 
                          : 'opacity-40 grayscale'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                
                <Slider
                  value={[anxiety]}
                  onValueChange={(value) => setAnxiety(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                
                <p className="text-center text-sm text-muted-foreground">
                  {getAnxietyLabel(anxiety)}
                </p>
              </div>

              {/* Energy Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-lg font-semibold">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Energy Level
                  </label>
                  {energyTrend && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-sm"
                    >
                      {energyTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {energyTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {energyTrend === 'same' && <Minus className="h-4 w-4 text-gray-500" />}
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-center gap-2 mb-2">
                  {energyEmojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setEnergy(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-4xl transition-all flex items-center justify-center leading-none ${
                        energy === index + 1 
                          ? 'scale-125 drop-shadow-lg' 
                          : 'opacity-40 grayscale'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                
                <Slider
                  value={[energy]}
                  onValueChange={(value) => setEnergy(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                
                <p className="text-center text-sm text-muted-foreground">
                  {getEnergyLabel(energy)}
                </p>
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Anything you'd like to note? (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? What's on your mind?"
                  className="w-full min-h-[80px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {notes.length}/200
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 text-lg"
              >
                Сохранить чек-ин
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="py-12 text-center space-y-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1]
                }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Чек-ин сохранён!
              </h3>
              <p className="text-muted-foreground">
                Спасибо, что поделился своими ощущениями
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
