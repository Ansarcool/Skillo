import { type FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './select.module.css';
import type { TSelectProps } from './types.ts';
import arrowIcon from '../../../../public/icons/chevron-down.png';

export const Select: FC<TSelectProps> = ({
  label,
  placeholder = 'Выберите...',
  options,
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || disabled) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, disabled]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideWrapper = wrapperRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      if (!isInsideWrapper && !isInsideDropdown) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <span className={`body`}>{label}</span>

      <button
        type='button'
        ref={triggerRef}
        disabled={disabled}
        className={`body value button ${styles.trigger} ${isOpen ? styles.open : ''} ${
          disabled ? styles.disabled : ''
        }`}
        onClick={handleToggle}
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

      {isOpen &&
        !disabled &&
        createPortal(
          <ul
            ref={dropdownRef}
            className={styles.dropdown}
            style={{
              top: position.top,
              left: position.left,
              width: position.width
            }}
          >
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
          </ul>,
          document.body
        )}
    </div>
  );
};
