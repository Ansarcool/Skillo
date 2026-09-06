import type { FC, ChangeEvent, MouseEvent } from 'react';
import styles from './search-input.module.css';
import searchIcon from '../../../../public/icons/search.png';
import clearIcon from '../../../../public/icons/cross.svg';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Искать навык'
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  const handleClear = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <img src={searchIcon} alt='лупа' className={styles.searchIcon} />
        <input
          type='text'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`body ${styles.searchInput}`}
        />
        {value.length > 0 && (
          <img
            src={clearIcon}
            alt='очистить'
            className={styles.clearIcon}
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};
