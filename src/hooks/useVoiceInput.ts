/**
 * useVoiceInput - Voice Input Hook
 * Голосовой ввод с использованием Web Speech API
 */

import { useState, useEffect, useCallback } from 'react'
import { useTelegram } from './useTelegram'

interface UseVoiceInputOptions {
  /** Язык распознавания (по умолчанию ru-RU) */
  lang?: string
  /** Continuous mode (не останавливаться автоматически) */
  continuous?: boolean
  /** Interim results (промежуточные результаты) */
  interimResults?: boolean
  /** Колбэк при получении результата */
  onResult?: (transcript: string) => void
  /** Колбэк при ошибке */
  onError?: (error: string) => void
}

/**
 * Хук для голосового ввода
 * 
 * @example
 * const {
 *   isListening,
 *   transcript,
 *   isSupported,
 *   startListening,
 *   stopListening,
 *   resetTranscript
 * } = useVoiceInput({
 *   lang: 'ru-RU',
 *   onResult: (text) => setNote(text)
 * })
 */
export function useVoiceInput({
  lang = 'ru-RU',
  continuous = false,
  interimResults = true,
  onResult,
  onError
}: UseVoiceInputOptions = {}) {
  const { haptic } = useTelegram()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recognition, setRecognition] = useState<any>(null)

  // Проверка поддержки Web Speech API
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  // Инициализация Speech Recognition
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition

    const recognitionInstance = new SpeechRecognition()
    recognitionInstance.lang = lang
    recognitionInstance.continuous = continuous
    recognitionInstance.interimResults = interimResults

    recognitionInstance.onstart = () => {
      setIsListening(true)
      haptic.medium()
    }

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' '
        } else {
          interimTranscript += transcriptPart
        }
      }

      if (finalTranscript) {
        setTranscript(prev => (prev + finalTranscript).trim())
        if (onResult) {
          onResult((transcript + finalTranscript).trim())
        }
        haptic.light()
      }

      setInterimTranscript(interimTranscript)
    }

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      const errorMessage = getErrorMessage(event.error)
      if (onError) {
        onError(errorMessage)
      }
      haptic.error()
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    setRecognition(recognitionInstance)

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop()
      }
    }
  }, [lang, continuous, interimResults, isSupported, haptic, onError, onResult, transcript])

  const startListening = useCallback(() => {
    if (!recognition || isListening) return

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (!recognition || !isListening) return

    try {
      recognition.stop()
      haptic.light()
    } catch (error) {
      console.error('Failed to stop recognition:', error)
    }
  }, [recognition, isListening, haptic])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    /** Идет ли прослушивание */
    isListening,
    /** Финальный транскрипт */
    transcript,
    /** Промежуточный транскрипт (realtime) */
    interimTranscript,
    /** Поддерживается ли браузером */
    isSupported,
    /** Начать запись */
    startListening,
    /** Остановить запись */
    stopListening,
    /** Очистить транскрипт */
    resetTranscript
  }
}

function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'no-speech': 'Речь не обнаружена',
    'audio-capture': 'Микрофон не доступен',
    'not-allowed': 'Доступ к микрофону запрещен',
    'network': 'Ошибка сети',
    'aborted': 'Запись прервана'
  }

  return messages[error] || 'Ошибка распознавания речи'
}
