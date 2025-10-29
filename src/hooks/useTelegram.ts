import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      // Configure Telegram WebApp for mobile optimization
      tg.ready();
      tg.expand();
      
      // Устанавливаем цвет хедера в белый, чтобы он сливался с фоном
      tg.setHeaderColor('#ffffff');
      
      // Скрываем встроенные кнопки Telegram
      tg.BackButton.hide();
      tg.MainButton.hide();
      
      setIsReady(true);
    }

    // Handle viewport changes for mobile
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tg]);

  const user = tg?.initDataUnsafe?.user;
  const isTelegramWebApp = !!tg;

  return {
    tg,
    user,
    isReady,
    isTelegramWebApp,
    colorScheme: tg?.colorScheme || 'light',
    themeParams: tg?.themeParams || {},
    viewportHeight,
    isMobile: viewportHeight < 768,
    isSmallMobile: viewportHeight < 600,
  };
};
