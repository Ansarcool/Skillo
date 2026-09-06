import { Link } from 'react-router-dom';
import type { FC, ReactNode, MouseEvent } from 'react';
import styles from './button.module.css';

type TButtonProps = {
  type: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  htmlType?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  to?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
};

export const Button: FC<TButtonProps> = ({
  type,
  size = 'medium',
  htmlType = 'button',
  children,
  to,
  className,
  disabled = false,
  onClick
}) => {
  const combinedClassName = `${styles.button} ${styles[size]} ${styles[type]} ${className || ''}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={htmlType}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
