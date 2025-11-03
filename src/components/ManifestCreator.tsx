import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Sparkle, Heart, Shield, Target, ArrowRight } from '@phosphor-icons/react'

interface ManifestCreatorProps {
  onComplete?: (data: any) => void
}

export default function ManifestCreator({ onComplete }: ManifestCreatorProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [manifest, setManifest] = useState({
    values: '',
    rights: '',
    boundaries: '',
    mantra: '',
    support: ''
  })

  const sections = [
    {
      title: 'Мои ценности',
      description: 'Что для тебя самое важное?',
      icon: <Heart size={20} className="text-pink-600" weight="duotone" />,
      placeholder: 'Например: Честность, уважение, самоуважение, семья...',
      key: 'values' as keyof typeof manifest
    },
    {
      title: 'Мои права',
      description: 'Напомни себе о своих правах',
      icon: <Shield size={20} className="text-blue-600" weight="duotone" />,
      placeholder: 'Например:\n• Я имею право чувствовать то, что чувствую\n• Я имею право сказать "нет"\n• Я имею право на отдых...',
      key: 'rights' as keyof typeof manifest
    },
    {
      title: 'Мои границы',
      description: '5-7 главных границ, которые ты защищаешь',
      icon: <Target size={20} className="text-purple-600" weight="duotone" />,
      placeholder: 'Например:\n• Мое тело — только мое решение\n• Моё время — я не обязан объяснять\n• Мой телефон — моя приватность...',
      key: 'boundaries' as keyof typeof manifest
    },
    {
      title: 'Моя мантра',
      description: 'Одна фраза, которая тебя поддерживает',
      icon: <Sparkle size={20} className="text-yellow-600" weight="duotone" />,
      placeholder: 'Например: "Я имею право заботиться о себе" или "Границы — это не эгоизм, это самоуважение"',
      key: 'mantra' as keyof typeof manifest
    },
    {
      title: 'Мой план поддержки',
      description: 'К кому обращусь, что делаю ежедневно',
      icon: <CheckCircle size={20} className="text-green-600" weight="duotone" />,
      placeholder: 'Например:\n• К маме, если нужна поддержка\n• Утренняя практика самоуважения\n• Перечитываю мантру перед сложными разговорами...',
      key: 'support' as keyof typeof manifest
    }
  ]

  const currentSectionData = sections[currentSection]

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    } else {
      onComplete?.(manifest)
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }

  const allSectionsComplete = sections.every(section =>
    manifest[section.key].trim().length > 0
  )

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-3">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              idx <= currentSection
                ? 'bg-indigo-600'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Current Section */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Card className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-center gap-3 mb-3">
            {currentSectionData.icon}
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{currentSectionData.title}</h3>
              <p className="text-xs text-gray-600">{currentSectionData.description}</p>
            </div>
          </div>

          <Textarea
            value={manifest[currentSectionData.key]}
            onChange={e => setManifest(prev => ({
              ...prev,
              [currentSectionData.key]: e.target.value
            }))}
            placeholder={currentSectionData.placeholder}
            className="min-h-[120px] text-xs resize-none"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Раздел {currentSection + 1} из {sections.length}</span>
            {manifest[currentSectionData.key].length > 0 && (
              <span className="text-green-600 font-semibold">✓ Заполнено</span>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentSection === 0}
          className="flex-1 text-xs py-1.5 h-auto"
        >
          ← Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={!manifest[currentSectionData.key].trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md py-1.5 h-auto"
        >
          {currentSection < sections.length - 1 ? 'Далее →' : 'Завершить'}
        </Button>
      </div>

      {/* Completion */}
      {currentSection === sections.length - 1 && allSectionsComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto mb-2 text-green-600" weight="duotone" />
              <h3 className="text-lg font-bold mb-2">Манифест создан! 🎉</h3>
              <p className="text-sm text-gray-700 mb-3">
                Этот манифест — твой компас в сложных ситуациях
              </p>
              <div className="text-xs text-gray-600 mb-3">
                💡 Сохрани его в заметки и перечитывай раз в неделю
              </div>
              <Button
                onClick={() => onComplete?.(manifest)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
              >
                Сохранить манифест
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}






