import { type FC, useEffect, useRef, useState } from 'react';
import styles from './select.module.css';
import type { TSelectProps } from './types.ts';
import arrowIcon from '../../../../public/icons/chevron-down.png';

export const Select: FC<TSelectProps> = ({
  label,
  placeholder = 'Выберите...',
  options,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <span className={`body`}>{label}</span>

      <button
        type='button'
        className={`body value button ${styles.trigger} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? styles.value : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <img
          src={arrowIcon}
          alt='стрелка'
          className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ''}`}
        />
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`body ${styles.option} ${
                option.value === value ? styles.selected : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
