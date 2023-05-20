import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Usage Example:
 * <ScrollTo position="100px"/>
 * @param param0
 * @returns
 */
export const ScrollTo = ({ position = 0 }: { position?: number }): null => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: position, behavior: 'smooth' });
  }, [location, position]);

  return null;
};
