// Компонент для peer learning (обучение с ровесниками)
// Истории других подростков и возможность делиться опытом

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users, 
  Heart, 
  ChatCircle, 
  ThumbsUp,
  Star,
  Sparkle
} from '@phosphor-icons/react'
import { useState } from 'react'

export interface PeerStory {
  id: string
  authorName: string
  authorAge: number
  authorInitials: string
  avatarColor: string
  title: string
  situation: string
  solution: string
  outcome: string
  skillsUsed: string[]
  helpfulness: number // количество "помогло мне"
  category: 'family' | 'friends' | 'school' | 'digital'
  emotion: string
}

interface PeerLearningFeedProps {
  stories: PeerStory[]
  onShare?: () => void
}

const categoryLabels = {
  family: 'Семья',
  friends: 'Друзья',
  school: 'Школа',
  digital: 'Интернет'
}

const categoryEmojis = {
  family: '🏠',
  friends: '👥',
  school: '🎓',
  digital: '💻'
}

export default function PeerLearningFeed({ stories, onShare }: PeerLearningFeedProps) {
  const [expandedStory, setExpandedStory] = useState<string | null>(null)
  const [helpfulMarks, setHelpfulMarks] = useState<Set<string>>(new Set())

  const handleMarkHelpful = (storyId: string) => {
    setHelpfulMarks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" weight="fill" />
          <h3 className="text-lg font-semibold">Истории ровесников</h3>
        </div>
        {onShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            <Sparkle className="w-4 h-4 mr-2" weight="fill" />
            Поделиться своей историей
          </Button>
        )}
      </div>

      {/* Info card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="text-sm text-purple-900 font-medium mb-1">
                Ты не один(а)!
              </p>
              <p className="text-xs text-purple-700">
                Читай реальные истории других подростков о том, как они устанавливали границы.
                Их опыт может помочь тебе в похожих ситуациях.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stories */}
      <div className="space-y-3">
        {stories.map(story => {
          const isExpanded = expandedStory === story.id
          const isMarkedHelpful = helpfulMarks.has(story.id)

          return (
            <Card
              key={story.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className={`${story.avatarColor} w-10 h-10`}>
                    <AvatarFallback className="text-white font-semibold">
                      {story.authorInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Author info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {story.authorName}, {story.authorAge} лет
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {categoryEmojis[story.category]} {categoryLabels[story.category]}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mb-1">{story.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Эмоция: {story.emotion}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" weight="fill" />
                        {story.helpfulness + (isMarkedHelpful ? 1 : 0)} полезно
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Situation */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Ситуация:
                  </p>
                  <p className="text-sm leading-relaxed">
                    {story.situation}
                  </p>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {/* Solution */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        Что я сделал(а):
                      </p>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {story.solution}
                      </p>
                    </div>

                    {/* Outcome */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-900 mb-1">
                        Что получилось:
                      </p>
                      <p className="text-sm text-green-800 leading-relaxed">
                        {story.outcome}
                      </p>
                    </div>

                    {/* Skills used */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Навыки, которые помогли:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {story.skillsUsed.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-purple-100 text-purple-700"
                          >
                            <Star className="w-3 h-3 mr-1" weight="fill" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                    className="flex-1"
                  >
                    {isExpanded ? 'Скрыть' : 'Читать полностью'}
                  </Button>
                  <Button
                    variant={isMarkedHelpful ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleMarkHelpful(story.id)}
                    className={isMarkedHelpful ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" weight={isMarkedHelpful ? 'fill' : 'regular'} />
                    Помогло
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Share your story CTA */}
      {onShare && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <ChatCircle className="w-10 h-10 text-purple-600 mx-auto" weight="fill" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">
                  Твоя история может помочь другим
                </h4>
                <p className="text-sm text-purple-700 mb-3">
                  Поделись опытом установки границ. Это поможет ровесникам, которые столкнулись с похожими ситуациями.
                </p>
                <Button
                  onClick={onShare}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Sparkle className="w-4 h-4 mr-2" weight="fill" />
                  Рассказать свою историю
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Примеры историй
export const examplePeerStories: PeerStory[] = [
  {
    id: 'story-1',
    authorName: 'Аня',
    authorAge: 16,
    authorInitials: 'АК',
    avatarColor: 'bg-pink-500',
    title: 'Научилась отказывать подруге',
    situation: 'Моя лучшая подруга постоянно просила списывать домашку. Я чувствовала себя виноватой, когда отказывала.',
    solution: 'Я сказала: "Маша, ты моя лучшая подруга, но мне некомфортно давать списывать. Давай я лучше помогу тебе разобраться в теме?"',
    outcome: 'Сначала она обиделась, но потом поблагодарила. Теперь мы вместе делаем домашку, и она лучше понимает материал. Наша дружба стала честнее.',
    skillsUsed: ['Умение говорить "нет"', 'Альтернативное решение', 'Честность'],
    helpfulness: 24,
    category: 'friends',
    emotion: 'Чувство вины → Облегчение'
  },
  {
    id: 'story-2',
    authorName: 'Максим',
    authorAge: 15,
    authorInitials: 'МП',
    avatarColor: 'bg-blue-500',
    title: 'Установил границы с младшим братом',
    situation: 'Брат постоянно брал мои вещи без спроса. Я злился, но родители говорили "поделись с братом".',
    solution: 'Я поговорил с родителями спокойно: "Я не против делиться, но хочу, чтобы меня спрашивали". Мы договорились о правилах.',
    outcome: 'Брат теперь спрашивает разрешения. Я стал реже злиться. Родители оценили мою зрелость.',
    skillsUsed: ['Уверенная коммуникация', 'Компромисс', 'Работа с семьёй'],
    helpfulness: 18,
    category: 'family',
    emotion: 'Злость → Уважение'
  },
  {
    id: 'story-3',
    authorName: 'Лиза',
    authorAge: 17,
    authorInitials: 'ЛС',
    avatarColor: 'bg-purple-500',
    title: 'Защитила свою приватность в соцсетях',
    situation: 'Одноклассники обижались, что я не добавляю их во всех соцсетях. Говорили, что я "задаюсь".',
    solution: 'Я объяснила: "Это мое личное пространство. Я добавляю только близких друзей. Ничего личного".',
    outcome: 'Некоторые продолжали обижаться, но я перестала переживать. Поняла, что это нормально - иметь приватность.',
    skillsUsed: ['Цифровые границы', 'Самоуважение', 'Устойчивость к давлению'],
    helpfulness: 31,
    category: 'digital',
    emotion: 'Давление → Уверенность'
  },
  {
    id: 'story-4',
    authorName: 'Даня',
    authorAge: 16,
    authorInitials: 'ДВ',
    avatarColor: 'bg-green-500',
    title: 'Сказал "нет" травле одноклассника',
    situation: 'Друзья травили нового ученика. Просили меня присоединиться. Я не хотел, но боялся стать изгоем.',
    solution: 'Я сказал: "Ребят, мне это не нравится. Я не буду в этом участвовать". Ушёл.',
    outcome: 'Пара ребят поддержали меня. Травля прекратилась. Я почувствовал гордость за себя.',
    skillsUsed: ['Моральная позиция', 'Смелость', 'Защита других'],
    helpfulness: 42,
    category: 'school',
    emotion: 'Страх → Гордость'
  }
]
