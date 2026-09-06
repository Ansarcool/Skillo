import { type FC, useState } from 'react';
import { Checkbox } from '../checkbox';
import styles from './category-accordion.module.css';

import { useDispatch, useSelector } from 'react-redux';
import {
  toggleCategoryGroup,
  toggleSubcategory
} from '../../../slices/filterSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';

export type Subcategory = {
  id: string;
  label: string;
};

export type CategoryAccordionProps = {
  title: string;
  subcategories: Subcategory[];
};

export const CategoryAccordion: FC<CategoryAccordionProps> = ({
  title,
  subcategories
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const selectedSubcategoryIds = useSelector(
    (state: RootState) => state.filter.selectedSubcategoryIds
  );
  const allSubIds = subcategories.map((sub) => sub.id);
  const selectedCount = subcategories.filter((sub) =>
    selectedSubcategoryIds.includes(sub.id)
  ).length;
  const isAllSelected =
    selectedCount === subcategories.length && subcategories.length > 0;
  const isIndeterminate =
    selectedCount > 0 && selectedCount < subcategories.length;
  const handleParentToggle = () => {
    dispatch(
      toggleCategoryGroup({
        subcategoryIds: allSubIds,
        selectAll: !(isAllSelected || isIndeterminate)
      })
    );
  };
  const handleSubToggle = (subId: string) => {
    dispatch(toggleSubcategory(subId));
  };

  return (
    <div className={styles.accordion}>
      <div className={styles.header}>
        <div className={styles.header_left}>
          <Checkbox
            label={title}
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleParentToggle}
          />
        </div>

        <button
          type='button'
          className={`${styles.toggle_btn} ${isOpen ? styles.expanded : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Свернуть/Развернуть'
        />
      </div>

      {isOpen && (
        <div className={styles.subcategories_list}>
          {subcategories.map((sub) => (
            <Checkbox
              key={sub.id}
              label={sub.label}
              checked={selectedSubcategoryIds.includes(sub.id)}
              onChange={() => handleSubToggle(sub.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
