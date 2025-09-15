import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Moon, Brain, Smiley, SmileyMeh, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CheckInData {
  date: string
  mood: number // 1-5 scale 
  anxiety: number // 0-10 scale
  sleepHours: number
  note?: string
}

interface CheckInPanelProps {
  onCheckIn: (data: CheckInData) => void
  lastCheckIn: CheckInData | null
}

export default function CheckInPanel({ onCheckIn, lastCheckIn }: CheckInPanelProps) {
  const [mood, setMood] = useState<number>(3)
  const [anxiety, setAnxiety] = useState<number[]>([3])
  const [sleepHours, setSleepHours] = useState<number[]>([7])
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check if already checked in today
  const today = new Date().toISOString().split('T')[0]
  const hasCheckedInToday = lastCheckIn?.date === today

  const moodEmojis = [
    { value: 1, emoji: SmileyMeh, label: "Struggling", color: "text-red-500" },
    { value: 2, emoji: SmileyMeh, label: "Difficult", color: "text-orange-500" },
    { value: 3, emoji: SmileyMeh, label: "Okay", color: "text-yellow-500" },
    { value: 4, emoji: Smiley, label: "Good", color: "text-blue-500" },
    { value: 5, emoji: Smiley, label: "Great", color: "text-green-500" }
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const checkInData: CheckInData = {
        date: today,
        mood,
        anxiety: anxiety[0],
        sleepHours: sleepHours[0],
        note: note.trim() || undefined
      }
      
      onCheckIn(checkInData)
      
      // Show success message
      toast.success("Check-in saved! 🌟", {
        description: "Thank you for taking a moment to reflect on your wellbeing."
      })
      
      // Reset form for next time
      setNote('')
      
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again in a moment."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateInsight = () => {
    if (!lastCheckIn) return null
    
    const { mood: lastMood, anxiety: lastAnxiety, sleepHours: lastSleep } = lastCheckIn
    
    if (anxiety[0] > 7) {
      return {
        type: "concern",
        message: "Your anxiety levels seem high today. Consider trying a breathing practice or reaching out to your group for support.",
        action: "Try a 5-minute breathing exercise"
      }
    }
    
    if (sleepHours[0] < 6) {
      return {
        type: "tip", 
        message: "Getting enough sleep is crucial for emotional wellbeing. Aim for 8-9 hours when possible.",
        action: "Set a bedtime reminder"
      }
    }
    
    if (mood >= 4 && anxiety[0] <= 4) {
      return {
        type: "positive",
        message: "You're doing great today! This is a good time to practice gratitude or help a friend.",
        action: "Share something positive"
      }
    }
    
    return null
  }

  const insight = generateInsight()

  if (hasCheckedInToday) {
    return (
      <div className="space-y-6">
        {/* Today's Check-in Summary */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
              Today's Check-in Complete
            </CardTitle>
            <CardDescription>
              You've already checked in today. Here's your summary:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">
                  {moodEmojis.find(m => m.value === lastCheckIn.mood)?.emoji && 
                    React.createElement(moodEmojis.find(m => m.value === lastCheckIn.mood)!.emoji, {
                      className: `w-8 h-8 mx-auto ${moodEmojis.find(m => m.value === lastCheckIn.mood)!.color}`
                    })
                  }
                </div>
                <p className="text-sm font-medium">Mood</p>
                <p className="text-xs text-muted-foreground">
                  {moodEmojis.find(m => m.value === lastCheckIn.mood)?.label}
                </p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {lastCheckIn.anxiety}/10
                </div>
                <p className="text-sm font-medium">Anxiety</p>
                <p className="text-xs text-muted-foreground">
                  {lastCheckIn.anxiety <= 3 ? 'Low' : 
                   lastCheckIn.anxiety <= 6 ? 'Moderate' : 'High'}
                </p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-accent mb-1">
                  {lastCheckIn.sleepHours}h
                </div>
                <p className="text-sm font-medium">Sleep</p>
                <p className="text-xs text-muted-foreground">
                  {lastCheckIn.sleepHours >= 8 ? 'Great' : 
                   lastCheckIn.sleepHours >= 6 ? 'Good' : 'Low'}
                </p>
              </div>
            </div>
            
            {lastCheckIn.note && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Your reflection:</p>
                  <p className="text-sm text-muted-foreground italic">"{lastCheckIn.note}"</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Personalized Insight */}
        {insight && (
          <Card className={`${
            insight.type === 'concern' ? 'border-orange-200 bg-orange-50' :
            insight.type === 'positive' ? 'border-blue-200 bg-blue-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <CardContent className="p-4">
              <p className="text-sm text-foreground mb-3">{insight.message}</p>
              <Button variant="outline" size="sm">
                {insight.action}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tomorrow's Check-in Reminder */}
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              See you tomorrow for another check-in. Take care of yourself today! 💙
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Daily Check-in</CardTitle>
          <CardDescription>
            How are you feeling today? Taking 30 seconds to check in helps build self-awareness.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            Overall Mood
          </CardTitle>
          <CardDescription>Choose the emoji that best represents how you're feeling right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((moodOption) => {
              const EmojiComponent = moodOption.emoji
              return (
                <button
                  key={moodOption.value}
                  onClick={() => setMood(moodOption.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    mood === moodOption.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <EmojiComponent 
                    className={`w-8 h-8 mx-auto ${moodOption.color}`} 
                    weight="fill" 
                  />
                  <p className="text-xs mt-2 font-medium">{moodOption.label}</p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Anxiety Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Anxiety Level
          </CardTitle>
          <CardDescription>
            Rate your anxiety from 0 (completely calm) to 10 (very anxious)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={anxiety}
              onValueChange={setAnxiety}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Calm (0)</span>
            <span className="font-medium text-foreground">{anxiety[0]}/10</span>
            <span>Very Anxious (10)</span>
          </div>
          
          {anxiety[0] > 7 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                It looks like you're feeling quite anxious. Remember, it's okay to reach out for support. 
                Consider trying a breathing exercise or talking to someone you trust.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="w-5 h-5 text-blue-600" />
            Sleep Last Night
          </CardTitle>
          <CardDescription>How many hours of sleep did you get?</CardDescription>
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
              <p className="text-sm text-blue-800">
                Sleep is super important for your mood and focus. Try to aim for 8-9 hours when possible! 😴
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reflection (Optional)</CardTitle>
          <CardDescription>
            Any thoughts, wins, or challenges you'd like to note today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Something good that happened today, a challenge you're facing, or just what's on your mind..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-muted-foreground mt-2">
            {note.length}/500 characters
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Saving..." : "Complete Check-in"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Your responses help us understand how to better support you
          </p>
        </CardContent>
      </Card>
    </div>
  )
}