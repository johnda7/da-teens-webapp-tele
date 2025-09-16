import { Module, ModuleWeek } from '@/lib/types'

// Seed data for all 12 modules in DA Teens program
export const modulesData: Array<Module & { weeks: ModuleWeek[] }> = [
  {
    id: 'module-1',
    slug: 'confidence-self-discovery',
    title: 'Confidence & Self-Discovery',
    description: 'Explore your strengths, build inner confidence, and develop a positive self-image',
    orderIndex: 1,
    totalWeeks: 3,
    isActive: true,
    locale: 'en',
    createdAt: new Date('2024-01-01'),
    weeks: [
      {
        id: 'week-1-1',
        moduleId: 'module-1',
        weekNumber: 1,
        title: 'Discovering Your Strengths',
        description: 'Learn to identify and appreciate your unique qualities and talents',
        videoUrl: '/content/videos/confidence-week1.mp4',
        videoDuration: '6 min',
        practices: [
          {
            title: 'Strengths Wheel Exercise',
            duration: '10 min',
            type: 'reflection',
            steps: [
              'Draw a circle and divide it into 8 sections',
              'In each section, write one of your strengths',
              'Think of a time when you used each strength successfully',
              'Share one strength story with your group this week'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'What strength surprised you the most when you wrote it down?',
          'How did it feel to focus on your positive qualities?',
          'Which strength would you like to develop further?'
        ],
        isActive: true
      },
      {
        id: 'week-1-2',
        moduleId: 'module-1',
        weekNumber: 2,
        title: 'Building Inner Confidence',
        description: 'Develop tools to boost self-confidence and overcome self-doubt',
        videoUrl: '/content/videos/confidence-week2.mp4',
        videoDuration: '7 min',
        practices: [
          {
            title: 'Confidence Anchor Technique',
            duration: '8 min',
            type: 'meditation',
            steps: [
              'Sit comfortably and close your eyes',
              'Remember a time when you felt truly confident',
              'Notice what you saw, heard, and felt in that moment',
              'Create a physical "anchor" (like touching your thumb to finger)',
              'Practice this anchor daily to access confidence when needed'
            ],
            isGuided: true,
            audioUrl: '/content/audio/confidence-anchor.mp3'
          }
        ],
        reflectionQuestions: [
          'What does confidence feel like in your body?',
          'When do you feel most confident during the day?',
          'What small step could you take tomorrow to practice confidence?'
        ],
        isActive: true
      },
      {
        id: 'week-1-3',
        moduleId: 'module-1',
        weekNumber: 3,
        title: 'Positive Self-Talk',
        description: 'Transform your inner critic into your inner supporter',
        videoUrl: '/content/videos/confidence-week3.mp4',
        videoDuration: '5 min',
        practices: [
          {
            title: 'Inner Voice Makeover',
            duration: '12 min',
            type: 'journaling',
            steps: [
              'Notice your self-talk for one day without judgment',
              'Write down any negative phrases you caught',
              'For each negative phrase, create a kind alternative',
              'Practice your new phrases 3 times daily',
              'Imagine speaking to your best friend - use that tone with yourself'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'What patterns did you notice in your self-talk?',
          'How did it feel to speak to yourself more kindly?',
          'What would you tell a friend who talks to themselves the way you do?'
        ],
        isActive: true
      }
    ]
  },
  {
    id: 'module-2',
    slug: 'healthy-friendships',
    title: 'Healthy Friendships',
    description: 'Build meaningful connections with empathy, trust, and healthy boundaries',
    orderIndex: 2,
    totalWeeks: 3,
    isActive: true,
    locale: 'en',
    createdAt: new Date('2024-01-01'),
    weeks: [
      {
        id: 'week-2-1',
        moduleId: 'module-2',
        weekNumber: 1,
        title: 'Understanding Friendship Types',
        description: 'Explore different levels of friendship and what makes them healthy',
        videoUrl: '/content/videos/friendship-week1.mp4',
        videoDuration: '8 min',
        practices: [
          {
            title: 'Friendship Mapping',
            duration: '15 min',
            type: 'reflection',
            steps: [
              'Draw three circles: inner (close friends), middle (good friends), outer (acquaintances)',
              'Place people in your life in the appropriate circles',
              'Notice what qualities make someone a close friend',
              'Reflect on how you show up in different friendships'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'What patterns do you notice in your friendship circles?',
          'What qualities do you value most in a friend?',
          'How do you show care and support to your friends?'
        ],
        isActive: true
      },
      {
        id: 'week-2-2',
        moduleId: 'module-2',
        weekNumber: 2,
        title: 'Building Empathy & Trust',
        description: 'Develop deeper connection skills through active listening and understanding',
        videoUrl: '/content/videos/friendship-week2.mp4',
        videoDuration: '6 min',
        practices: [
          {
            title: 'Active Listening Practice',
            duration: '10 min',
            type: 'exercise',
            steps: [
              'Partner with someone for this exercise',
              'Person A shares something meaningful for 3 minutes',
              'Person B listens without interrupting or giving advice',
              'Person B reflects back what they heard and felt',
              'Switch roles and repeat'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'How did it feel to be truly heard without judgment?',
          'What did you notice about your listening habits?',
          'How can you practice better listening in your daily conversations?'
        ],
        isActive: true
      },
      {
        id: 'week-2-3',
        moduleId: 'module-2',
        weekNumber: 3,
        title: 'Setting Healthy Boundaries',
        description: 'Learn to communicate your needs and respect others\' limits',
        videoUrl: '/content/videos/friendship-week3.mp4',
        videoDuration: '7 min',
        practices: [
          {
            title: 'Boundary Setting Scripts',
            duration: '12 min',
            type: 'exercise',
            steps: [
              'Identify a situation where you need better boundaries',
              'Write down your specific need or limit',
              'Practice saying it out loud using "I" statements',
              'Role-play the conversation with a trusted person',
              'Plan how to follow through with kindness and firmness'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'Where in your friendships do you need clearer boundaries?',
          'What makes it difficult for you to say no sometimes?',
          'How can boundaries actually strengthen your relationships?'
        ],
        isActive: true
      }
    ]
  },
  {
    id: 'module-3',
    slug: 'communication-skills',
    title: 'Communication Skills',
    description: 'Master active listening, assertive expression, and conflict resolution',
    orderIndex: 3,
    totalWeeks: 3,
    isActive: true,
    locale: 'en',
    createdAt: new Date('2024-01-01'),
    weeks: [
      {
        id: 'week-3-1',
        moduleId: 'module-3',
        weekNumber: 1,
        title: 'I-Messages & Clear Expression',
        description: 'Learn to express your feelings and needs without blame or judgment',
        videoUrl: '/content/videos/communication-week1.mp4',
        videoDuration: '6 min',
        practices: [
          {
            title: 'I-Message Formula Practice',
            duration: '10 min',
            type: 'exercise',
            steps: [
              'Think of a recent situation where you felt misunderstood',
              'Write the situation using blame language first',
              'Rewrite using: "I feel ___ when ___ because ___"',
              'Practice saying both versions out loud',
              'Notice the difference in how each feels'
            ],
            isGuided: false
          }
        ],
        reflectionQuestions: [
          'How did the I-message feel different from the blame statement?',
          'What situations would benefit from clearer expression?',
          'What emotions are hardest for you to express directly?'
        ],
        isActive: true
      }
    ]
  },
  {
    id: 'module-4',
    slug: 'stress-management',
    title: 'Stress Management',
    description: 'Learn breathing techniques, mindfulness practices, and healthy coping strategies',
    orderIndex: 4,
    totalWeeks: 3,
    isActive: true,
    locale: 'en',
    createdAt: new Date('2024-01-01'),
    weeks: [
      {
        id: 'week-4-1',
        moduleId: 'module-4',
        weekNumber: 1,
        title: 'Understanding Your Stress Response',
        description: 'Recognize stress signals and understand how your body and mind respond',
        videoUrl: '/content/videos/stress-week1.mp4',
        videoDuration: '7 min',
        practices: [
          {
            title: '4-7-8 Breathing Technique',
            duration: '6 min',
            type: 'breathing',
            steps: [
              'Sit comfortably with your back straight',
              'Exhale completely through your mouth',
              'Inhale through nose for 4 counts',
              'Hold your breath for 7 counts',
              'Exhale through mouth for 8 counts',
              'Repeat 4 cycles, practice twice daily'
            ],
            isGuided: true,
            audioUrl: '/content/audio/4-7-8-breathing.mp3'
          }
        ],
        reflectionQuestions: [
          'What physical sensations do you notice when stressed?',
          'How did the breathing exercise affect your stress level?',
          'What are your most common stress triggers?'
        ],
        isActive: true
      }
    ]
  }
]

// Generate remaining modules with basic structure
const generateModule = (
  id: number,
  slug: string,
  title: string,
  description: string
): Module & { weeks: ModuleWeek[] } => ({
  id: `module-${id}`,
  slug,
  title,
  description,
  orderIndex: id,
  totalWeeks: 3,
  isActive: true,
  locale: 'en',
  createdAt: new Date('2024-01-01'),
  weeks: Array.from({ length: 3 }, (_, weekIndex) => ({
    id: `week-${id}-${weekIndex + 1}`,
    moduleId: `module-${id}`,
    weekNumber: weekIndex + 1,
    title: `Week ${weekIndex + 1}: ${title} Exploration`,
    description: `Explore key concepts and practices related to ${title.toLowerCase()}`,
    videoUrl: `/content/videos/${slug}-week${weekIndex + 1}.mp4`,
    videoDuration: '6 min',
    practices: [
      {
        title: `${title} Practice`,
        duration: '10 min',
        type: 'reflection',
        steps: [
          'Take a few deep breaths to center yourself',
          'Reflect on the week\'s theme and your experiences',
          'Write down 3 key insights or observations',
          'Set an intention for applying what you\'ve learned'
        ],
        isGuided: false
      }
    ],
    reflectionQuestions: [
      `How has this week's focus on ${title.toLowerCase()} affected you?`,
      'What was the most challenging part of this week\'s practice?',
      'What would you like to continue working on next week?'
    ],
    isActive: true
  }))
})

// Add remaining modules
modulesData.push(
  generateModule(5, 'body-image-self-acceptance', 'Body Image & Self-Acceptance', 'Develop a healthy relationship with your body and cultivate self-acceptance'),
  generateModule(6, 'time-management-focus', 'Time Management & Focus', 'Build productive habits, manage priorities, and improve concentration'),
  generateModule(7, 'financial-literacy', 'Financial Literacy', 'Learn budgeting basics, develop a healthy money mindset, and plan for the future'),
  generateModule(8, 'career-exploration', 'Career Exploration', 'Discover your interests, explore future paths, and build valuable skills'),
  generateModule(9, 'digital-wellness', 'Digital Wellness', 'Develop healthy social media habits and create sustainable screen time balance'),
  generateModule(10, 'healthy-lifestyle', 'Healthy Lifestyle', 'Establish routines for sleep, nutrition, movement, and overall wellbeing'),
  generateModule(11, 'decision-making', 'Decision Making', 'Learn to make thoughtful choices and handle consequences with confidence'),
  generateModule(12, 'resilience-growth', 'Resilience & Growth', 'Bounce back from setbacks, embrace challenges, and develop a growth mindset')
)

export default modulesData