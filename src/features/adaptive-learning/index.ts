/**
 * Adaptive Learning Feature - Public API
 * 
 * FSD Layer: Features
 * Feature: adaptive-learning (адаптивная система обучения)
 */

// Model (engine, types, utils)
export {
  type UserProgress,
  type LessonRecommendation,
  type EmotionalState,
  type CognitiveLoad,
  type MasteryLevel,
  analyzeEmotionalState,
  calculateCognitiveLoad,
  estimateMastery,
  recommendLessonFormat,
  generateRecommendationReason
} from './model/engine'

// UI Components (пока нет, добавим позже при миграции AdaptiveLessonViewer)
