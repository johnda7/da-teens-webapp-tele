import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  Trophy, 
  Target, 
  Heart, 
  BookOpen, 
  Users, 
  Calendar,
  Medal,
  Crown,
  Fire
} from '@phosphor-icons/react'

interface BadgeData {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  category: 'milestone' | 'habit' | 'social' | 'achievement'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
  criteria: string
}

interface BadgeGridProps {
  userBadges: string[] // Array of earned badge IDs
}

export default function BadgeGrid({ userBadges }: BadgeGridProps) {
  const badges: BadgeData[] = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Completed your first module week',
      icon: Star,
      category: 'milestone',
      rarity: 'common',
      earned: userBadges.includes('first-step'),
      earnedDate: '2024-01-08',
      criteria: 'Complete any module week'
    },
    {
      id: 'check-in-streak-7',
      title: 'Weekly Warrior',
      description: 'Completed 7 days of check-ins in a row',
      icon: Fire,
      category: 'habit',
      rarity: 'common',
      earned: userBadges.includes('check-in-streak-7'),
      earnedDate: '2024-01-10',
      progress: 7,
      maxProgress: 7,
      criteria: '7 consecutive daily check-ins'
    },
    {
      id: 'check-in-streak-30',
      title: 'Monthly Champion',
      description: 'Maintained daily check-ins for 30 days',
      icon: Crown,
      category: 'habit',
      rarity: 'epic',
      earned: false,
      progress: 12,
      maxProgress: 30,
      criteria: '30 consecutive daily check-ins'
    },
    {
      id: 'module-complete',
      title: 'Module Master',
      description: 'Completed your first full 3-week module',
      icon: Trophy,
      category: 'achievement',
      rarity: 'rare',
      earned: false,
      progress: 2,
      maxProgress: 3,
      criteria: 'Complete all 3 weeks of any module'
    },
    {
      id: 'support-seeker',
      title: 'Courage to Ask',
      description: 'Reached out for support when you needed it',
      icon: Heart,
      category: 'milestone',
      rarity: 'rare',
      earned: false,
      criteria: 'Use SOS feature or message curator for help'
    },
    {
      id: 'group-contributor',
      title: 'Team Player',
      description: 'Actively participated in 5 group sessions',
      icon: Users,
      category: 'social',
      rarity: 'common',
      earned: false,
      progress: 2,
      maxProgress: 5,
      criteria: 'Attend and participate in 5 group video sessions'
    },
    {
      id: 'practice-dedication',
      title: 'Practice Makes Progress',
      description: 'Completed 20 mindfulness practices',
      icon: Target,
      category: 'habit',
      rarity: 'rare',
      earned: false,
      progress: 8,
      maxProgress: 20,
      criteria: 'Complete 20 guided practices'
    },
    {
      id: 'reflection-master',
      title: 'Deep Thinker',
      description: 'Submitted thoughtful reflections for 10 weeks',
      icon: BookOpen,
      category: 'achievement',
      rarity: 'epic',
      earned: false,
      progress: 3,
      maxProgress: 10,
      criteria: 'Submit quality reflections for 10 weeks'
    },
    {
      id: 'year-journey',
      title: 'Year-Long Explorer',
      description: 'Completed all 12 modules in the program',
      icon: Medal,
      category: 'achievement',
      rarity: 'legendary',
      earned: false,
      progress: 0,
      maxProgress: 12,
      criteria: 'Complete all 12 modules (entire year program)'
    }
  ]

  const earnedBadges = badges.filter(b => b.earned)
  const inProgressBadges = badges.filter(b => !b.earned && b.progress !== undefined)
  const lockedBadges = badges.filter(b => !b.earned && b.progress === undefined)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'text-green-600'
      case 'habit': return 'text-orange-600'
      case 'social': return 'text-blue-600'
      case 'achievement': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const BadgeCard = ({ badge }: { badge: BadgeData }) => {
    const IconComponent = badge.icon
    const isEarned = badge.earned
    const hasProgress = badge.progress !== undefined

    return (
      <Card className={`transition-all duration-200 ${
        isEarned 
          ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-sm' 
          : hasProgress 
            ? 'hover:shadow-md cursor-pointer' 
            : 'opacity-60'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-full ${
              isEarned ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <IconComponent 
                className={`w-6 h-6 ${
                  isEarned ? getCategoryColor(badge.category) : 'text-muted-foreground'
                }`}
                weight={isEarned ? 'fill' : 'regular'}
              />
            </div>
            <div className="flex gap-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${getRarityColor(badge.rarity)}`}
              >
                {badge.rarity}
              </Badge>
              {isEarned && (
                <Badge variant="default" className="text-xs">
                  ✓ Earned
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          <div>
            <CardTitle className="text-base leading-tight">{badge.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {badge.description}
            </CardDescription>
          </div>

          {/* Progress Bar */}
          {hasProgress && badge.maxProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span className="text-muted-foreground">
                  {badge.progress}/{badge.maxProgress}
                </span>
              </div>
              <Progress 
                value={(badge.progress! / badge.maxProgress) * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Earned Date */}
          {isEarned && badge.earnedDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              Earned {new Date(badge.earnedDate).toLocaleDateString()}
            </div>
          )}

          {/* Criteria */}
          <p className="text-xs text-muted-foreground border-t pt-2">
            {badge.criteria}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Achievements</CardTitle>
          <CardDescription>
            Celebrating your progress and milestones on this wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{earnedBadges.length}</div>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{inProgressBadges.length}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{badges.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" weight="fill" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            In Progress ({inProgressBadges.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgressBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {lockedBadges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-600" />
            Available to Earn ({lockedBadges.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {lockedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Motivation Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <h4 className="font-medium mb-2">Keep Going! 🌟</h4>
          <p className="text-sm text-muted-foreground">
            Every small step counts. Each badge represents your commitment to growth and wellbeing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}