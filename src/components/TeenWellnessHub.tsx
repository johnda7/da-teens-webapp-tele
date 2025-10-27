import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, Clock, Target, Heart, BookOpen } from '@phosphor-icons/react'
import PracticePlayer from '@/components/PracticePlayer'
import { teenSpecificPractices, teenScenarios } from '@/data/teenContent'
import { breathingPractices, quickPractices } from '@/data/practicesData'

export default function TeenWellnessHub() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = Array.from(new Set([
    ...teenSpecificPractices.flatMap(p => p.tags),
    ...breathingPractices.flatMap(p => p.tags)
  ]))

  // Filter practices based on search and tags
  const filteredTeenPractices = teenSpecificPractices.filter(practice => {
    const matchesSearch = practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = !selectedTag || practice.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const filteredBreathingPractices = breathingPractices.filter(practice => {
    const matchesSearch = practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = !selectedTag || practice.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Центр поддержки</h2>
        <p className="text-muted-foreground">
          Практики и сценарии, созданные специально для подростков
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск практик..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              Все
            </Button>
            {allTags.slice(0, 8).map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Ситуации</TabsTrigger>
          <TabsTrigger value="teen-practices">Для подростков</TabsTrigger>
          <TabsTrigger value="breathing">Дыхание</TabsTrigger>
          <TabsTrigger value="quick">Быстрые</TabsTrigger>
        </TabsList>

        {/* Teen Scenarios */}
        <TabsContent value="scenarios" className="mt-6">
          <div className="grid gap-4">
            {teenScenarios.map(scenario => (
              <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {scenario.title}
                  </CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Рекомендуемые практики:</h4>
                      <div className="grid gap-2">
                        {scenario.practices.map(practiceId => {
                          const practice = [...teenSpecificPractices, ...breathingPractices, ...quickPractices]
                            .find(p => p.id === practiceId)
                          if (!practice) return null
                          
                          return (
                            <Dialog key={practiceId}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="justify-start gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  {practice.title}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <PracticePlayer practiceId={practiceId} />
                              </DialogContent>
                            </Dialog>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Полезные советы:</h4>
                      <ul className="space-y-1">
                        {scenario.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Teen-Specific Practices */}
        <TabsContent value="teen-practices" className="mt-6">
          <div className="grid gap-4">
            {filteredTeenPractices.map(practice => (
              <Card key={practice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-accent" />
                        {practice.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{practice.description}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {practice.scenario}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {practice.duration}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {practice.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2">
                        <BookOpen className="w-4 h-4" />
                        Начать практику
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <PracticePlayer practiceId={practice.id} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Breathing Practices */}
        <TabsContent value="breathing" className="mt-6">
          <div className="grid gap-4">
            {filteredBreathingPractices.map(practice => (
              <Card key={practice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{practice.title}</CardTitle>
                      <CardDescription className="mt-1">{practice.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{practice.duration}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {practice.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <Clock className="w-4 h-4" />
                        Открыть практику
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <PracticePlayer practiceId={practice.id} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quick Practices */}
        <TabsContent value="quick" className="mt-6">
          <div className="grid gap-3">
            {quickPractices.map(practice => (
              <Card key={practice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{practice.instruction}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant="secondary">{practice.duration}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Попробовать
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <PracticePlayer practiceId={practice.id} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}