import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface CheckInData {
  date: string
  mood: number
  anxiety: number
  sleepHours: number
  note?: string
}

interface CheckInPanelProps {
  onCheckIn: (data: CheckInData) => void
  lastCheckIn: CheckInData | null
}

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄']
const moodLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Great', 'Amazing']

export default function CheckInPanel({ onCheckIn, lastCheckIn }: CheckInPanelProps) {
  const [mood, setMood] = useState(lastCheckIn?.mood || 3)
  const [anxiety, setAnxiety] = useState([lastCheckIn?.anxiety || 3])
  const [sleepHours, setSleepHours] = useState([lastCheckIn?.sleepHours || 8])
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [checkIns, setCheckIns] = useKV<CheckInData[]>('check-ins', [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const checkInData: CheckInData = {
      date: new Date().toISOString().split('T')[0],
      mood,
      anxiety: anxiety[0],
      sleepHours: sleepHours[0],
      note: note.trim() || undefined
    }
    
    // Save to KV store
    setCheckIns((current) => [checkInData, ...(current || []).slice(0, 29)]) // Keep last 30 check-ins
    
    // Call parent callback
    onCheckIn(checkInData)
    
    // Show success message
    toast.success('Check-in saved! Great job staying aware of your wellness.')
    
    setIsSubmitting(false)
    setNote('')
  }

  const today = new Date().toISOString().split('T')[0]
  const hasCheckedInToday = lastCheckIn?.date === today

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Daily Check-in</h2>
        <p className="text-muted-foreground">
          {hasCheckedInToday ? 'Update your check-in for today' : 'How are you feeling today?'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Mood Check
            <Badge variant="secondary">{moodLabels[mood]}</Badge>
          </CardTitle>
          <CardDescription>Pick the emoji that best represents how you feel right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 py-4">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setMood(index)}
                className={`text-4xl p-2 rounded-lg transition-all ${
                  mood === index 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                    : 'hover:bg-muted'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anxiety Level</CardTitle>
          <CardDescription>Rate your anxiety from 0 (calm) to 10 (very anxious)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={anxiety}
              onValueChange={setAnxiety}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0 - Calm</span>
            <span className="font-medium text-foreground">{anxiety[0]}/10</span>
            <span>10 - Very anxious</span>
          </div>
          {anxiety[0] >= 7 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Feeling anxious? Try a quick breathing exercise or reach out to your curator.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep</CardTitle>
          <CardDescription>How many hours did you sleep last night?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              max={12}
              min={2}
              step={0.5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>2 hours</span>
            <span className="font-medium text-foreground">{sleepHours[0]} hours</span>
            <span>12 hours</span>
          </div>
          {sleepHours[0] < 6 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Getting enough sleep is crucial for your wellbeing. Try to aim for 8-9 hours tonight.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Journal</CardTitle>
          <CardDescription>Anything on your mind? (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's one thing that happened today that you're grateful for? Or what's something that challenged you?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
            maxLength={500}
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {note.length}/500
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit}
        className="w-full h-12 text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : hasCheckedInToday ? 'Update Check-in' : 'Complete Check-in'}
      </Button>

      {(checkIns && checkIns.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {checkIns.slice(0, 5).map((checkIn, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodEmojis[checkIn.mood]}</span>
                    <div>
                      <p className="text-sm font-medium">{checkIn.date}</p>
                      <p className="text-xs text-muted-foreground">
                        Anxiety: {checkIn.anxiety}/10 • Sleep: {checkIn.sleepHours}h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}