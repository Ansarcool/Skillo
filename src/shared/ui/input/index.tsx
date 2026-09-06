import React, { type FC, type ChangeEvent, type SyntheticEvent } from 'react';
import clsx from 'clsx';
import styles from './input.module.css';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onChange'
> & {
  label?: string;
  value?: string;
  size?: 'small' | 'medium' | 'large';
  error?: string;
  extraClass?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: SyntheticEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
};

const sizeClasses = {
  small: styles.inputSizeSmall,
  medium: styles.inputSizeMedium,
  large: styles.inputSizeLarge
};

export const Input: FC<InputProps> = ({
  label,
  value,
  size = 'medium',
  error,
  extraClass = '',
  id,
  disabled,
  onChange,
  onFocus,
  onBlur,
  className = '',
  ...rest
}) => {
  const inputClassName = clsx(
    styles.input,
    sizeClasses[size],
    {
      [styles.inputStateError]: Boolean(error)
    },
    extraClass,
    className
  );

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={id} className={`body ${styles.inputLabel}`}>
          {label}
        </label>
      )}

      <input
        id={id}
        disabled={disabled}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={inputClassName}
        value={value}
        {...rest}
      />

      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
};
