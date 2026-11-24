import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Select } from '../../select/select.tsx';
import { MultiSelect } from '../../multiselect';
import { Button } from '../../button';
import type { TStepThreeFormValues } from '../../../../pages/register/step-three-chema.ts';
import styles from './my-skill-page.module.css';
import emailIcon from '../../../../../public/icons/request.svg';
import messageIcon from '../../../../../public/icons/message-text.svg';
import heartIcon from '../../../../../public/icons/like.svg';
import ideaIcon from '../../../../../public/icons/idea.svg';
import userIcon from '../../../../../public/icons/user.svg';

type TOption = { value: string; label: string };

type TMySkillsPageUIProps = {
  register: UseFormRegister<TStepThreeFormValues>;
  control: Control<TStepThreeFormValues>;
  errors: FieldErrors<TStepThreeFormValues>;
  isValid: boolean;
  isDirty: boolean;
  categoryOptions: TOption[];
  subcategoryOptions: TOption[];
  selectedCategoryLabel?: string;
  selectedSubcategoryLabel?: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
};

export const MySkillsPageUI: FC<TMySkillsPageUIProps> = ({
  register,
  control,
  errors,
  isValid,
  isDirty,
  categoryOptions,
  subcategoryOptions,
  onSubmit
}) => (
  <div className={styles.page}>
    <div className={styles.mainContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.sideMenu}>
          <NavLink
            to='/requests'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={emailIcon} alt='' /> Заявки
          </NavLink>

          <NavLink
            to='/exchanges'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={messageIcon} alt='' /> Мои обмены
          </NavLink>

          <NavLink
            to='/favorites'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={heartIcon} alt='' /> Избранное
          </NavLink>

          <NavLink
            to='/my-skills'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={ideaIcon} alt='' /> Мои навыки
          </NavLink>

          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={userIcon} alt='' /> Личные данные
          </NavLink>
        </nav>
      </aside>

      <main className={styles.contentCard}>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className='body'>Название навыка</span>
            <input
              type='text'
              placeholder='Введите название вашего навыка'
              {...register('skillName')}
              className={`body ${styles.input}`}
            />
            {errors.skillName && (
              <p className={`caption ${styles.error}`}>
                {errors.skillName.message}
              </p>
            )}
          </label>

          <div className={styles.field}>
            <Controller
              control={control}
              name='categoryId'
              render={({ field }) => (
                <Select
                  label='Категория навыка'
                  placeholder='Выберите категорию навыка'
                  value={field.value}
                  options={categoryOptions}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.categoryId && (
              <p className={`caption ${styles.error}`}>
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <Controller
              control={control}
              name='subcategoryIds'
              render={({ field }) => (
                <MultiSelect
                  label='Подкатегории навыка'
                  placeholder='Выберите подкатегории'
                  value={field.value ?? []}
                  options={subcategoryOptions}
                  onChange={field.onChange}
                  disabled={subcategoryOptions.length === 0}
                />
              )}
            />
            {errors.subcategoryIds && (
              <p className={`caption ${styles.error}`}>
                {errors.subcategoryIds.message}
              </p>
            )}
          </div>

          <label className={styles.field}>
            <span className='body'>Описание</span>
            <textarea
              placeholder='Коротко опишите, чему можете научить'
              {...register('description')}
              className={`body ${styles.textarea}`}
              rows={4}
            />
            {errors.description && (
              <p className={`caption ${styles.error}`}>
                {errors.description.message}
              </p>
            )}
          </label>

          <Button
            type='primary'
            htmlType='submit'
            className='body'
            disabled={!isValid || !isDirty}
          >
            Сохранить изменения
          </Button>
        </form>
      </main>
    </div>
  </div>
);
