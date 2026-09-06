import type { FC } from 'react';
import styles from './radio.module.css';
import type { TRadioProps } from './types.ts';

export const Radio: FC<TRadioProps> = ({ label, name, checked, onChange }) => (
  <label className={`body ${styles.radio}`}>
    <input
      type='radio'
      name={name}
      checked={checked}
      onChange={onChange}
      className={styles.radioInput}
    />
    <span className={styles.radioCustom} />
    {label}
  </label>
);
