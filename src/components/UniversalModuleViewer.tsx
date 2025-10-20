/**
 * Universal Module Viewer
 * Работает со ВСЕМИ модулями (1-13) единообразно
 */

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BoundariesModule from './BoundariesModule' // используем как fallback для модуля #1
import { getModuleById } from '@/data/modulesRegistry'

type Props = {
  moduleId: number
  onBack: () => void
}

export default function UniversalModuleViewer({ moduleId, onBack }: Props) {
  // Для модуля #1 используем готовый BoundariesModule
  if (moduleId === 1) {
    return <BoundariesModule onBack={onBack} />
  }

  const moduleData = getModuleById(moduleId)

  // Если модуль не найден
  if (!moduleData) {
    return (
      <div className="p-4">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Модуль не найден</h2>
            <p className="text-muted-foreground">Модуль #{moduleId} не существует</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Если модуль в разработке (Coming Soon)
  if (moduleData.comingSoon) {
    return (
      <div className="p-4">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Card className={moduleData.color}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{moduleData.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{moduleData.title}</h2>
            <p className="text-muted-foreground mb-4">{moduleData.description}</p>
            <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
              🚧 В разработке
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Этот модуль появится в следующих обновлениях
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Показываем обзор модуля (Coming Soon для всех кроме #1)
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-20"
      >
        {/* Back Button */}
        <div className="p-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Назад к модулям
          </Button>
        </div>

        {/* Coming Soon Card */}
        <div className="p-4">
          <Card className={moduleData.color}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{moduleData.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{moduleData.title}</h2>
              <p className="text-muted-foreground mb-4">{moduleData.description}</p>
              <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                🚧 В разработке
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Этот модуль появится в следующих обновлениях
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Примерная длительность: {moduleData.estimatedDuration}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
