import { toast } from 'sonner'

interface ShareProgressButtonProps {
  text: string
  url?: string
  className?: string
}

/**
 * Кнопка шаринга прогресса. Предпочитает Web Share API, 
 * падает обратно на Telegram share или копирование ссылки в буфер.
 */
export default function ShareProgressButton({ text, url = (typeof window !== 'undefined' ? window.location.href : ''), className }: ShareProgressButtonProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text, url })
        toast.success('Отправлено!')
        return
      }
      // Telegram share
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      window.open(tgUrl, '_blank')
      toast.success('Открылся Telegram для шаринга')
    } catch (e) {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        toast.success('Ссылка скопирована')
      } catch {
        toast.error('Не удалось поделиться')
      }
    }
  }

  return (
    <button onClick={handleShare} className={className || 'px-3 py-2 rounded-lg bg-white border text-sm hover:bg-gray-50 active:scale-[0.99]'}>
      Поделиться прогрессом
    </button>
  )
}
