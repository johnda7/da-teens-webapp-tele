/**
 * 🤖 AI Подросток - Telegram Bot Configuration
 * 
 * Философия: Perplexity AI - простота, скорость, прозрачность
 */

export const config = {
  // 🔐 Telegram Bot Token
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '8420062920:AAEY7GJvfHYgRcX130_ZUO8JMX3wjHa6dPU',
    botUsername: 'podrosbot',
    webhookUrl: process.env.WEBHOOK_URL,
    webhookSecret: process.env.WEBHOOK_SECRET,
  },

  // 🤖 AI Configuration
  ai: {
    provider: 'openai', // 'openai' | 'anthropic' | 'gemini'
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o', // Latest model for fast responses
      temperature: 0.7,
      maxTokens: 1000,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 1000,
    },
  },

  // 📊 Analytics Configuration
  analytics: {
    enabled: true,
    sentimentAnalysis: true,
    topicModeling: true,
    trendDetection: true,
    // Privacy settings
    anonymizeData: true,
    dataRetentionDays: 90,
    gdprCompliant: true,
  },

  // 💡 Recommendations
  recommendations: {
    enabled: true,
    frequency: 'weekly', // 'daily' | 'weekly' | 'monthly'
    minConfidence: 0.7, // Минимальная уверенность для рекомендации
    sources: ['dialogs', 'feedback', 'usage'],
  },

  // 🚨 Crisis Detection
  crisis: {
    enabled: true,
    keywords: [
      // Суицидальные мысли
      'не хочу жить', 'покончить с собой', 'суицид', 'самоубийство',
      // Депрессия
      'депрессия', 'нет смысла', 'бесполезный', 'безнадежность',
      // Насилие
      'избивают', 'насилие', 'домогательство', 'изнасилование',
      // Буллинг
      'травят', 'издеваются', 'буллинг', 'кибербуллинг',
    ],
    urgentResponseEnabled: true,
    notifyHumans: true, // Уведомить живых психологов
    emergencyContacts: [
      { name: 'Детский телефон доверия', number: '8-800-2000-122' },
      { name: 'Помощь рядом', url: 'https://pomoschryadom.ru' },
    ],
  },

  // 🔒 Security & Privacy
  security: {
    rateLimit: {
      enabled: true,
      maxRequests: 30,
      windowMs: 60000, // 30 requests per minute
    },
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm',
    },
    allowedChats: process.env.ALLOWED_CHATS?.split(',') || [], // Empty = all chats
  },

  // 📈 Metrics (от Perplexity)
  metrics: {
    // Latency targets (P90, P99)
    targetLatencyMs: {
      p50: 200,
      p90: 500,
      p99: 1000,
    },
    // Growth targets
    targets: {
      daily: {
        activeUsers: 50,
        messages: 200,
        insights: 5,
      },
      monthly: {
        activeUsers: 1000,
        messages: 10000,
        insights: 50,
      },
    },
  },

  // 🌐 Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },

  // 💾 Database
  database: {
    url: process.env.DATABASE_URL,
    redis: {
      url: process.env.REDIS_URL,
      ttl: 3600, // 1 hour cache
    },
  },

  // 🔗 Integration with main app
  mainApp: {
    apiUrl: process.env.MAIN_APP_API_URL || 'http://localhost:5002',
    apiKey: process.env.MAIN_APP_API_KEY,
    syncEnabled: true,
    syncIntervalMinutes: 15,
  },

  // 🎯 Feature Flags (быстрые эксперименты)
  features: {
    groupChats: false, // TODO: Phase 4
    voiceMessages: false, // TODO: Future
    imageAnalysis: false, // TODO: Future
    multiLanguage: false, // TODO: Phase 4
    parentalControls: false, // TODO: Phase 5
    enterpriseFeatures: false, // TODO: Phase 5
  },

  // 📝 Logging & Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      enabled: process.env.NODE_ENV === 'production',
    },
    analytics: {
      provider: 'posthog', // или 'mixpanel', 'amplitude'
      apiKey: process.env.POSTHOG_API_KEY,
    },
  },
} as const

// Type exports for TypeScript
export type Config = typeof config
export type AIProvider = 'openai' | 'anthropic' | 'gemini'
export type AnalyticsFrequency = 'daily' | 'weekly' | 'monthly'

// Validation
export function validateConfig(): void {
  if (!config.telegram.botToken) {
    throw new Error('❌ TELEGRAM_BOT_TOKEN is required')
  }
  
  if (config.ai.provider === 'openai' && !config.ai.openai.apiKey) {
    console.warn('⚠️  OPENAI_API_KEY not set, AI features disabled')
  }

  if (config.server.nodeEnv === 'production') {
    if (!config.telegram.webhookUrl) {
      throw new Error('❌ WEBHOOK_URL required in production')
    }
    if (!config.monitoring.sentry.dsn) {
      console.warn('⚠️  SENTRY_DSN not set, error tracking disabled')
    }
  }

  console.log('✅ Configuration validated')
}

// Helper: Get AI client based on provider
export function getAIConfig() {
  switch (config.ai.provider) {
    case 'openai':
      return config.ai.openai
    case 'anthropic':
      return config.ai.anthropic
    default:
      throw new Error(`Unknown AI provider: ${config.ai.provider}`)
  }
}

export default config
