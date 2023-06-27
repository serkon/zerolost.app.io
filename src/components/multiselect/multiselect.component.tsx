import './multiselect.component.scss';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';

export interface Option {
  value: string;
  label: string;
  group?: string;
  checked?: boolean;
  [key: string]: any;
}

interface CheckboxDropdownProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({ options, value, onChange, label, placeholder, error, ...rest }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const { translate } = useTranslate();
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const [dropdownDirection, setDropdownDirection] = useState<string>('down');

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent): void => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const rect = dropdownContentRef.current?.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    setDropdownDirection(rect && viewHeight - rect.top - 50 < rect.height ? 'up' : 'down');
    document.addEventListener('mousedown', checkIfClickedOutside as any);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside as any);
    };
  }, [isOpen]);

  const handleCheck = (optionValue: Option): void => {
    const isSelected = value.find((item: Option) => item.value === optionValue.value);

    onChange(isSelected ? value.filter((item: Option) => item.value !== optionValue.value) : [...value, optionValue]);
  };
  const handleCheckAll = (): void => {
    onChange(value.length === filteredOptions.length ? [] : filteredOptions);
  };
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));
  const groups = Array.from(new Set(filteredOptions.map((item) => item.group)));

  return (
    <div ref={ref} className="dropdown d-flex flex-column">
      <label className="dropdown-label d-flex flex-column secondary-600 fw-bold caption-10">
        <span>{label}</span>
        <div className="selector position-relative">
          <input
            className={`dropdown-button form-control form-control-lg ${error ? 'invalid' : ''}`}
            data-invalid={error ? true : undefined}
            onClick={(): void => setIsOpen(!isOpen)}
            value={`${value.length > 0 ? `${value.length} selected` : ''}`}
            placeholder={placeholder}
            readOnly
          />
          <div className="right-selection">
            <svg width="1.125rem" height="1.125rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" data-chevron="true" style={{ color: `${error ? 'rgb(250, 82, 82)' : 'rgb(134, 142, 150)'}` }}>
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </label>
      <div className="dropdown-container">
        {error && <div className="dropdown-error caption-10">{error}</div>}
        {isOpen && (
          <div className={`dropdown-popup ${dropdownDirection}`} ref={dropdownContentRef}>
            <input className="filter form-control form-control-md mx-3 w-auto my-2" type="text" placeholder="Filter options" value={filter} onChange={(e: ChangeEvent<HTMLInputElement>): void => setFilter(e.target.value)} />
            <label className="select-all px-3 py-2 d-flex flex-wrap secondary-500 caption-14">
              <input className="form-check-input me-1" type="checkbox" onChange={handleCheckAll} checked={value.length === filteredOptions.length} />
              {`${value.length === filteredOptions.length ? translate('DESELECT_ALL') : translate('SELECT_ALL')}`}
            </label>
            {groups.map((group) => (
              <div key={group} className="dropdown-group-items">
                {group && <span className="dropdown-group caption-10 px-3 py-1 my-1 text-nowrap secondary-400 w-100 d-inline-flex">{group}</span>}
                {filteredOptions
                  .filter((option) => option.group === group)
                  .map((option) => (
                    <label key={option.value} className="dropdown-item px-3 d-flex flex-wrap secondary-500 caption-14 ">
                      <input className="form-check-input me-1" type="checkbox" name={option.value} onChange={(): void => handleCheck(option)} checked={!!value.find((item: Option) => item.value === option.value)} />
                      {option.label}
                    </label>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
