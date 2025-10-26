import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'button' | 'avatar'
  className?: string
}

export function SkeletonLoader({ type = 'card', className = '' }: SkeletonLoaderProps) {
  const getSkeletonConfig = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 p-6 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/5" />
            </div>
          </div>
        )
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        )
      case 'button':
        return (
          <div className={`h-10 bg-gray-200 rounded-xl animate-pulse ${className}`} />
        )
      case 'avatar':
        return (
          <div className={`w-10 h-10 bg-gray-200 rounded-full animate-pulse ${className}`} />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {getSkeletonConfig()}
    </motion.div>
  )
}

// Container for multiple skeleton cards
interface SkeletonGridProps {
  count: number
  type?: 'card' | 'text' | 'button' | 'avatar'
  className?: string
}

export function SkeletonGrid({ count, type = 'card', className = '' }: SkeletonGridProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonLoader type={type} />
        </motion.div>
      ))}
    </div>
  )
}

// Pulse animation for loading states
export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
