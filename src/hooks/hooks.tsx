import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LinkItem {
  to: string;
  title?: string;
  external?: boolean;
}

export const useSetTitle = (title: string): void => {
  useEffect(() => {
    const prevTitle = document.title;

    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export const useProcess = (): any => process.env;

/**
 * Redirections
 */
export const useDirection = (): ((item: LinkItem) => void) => {
  const navigate = useNavigate();
  const direction = React.useCallback(
    (item: LinkItem): void => {
      item.external ? window.open(item.to, '_blank') : navigate(item.to);
    },
    [navigate],
  );

  return direction;
};
