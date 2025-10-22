import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkle, Medal } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Badge as BadgeType } from '@/lib/gamification'

interface BadgeUnlockModalProps {
  badge: BadgeType | null
  onClose: () => void
}

export default function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  if (!badge) return null

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  }

  const rarityLabels = {
    common: 'Обычное',
    rare: 'Редкое',
    epic: 'Эпическое',
    legendary: 'Легендарное'
  }

  const rarityBadgeColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-200',
    rare: 'bg-blue-100 text-blue-700 border-blue-200',
    epic: 'bg-purple-100 text-purple-700 border-purple-200',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-[40px] border-0 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Animated gradient background */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-10`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.cos((i / 8) * Math.PI * 2) * 40)}%`,
                  y: `${50 + (Math.sin((i / 8) * Math.PI * 2) * 40)}%`,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Sparkle size={8} className={`text-${badge.rarity === 'legendary' ? 'yellow' : 'purple'}-400`} weight="fill" />
              </motion.div>
            ))}

            <CardContent className="relative p-8 text-center space-y-6">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 p-0 rounded-full"
              >
                <X size={20} />
              </Button>

              {/* Achievement header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Medal size={20} className="text-yellow-600" weight="fill" />
                  <span className="ios-caption1 text-gray-600 uppercase tracking-wider">
                    Достижение разблокировано!
                  </span>
                </div>
                <Badge className={`${rarityBadgeColors[badge.rarity]} ios-caption1`}>
                  {rarityLabels[badge.rarity]}
                </Badge>
              </motion.div>

              {/* Badge icon with pulsing animation */}
              <motion.div
                className="mx-auto"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                <motion.div
                  className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center shadow-2xl border-4 border-white`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.3
                  }}
                >
                  <span className="text-7xl">{badge.icon}</span>
                </motion.div>
              </motion.div>

              {/* Badge details */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h2 className="ios-title2 font-bold text-gray-900">
                  {badge.name}
                </h2>
                <p className="ios-body text-gray-600">
                  {badge.description}
                </p>
              </motion.div>

              {/* Emotional message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-purple-50/80 backdrop-blur-[20px] rounded-2xl p-4 border border-purple-100"
              >
                <p className="ios-caption1 text-purple-900 italic">
                  💜 {badge.emotionalMessage}
                </p>
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  size="lg"
                  className={`w-full h-12 bg-gradient-to-r ${rarityColors[badge.rarity]} text-white hover:opacity-90 ios-body shadow-lg`}
                >
                  Продолжить
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
