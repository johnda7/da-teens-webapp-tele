// Telegram Mini App configuration
export const TELEGRAM_CONFIG = {
  // Safe area handling for iOS notch
  useSafeArea: true,
  
  // Haptic feedback settings
  hapticFeedback: {
    enabled: true,
    styles: {
      light: 'light',
      medium: 'medium', 
      heavy: 'heavy',
      rigid: 'rigid',
      soft: 'soft'
    } as const
  },
  
  // Fullscreen mode support (Bot API 8.0+)
  fullscreen: {
    supported: true,
    defaultMode: 'compact' as 'compact' | 'fullscreen'
  },
  
  // Bottom bar color (Bot API 7.10+)
  bottomBar: {
    enabled: true,
    useThemeColor: true
  },
  
  // Storage options
  storage: {
    // Use DeviceStorage for persistent data (Bot API 9.0+)
    useDeviceStorage: true,
    // Use SecureStorage for sensitive data
    useSecureStorage: true,
    // CloudStorage limit: 1024 items per user
    cloudStorageLimit: 1024
  }
} as const;

export type TelegramConfig = typeof TELEGRAM_CONFIG;
