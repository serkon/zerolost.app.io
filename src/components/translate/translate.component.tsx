import React, { useContext, useEffect, useState } from 'react';

interface TranslateContextType {
  translateState: State;
  translateLanguage: (language: string) => void;
  translate: (key: string, params?: any) => string;
}

export const TranslateContext = React.createContext<TranslateContextType>({
  translateState: { language: 'tr', content: {} },
  translateLanguage: () => null,
  translate: () => '',
});

interface Props {
  current?: string;
  children?: React.ReactNode;
}

interface State {
  language: string;
  content: { [key: string]: string };
}

export const Translate: React.FC<Props> = ({ current = 'en', children }) => {
  const [state, setState] = useState<State>({
    language: current,
    content: {},
  });
  const translateLanguage = async (language: string): Promise<void> => {
    const content = await import(`./languages/${language}.json`);

    setState((prevState) => ({ ...prevState, language, content }));
  };

  useEffect(() => {
    translateLanguage(current);
  }, [current]);

  return (
    <TranslateContext.Provider value={{
      translateState: state,
      translateLanguage,
      translate: (key: string, params?: any): string => {
        let text = getObjectPathValue(state.content, key) || key;
        const type = params !== null && typeof params !== 'undefined' ? params.constructor.name : null;

        if (type === 'Array') {
          params.forEach((param: any, paramIndex: number) => {
            text = text.replace(new RegExp(`{${paramIndex}}`, 'g'), param);
          });
        } else if (type === 'Object') {
          Object.keys(params).forEach((keyName: string) => {
            text = text.replace(new RegExp(`{${keyName}}`, 'g'), params[keyName]);
          });
        }

        return text;
      },
    }}
    >
      { <>{children}</>}
    </TranslateContext.Provider>
  );
};

const getObjectPathValue = (value: any, path: string): any => {
  let data = value;

  if (path) {
    path = path.toString();
    path.split('.').forEach((val: any) => {
      data = data !== null && typeof data !== 'undefined' ? data[val] : null;
    });
  }

  return data;
};

export const useTranslate = (): TranslateContextType => useContext(TranslateContext);
