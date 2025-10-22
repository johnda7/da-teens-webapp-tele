/**
 * Modules Registry
 * Центральный реестр всех 13 модулей платформы
 */

import type { ModuleData } from '@/types/module'
import { boundariesModule } from './boundariesModule'

// Модуль #1: Личные границы (полностью разработан)
const module1 = boundariesModule

// Модули #2-13: Заглушки (будут разрабатываться постепенно)
const comingSoonModules: ModuleData[] = [
  {
    id: 2,
    title: 'Мотивация',
    description: 'Внутренняя мотивация, цели, энергия',
    icon: '🔥',
    color: 'bg-orange-50 border-orange-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 3,
    title: 'Эмоции',
    description: 'Распознавание, принятие, управление эмоциями',
    icon: '❤️',
    color: 'bg-pink-50 border-pink-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 4,
    title: 'Дружба',
    description: 'Эмпатия, доверие, границы, здоровые отношения',
    icon: '🤝',
    color: 'bg-green-50 border-green-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 5,
    title: 'Общение',
    description: 'Я-сообщения, активное слушание, убеждение',
    icon: '💬',
    color: 'bg-purple-50 border-purple-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 6,
    title: 'Стресс-менеджмент',
    description: 'Дыхательные техники, телесные практики',
    icon: '🧘',
    color: 'bg-blue-50 border-blue-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 7,
    title: 'Самооценка',
    description: 'Принятие себя, работа с комплексами',
    icon: '✨',
    color: 'bg-yellow-50 border-yellow-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 8,
    title: 'Тайм-менеджмент',
    description: 'Приоритеты, фокус, учебные ритуалы',
    icon: '⏰',
    color: 'bg-indigo-50 border-indigo-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 9,
    title: 'Финансовая грамотность',
    description: 'Базовый бюджет, цели, проекты',
    icon: '💰',
    color: 'bg-emerald-50 border-emerald-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 10,
    title: 'Карьерный путь',
    description: 'Интересы, сильные стороны, профориентация',
    icon: '🎯',
    color: 'bg-red-50 border-red-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 11,
    title: 'Цифровая гигиена',
    description: 'Соцсети, скролл-детокс, кибербуллинг',
    icon: '📱',
    color: 'bg-cyan-50 border-cyan-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 12,
    title: 'Здоровые привычки',
    description: 'Сон, питание, движение, экранное время',
    icon: '🌱',
    color: 'bg-teal-50 border-teal-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  },
  {
    id: 13,
    title: 'Принятие решений',
    description: 'Анализ последствий, эксперименты',
    icon: '🤔',
    color: 'bg-violet-50 border-violet-200',
    estimatedDuration: '3-4 недели',
    comingSoon: true,
    lessons: []
  }
]

// Собираем все модули в Map для быстрого доступа
export const modulesRegistry = new Map<number, ModuleData>()

// Добавляем модуль #1
modulesRegistry.set(1, module1 as any) // приводим к ModuleData

// Добавляем модули #2-13
comingSoonModules.forEach(module => {
  modulesRegistry.set(module.id as number, module)
})

// Хелпер для получения модуля по ID
export function getModuleById(id: number): ModuleData | undefined {
  return modulesRegistry.get(id)
}

// Хелпер для получения всех модулей
export function getAllModules(): ModuleData[] {
  return Array.from(modulesRegistry.values())
}
