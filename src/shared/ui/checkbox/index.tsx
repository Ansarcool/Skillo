import { type FC, useEffect, useRef } from 'react';
import styles from './checkbox.module.css';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
};

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  indeterminate,
  onChange
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`body ${styles.checkbox}`}>
      <input
        ref={ref}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxCustom} />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
};
