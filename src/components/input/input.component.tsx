import './input.component.scss';

import React, { useEffect, useImperativeHandle, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconLeft?: string;
  iconRight?: string;
  ref?: React.MutableRefObject<HTMLInputElement>;
}

/**
 * Usage Example:
 * const inputRef = React.useRef<HTMLInputElement>(null);
 * const dispatch = useDispatch();
 * const change = () => {
 *   const value = inputRef.current?.value;
 *   window.clearTimeout(timeout);
 *   timeout = window.setTimeout(() => {
 *     if (typeof value === 'string' && value?.length >= 0) {
 *       dispatch(filter_game_by_search_string(inputRef.current?.value ? inputRef.current?.value : ''));
 *     }
 *   }, 400);
 * };
 *
 * <Input label={t('Search')} iconRight="search" onInput={() => change()} ref={inputRef} />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, iconLeft, iconRight, ...rest }, forwardedRef) => {
  const [type, SetType] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const showEye = (): void => {
    if (type) {
      const ref = inputRef.current as HTMLInputElement;

      ref.type = ref.type === 'password' ? 'text' : 'password';
    }
  };

  useEffect(() => {
    const ref = inputRef.current as HTMLInputElement;

    SetType(ref.type === 'password');
  }, []);

  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

  return (
    <label className={`input-component${iconLeft ? ' icon-left with-icon' : iconRight ? ' icon-right with-icon' : ''}`}>
      <input type="text" {...rest} required ref={inputRef} />
      <span>{label}</span>
      {(iconLeft || iconRight) && <i className={`icon icon-${iconLeft || iconRight}`} onClick={showEye} />}
    </label>
  );
});
