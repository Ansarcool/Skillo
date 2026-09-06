import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Select } from '../../select/select.tsx';
import { Button } from '../../button';
import type { TStepThreeFormValues } from '../../../../pages/register/step-three-chema.ts';
import styles from '../../../../pages/profile/profile.module.css';

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
          <Link to='/requests' className={styles.sideItem}>
            Заявки
          </Link>
          <Link to='/exchanges' className={styles.sideItem}>
            Мои обмены
          </Link>
          <Link to='/favorites' className={styles.sideItem}>
            Избранное
          </Link>
          <Link
            to='/my-skills'
            className={`${styles.sideItem} ${styles.sideItemActive}`}
          >
            Мои навыки
          </Link>
          <Link to='/profile' className={styles.sideItem}>
            Личные данные
          </Link>
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
              name='subcategoryId'
              render={({ field }) => (
                <Select
                  label='Подкатегория навыка'
                  placeholder='Выберите подкатегорию навыка'
                  value={field.value}
                  options={subcategoryOptions}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.subcategoryId && (
              <p className={`caption ${styles.error}`}>
                {errors.subcategoryId.message}
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
