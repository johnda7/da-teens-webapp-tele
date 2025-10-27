import { lazy } from 'react'

// Lazy load heavy components
export const LazyBoundariesModule = lazy(() => import('./BoundariesModule'))
export const LazyAdaptiveLessonViewer = lazy(() => import('./AdaptiveLessonViewer'))
export const LazyCheckInPanel = lazy(() => import('./CheckInPanel'))
export const LazyCohortSchedule = lazy(() => import('./CohortSchedule'))
export const LazyBadgeGrid = lazy(() => import('./BadgeGrid'))
export const LazyProgressStats = lazy(() => import('./ProgressStats'))
export const LazyDashboardHero = lazy(() => import('./DashboardHero'))
export const LazyDailyRecommendationCard = lazy(() => import('./DailyRecommendationCard'))

// Lazy load demo components
export const LazyVisualLessonCard = lazy(() => import('./VisualLessonCard'))
export const LazyInteractiveExercise = lazy(() => import('./InteractiveExercise'))
export const LazyMultimodalContent = lazy(() => import('./MultimodalContent'))
export const LazyLessonImages = lazy(() => import('./LessonImages'))
export const LazySleepMeditationHub = lazy(() => import('./SleepMeditationHub'))
export const LazySleepIntegration = lazy(() => import('./SleepIntegration'))



