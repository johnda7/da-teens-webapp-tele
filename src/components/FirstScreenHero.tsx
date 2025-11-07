/**
 * FirstScreenHero - Первый экран для новых пользователей
 * 
 * Эмоциональный hook для привлечения подростков:
 * - Вопрос: "Не можешь сказать НЕТ?"
 * - Проблема: "Друзья используют тебя, но ты боишься отказать?"
 * - Решение: "Мы научим тебя за 3 недели"
 * - Social proof: "50,000+ подростков уже используют"
 * 
 * Стиль: iOS 26 Liquid Glass + Perplexity Speed + Jobs Simplicity
 */

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, CheckCircle, Clock, User, ArrowRight } from '@phosphor-icons/react'
import ExampleCards, { type Example } from './ExampleCards'
import QuickQuiz from './QuickQuiz'
import boundariesModule from '@/data/boundariesModule'

interface FirstScreenHeroProps {
  onStartLearning: () => void
  userProgress?: {
    lessonsCompleted: number
    totalLessons: number
    xpEarned?: number
  }
  showProgress?: boolean
  userName?: string
}

export default function FirstScreenHero({
  onStartLearning,
  userProgress,
  showProgress = false,
  userName
}: FirstScreenHeroProps) {
  const lessonsCompleted = userProgress?.lessonsCompleted || 0
  const totalLessons = userProgress?.totalLessons || 9
  const progressPercentage = Math.round((lessonsCompleted / totalLessons) * 100)
  
  // Определяем состояние пользователя
  const isNewUser = lessonsCompleted === 0
  const isReturningUser = lessonsCompleted > 0 && lessonsCompleted < 7
  const isAlmostComplete = lessonsCompleted >= 7

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Liquid Glass Background - Animated Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '-20%',
            left: '-20%'
          }}
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '20%', '-20%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(90, 200, 250, 0.08) 0%, transparent 70%)',
            filter: 'blur(70px)',
            right: '-10%',
            top: '30%'
          }}
          animate={{
            x: ['10%', '-15%', '10%'],
            y: ['5%', '-10%', '5%'],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 max-w-2xl mx-auto">
        
        {/* Header - Компактный */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" weight="fill" />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-6"
        >
          
          {/* Hook - Большой текст */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Не можешь сказать НЕТ?
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
                Друзья используют тебя,<br />
                но ты боишься отказать?
              </p>
            </motion.div>
          )}

          {/* Вернувшийся пользователь - показываем прогресс */}
          {isReturningUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {userName ? `Привет, ${userName}!` : 'Продолжаем обучение'}
              </h1>
              
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Твой прогресс</span>
                  <span className="text-sm font-bold text-blue-600">
                    {lessonsCompleted}/{totalLessons} уроков
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ты на {progressPercentage}% пути к уверенности
                </p>
              </div>
            </motion.div>
          )}

          {/* Почти завершивший - фокус на финише */}
          {isAlmostComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Почти у цели! 🎯
              </h1>
              
              <p className="text-lg text-gray-700 mb-6">
                Осталось {totalLessons - lessonsCompleted} {totalLessons - lessonsCompleted === 1 ? 'урок' : 'урока'}!
              </p>
            </motion.div>
          )}

          {/* Решение */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold text-gray-800 mb-8"
          >
            {isNewUser ? (
              <>Мы научим тебя за <span className="text-blue-600">3 недели</span></>
            ) : (
              <>Продолжай укреплять свои границы</>
            )}
          </motion.p>

          {/* CTA - Большая кнопка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <Button
              onClick={onStartLearning}
              size="lg"
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isNewUser ? (
                <>
                  Начать бесплатно
                  <ArrowRight className="w-6 h-6 ml-2" weight="bold" />
                </>
              ) : (
                <>
                  Продолжить обучение
                  <ArrowRight className="w-6 h-6 ml-2" weight="bold" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Social Proof - Компактная карточка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      50,000+ подростков уже используют
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" weight="fill" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      5 минут в день
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-600" weight="fill" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      От подросткового психолога Екатерины Карпенко
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Мини-визуализация прогресса (замок) - только для новых */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center mt-8"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Замок границ</p>
                    <p className="text-xs text-gray-500">Начни строить свой замок</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ДЛИННАЯ СКРОЛЛИРУЕМАЯ СТРАНИЦА С КОНТЕНТОМ - только для новых пользователей */}
          {isNewUser && (
            <div className="mt-16 space-y-16">
              {/* СЕКЦИЯ 2: Примеры из жизни */}
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-8"
              >
                <ExampleCards
                  examples={(boundariesModule.lessons[0]?.formats.text?.content.examples || []) as Example[]}
                />
              </motion.section>

              {/* СЕКЦИЯ 3: Быстрые интерактивы - Quick Quiz */}
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-8"
              >
                <QuickQuiz
                  questions={boundariesModule.lessons[0]?.quiz?.slice(0, 3) || []}
                  onComplete={(score) => {
                    console.log('Quiz completed with score:', score)
                  }}
                />
              </motion.section>

              {/* СЕКЦИЯ 4: Реальные истории подростков */}
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-8"
              >
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Как подростки справляются
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Реальные истории от ровесников, которые уже научились защищать свои границы
                    </p>
                  </div>
                  
                  {/* История Даши из Урока 3 */}
                  {boundariesModule.lessons[2]?.formats.text?.content.practicalExample && (
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {boundariesModule.lessons[2].formats.text.content.practicalExample.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {boundariesModule.lessons[2].formats.text.content.practicalExample.story}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm font-medium text-purple-900">
                              💡 Урок: {boundariesModule.lessons[2].formats.text.content.practicalExample.lesson}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Истории из Урока 5 (Лера, Таня, Максим) */}
                  {boundariesModule.lessons[4]?.formats.text?.content.sections?.[2]?.body && (
                    <Card className="bg-white/80 backdrop-blur-xl border border-gray-200">
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <h3 className="text-lg font-bold text-gray-900">
                            Еще истории ровесников
                          </h3>
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                            {boundariesModule.lessons[4].formats.text.content.sections[2].body.split('\n\n').slice(0, 3).join('\n\n')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.section>

              {/* СЕКЦИЯ 5: Прогрессивный CTA */}
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-8"
              >
                <div className="text-center space-y-6 py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Готов начать обучение?
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                      Присоединяйся к 50,000+ подростков и научись защищать свои границы за 3 недели
                    </p>
                  </motion.div>

                  <Button
                    onClick={onStartLearning}
                    size="lg"
                    className="w-full sm:w-auto min-w-[280px] h-16 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Начать первый урок
                    <ArrowRight className="w-6 h-6 ml-2" weight="bold" />
                  </Button>

                  <p className="text-sm text-gray-500">
                    Бесплатно • 5 минут в день • Первый результат уже сегодня
                  </p>
                </div>
              </motion.section>
            </div>
          )}

          {/* Прогресс для вернувшихся пользователей */}
          {showProgress && userProgress && !isNewUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <Shield className="w-8 h-8 text-white z-10" weight="fill" />
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-white/20"
                      style={{ height: `${100 - progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Замок границ</p>
                    <p className="text-xs text-gray-500">{progressPercentage}% построен</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

