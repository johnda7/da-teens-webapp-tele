import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendUp, 
  TrendDown, 
  Minus, 
  Target, 
  Calendar, 
  BookOpen,
  Trophy,
  Heart,
  Users,
  CheckCircle
} from '@phosphor-icons/react'
import { progressUtils, wellnessUtils, textUtils } from '@/lib/utils/helpers'

interface CheckInData {
  date: string
  mood: number
  anxiety: number
  sleepHours: number
  note?: string
}

interface ProgressStatsProps {
  userProfile: {
    name: string
    age: number
    currentModule: number
    currentWeek: number
    completedModules: number
    streak: number
    cohortId: string
  }
  checkIns: CheckInData[]
  badgeCount: number
}

export default function ProgressStats({ userProfile, checkIns, badgeCount }: ProgressStatsProps) {
  // Calculate various stats
  const programProgress = progressUtils.calculateProgramProgress(userProfile.completedModules)
  const moodTrend = wellnessUtils.analyzeMoodTrend(checkIns.map(c => ({
    id: c.date,
    userId: 'current',
    date: c.date,
    mood: c.mood,
    anxiety: c.anxiety,
    sleepHours: c.sleepHours,
    note: c.note,
    createdAt: new Date()
  })))
  
  const totalCheckIns = checkIns.length
  const streakDays = userProfile.streak
  const encouragementMessage = textUtils.getEncouragementMessage(streakDays, userProfile.completedModules)

  // Calculate weekly stats
  const thisWeekCheckIns = checkIns.filter(c => {
    const checkInDate = new Date(c.date)
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    return checkInDate >= weekStart
  })

  const avgMoodThisWeek = thisWeekCheckIns.length > 0 
    ? thisWeekCheckIns.reduce((sum, c) => sum + c.mood, 0) / thisWeekCheckIns.length
    : 0

  const avgSleepThisWeek = thisWeekCheckIns.length > 0
    ? thisWeekCheckIns.reduce((sum, c) => sum + c.sleepHours, 0) / thisWeekCheckIns.length
    : 0

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendUp
      case 'declining': return TrendDown
      default: return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600'
      case 'declining': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-xl">Hi {userProfile.name}! 👋</CardTitle>
          <CardDescription className="text-base">
            {encouragementMessage}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Program Progress
          </CardTitle>
          <CardDescription>{programProgress.stage} • {programProgress.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Modules Completed</span>
              <span className="font-medium">{userProfile.completedModules}/12</span>
            </div>
            <Progress value={programProgress.percentage} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {programProgress.percentage}% of your wellness journey complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{streakDays}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Daily check-ins</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">{badgeCount}</div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Trophy className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Achievements</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Module Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Current Module
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Module {userProfile.currentModule}</h4>
              <p className="text-sm text-muted-foreground">Week {userProfile.currentWeek} of 3</p>
            </div>
            <Badge variant="secondary">
              Week {userProfile.currentWeek}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Week Progress</span>
              <span>{userProfile.currentWeek}/3 weeks</span>
            </div>
            <Progress value={(userProfile.currentWeek / 3) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Wellness Trends */}
      {checkIns.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" weight="fill" />
              Wellness Trends
            </CardTitle>
            <CardDescription>Based on your recent check-ins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mood Trend */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-background ${getTrendColor(moodTrend.trend)}`}>
                  {React.createElement(getTrendIcon(moodTrend.trend), { className: "w-4 h-4" })}
                </div>
                <div>
                  <p className="font-medium text-sm">Mood Trend</p>
                  <p className="text-xs text-muted-foreground capitalize">{moodTrend.trend}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{moodTrend.average.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
            </div>

            {/* This Week Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg text-center">
                <p className="text-sm font-medium">This Week</p>
                <p className="text-lg font-bold text-primary">{avgMoodThisWeek.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Mood</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg text-center">
                <p className="text-sm font-medium">Sleep</p>
                <p className="text-lg font-bold text-accent">{avgSleepThisWeek.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">Avg per night</p>
              </div>
            </div>

            {/* Recommendation */}
            {moodTrend.recommendation && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{moodTrend.recommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Community Involvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Cohort</span>
            <Badge>Teens 14-16 Group A</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Check-ins</span>
            <span className="font-medium">{totalCheckIns}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Engagement</span>
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
            Recent Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {streakDays >= 7 && (
            <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">7-day check-in streak achieved!</span>
            </div>
          )}
          
          {userProfile.completedModules >= 1 && (
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">First module completed</span>
            </div>
          )}

          {badgeCount >= 3 && (
            <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Earned {badgeCount} achievement badges</span>
            </div>
          )}

          {/* Encouragement if no milestones yet */}
          {streakDays < 7 && userProfile.completedModules === 0 && badgeCount < 3 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Your first milestones are just around the corner! Keep up the great work. 🌟
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}