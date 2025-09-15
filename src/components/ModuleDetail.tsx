import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Play, CheckCircle, Clock, Users, BookOpen } from '@phosphor-icons/react'

interface Week {
  id: number
  title: string
  description: string
  videoUrl?: string
  videoDuration?: string
  practices: Practice[]
  reflectionQuestions: string[]
  isCompleted: boolean
  isCurrent: boolean
}

interface Practice {
  title: string
  duration: string
  steps: string[]
}

interface ModuleDetailProps {
  moduleId: number
  onBack: () => void
}

// Mock data for Module 1: Confidence & Self-Discovery
const moduleData = {
  1: {
    title: "Confidence & Self-Discovery",
    description: "Explore your strengths, build inner confidence, and develop a positive self-image",
    totalDuration: "3 weeks",
    groupSessions: 3,
    weeks: [
      {
        id: 1,
        title: "Discovering Your Strengths",
        description: "Learn to identify and appreciate your unique qualities and talents",
        videoUrl: "https://example.com/week1-video",
        videoDuration: "6 min",
        practices: [
          {
            title: "Strengths Wheel Exercise",
            duration: "10 min",
            steps: [
              "Draw a circle and divide it into 8 sections",
              "In each section, write one of your strengths",
              "Think of a time when you used each strength successfully",
              "Share one strength story with your group this week"
            ]
          }
        ],
        reflectionQuestions: [
          "What strength surprised you the most when you wrote it down?",
          "How did it feel to focus on your positive qualities?",
          "Which strength would you like to develop further?"
        ],
        isCompleted: true,
        isCurrent: false
      },
      {
        id: 2,
        title: "Building Inner Confidence",
        description: "Develop tools to boost self-confidence and overcome self-doubt",
        videoUrl: "https://example.com/week2-video", 
        videoDuration: "7 min",
        practices: [
          {
            title: "Confidence Anchor Technique",
            duration: "8 min",
            steps: [
              "Sit comfortably and close your eyes",
              "Remember a time when you felt truly confident",
              "Notice what you saw, heard, and felt in that moment",
              "Create a physical 'anchor' (like touching your thumb to finger)",
              "Practice this anchor daily to access confidence when needed"
            ]
          }
        ],
        reflectionQuestions: [
          "What does confidence feel like in your body?",
          "When do you feel most confident during the day?",
          "What small step could you take tomorrow to practice confidence?"
        ],
        isCompleted: false,
        isCurrent: true
      },
      {
        id: 3,
        title: "Positive Self-Talk",
        description: "Transform your inner critic into your inner supporter",
        videoUrl: "https://example.com/week3-video",
        videoDuration: "5 min", 
        practices: [
          {
            title: "Inner Voice Makeover",
            duration: "12 min",
            steps: [
              "Notice your self-talk for one day without judgment",
              "Write down any negative phrases you caught",
              "For each negative phrase, create a kind alternative",
              "Practice your new phrases 3 times daily",
              "Imagine speaking to your best friend - use that tone with yourself"
            ]
          }
        ],
        reflectionQuestions: [
          "What patterns did you notice in your self-talk?",
          "How did it feel to speak to yourself more kindly?",
          "What would you tell a friend who talks to themselves the way you do?"
        ],
        isCompleted: false,
        isCurrent: false
      }
    ]
  }
}

export default function ModuleDetail({ moduleId, onBack }: ModuleDetailProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  
  const module = moduleData[moduleId as keyof typeof moduleData]
  
  if (!module) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Module content coming soon...</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
        </CardContent>
      </Card>
    )
  }

  // If a week is selected, show week detail
  if (selectedWeek) {
    const week = module.weeks.find(w => w.id === selectedWeek)
    if (!week) return null

    return (
      <div className="space-y-6">
        {/* Week Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedWeek(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Module
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Week {week.id}: {week.title}</CardTitle>
                <CardDescription className="mt-1">{week.description}</CardDescription>
              </div>
              {week.isCompleted && (
                <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Video Section */}
        {week.videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Weekly Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <Play className="w-12 h-12 text-primary mx-auto mb-4" weight="fill" />
                <p className="font-medium">{week.title}</p>
                <p className="text-sm text-muted-foreground">{week.videoDuration}</p>
                <Button className="mt-4">
                  Watch Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Practices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Practice Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {week.practices.map((practice, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{practice.title}</h4>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {practice.duration}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {practice.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center justify-center">
                        {stepIndex + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant={week.isCompleted ? "secondary" : "default"}>
                  {week.isCompleted ? "Completed" : "Start Practice"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reflection Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Reflection</CardTitle>
            <CardDescription>Take a few minutes to think about your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {week.reflectionQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">{question}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Submit Reflection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Module overview
  const completedWeeks = module.weeks.filter(w => w.isCompleted).length
  const currentWeek = module.weeks.find(w => w.isCurrent)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Modules
        </Button>
      </div>

      {/* Module Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {module.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {module.totalDuration}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {module.groupSessions} group sessions
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Module Progress</span>
              <span>{completedWeeks}/3 weeks completed</span>
            </div>
            <Progress value={(completedWeeks / 3) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Week Highlight */}
      {currentWeek && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" weight="fill" />
              Continue Week {currentWeek.id}
            </CardTitle>
            <CardDescription>{currentWeek.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => setSelectedWeek(currentWeek.id)}
            >
              Start Week {currentWeek.id}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Week List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3-Week Journey</h3>
        
        {module.weeks.map((week, index) => (
          <Card 
            key={week.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              week.isCurrent ? 'ring-2 ring-primary/20' : ''
            }`}
            onClick={() => setSelectedWeek(week.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Week {week.id}
                    </span>
                    {week.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{week.title}</CardTitle>
                  <CardDescription className="mt-1">{week.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {week.videoDuration && (
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {week.videoDuration}
                    </span>
                  )}
                  <span>{week.practices.length} practice{week.practices.length !== 1 ? 's' : ''}</span>
                  <span>{week.reflectionQuestions.length} questions</span>
                </div>
                
                <Badge variant={
                  week.isCompleted ? "default" : 
                  week.isCurrent ? "secondary" : "outline"
                }>
                  {week.isCompleted ? 'Completed' : 
                   week.isCurrent ? 'Current' : 'Upcoming'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}