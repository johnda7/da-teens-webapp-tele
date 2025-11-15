import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import './lib/react-init' // Инициализация React для совместимости с Radix UI

import App from './app/App'
import { ErrorFallback } from './ErrorFallback.tsx'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
