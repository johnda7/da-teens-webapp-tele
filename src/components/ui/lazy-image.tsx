/**
 * LazyImage - Lazy Loading Image Component
 * Ленивая загрузка изображений с Intersection Observer
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string
  alt: string
  /** Placeholder изображение (опционально) */
  placeholderSrc?: string
  /** Показывать skeleton пока загружается */
  showSkeleton?: boolean
  /** Класс для skeleton */
  skeletonClassName?: string
  /** Эффект появления */
  fadeIn?: boolean
  /** Задержка появления (ms) */
  fadeInDuration?: number
  /** Root margin для Intersection Observer */
  rootMargin?: string
}

/**
 * Компонент ленивой загрузки изображений
 * 
 * @example
 * <LazyImage
 *   src="/images/module.jpg"
 *   alt="Module 1"
 *   className="w-full h-48 object-cover rounded-lg"
 *   fadeIn
 * />
 */
export function LazyImage({
  src,
  alt,
  placeholderSrc,
  showSkeleton = true,
  skeletonClassName,
  fadeIn = true,
  fadeInDuration = 300,
  rootMargin = '50px',
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer для детекции видимости
  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin }
    )

    observer.observe(img)

    return () => {
      if (img) observer.unobserve(img)
    }
  }, [rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
    setError(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoaded(true)
  }

  // Показываем skeleton пока не загрузилось
  if (!isLoaded && showSkeleton && !error) {
    return (
      <Skeleton
        ref={imgRef}
        className={cn(skeletonClassName || className)}
      />
    )
  }

  // Показываем placeholder при ошибке
  if (error) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-400',
          className
        )}
      >
        <span className="text-sm">Не удалось загрузить</span>
      </div>
    )
  }

  return (
    <>
      {/* Placeholder пока не в viewport */}
      {!isInView && placeholderSrc && (
        <img
          ref={imgRef}
          src={placeholderSrc}
          alt={alt}
          className={cn('blur-sm', className)}
          {...props}
        />
      )}

      {/* Основное изображение */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            className,
            fadeIn && 'transition-opacity duration-' + fadeInDuration,
            fadeIn && !isLoaded && 'opacity-0',
            fadeIn && isLoaded && 'opacity-100'
          )}
          loading="lazy"
          {...props}
        />
      )}
    </>
  )
}
