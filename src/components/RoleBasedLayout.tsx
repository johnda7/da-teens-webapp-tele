/**
 * RoleBasedLayout Component
 * 
 * Переключает между опытом подростка и родителя
 * Философия Jobs: Минимализм - один аккаунт, два опыта
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users } from '@phosphor-icons/react'

interface UserProfile {
  role?: 'teen' | 'parent'
  children?: string[]
}

interface RoleBasedLayoutProps {
  userProfile: UserProfile | undefined
  teenDashboard: React.ReactNode
  parentDashboard?: React.ReactNode
  onRoleChange?: (role: 'teen' | 'parent') => void
}

export default function RoleBasedLayout({
  userProfile,
  teenDashboard,
  parentDashboard,
  onRoleChange
}: RoleBasedLayoutProps) {
  const currentRole = userProfile?.role || 'teen'
  const hasChildren = userProfile?.children && userProfile.children.length > 0

  // Если user - родитель И у него есть дети, показываем переключатель
  const showRoleSwitcher = currentRole === 'parent' && hasChildren

  const [selectedRole, setSelectedRole] = useState<'teen' | 'parent'>(currentRole)

  const handleRoleToggle = () => {
    const newRole = selectedRole === 'teen' ? 'parent' : 'teen'
    setSelectedRole(newRole)
    onRoleChange?.(newRole)
  }

  // Если подросток - сразу показываем его dashboard
  if (currentRole === 'teen') {
    return <>{teenDashboard}</>
  }

  // Если родитель без детей - показываем placeholder для его уроков
  if (currentRole === 'parent' && !hasChildren) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" weight="fill" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Привет, родитель!
          </h2>
          <p className="text-gray-600 mb-6">
            Подключи профиль ребёнка, чтобы отслеживать его прогресс
          </p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Подключить ребёнка
          </button>
        </div>

        {parentDashboard && (
          <div className="mt-8">
            {parentDashboard}
          </div>
        )}
      </div>
    )
  }

  // Если родитель с детьми - показываем переключатель
  return (
    <div>
      {/* Role Switcher - Jobs minimalism */}
      {showRoleSwitcher && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4"
        >
          <div className="bg-white rounded-xl p-1 border border-gray-200 inline-flex">
            <button
              onClick={() => setSelectedRole('teen')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${selectedRole === 'teen'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Users className="w-5 h-5" weight={selectedRole === 'teen' ? 'fill' : 'regular'} />
              Прогресс ребёнка
            </button>
            <button
              onClick={() => setSelectedRole('parent')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${selectedRole === 'parent'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <User className="w-5 h-5" weight={selectedRole === 'parent' ? 'fill' : 'regular'} />
              Моё обучение
            </button>
          </div>
        </motion.div>
      )}

      {/* Content based on selected role */}
      <AnimatePresence mode="wait">
        {selectedRole === 'teen' ? (
          <motion.div
            key="teen"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {teenDashboard}
          </motion.div>
        ) : (
          <motion.div
            key="parent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {parentDashboard || (
              <div className="p-4 text-center text-gray-500">
                Мои уроки родителя (скоро)
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

