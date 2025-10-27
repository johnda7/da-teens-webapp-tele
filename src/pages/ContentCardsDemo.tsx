// Demo page для Video/Practice/Homework cards
import VideoCard from '@/components/VideoCard'
import PracticeCard from '@/components/PracticeCard'
import HomeworkCard from '@/components/HomeworkCard'
import { motion } from 'framer-motion'

export default function ContentCardsDemo() {
  return (
    <div className="min-h-screen relative">
      {/* Liquid Glass Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50" />
        
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-12"
        >
          <h1 className="ios-title1 text-gray-900 mb-2">
            Контент программы
          </h1>
          <p className="ios-body text-gray-600">
            Эфиры с Екатериной Карпенко, практики и домашние задания
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Video Cards Section */}
          <section>
            <h2 className="ios-title2 text-gray-900 mb-6">Эфиры</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoCard
                title="Что такое личные границы?"
                description="Главный эфир с Екатериной Карпенко. Разбираем основы: что такое границы, зачем они нужны, и как их определить."
                duration="90 мин"
                date="14.10.2025"
                type="main"
                instructor="Екатерина Карпенко"
                isWatched={true}
                onPlay={() => console.log('Play video')}
              />
              
              <VideoCard
                title="Практика: Говорю НЕТ"
                description="Разбор домашки и ролевые игры. Учимся говорить НЕТ в безопасной обстановке."
                duration="30 мин"
                date="16.10.2025"
                type="additional"
                instructor="Екатерина Карпенко"
                isWatched={false}
                onPlay={() => console.log('Play video')}
              />
              
              <VideoCard
                title="Peer Sharing: Мои границы"
                description="Подростки делятся своими историями. Групповые упражнения и поддержка."
                duration="30 мин"
                date="18.10.2025"
                type="additional"
                instructor="Екатерина Карпенко"
                isWatched={false}
                onPlay={() => console.log('Play video')}
              />
            </div>
          </section>

          {/* Practice Cards Section */}
          <section>
            <h2 className="ios-title2 text-gray-900 mb-6">Практики</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PracticeCard
                title="Мои границы: Рефлексия"
                description="Опиши 3 ситуации где тебе было сложно сказать НЕТ. Что ты чувствовал? Почему было сложно?"
                estimatedTime={15}
                xpReward={50}
                difficulty="easy"
                type="reflection"
                isCompleted={true}
                onStart={() => console.log('Start practice')}
              />
              
              <PracticeCard
                title="Говорю НЕТ: Role-play"
                description="Интерактивная ролевая игра. Практикуй отказы в разных ситуациях: с друзьями, родителями, незнакомцами."
                estimatedTime={20}
                xpReward={75}
                difficulty="medium"
                type="roleplay"
                isCompleted={false}
                onStart={() => console.log('Start practice')}
              />
              
              <PracticeCard
                title="Осознанность: Чувствуй границы"
                description="Медитация на осознание своих границ. 10 минут спокойствия и концентрации на своих ощущениях."
                estimatedTime={10}
                xpReward={50}
                difficulty="easy"
                type="mindfulness"
                isCompleted={false}
                onStart={() => console.log('Start practice')}
              />
            </div>
          </section>

          {/* Homework Cards Section */}
          <section>
            <h2 className="ios-title2 text-gray-900 mb-6">Домашние задания</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HomeworkCard
                title="Упражнение: Моя граница"
                description="Опиши 3 ситуации где тебе было сложно сказать НЕТ. Проанализируй каждую."
                instructions={[
                  "Опиши ситуацию: кто, что, когда, где",
                  "Что ты чувствовал в этот момент?",
                  "Почему тебе было сложно сказать НЕТ?",
                  "Как бы ты поступил теперь, после эфира?"
                ]}
                deadline="18.10.2025 19:00"
                estimatedTime={30}
                xpReward={100}
                status="checked"
                feedback="Маша, отличная работа! Ты глубоко проанализировала каждую ситуацию. Особенно понравилось как ты описала свои чувства. Продолжай в том же духе! 💜"
                grade={9}
                onStart={() => console.log('Start homework')}
                onSubmit={() => console.log('Submit homework')}
                onViewFeedback={() => console.log('View feedback')}
              />
              
              <HomeworkCard
                title="Практика в жизни: Скажи НЕТ"
                description="В течение недели найди 3 ситуации где ты скажешь НЕТ. Запиши как прошло."
                instructions={[
                  "Найди безопасную ситуацию для практики",
                  "Скажи НЕТ уверенно, но мягко",
                  "Запиши: что сказал, как отреагировали, что почувствовал",
                  "Повтори 3 раза в течение недели"
                ]}
                deadline="25.10.2025 19:00"
                estimatedTime={45}
                xpReward={150}
                status="in-progress"
                onStart={() => console.log('Start homework')}
                onSubmit={() => console.log('Submit homework')}
              />
              
              <HomeworkCard
                title="Reflection: Мои достижения"
                description="Подведи итоги недели. Что получилось? Что было сложно? Что изменилось?"
                deadline="20.10.2025 23:59"
                estimatedTime={20}
                xpReward={75}
                status="not-started"
                onStart={() => console.log('Start homework')}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
