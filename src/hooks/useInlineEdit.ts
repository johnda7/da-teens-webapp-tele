/**
 * useInlineEdit - Inline Editing Hook
 * Inline редактирование текста с сохранением
 */

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useTelegram } from './useTelegram'

interface UseInlineEditOptions {
  /** Начальное значение */
  initialValue: string
  /** Колбэк при сохранении */
  onSave: (value: string) => void | Promise<void>
  /** Колбэк при отмене */
  onCancel?: () => void
  /** Валидация значения */
  validate?: (value: string) => boolean
  /** Сообщение об ошибке */
  errorMessage?: string
}

/**
 * Хук для inline редактирования
 * 
 * @example
 * const {
 *   isEditing,
 *   value,
 *   inputRef,
 *   startEditing,
 *   handleChange,
 *   handleBlur,
 *   handleKeyDown
 * } = useInlineEdit({
 *   initialValue: userName,
 *   onSave: async (newName) => await updateUser(newName)
 * })
 */
export function useInlineEdit({
  initialValue,
  onSave,
  onCancel,
  validate,
  errorMessage = 'Недопустимое значение'
}: UseInlineEditOptions) {
  const { haptic } = useTelegram()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Фокус на input при начале редактирования
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    haptic.light()
    setIsEditing(true)
    setError(null)
  }

  const handleChange = (newValue: string) => {
    setValue(newValue)
    setError(null)
  }

  const save = async () => {
    // Валидация
    if (validate && !validate(value)) {
      setError(errorMessage)
      haptic.error()
      return
    }

    // Если значение не изменилось
    if (value === initialValue) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    
    try {
      await onSave(value)
      haptic.success()
      setIsEditing(false)
    } catch (error) {
      console.error('Save error:', error)
      setError('Ошибка сохранения')
      haptic.error()
    } finally {
      setIsSaving(false)
    }
  }

  const cancel = () => {
    setValue(initialValue)
    setError(null)
    setIsEditing(false)
    
    if (onCancel) {
      onCancel()
    }
    
    haptic.light()
  }

  const handleBlur = () => {
    if (!error && value.trim()) {
      save()
    } else {
      cancel()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      save()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  return {
    /** Режим редактирования */
    isEditing,
    /** Текущее значение */
    value,
    /** Ошибка валидации */
    error,
    /** Идет ли сохранение */
    isSaving,
    /** Ref для input элемента */
    inputRef,
    /** Начать редактирование */
    startEditing,
    /** Обработчик изменения */
    handleChange,
    /** Обработчик потери фокуса */
    handleBlur,
    /** Обработчик клавиш */
    handleKeyDown,
    /** Сохранить вручную */
    save,
    /** Отменить вручную */
    cancel
  }
}
