import { useEffect } from 'react';

import { useMediaQuery } from './media.hook';

export const useMobile = (): void => {
  const isDesktop = useMediaQuery('md');

  // const root: HTMLDivElement | null = document.getElementById('root') as HTMLDivElement;
  useEffect(() => {
    !isDesktop ? document.documentElement.classList.add('mobile') : document.documentElement.classList.remove('mobile');
  });
};
