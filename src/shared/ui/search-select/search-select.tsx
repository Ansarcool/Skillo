import { type FC, useEffect, useRef, useState } from 'react';
import styles from './search-select.module.css';
import type { TSelectProps } from '../select/types.ts';
import arrowIcon from '../../../../public/icons/chevron-down.png';

export const SearchSelect: FC<TSelectProps> = ({
  label,
  placeholder = 'Выберите...',
  options,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.wrapper} ref={ref}>
      <span className={`body`}>{label}</span>

      <div
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <input
            type='text'
            className={`body ${styles.input}`}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        ) : (
          <span
            className={`body ${selectedOption ? styles.value : styles.placeholder}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}

        <img
          src={arrowIcon}
          alt='стрелка'
          className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ''}`}
        />
      </div>

      {isOpen && (
        <ul className={styles.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className={`body ${styles.option} ${
                  option.value === value ? styles.selected : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={`body ${styles.noResults}`}>Ничего не найдено</li>
          )}
        </ul>
      )}
    </div>
  );
};
