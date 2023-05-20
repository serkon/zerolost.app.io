declare module 'react-router-dom';

// In typings.d.ts(is Global)
declare global {
  interface Window {
    getVersion: () => any;
  }
}

export {};
