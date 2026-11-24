import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { getSkillsThunk } from '../../../slices/skillsSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import { stepTwoSchema, type TStepTwoFormValues } from '../step-two-schema.ts';
import { Select } from '../../../shared/ui/select/select.tsx';
import { MultiSelect } from '../../../shared/ui/multiselect';
import { SearchSelect } from '../../../shared/ui/search-select/search-select.tsx';
import { DatePicker } from '../../../shared/ui/date';
import styles from './step-two.module.css';
import { Button } from '../../../shared/ui/button';
import { getCategorySlugById } from '../../../shared/lib/category-labels.ts';
import guestIcon from '../../../../public/icons/nonAvatar.png';

type TStepTwoProps = {
  onBack: () => void;
  onNext: (stepTwoData: {
    name: string;
    avatar: string | null;
    birthDate: string;
    gender: 'any' | 'male' | 'female';
    city: string;
    wantsToLearn: {
      id: number;
      category:
        'business' | 'creative' | 'languages' | 'education' | 'home' | 'health';
      subcategoryId: any;
      name: any;
      description: string;
    }[];
  }) => void;
};

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(guestIcon);

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
    setValue,
    formState: { errors, isValid }
  } = useForm<TStepTwoFormValues>({
    resolver: yupResolver(stepTwoSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      birthDate: '',
      gender: 'any',
      city: '',
      categoryId: '',
      subcategoryIds: []
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
    const categorySlug = getCategorySlugById(Number(data.categoryId));

    const wantsToLearn = data.subcategoryIds.map((subId, index) => {
      const subcategory = selectedCategory?.skills.find(
        (skill) => String(skill.id) === subId
      );

      return {
        id: Date.now() + index,
        category: categorySlug,
        subcategoryId: subcategory?.id,
        name: subcategory ? subcategory.name : '',
        description: ''
      };
    });

    onNext({
      name: data.name,
      avatar: avatarPreview,
      birthDate: data.birthDate,
      gender: data.gender,
      city: data.city,
      wantsToLearn
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.avatarUpload}>
        <div className={styles.avatar}>
          {avatarPreview ? (
            <img src={avatarPreview} alt='avatar' />
          ) : (
            <span className={`body ${styles.avatarPlaceholder}`}>Аватар</span>
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
              onChange={(value) => {
                field.onChange(value);
                setValue('subcategoryIds', [], { shouldValidate: true });
              }}
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
              label='Подкатегории, которым хотите научиться'
              placeholder='Выберите подкатегории'
              value={field.value ?? []}
              options={subcategoryOptions}
              onChange={field.onChange}
              disabled={!selectedCategoryId}
            />
          )}
        />
        {errors.subcategoryIds && (
          <p className={`caption ${styles.error}`}>
            {errors.subcategoryIds.message}
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
