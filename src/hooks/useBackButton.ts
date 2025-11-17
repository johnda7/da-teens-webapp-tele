/**
 * useBackButton - Telegram BackButton Hook
 * Управляет кнопкой "Назад" в Telegram Mini App для навигации
 */

import { useEffect } from 'react'
import { useTelegram } from './useTelegram'

interface UseBackButtonOptions {
  /** Колбэк при нажатии на кнопку назад */
  onBack?: () => void
  /** Показывать ли кнопку (по умолчанию true) */
  show?: boolean
}

/**
 * Хук для работы с Telegram BackButton
 * Автоматически показывает/скрывает кнопку и обрабатывает клики
 * 
 * @example
 * // В модуле для возврата на дашборд
 * useBackButton({
 *   onBack: () => setSelectedModule(null),
 *   show: true
 * })
 * 
 * @example
 * // Автоматический контроль видимости
 * useBackButton({
 *   onBack: handleGoBack,
 *   show: isModuleOpen
 * })
 */
export function useBackButton({ onBack, show = true }: UseBackButtonOptions = {}) {
  const { webApp } = useTelegram()

  useEffect(() => {
    if (!webApp?.BackButton) return

    const backButton = webApp.BackButton

    if (show && onBack) {
      // Показываем кнопку
      backButton.show()

      // Регистрируем обработчик
      backButton.onClick(onBack)

      // Cleanup: скрываем кнопку и удаляем обработчик
      return () => {
        backButton.offClick(onBack)
        backButton.hide()
      }
    } else {
      // Скрываем кнопку если show = false
      backButton.hide()
    }
  }, [webApp, show, onBack])

  return {
    /** Показать кнопку вручную */
    show: () => webApp?.BackButton?.show(),
    /** Скрыть кнопку вручную */
    hide: () => webApp?.BackButton?.hide(),
    /** Доступна ли кнопка */
    isAvailable: !!webApp?.BackButton
  }
}
