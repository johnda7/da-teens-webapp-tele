/**
 * ExampleCards - Компонент для отображения примеров здоровых и нарушенных границ
 * Используется на первом экране для демонстрации контента модуля
 */

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle } from '@phosphor-icons/react'

export interface Example {
  title: string
  text: string
}

interface ExampleCardsProps {
  examples: Example[]
  onExampleClick?: (example: Example) => void
}

export default function ExampleCards({ examples, onExampleClick }: ExampleCardsProps) {
  const isHealthy = (title: string) => title.includes('✅')

  return (
    <div className="space-y-4">
      {/* Заголовок секции */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Посмотри, как это работает
        </h2>
        <p className="text-gray-600 mb-6">
          Примеры здоровых и нарушенных границ из реальной жизни
        </p>
      </motion.div>

      {/* Карточки примеров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {examples.map((example, index) => {
          const healthy = isHealthy(example.title)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onExampleClick?.(example)}
              className="cursor-pointer"
            >
              <Card
                className={`
                  h-full transition-all duration-300 hover:shadow-lg
                  ${healthy 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300'
                  }
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${healthy ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      {healthy ? (
                        <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" weight="fill" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-semibold text-sm mb-2
                        ${healthy ? 'text-green-800' : 'text-red-800'}
                      `}>
                        {example.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {example.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}




