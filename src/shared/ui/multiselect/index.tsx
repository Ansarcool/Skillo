import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import styles from './multiselect.module.css';
import type { TMultiSelectProps } from './types.ts';
import { Checkbox } from '../checkbox';
import arrowIcon from '../../../../public/icons/chevron-down.png';
import crossIcon from '../../../../public/icons/cross.svg';

export const MultiSelect: FC<TMultiSelectProps> = ({
  label,
  placeholder = 'Выберите...',
  options,
  value,
  onChange,
  disabled = false,
  maxVisibleTags = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const selectedOptions = value
    .map((v) => options.find((opt) => opt.value === v))
    .filter((opt): opt is NonNullable<typeof opt> => Boolean(opt));

  const visibleTags = selectedOptions.slice(0, maxVisibleTags);
  const hiddenCount = selectedOptions.length - visibleTags.length;

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
  }, [isOpen, disabled, value]);

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
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
    setIsOpen((prev) => !prev);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeTag = (e: MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <span className='body'>{label}</span>}

      <div
        ref={triggerRef}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`body ${styles.trigger} ${isOpen ? styles.open : ''} ${
          disabled ? styles.disabled : ''
        }`}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        <div className={styles.content}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            <>
              {visibleTags.map((option) => (
                <span key={option.value} className={styles.tag}>
                  {option.label}
                  {!disabled && (
                    <button
                      type='button'
                      className={styles.tagRemove}
                      aria-label={`Убрать ${option.label}`}
                      onClick={(e) => removeTag(e, option.value)}
                    >
                      <img
                        src={crossIcon}
                        alt=''
                        className={styles.tagRemoveIcon}
                      />
                    </button>
                  )}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className={styles.tagMore}>+{hiddenCount}</span>
              )}
            </>
          )}
        </div>
        <img
          src={arrowIcon}
          alt=''
          className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ''}`}
        />
      </div>

      {isOpen &&
        !disabled &&
        createPortal(
          <ul
            ref={dropdownRef}
            role='listbox'
            aria-multiselectable='true'
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
                role='option'
                aria-selected={value.includes(option.value)}
                className={styles.option}
              >
                <Checkbox
                  label={option.label}
                  checked={value.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className={styles.optionCheckbox}
                />
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};
