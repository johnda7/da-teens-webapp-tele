import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Phone, Heart, ArrowRight, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SOSButtonProps {
  variant?: 'default' | 'icon'
}

export default function SOSButton({ variant = 'icon' }: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUrgency, setSelectedUrgency] = useState<'low' | 'medium' | 'high' | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const urgencyLevels = [
    {
      level: 'low',
      label: 'I need someone to talk to',
      description: 'Feeling overwhelmed but not in immediate danger',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      responseTime: '2-4 hours'
    },
    {
      level: 'medium',
      label: 'I need help soon',
      description: 'Struggling with difficult thoughts or feelings',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      responseTime: '30-60 minutes'
    },
    {
      level: 'high',
      label: 'This is urgent',
      description: 'I need immediate support or am in crisis',
      color: 'bg-red-50 border-red-200 text-red-800',
      responseTime: 'Immediately'
    }
  ]

  const handleSubmit = async () => {
    if (!selectedUrgency) {
      toast.error("Please select how urgent this is")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to alert curator/mental health professional
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock notification to curator
      console.log('SOS Alert sent:', {
        urgency: selectedUrgency,
        message,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id'
      })

      toast.success("Help is on the way", {
        description: selectedUrgency === 'high' 
          ? "A mental health professional will contact you immediately."
          : `Someone will reach out within ${urgencyLevels.find(l => l.level === selectedUrgency)?.responseTime}.`
      })

      // Reset and close
      setSelectedUrgency(null)
      setMessage('')
      setIsOpen(false)

    } catch (error) {
      toast.error("Connection error", {
        description: "Please try again or call emergency services if this is urgent."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const TriggerButton = variant === 'icon' ? (
    <Button
      variant="outline"
      size="sm"
      className="border-destructive/20 text-destructive hover:bg-destructive/10"
    >
      <Shield className="w-4 h-4" />
    </Button>
  ) : (
    <Button
      variant="destructive"
      className="w-full"
    >
      <Shield className="w-4 h-4 mr-2" />
      I Need Help (SOS)
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" weight="fill" />
            We're Here to Help
          </DialogTitle>
          <DialogDescription>
            You're not alone. Let us know what kind of support you need right now.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emergency Notice */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    If this is a life-threatening emergency
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">
                    Please call 911 (US), 999 (UK), or your local emergency number immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgency Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">How urgent is this?</h4>
            
            {urgencyLevels.map((level) => (
              <Card
                key={level.level}
                className={`cursor-pointer transition-all ${
                  selectedUrgency === level.level
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:shadow-sm'
                }`}
                onClick={() => setSelectedUrgency(level.level as any)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{level.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {level.description}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${level.color}`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {level.responseTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Optional Message */}
          {selectedUrgency && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tell us what's happening (optional)
              </label>
              <Textarea
                placeholder="Any details that might help us support you better..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/300 characters • This will only be seen by trained professionals
              </p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!selectedUrgency || isSubmitting}
              className="w-full"
              variant="destructive"
            >
              {isSubmitting ? 'Sending...' : 'Send Help Request'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* Support Resources */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h5 className="font-medium text-sm mb-2">24/7 Crisis Resources</h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>🇺🇸 Crisis Text Line: Text HOME to 741741</p>
                <p>🇺🇸 National Suicide Prevention Lifeline: 988</p>
                <p>🇬🇧 Samaritans: 116 123</p>
                <p>🇨🇦 Talk Suicide Canada: 1-833-456-4566</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}