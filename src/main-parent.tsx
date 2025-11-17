import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary"
import './lib/react-init' // Инициализация React для совместимости с Radix UI

import { ParentApp } from './app/ParentApp'
import { ErrorFallback } from './ErrorFallback'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ParentApp />
  </ErrorBoundary>
)
