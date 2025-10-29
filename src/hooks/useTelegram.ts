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
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      // Set header color to match theme
      if (tg.themeParams?.bg_color) {
        tg.setHeaderColor(tg.themeParams.bg_color);
      }
      
      // Configure main button for better mobile UX
      tg.MainButton.setText('Продолжить');
      tg.MainButton.color = '#007AFF';
      tg.MainButton.textColor = '#FFFFFF';
      
      // Configure back button
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        // Handle back button press
        window.history.back();
      });
      
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
