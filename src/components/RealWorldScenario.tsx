// Компонент сценариев из реальной жизни
// Интерактивные истории с выбором действий

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  ChatCircleDots, 
  Path, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  ArrowRight
} from '@phosphor-icons/react'

interface ScenarioChoice {
  id: string
  text: string
  isHealthy: boolean
  feedback: string
  consequence: string
  skillsUsed?: string[]
}

interface Scenario {
  id: string
  title: string
  context: string
  situation: string
  character: string
  emotionalState: string
  choices: ScenarioChoice[]
}

interface RealWorldScenarioProps {
  scenario: Scenario
  onComplete: (choice: ScenarioChoice) => void
}

export default function RealWorldScenario({
  scenario,
  onComplete
}: RealWorldScenarioProps) {
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleChoiceSelect = (choice: ScenarioChoice) => {
    setSelectedChoice(choice)
    setShowFeedback(true)
  }

  const handleContinue = () => {
    if (selectedChoice) {
      onComplete(selectedChoice)
    }
  }

  return (
    <div className="space-y-4">
      {/* Scenario Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-start gap-3 mb-2">
            <Users className="w-6 h-6 text-indigo-600 flex-shrink-0" weight="fill" />
            <div>
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
              <CardDescription className="mt-1">{scenario.context}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {scenario.character}
            </Badge>
            <Badge variant="outline" className="text-xs bg-pink-50 border-pink-200 text-pink-700">
              {scenario.emotionalState}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Situation */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <ChatCircleDots className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-sm text-blue-900 leading-relaxed">
                {scenario.situation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Choices */}
      {!showFeedback ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Path className="w-5 h-5 text-purple-600" weight="fill" />
            <p className="font-semibold text-foreground">Что бы ты сделал(а)?</p>
          </div>
          
          {scenario.choices.map((choice, index) => (
            <Button
              key={choice.id}
              variant="outline"
              className="w-full h-auto py-4 px-4 text-left justify-start hover:border-purple-400 hover:bg-purple-50 transition-all"
              onClick={() => handleChoiceSelect(choice)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed">{choice.text}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : selectedChoice && (
        <>
          {/* Feedback */}
          <Alert className={
            selectedChoice.isHealthy
              ? 'bg-green-50 border-green-200'
              : 'bg-orange-50 border-orange-200'
          }>
            <div className="flex items-start gap-3">
              {selectedChoice.isHealthy ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" weight="fill" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  selectedChoice.isHealthy ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {selectedChoice.isHealthy ? 'Отличный выбор! 🎉' : 'Можно было лучше 💭'}
                </h4>
                <AlertDescription className={
                  selectedChoice.isHealthy ? 'text-green-800' : 'text-orange-800'
                }>
                  <p className="mb-3">{selectedChoice.feedback}</p>
                  <p className="text-sm font-medium mb-2">Что произойдёт дальше:</p>
                  <p className="text-sm">{selectedChoice.consequence}</p>
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {/* Skills used */}
          {selectedChoice.skillsUsed && selectedChoice.skillsUsed.length > 0 && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <p className="font-semibold text-purple-900 mb-2">
                      {selectedChoice.isHealthy ? 'Навыки, которые ты использовал(а):' : 'Навыки, которые стоило использовать:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedChoice.skillsUsed.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Продолжить <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}
    </div>
  )
}

// Пример использования:
export const exampleScenarios: Scenario[] = [
  {
    id: 'friend-boundary-1',
    title: 'Звонок в 2 часа ночи',
    context: 'Твой друг часто звонит поздно ночью',
    situation: 'Уже 2 часа ночи. Твой телефон звонит - это твой друг в третий раз за эту неделю. Он хочет поговорить о своих проблемах. Завтра у тебя важная контрольная.',
    character: 'Друг, 16 лет',
    emotionalState: 'Усталость, раздражение',
    choices: [
      {
        id: 'choice-1',
        text: 'Ответить на звонок и выслушать друга, несмотря на усталость',
        isHealthy: false,
        feedback: 'Твоя забота о друге понятна, но игнорирование своих потребностей может привести к выгоранию.',
        consequence: 'Ты плохо спишь, на контрольной не можешь сосредоточиться. Друг продолжает звонить поздно, потому что ты не установил границу.',
        skillsUsed: ['Эмпатия (но без баланса)']
      },
      {
        id: 'choice-2',
        text: 'Отправить сообщение: "Я хочу тебе помочь, но сейчас мне нужно спать. Давай поговорим завтра после школы?"',
        isHealthy: true,
        feedback: 'Отличный баланс заботы о себе и друге! Ты предлагаешь поддержку, но в удобное для обоих время.',
        consequence: 'Ты хорошо спишь и успешно пишешь контрольную. Друг понимает твою границу и начинает звонить в разумное время. Ваша дружба становится более здоровой.',
        skillsUsed: ['Установка границ', 'Уверенная коммуникация', 'Самозабота', 'Эмпатия']
      },
      {
        id: 'choice-3',
        text: 'Проигнорировать звонок и выключить телефон',
        isHealthy: false,
        feedback: 'Забота о себе важна, но полное игнорирование друга может повредить отношениям.',
        consequence: 'Ты спишь хорошо, но друг обижен и отдаляется. Возникает недопонимание.',
        skillsUsed: ['Самозабота (но без коммуникации)']
      },
      {
        id: 'choice-4',
        text: 'Ответить коротко: "Не могу сейчас", и сразу бросить трубку',
        isHealthy: false,
        feedback: 'Ты пытаешься установить границу, но резкий тон может обидеть друга.',
        consequence: 'Друг чувствует себя отвергнутым. Граница установлена, но отношения напряжены.',
        skillsUsed: ['Попытка установить границу (но без деликатности)']
      }
    ]
  },
  {
    id: 'family-boundary-1',
    title: 'Родители читают переписку',
    context: 'Родители хотят контролировать твою личную жизнь',
    situation: 'Ты оставил телефон на столе. Возвращаешься и видишь, что мама читает твою переписку с друзьями. Она говорит: "Я переживаю за тебя, поэтому должна знать, о чём ты говоришь".',
    character: 'Мама, 42 года',
    emotionalState: 'Злость, обида, нарушение приватности',
    choices: [
      {
        id: 'choice-1',
        text: 'Закричать: "Это моя личная жизнь! У тебя нет права!" и уйти, хлопнув дверью',
        isHealthy: false,
        feedback: 'Твои чувства понятны, но агрессия усугубит конфликт и не поможет установить границу.',
        consequence: 'Родители обижены и злы. Контроль усиливается. Доверие подорвано.',
        skillsUsed: ['Выражение эмоций (но неконструктивно)']
      },
      {
        id: 'choice-2',
        text: 'Спокойно сказать: "Мама, я понимаю, что ты беспокоишься. Но чтение моих сообщений без разрешения нарушает мои границы. Давай поговорим о том, как ты можешь быть уверена в моей безопасности, не нарушая мою приватность?"',
        isHealthy: true,
        feedback: 'Отличная стратегия! Ты признаёшь чувства мамы, но четко обозначаешь свои границы и предлагаешь конструктивное решение.',
        consequence: 'Мама удивлена твоей зрелостью. Вы договариваетесь о компромиссе: ты сам(а) рассказываешь о важном, а она не проверяет телефон. Доверие растёт.',
        skillsUsed: ['Установка границ', 'Уверенная коммуникация', 'Эмпатия', 'Компромисс', 'Зрелость']
      },
      {
        id: 'choice-3',
        text: 'Промолчать и поставить пароль на телефон',
        isHealthy: false,
        feedback: 'Пассивная граница без коммуникации может усилить недоверие.',
        consequence: 'Мама чувствует себя отвергнутой. Конфликт не решён, просто скрыт. Напряжение растёт.',
        skillsUsed: ['Попытка защиты приватности (но без диалога)']
      },
      {
        id: 'choice-4',
        text: 'Сказать: "Ладно, мам, проверяй. Мне всё равно"',
        isHealthy: false,
        feedback: 'Отказ от своих границ приведёт к обиде и потере уважения к себе.',
        consequence: 'Ты теряешь приватность. Чувствуешь обиду и отдаление от мамы. Границы полностью стёрты.',
        skillsUsed: ['Избегание конфликта (в ущерб себе)']
      }
    ]
  }
]
