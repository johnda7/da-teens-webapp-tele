/**
 * React Initialization for Legacy Dependencies
 * 
 * Some UI libraries (like older versions of Radix UI) expect React 
 * to be available in the global scope. This file ensures compatibility
 * by registering React globally.
 * 
 * This replaces the @github/spark/spark import that was doing this previously.
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Register React globally for libraries that expect it
if (typeof window !== 'undefined') {
  // Make React available for Radix UI and other dependencies
  ;(window as any).React = React
  ;(window as any).ReactDOM = ReactDOM
  
  // Log for debugging (remove in production)
  console.log('[react-init] React registered globally for compatibility')
}

// Export for potential direct usage
export { React, ReactDOM }
