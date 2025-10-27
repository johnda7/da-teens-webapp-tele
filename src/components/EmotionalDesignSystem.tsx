import React from 'react'

// Эмоциональные цветовые палитры
export const emotionalColorPalettes = {
  anxious: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#FF8E8E',
    background: '#FFF5F5',
    text: '#8B4513',
    gradient: 'from-red-400 to-yellow-400',
    description: 'Тёплые, успокаивающие тона для тревожного состояния'
  },
  energetic: {
    primary: '#4ECDC4',
    secondary: '#45B7D1',
    accent: '#96CEB4',
    background: '#F0FDFF',
    text: '#1E40AF',
    gradient: 'from-cyan-400 to-blue-500',
    description: 'Яркие, энергичные тона для активного состояния'
  },
  focused: {
    primary: '#96CEB4',
    secondary: '#FFEAA7',
    accent: '#A8E6CF',
    background: '#F0FDF4',
    text: '#166534',
    gradient: 'from-green-400 to-yellow-300',
    description: 'Спокойные, сосредоточенные тона для фокуса'
  },
  calm: {
    primary: '#A8E6CF',
    secondary: '#FFD93D',
    accent: '#FFAAA5',
    background: '#FEFEFE',
    text: '#374151',
    gradient: 'from-green-300 to-yellow-200',
    description: 'Мягкие, расслабляющие тона для спокойствия'
  },
  excited: {
    primary: '#FF8A80',
    secondary: '#FFB74D',
    accent: '#FFCDD2',
    background: '#FFF8E1',
    text: '#E65100',
    gradient: 'from-orange-400 to-pink-400',
    description: 'Яркие, возбуждающие тона для радости'
  }
}

// Эмоциональные анимации
export const emotionalAnimations = {
  anxious: {
    hover: { scale: 1.01, y: -2 },
    tap: { scale: 0.99 },
    transition: { type: "spring", stiffness: 200, damping: 20 },
    description: 'Мягкие, осторожные анимации'
  },
  energetic: {
    hover: { scale: 1.05, y: -6 },
    tap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 15 },
    description: 'Быстрые, динамичные анимации'
  },
  focused: {
    hover: { scale: 1.03, y: -4 },
    tap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300, damping: 25 },
    description: 'Плавные, контролируемые анимации'
  },
  calm: {
    hover: { scale: 1.02, y: -3 },
    tap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 150, damping: 30 },
    description: 'Медленные, расслабляющие анимации'
  },
  excited: {
    hover: { scale: 1.08, y: -8 },
    tap: { scale: 0.92 },
    transition: { type: "spring", stiffness: 500, damping: 10 },
    description: 'Быстрые, радостные анимации'
  }
}

// Эмоциональные изображения
export const emotionalImages = {
  anxious: {
    hero: '/images/emotions/anxious-hero.jpg',
    background: '/images/emotions/anxious-bg.jpg',
    icon: '/images/emotions/anxious-icon.svg',
    description: 'Спокойные, умиротворяющие изображения'
  },
  energetic: {
    hero: '/images/emotions/energetic-hero.jpg',
    background: '/images/emotions/energetic-bg.jpg',
    icon: '/images/emotions/energetic-icon.svg',
    description: 'Динамичные, активные изображения'
  },
  focused: {
    hero: '/images/emotions/focused-hero.jpg',
    background: '/images/emotions/focused-bg.jpg',
    icon: '/images/emotions/focused-icon.svg',
    description: 'Сосредоточенные, целеустремлённые изображения'
  },
  calm: {
    hero: '/images/emotions/calm-hero.jpg',
    background: '/images/emotions/calm-bg.jpg',
    icon: '/images/emotions/calm-icon.svg',
    description: 'Мирные, расслабляющие изображения'
  },
  excited: {
    hero: '/images/emotions/excited-hero.jpg',
    background: '/images/emotions/excited-bg.jpg',
    icon: '/images/emotions/excited-icon.svg',
    description: 'Радостные, праздничные изображения'
  }
}

// Эмоциональные звуки и музыка
export const emotionalAudio = {
  anxious: {
    backgroundMusic: '/audio/emotions/anxious-ambient.mp3',
    soundEffects: ['/audio/emotions/anxious-chime.mp3'],
    voiceTone: 'calm',
    speed: 'slow',
    pitch: 'low',
    description: 'Мягкие, успокаивающие звуки'
  },
  energetic: {
    backgroundMusic: '/audio/emotions/energetic-ambient.mp3',
    soundEffects: ['/audio/emotions/energetic-chime.mp3'],
    voiceTone: 'upbeat',
    speed: 'normal',
    pitch: 'high',
    description: 'Ритмичные, мотивирующие звуки'
  },
  focused: {
    backgroundMusic: '/audio/emotions/focused-ambient.mp3',
    soundEffects: ['/audio/emotions/focused-chime.mp3'],
    voiceTone: 'clear',
    speed: 'normal',
    pitch: 'medium',
    description: 'Чёткие, сосредоточенные звуки'
  },
  calm: {
    backgroundMusic: '/audio/emotions/calm-ambient.mp3',
    soundEffects: ['/audio/emotions/calm-chime.mp3'],
    voiceTone: 'gentle',
    speed: 'slow',
    pitch: 'low',
    description: 'Тихие, расслабляющие звуки'
  },
  excited: {
    backgroundMusic: '/audio/emotions/excited-ambient.mp3',
    soundEffects: ['/audio/emotions/excited-chime.mp3'],
    voiceTone: 'cheerful',
    speed: 'fast',
    pitch: 'high',
    description: 'Весёлые, радостные звуки'
  }
}

// Культурные адаптации
export const culturalAdaptations = {
  russian: {
    colors: {
      primary: '#FF6B6B', // Красный - традиционный цвет
      secondary: '#4ECDC4', // Голубой - цвет неба
      accent: '#FFE66D' // Жёлтый - цвет солнца
    },
    images: {
      hero: '/images/cultural/russian-hero.jpg',
      background: '/images/cultural/russian-bg.jpg',
      examples: '/images/cultural/russian-examples.jpg'
    },
    examples: [
      'Подруга просит списать на экзамене',
      'Родители настаивают на выборе профессии',
      'Одноклассники дразнят за внешность',
      'Учитель требует ответить у доски'
    ],
    phrases: [
      'Извини, но я не могу',
      'Мне это не подходит',
      'Я не хочу этого делать',
      'Это моё личное решение'
    ]
  },
  international: {
    colors: {
      primary: '#4ECDC4', // Универсальный синий
      secondary: '#96CEB4', // Универсальный зелёный
      accent: '#FFEAA7' // Универсальный жёлтый
    },
    images: {
      hero: '/images/cultural/international-hero.jpg',
      background: '/images/cultural/international-bg.jpg',
      examples: '/images/cultural/international-examples.jpg'
    },
    examples: [
      'Friend asks to copy homework',
      'Parents pressure about career choice',
      'Classmates tease about appearance',
      'Teacher demands public speaking'
    ],
    phrases: [
      'Sorry, but I cannot',
      'This is not for me',
      'I do not want to do this',
      'This is my personal decision'
    ]
  }
}

// Функция для получения эмоционального стиля
export const getEmotionalStyle = (emotionalState: keyof typeof emotionalColorPalettes) => {
  return {
    colors: emotionalColorPalettes[emotionalState],
    animations: emotionalAnimations[emotionalState],
    images: emotionalImages[emotionalState],
    audio: emotionalAudio[emotionalState]
  }
}

// Функция для получения культурной адаптации
export const getCulturalAdaptation = (culture: 'russian' | 'international') => {
  return culturalAdaptations[culture]
}

// Компонент для эмоционального контекста
interface EmotionalContextProps {
  emotionalState: keyof typeof emotionalColorPalettes
  culture: 'russian' | 'international'
  children: React.ReactNode
}

export function EmotionalContext({ emotionalState, culture, children }: EmotionalContextProps) {
  const emotionalStyle = getEmotionalStyle(emotionalState)
  const culturalStyle = getCulturalAdaptation(culture)

  return (
    <div 
      className="emotional-context"
      style={{
        '--emotional-primary': emotionalStyle.colors.primary,
        '--emotional-secondary': emotionalStyle.colors.secondary,
        '--emotional-accent': emotionalStyle.colors.accent,
        '--emotional-background': emotionalStyle.colors.background,
        '--emotional-text': emotionalStyle.colors.text,
        '--cultural-primary': culturalStyle.colors.primary,
        '--cultural-secondary': culturalStyle.colors.secondary,
        '--cultural-accent': culturalStyle.colors.accent
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Хук для эмоционального состояния
export const useEmotionalState = () => {
  const [emotionalState, setEmotionalState] = React.useState<keyof typeof emotionalColorPalettes>('calm')
  const [culture, setCulture] = React.useState<'russian' | 'international'>('russian')

  const updateEmotionalState = (newState: keyof typeof emotionalColorPalettes) => {
    setEmotionalState(newState)
  }

  const updateCulture = (newCulture: 'russian' | 'international') => {
    setCulture(newCulture)
  }

  return {
    emotionalState,
    culture,
    updateEmotionalState,
    updateCulture,
    emotionalStyle: getEmotionalStyle(emotionalState),
    culturalStyle: getCulturalAdaptation(culture)
  }
}

export default EmotionalContext
