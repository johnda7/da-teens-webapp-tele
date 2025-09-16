import { useMemo } from 'react'

interface PersonalizedGreetingProps {
  userName: string
  className?: string
}

export default function PersonalizedGreeting({ userName, className = "" }: PersonalizedGreetingProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      return 'Доброе утро'
    } else if (hour >= 12 && hour < 17) {
      return 'Добрый день'
    } else if (hour >= 17 && hour < 22) {
      return 'Добрый вечер'
    } else {
      return 'Привет'
    }
  }, [])

  return (
    <div className={className}>
      <h1 className="text-lg font-semibold text-foreground">
        {greeting}, {userName}!
      </h1>
      <p className="text-sm text-muted-foreground">DA Teens</p>
    </div>
  )
}