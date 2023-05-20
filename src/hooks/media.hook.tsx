import { useEffect, useState } from 'react';

export interface Breakpoint {
  base: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl?: string;
  [key: string]: string | undefined;
}

export const breakpoints: Breakpoint = {
  base: '0em',
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  xxl: '96em',
};

export function useMediaQuery(breakpoint: keyof Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`);

    setMatches(media.matches);
    media.onchange = (e: MediaQueryListEvent): void => {
      setMatches(e.matches);
    };

    return (): void => {
      media.onchange = null;
      setMatches(false);
    };
  }, [breakpoint]);

  return matches;
}
