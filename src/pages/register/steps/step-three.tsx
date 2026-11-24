import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../../slices/profileSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import {
  stepThreeSchema,
  type TStepThreeFormValues
} from '../step-three-chema.ts';
import type { TRegisterFormValues } from '../schema.ts';
import { Select } from '../../../shared/ui/select/select.tsx';
import { MultiSelect } from '../../../shared/ui/multiselect';
import { Modal } from '../../../shared/ui/modal/modal.tsx';
import { SkillProposalPreview } from '../skill-propsal-preview';
import imageIcon from '../../../../public/icons/gallery-add.svg';
import styles from './step-three.module.css';
import { Button } from '../../../shared/ui/button';
import { getCategorySlugById } from '../../../shared/lib/category-labels.ts';
import { registerThunk } from '../../../slices/authSlice.ts';
import { uploadSkillImages, updateProfile } from '../../../api/api.ts';

type TStepTwoData = {
  name: string;
  avatar: string | null;
  birthDate: string;
  gender: 'any' | 'male' | 'female';
  city: string;
  wantsToLearn: any[];
};

type TStepThreeProps = {
  accountData: TRegisterFormValues | null;
  stepTwoData: TStepTwoData;
  onBack: () => void;
  onFinish: () => void;
};

type TImageItem = { file: File; preview: string };

const MAX_IMAGES = 6;

export const StepThree = ({
  accountData,
  stepTwoData,
  onBack,
  onFinish
}: TStepThreeProps) => {
  const skillCategories = useSelector(
    (state: RootState) => state.skills.skills
  );
  const [images, setImages] = useState<TImageItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid }
  } = useForm<TStepThreeFormValues>({
    resolver: yupResolver(stepThreeSchema),
    mode: 'onChange',
    defaultValues: {
      skillName: '',
      categoryId: '',
      subcategoryIds: [],
      description: ''
    }
  });

  const selectedCategoryId = watch('categoryId');
  const selectedSubcategoryIds = watch('subcategoryIds') ?? [];
  const skillName = watch('skillName');
  const description = watch('description');

  const selectedCategory = skillCategories.find(
    (cat) => String(cat.id) === selectedCategoryId
  );

  const selectedSubcategoryNames =
    selectedCategory?.skills
      .filter((skill) => selectedSubcategoryIds.includes(String(skill.id)))
      .map((skill) => skill.name)
      .join(', ') ?? '';

  const categoryOptions = skillCategories.map((cat) => ({
    value: String(cat.id),
    label: cat.category
  }));

  const subcategoryOptions =
    selectedCategory?.skills.map((skill) => ({
      value: String(skill.id),
      label: skill.name
    })) ?? [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = MAX_IMAGES - images.length;
    const newItems = Array.from(files)
      .slice(0, Math.max(availableSlots, 0))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));

    setImages((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = () => {
    setSubmitError(null);
    setIsPreviewOpen(true);
  };

  const handleEdit = () => {
    setIsPreviewOpen(false);
  };

  const buildCanTeach = (imageUrls: string[]) => {
    const formData = watch();
    const categorySlug = getCategorySlugById(Number(formData.categoryId));

    return formData.subcategoryIds.map((subId, index) => ({
      id: Date.now() + index,
      name: formData.skillName,
      category: categorySlug,
      subcategoryId: Number(subId),
      description: formData.description,
      images: imageUrls
    }));
  };

  const handleConfirm = async () => {
    if (!accountData || isSubmitting) return;

    setSubmitError(null);
    const formData = watch();
    setIsSubmitting(true);

    try {
      const authResult = await dispatch(
        registerThunk({
          email: accountData.email,
          password: accountData.password,
          name: stepTwoData.name,
          avatar: stepTwoData.avatar,
          birthDate: stepTwoData.birthDate,
          gender: stepTwoData.gender,
          city: stepTwoData.city,
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryIds[0] ?? '',
          canTeach: buildCanTeach([]),
          wantsToLearn: stepTwoData.wantsToLearn
        })
      );

      if (!registerThunk.fulfilled.match(authResult)) {
        const message = authResult.error?.message || 'Ошибка регистрации';
        console.error('Ошибка регистрации:', message);
        setSubmitError(message);
        setIsPreviewOpen(false);
        return;
      }

      let canTeach = buildCanTeach([]);

      if (images.length > 0) {
        const urls = await uploadSkillImages(images.map((i) => i.file));
        canTeach = buildCanTeach(urls);
        await updateProfile({ canTeach }, authResult.payload.token);
      }

      dispatch(
        setProfile({
          ...profile,
          cardId: authResult.payload.user.id ?? null,
          ...stepTwoData,
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryIds[0] ?? '',
          canTeach
        })
      );

      images.forEach((i) => URL.revokeObjectURL(i.preview));
      setIsPreviewOpen(false);
      onFinish();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка регистрации';
      console.error('Ошибка регистрации:', err);
      setSubmitError(message);
      setIsPreviewOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                options={categoryOptions}
                value={field.value}
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
                label='Подкатегории навыка'
                placeholder='Выберите подкатегории'
                options={subcategoryOptions}
                value={field.value ?? []}
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

        <label className={styles.field}>
          <span className='body'>Описание</span>
          <textarea
            placeholder='Коротко опишите, чему можете научить'
            {...register('description')}
            className={`body ${styles.textarea}`}
            rows={3}
          />
          {errors.description && (
            <p className={`caption ${styles.error}`}>
              {errors.description.message}
            </p>
          )}
        </label>

        {images.length > 0 && (
          <div className={styles.imageGrid}>
            {images.map((item, index) => (
              <div key={item.preview} className={styles.imageGridItem}>
                <img src={item.preview} alt='' />
                <button
                  type='button'
                  className={styles.imageRemoveButton}
                  onClick={() => handleRemoveImage(index)}
                  aria-label='Удалить изображение'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < MAX_IMAGES && (
          <label className={styles.imageUpload}>
            <span className='body'>
              Перетащите или выберите изображения навыка
            </span>
            <span className={`body ${styles.imageUploadLink}`}>
              <img src={imageIcon} alt='' />
              Выбрать изображения
            </span>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handleImageChange}
              hidden
            />
          </label>
        )}

        {submitError && (
          <p className={`caption ${styles.error}`}>{submitError}</p>
        )}

        <div className={styles.actions}>
          <Button
            className='body'
            htmlType='button'
            type='secondary'
            onClick={onBack}
          >
            Назад
          </Button>
          <Button
            className='body'
            htmlType='submit'
            type='primary'
            disabled={!isValid}
          >
            Продолжить
          </Button>
        </div>
      </form>

      {isPreviewOpen && (
        <Modal onClose={handleEdit}>
          <SkillProposalPreview
            category={selectedCategory?.category}
            subcategory={selectedSubcategoryNames}
            skillName={skillName}
            description={description}
            images={images.map((i) => i.preview)}
            onEdit={handleEdit}
            onDone={handleConfirm}
          />
        </Modal>
      )}
    </>
  );
};
