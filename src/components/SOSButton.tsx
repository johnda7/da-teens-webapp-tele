import { Button } from '@/components/ui/button'
import { Warning, Phone } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function SOSButton() {
  const handleSOS = () => {
    // Show immediate support message
    toast.error('SOS активирован', {
      description: 'Куратор уведомлён и свяжется с тобой в ближайшее время',
      duration: 5000,
    })

    // In real app, this would trigger:
    // - Notification to curator
    // - Log crisis flag in database
    // - Show emergency contacts
    
    // Mock curator notification
    console.log('🚨 SOS activated - notifying curator')
  }

  const showEmergencyContacts = () => {
    toast.info('Экстренные контакты', {
      description: 'Телефон доверия: 8-800-2000-122 (круглосуточно)',
      duration: 10000,
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={handleSOS}
        className="gap-2 text-xs"
      >
        <Warning className="w-3 h-3" weight="fill" />
        SOS
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={showEmergencyContacts}
        className="gap-1 text-xs"
      >
        <Phone className="w-3 h-3" />
      </Button>
    </div>
  )
}