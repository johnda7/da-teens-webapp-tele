import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ShieldWarning, Phone, Heart } from '@phosphor-icons/react'
import { toast } from 'sonner'

const crisisTypes = [
  { id: 'anxiety', label: 'Anxiety/Panic Attack', description: 'Feeling overwhelmed or having panic symptoms' },
  { id: 'depression', label: 'Depression/Low Mood', description: 'Feeling very sad, hopeless, or empty' },
  { id: 'self-harm', label: 'Self-Harm Thoughts', description: 'Thinking about hurting yourself' },
  { id: 'family', label: 'Family/Home Issues', description: 'Problems at home that feel unsafe' },
  { id: 'bullying', label: 'Bullying/Harassment', description: 'Being bullied or harassed by others' },
  { id: 'other', label: 'Other Crisis', description: 'Something else that feels urgent or scary' }
]

const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
  { name: 'Teen Crisis Hotline', number: '1-800-448-3000', available: '24/7' }
]

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCrisis, setSelectedCrisis] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedCrisis) {
      toast.error('Please select what type of help you need')
      return
    }

    setIsSubmitting(true)
    
    // In a real app, this would send an alert to curators/mentors
    // For demo purposes, we'll just show a success message
    setTimeout(() => {
      toast.success('Alert sent to your curator. They will contact you within 5 minutes.')
      setIsOpen(false)
      setSelectedCrisis('')
      setDetails('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1">
          <ShieldWarning className="w-4 h-4" />
          SOS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Heart className="w-5 h-5" weight="fill" />
            We're Here to Help
          </DialogTitle>
          <DialogDescription>
            You're not alone. Let us know what's going on so we can get you the right support.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">What's happening?</Label>
            <RadioGroup value={selectedCrisis} onValueChange={setSelectedCrisis} className="mt-2">
              {crisisTypes.map((crisis) => (
                <div key={crisis.id} className="flex items-start space-x-2 p-3 border border-border rounded-lg">
                  <RadioGroupItem value={crisis.id} id={crisis.id} className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor={crisis.id} className="font-medium cursor-pointer">
                      {crisis.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{crisis.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="details" className="text-sm font-medium">
              Anything else you want to share? (optional)
            </Label>
            <Textarea
              id="details"
              placeholder="You can share more details here, but it's okay to leave this blank too."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="w-full"
              variant="destructive"
            >
              {isSubmitting ? 'Sending Alert...' : 'Send Alert to Curator'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Or call these crisis lines immediately:
              </p>
              <div className="space-y-1">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center text-xs bg-muted p-2 rounded">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-primary font-medium">{contact.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}