/**
 * FamilyLinking Component
 * Компонент для связывания родителя с детьми через Telegram
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { QrCode, Share, UserPlus, X, CheckCircle } from '@phosphor-icons/react'
import { useTelegram } from '@/hooks/useTelegram'
import { useParentAccess } from '@/hooks/useParentAccess'

interface FamilyLinkingProps {
  mode: 'parent' | 'teen'
}

export function FamilyLinking({ mode }: FamilyLinkingProps) {
  const { user } = useTelegram()
  const { linkChild, unlinkChild, childrenProgress } = useParentAccess()
  const [showAddChild, setShowAddChild] = useState(false)
  const [childId, setChildId] = useState('')
  const [childName, setChildName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Generate share link for teen to share with parent
  const generateShareLink = () => {
    const userId = user?.id || 'unknown'
    const userName = user?.first_name || 'Teen'
    const shareText = `Привет! Я ${userName}. Мой Telegram ID: ${userId}\n\nДобавь меня в свой родительский аккаунт DA Teens!`
    
    // Use Telegram Share API
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareText)}`)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
      toast.success('Скопировано в буфер обмена!')
    }
  }

  // Add child by Telegram ID
  const handleAddChild = async () => {
    if (!childId || !childName) {
      toast.error('Заполните все поля')
      return
    }

    setIsLoading(true)
    try {
      const result = await linkChild(childId, childName)
      
      if (result.success) {
        toast.success(`${childName} добавлен!`)
        setShowAddChild(false)
        setChildId('')
        setChildName('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Ошибка при добавлении ребенка')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove child
  const handleRemoveChild = async (id: string, name: string) => {
    if (!confirm(`Удалить ${name} из списка детей?`)) return

    try {
      const result = await unlinkChild(id)
      if (result.success) {
        toast.success(`${name} удален`)
      }
    } catch (error) {
      toast.error('Ошибка при удалении')
    }
  }

  // Teen mode: Share ID with parent
  if (mode === 'teen') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Связь с родителями</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Родители могут отслеживать твой прогресс. Поделись своим ID:
          </p>

          {/* My Telegram ID */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Мой Telegram ID:</div>
            <div className="text-2xl font-bold text-blue-600">{user?.id || 'Не определен'}</div>
          </div>

          {/* Share Button */}
          <Button
            onClick={generateShareLink}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Share className="w-4 h-4 mr-2" weight="fill" />
            Поделиться с родителем
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Родитель получит твой ID и сможет добавить тебя в свой аккаунт
          </div>
        </CardContent>
      </Card>
    )
  }

  // Parent mode: Add children
  return (
    <div className="space-y-4">
      {/* My Children */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Мои дети</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddChild(!showAddChild)}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {childrenProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Нет подключенных детей</p>
              <p className="text-xs mt-1">Нажмите "Добавить" чтобы связать аккаунт ребенка</p>
            </div>
          ) : (
            <div className="space-y-3">
              {childrenProgress.map((child) => (
                <motion.div
                  key={child.childId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{child.childName}</div>
                      <div className="text-xs text-gray-500">ID: {child.childId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                      Связан
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveChild(child.childId, child.childName)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Child Form */}
      {showAddChild && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Добавить ребенка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя ребенка</label>
                <Input
                  placeholder="Алекс"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telegram ID ребенка</label>
                <Input
                  placeholder="123456789"
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  type="number"
                />
                <p className="text-xs text-gray-500">
                  Ребенок может поделиться своим ID через кнопку "Поделиться с родителем" в своем приложении
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddChild}
                  disabled={isLoading || !childId || !childName}
                  className="flex-1"
                >
                  {isLoading ? 'Добавление...' : 'Добавить'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddChild(false)}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-2">📱 Как добавить ребенка:</h4>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Ребенок открывает свое приложение DA Teens</li>
            <li>Находит раздел "Связь с родителями"</li>
            <li>Нажимает кнопку "Поделиться с родителем"</li>
            <li>Отправляет вам сообщение с Telegram ID</li>
            <li>Вы вводите ID и имя ребенка здесь</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
