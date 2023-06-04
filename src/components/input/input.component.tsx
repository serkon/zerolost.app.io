import './input.component.scss';

import React, { useEffect, useImperativeHandle, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
 * <Input label="Username" type="password" placeholder="Username" defaultValue={'player1'} name="username" className="form-control-lg" />
 * <Input label="Password" type="password" placeholder="Password" defaultValue={'player1'} name="password" className="form-control-lg" iconRight="ti-eye" iconLeft="ti-settings" />
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
    <label className={`input-component ${iconLeft && 'icon-left with-icon'} ${iconRight && 'icon-right with-icon'}`}>
      {label && <span className="label caption-10 fw-semibold">{label}</span>}
      <div className="input-container">
        <input {...rest} required ref={inputRef} className={`form-control ${rest.className && rest.className}`} />
        {(iconLeft) && <i className={`icon i-left ${iconLeft}`} onClick={showEye} />}
        {(iconRight) && <i className={`icon i-right ${iconRight}`} onClick={showEye} />}
      </div>
    </label>
  );
});
