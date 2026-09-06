import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProfile,
  type TProfileState
} from '../../../slices/profileSlice.ts';
import { getSkillsThunk } from '../../../slices/skillsSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import { stepTwoSchema, type TStepTwoFormValues } from '../step-two-schema.ts';
import { Select } from '../../../shared/ui/select/select.tsx';
import { SearchSelect } from '../../../shared/ui/search-select/search-select.tsx';
import { DatePicker } from '../../../shared/ui/date';
import styles from '../register.module.css';
import { Button } from '../../../shared/ui/button';
import { getCategorySlugById } from '../../../shared/lib/category-labels.ts';

type TStepTwoProps = {
  onBack: () => void;
  onNext: () => void;
};
export type TProfileStateTwo = Omit<
  TProfileState,
  'categoryId' | 'subcategoryId' | 'canTeach'
>;

const cities = ['Лондон', 'Хельсинки', 'Будапешт', 'Таллин', 'Роттердам'].map(
  (city) => ({ value: city, label: city })
);

const genderOptions = [
  { value: 'any', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' }
];

export const StepTwo = ({ onBack, onNext }: TStepTwoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const skillCategories = useSelector(
    (state: RootState) => state.skills.skills
  );
  const profile = useSelector((state: RootState) => state.profile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (skillCategories.length === 0) {
      dispatch(getSkillsThunk());
    }
  }, [skillCategories.length, dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid }
  } = useForm<TStepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      gender: 'any',
      city: '',
      categoryId: '',
      subcategoryId: ''
    }
  });

  const selectedCategoryId = watch('categoryId');
  const selectedCategory = skillCategories.find(
    (cat) => String(cat.id) === selectedCategoryId
  );

  const categoryOptions = skillCategories.map((cat) => ({
    value: String(cat.id),
    label: cat.category
  }));

  const subcategoryOptions =
    selectedCategory?.skills.map((skill) => ({
      value: String(skill.id),
      label: skill.name
    })) ?? [];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: TStepTwoFormValues) => {
    const selectedSubcategory = selectedCategory?.skills.find(
      (skill) => String(skill.id) === data.subcategoryId
    );

    dispatch(
      setProfile({
        ...profile,
        cardId: profile.cardId ?? null,
        name: data.name,
        avatar: avatarPreview,
        birthDate: data.birthDate,
        gender: data.gender,
        city: data.city,
        wantsToLearn: [
          {
            id: profile.wantsToLearn?.[0]?.id ?? Date.now(),
            category: getCategorySlugById(Number(data.categoryId)),
            subcategoryId: selectedSubcategory?.id,
            name: selectedSubcategory ? selectedSubcategory.name : '',
            description: ''
          }
        ]
      })
    );
    onNext();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.avatarUpload}>
        <div className={styles.avatar}>
          {avatarPreview ? (
            <img src={avatarPreview} alt='avatar' />
          ) : (
            <span className={styles.avatarPlaceholder}>👤</span>
          )}
          <span className={styles.avatarPlus}>+</span>
        </div>
        <input
          type='file'
          accept='image/*'
          onChange={handleAvatarChange}
          hidden
        />
      </label>

      <label className={styles.field}>
        <span className='body'>Имя</span>
        <input
          type='text'
          placeholder='Введите ваше имя'
          {...register('name')}
          className={`body ${styles.input}`}
        />
        {errors.name && (
          <p className={`caption ${styles.error}`}>{errors.name.message}</p>
        )}
      </label>

      <div className={styles.row}>
        <div className={styles.field}>
          <Controller
            control={control}
            name='birthDate'
            render={({ field }) => (
              <DatePicker
                label='Дата рождения'
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.birthDate && (
            <p className={`caption ${styles.error}`}>
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <Controller
            control={control}
            name='gender'
            render={({ field }) => (
              <Select
                label='Пол'
                placeholder='Не указан'
                value={field.value}
                options={genderOptions}
                onChange={field.onChange}
              />
            )}
          />
          {errors.gender && (
            <p className={`caption ${styles.error}`}>{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <Controller
          control={control}
          name='city'
          render={({ field }) => (
            <SearchSelect
              label='Город'
              placeholder='Не указан'
              value={field.value}
              options={cities}
              onChange={field.onChange}
            />
          )}
        />
        {errors.city && (
          <p className={`caption ${styles.error}`}>{errors.city.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <Controller
          control={control}
          name='categoryId'
          render={({ field }) => (
            <Select
              label='Категория навыка, которому хотите научиться'
              placeholder='Выберите категорию'
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
              label='Подкатегория навыка, которому хотите научиться'
              placeholder='Выберите подкатегорию'
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

      <div className={styles.actions}>
        <Button
          type='secondary'
          htmlType='button'
          className='body'
          onClick={onBack}
        >
          Назад
        </Button>
        <Button
          type='primary'
          htmlType='submit'
          className='body'
          disabled={!isValid}
        >
          Продолжить
        </Button>
      </div>
    </form>
  );
};
