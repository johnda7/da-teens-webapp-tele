/**
 * App Provider
 * 
 * FSD Layer: App
 * Глобальный провайдер приложения с Telegram SDK и другими контекстами
 */

import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Toaster as HotToaster } from 'react-hot-toast'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <>
      {children}
      <Toaster />
      <HotToaster position="top-center" />
    </>
  )
}
