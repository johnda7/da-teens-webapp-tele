import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsReady(true);
    }
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
  };
};
