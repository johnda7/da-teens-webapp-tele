import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image, Play, Headphones, Brain, MapPin } from '@phosphor-icons/react'

interface LessonImage {
  id: string
  src: string
  alt: string
  type: 'hero' | 'concept' | 'example' | 'exercise'
  caption?: string
}

interface LessonImagesProps {
  lessonId: string
  images: LessonImage[]
  onImageClick?: (image: LessonImage) => void
}

const imageTypes = {
  hero: { icon: Image, label: 'Главное изображение', color: 'bg-blue-500' },
  concept: { icon: Brain, label: 'Концепция', color: 'bg-purple-500' },
  example: { icon: Play, label: 'Пример', color: 'bg-green-500' },
  exercise: { icon: Headphones, label: 'Упражнение', color: 'bg-orange-500' }
}

export default function LessonImages({ lessonId, images, onImageClick }: LessonImagesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Визуальные материалы</h3>
        <Badge variant="secondary" className="text-xs">
          {images.length} изображений
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => {
          const typeConfig = imageTypes[image.type]
          const Icon = typeConfig.icon

          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onImageClick?.(image)}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm">
                <CardContent className="p-0">
                  {/* Placeholder для изображения */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 font-medium">{image.alt}</p>
                      <p className="text-xs text-gray-400 mt-1">{image.src}</p>
                    </div>
                    
                    {/* Overlay с типом */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${typeConfig.color} text-white text-xs`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                    </div>

                    {/* Hover эффект */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="p-3 bg-white/50">
                      <p className="text-sm text-gray-700">{image.caption}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Информация о Google Learn Your Way стиле */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
      >
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Image className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Визуальное обучение как в Google Learn Your Way
            </h4>
            <p className="text-sm text-blue-700">
              Каждое изображение подобрано специально для лучшего понимания концепций. 
              Используем принципы визуального обучения для максимального эффекта.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
