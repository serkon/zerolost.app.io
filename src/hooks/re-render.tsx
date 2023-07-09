import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useForceRenderOnLocationChange = (): number => {
  const location = useLocation();
  const locationKey = useRef(0);

  useEffect(() => {
    locationKey.current += 1;
  }, [location]);

  return locationKey.current;
};
