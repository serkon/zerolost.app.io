import { useState } from 'react';

interface TextTransformHook {
  text: string;
  setText: (text: string) => void;
  titleCase: (str: string) => string;
  lowerCase: (str: string) => string;
  upperCase: (str: string) => string;
  camelCase: (str: string) => string;
  sentenceCase: (str: string) => string;
}

const useTextTransform = (): TextTransformHook => {
  const [text, setText] = useState<string>('');
  const titleCase = (str: string): string => str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  const lowerCase = (str: string): string => str.toLocaleLowerCase();
  const upperCase = (str: string): string => str.toLocaleUpperCase();
  const camelCase = (str: string): string => str.replace(/\s(.)/g, (match, group1) => group1.toUpperCase());
  const sentenceCase = (str: string): string => str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();

  return {
    text,
    setText,
    titleCase,
    lowerCase,
    upperCase,
    camelCase,
    sentenceCase,
  };
};

export default useTextTransform;
