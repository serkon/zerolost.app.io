import { useEffect, useState } from 'react';

import { breakpoints } from './media.hook';

/**
 * Returns a current breakpoint
 *
 * Usage Example:
 *
 * const size = useSize();
 * <Component prop={size === 'lg' ? 'lg-size': 'md-size' }></Component>
 */
export function useSize(): string | undefined {
  const [matches, setMatches] = useState<string | undefined>(undefined);

  useEffect(() => {
    const breakpointsKeys = Object.keys(breakpoints);
    let status = false;
    const mediaList: MediaQueryList[] = [];

    if (!status) {
      breakpointsKeys.forEach((_breakpoint: string, key: number) => {
        const media = window.matchMedia(`(max-width: ${breakpoints[breakpointsKeys[key]]})`);

        mediaList.push(media);
        media.onchange = (e: MediaQueryListEvent): void => {
          setMatches(e.matches ? _breakpoint : breakpointsKeys[key + 1]);
        };
        if (media.matches && status === false) {
          setMatches(breakpointsKeys[key]);
          status = true;
        }
      });
    }

    return () => {
      // cancel the subscription
      status = false;
      setMatches(undefined);
      mediaList.forEach((media: MediaQueryList) => {
        media.onchange = null;
      });
    };
  }, [matches]);

  return matches;
}
