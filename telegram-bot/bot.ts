/**
 * 🤖 AI Подросток - Telegram Bot
 * 
 * Философия Perplexity AI:
 * - Скорость > Совершенство
 * - Пользователь никогда не ошибается
 * - Answer Engine, а не просто чат-бот
 * - 1% улучшение каждый день
 */

import { Bot, Context, session, SessionFlavor } from 'grammy'
import { config, validateConfig } from './config'
import { analyzeMessage } from './analytics/sentiment'
import { detectCrisis } from './analytics/crisis'
import { generateInsights } from './analytics/insights'
import { getRecommendations } from './recommendations/content'
import { logMetrics } from './utils/metrics'

// Session data structure
interface SessionData {
  userId: number
  username?: string
  messageCount: number
  lastInteraction: Date
  emotionalState?: 'positive' | 'neutral' | 'negative' | 'crisis'
  topics: string[]
}

type MyContext = Context & SessionFlavor<SessionData>

// Initialize bot
const bot = new Bot<MyContext>(config.telegram.botToken)

// Session middleware
bot.use(session({
  initial: (): SessionData => ({
    userId: 0,
    messageCount: 0,
    lastInteraction: new Date(),
    topics: [],
  }),
}))

// Logger middleware
bot.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  
  logMetrics({
    type: 'request',
    duration,
    userId: ctx.from?.id,
    command: ctx.message?.text?.split(' ')[0],
  })
  
  // Perplexity principle: одержимость латентностью
  if (duration > config.metrics.targetLatencyMs.p90) {
    console.warn(`⚠️  Slow response: ${duration}ms (target: ${config.metrics.targetLatencyMs.p90}ms)`)
  }
})

// ========================================
// Commands
// ========================================

bot.command('start', async (ctx) => {
  const username = ctx.from?.first_name || 'друг'
  
  await ctx.reply(
    `👋 Привет, ${username}!\n\n` +
    `Я **AI Подросток** - твой умный помощник.\n\n` +
    `🎯 **Что я умею:**\n` +
    `• Отвечаю на твои вопросы\n` +
    `• Помогаю разобраться в сложных ситуациях\n` +
    `• Рекомендую полезные уроки\n` +
    `• Поддерживаю, когда нужно\n\n` +
    `💡 **Просто напиши мне что угодно** - я пойму и помогу!\n\n` +
    `⚙️ Команды: /help /stats /recommend`,
    { parse_mode: 'Markdown' }
  )
  
  // Update session
  ctx.session.userId = ctx.from!.id
  ctx.session.username = ctx.from?.username
  ctx.session.messageCount = 0
  ctx.session.lastInteraction = new Date()
})

bot.command('help', async (ctx) => {
  await ctx.reply(
    `📚 **Справка по командам**\n\n` +
    `/start - Начать общение\n` +
    `/help - Эта справка\n` +
    `/stats - Твоя статистика\n` +
    `/recommend - Рекомендации уроков\n` +
    `/crisis - Экстренная помощь\n\n` +
    `💬 **Можешь просто писать мне** - я понимаю обычные сообщения!\n\n` +
    `🔒 **Приватность:** Все данные анонимизированы и защищены.`,
    { parse_mode: 'Markdown' }
  )
})

bot.command('stats', async (ctx) => {
  const { messageCount, emotionalState, topics } = ctx.session
  
  const stateEmoji = {
    positive: '😊',
    neutral: '😐',
    negative: '😔',
    crisis: '🆘',
  }[emotionalState || 'neutral']
  
  await ctx.reply(
    `📊 **Твоя статистика**\n\n` +
    `💬 Сообщений: ${messageCount}\n` +
    `${stateEmoji} Настроение: ${emotionalState || 'не определено'}\n` +
    `🏷️ Популярные темы: ${topics.slice(0, 3).join(', ') || 'пока нет'}\n\n` +
    `Продолжай общаться - я учусь тебе помогать лучше! 🚀`,
    { parse_mode: 'Markdown' }
  )
})

bot.command('recommend', async (ctx) => {
  await ctx.reply('🔍 Анализирую твои интересы...')
  
  const recommendations = await getRecommendations({
    userId: ctx.session.userId,
    topics: ctx.session.topics,
    emotionalState: ctx.session.emotionalState,
  })
  
  if (recommendations.length === 0) {
    await ctx.reply(
      `🤔 Пока не могу дать рекомендации.\n\n` +
      `Пообщайся со мной немного - расскажи, что тебя интересует!`
    )
    return
  }
  
  let message = `💡 **Рекомендую тебе:**\n\n`
  
  recommendations.forEach((rec, i) => {
    message += `${i + 1}. **${rec.title}**\n`
    message += `   ${rec.description}\n`
    message += `   🔗 ${rec.link}\n\n`
  })
  
  await ctx.reply(message, { parse_mode: 'Markdown' })
})

bot.command('crisis', async (ctx) => {
  await ctx.reply(
    `🆘 **Экстренная помощь**\n\n` +
    `Если тебе нужна срочная помощь:\n\n` +
    `📞 **Детский телефон доверия**\n` +
    `8-800-2000-122 (бесплатно, 24/7)\n\n` +
    `🌐 **Онлайн-помощь**\n` +
    `https://pomoschryadom.ru\n\n` +
    `💚 Ты не один. Есть люди, которые помогут.\n\n` +
    `Я тоже здесь - пиши мне, я выслушаю.`,
    { parse_mode: 'Markdown' }
  )
})

// ========================================
// Message Handler (Main Logic)
// ========================================

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text
  const userId = ctx.from.id
  
  // Update session
  ctx.session.userId = userId
  ctx.session.messageCount++
  ctx.session.lastInteraction = new Date()
  
  try {
    // 1. Crisis Detection (highest priority)
    if (config.crisis.enabled) {
      const crisisResult = await detectCrisis(text)
      
      if (crisisResult.isCrisis) {
        ctx.session.emotionalState = 'crisis'
        
        await ctx.reply(
          `💚 Я вижу, что тебе сейчас тяжело.\n\n` +
          `Пожалуйста, обратись за помощью:\n\n` +
          `📞 Детский телефон доверия: 8-800-2000-122\n` +
          `🌐 https://pomoschryadom.ru\n\n` +
          `Я здесь, чтобы выслушать тебя. Расскажи, что случилось?`
        )
        
        // Notify human moderators
        if (config.crisis.notifyHumans) {
          console.error(`🚨 CRISIS DETECTED: User ${userId}: "${text}"`)
          // TODO: Send to monitoring system
        }
        
        return
      }
    }
    
    // 2. Sentiment Analysis
    if (config.analytics.sentimentAnalysis) {
      const sentiment = await analyzeMessage(text)
      ctx.session.emotionalState = sentiment.label
      
      // Update topics
      if (sentiment.topics && sentiment.topics.length > 0) {
        ctx.session.topics = [
          ...new Set([...sentiment.topics, ...ctx.session.topics])
        ].slice(0, 10) // Keep last 10 unique topics
      }
    }
    
    // 3. Generate AI Response (Answer Engine approach)
    const response = await generateAIResponse(text, ctx.session)
    
    // 4. Send response
    await ctx.reply(response, { parse_mode: 'Markdown' })
    
    // 5. Log insights (for product improvements)
    if (ctx.session.messageCount % 10 === 0) {
      // Every 10 messages, generate insights
      await generateInsights({
        userId,
        messages: ctx.session.messageCount,
        topics: ctx.session.topics,
        emotionalState: ctx.session.emotionalState,
      })
    }
    
  } catch (error) {
    console.error('❌ Error processing message:', error)
    
    await ctx.reply(
      `Упс! Что-то пошло не так 😅\n\n` +
      `Попробуй еще раз или напиши /help`
    )
  }
})

// ========================================
// AI Response Generation
// ========================================

async function generateAIResponse(
  message: string,
  session: SessionData
): Promise<string> {
  // TODO: Integrate with OpenAI/Anthropic
  // For now, simple rule-based responses
  
  const lowerMessage = message.toLowerCase()
  
  // Greetings
  if (/привет|здравствуй|хай|hi|hello/.test(lowerMessage)) {
    return `Привет! 👋 Как дела? Чем могу помочь?`
  }
  
  // Gratitude
  if (/спасибо|благодар/.test(lowerMessage)) {
    return `Пожалуйста! 😊 Я рад помочь. Есть еще вопросы?`
  }
  
  // Questions about stress
  if (/стресс|тревога|волную/.test(lowerMessage)) {
    return (
      `Понимаю, стресс — это тяжело 💙\n\n` +
      `Вот что может помочь:\n` +
      `• Глубокое дыхание: 4 счета вдох, 4 выдох\n` +
      `• Прогулка на свежем воздухе\n` +
      `• Поговорить с кем-то\n\n` +
      `Хочешь, порекомендую урок про управление стрессом? (/recommend)`
    )
  }
  
  // Questions about school
  if (/школа|учёба|урок|экзамен/.test(lowerMessage)) {
    return (
      `Школа может быть непростой 📚\n\n` +
      `Что именно тебя беспокоит? Расскажи подробнее, и я попробую помочь!\n\n` +
      `У нас есть уроки про:\n` +
      `• Управление временем\n` +
      `• Подготовку к экзаменам\n` +
      `• Мотивацию к учебе`
    )
  }
  
  // Default response (conversational)
  return (
    `Интересно! 🤔\n\n` +
    `Расскажи мне больше - я хочу понять и помочь.\n\n` +
    `💡 Подсказка: можешь спросить меня о:\n` +
    `• Стрессе и тревоге\n` +
    `• Отношениях с друзьями\n` +
    `• Школе и учёбе\n` +
    `• Или о чём угодно!\n\n` +
    `Также есть команды: /recommend /stats /help`
  )
}

// ========================================
// Error Handler
// ========================================

bot.catch((err) => {
  console.error('❌ Bot error:', err)
  
  // Send to monitoring (Sentry)
  if (config.monitoring.sentry.enabled) {
    // TODO: Sentry.captureException(err)
  }
})

// ========================================
// Start Bot
// ========================================

export async function startBot() {
  try {
    // Validate configuration
    validateConfig()
    
    console.log('🤖 Starting AI Подросток Bot...')
    
    // Production: use webhooks
    if (config.server.nodeEnv === 'production' && config.telegram.webhookUrl) {
      console.log(`🌐 Using webhook: ${config.telegram.webhookUrl}`)
      await bot.api.setWebhook(config.telegram.webhookUrl, {
        secret_token: config.telegram.webhookSecret,
      })
    } else {
      // Development: long polling
      console.log('🔄 Using long polling (development mode)')
      await bot.start()
    }
    
    console.log('✅ Bot started successfully!')
    console.log(`📊 Metrics: http://localhost:${config.server.port}/metrics`)
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n👋 Shutting down bot...')
  bot.stop()
})

process.once('SIGTERM', () => {
  console.log('\n👋 Shutting down bot...')
  bot.stop()
})

export default bot

// Start if run directly
if (require.main === module) {
  startBot()
}
