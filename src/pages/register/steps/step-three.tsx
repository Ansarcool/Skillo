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
import { Select } from '../../../shared/ui/select/select.tsx';
import { Modal } from '../../../shared/ui/modal/modal.tsx';
import { SkillProposalPreview } from '../skill-propsal-preview';
import imageIcon from '../../../../public/icons/gallery-add.svg';
import styles from '../register.module.css';
import { Button } from '../../../shared/ui/button';
import { getCategorySlugById } from '../../../shared/lib/category-labels.ts';

type TStepThreeProps = {
  onBack: () => void;
  onFinish: () => void;
};

export const StepThree = ({ onBack, onFinish }: TStepThreeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile);
  const skillCategories = useSelector(
    (state: RootState) => state.skills.skills
  );
  const [images, setImages] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid }
  } = useForm<TStepThreeFormValues>({
    resolver: yupResolver(stepThreeSchema),
    mode: 'onChange',
    defaultValues: {
      skillName: '',
      categoryId: '',
      subcategoryId: '',
      description: ''
    }
  });

  const selectedCategoryId = watch('categoryId');
  const selectedSubcategoryId = watch('subcategoryId');
  const skillName = watch('skillName');
  const description = watch('description');

  const selectedCategory = skillCategories.find(
    (cat) => String(cat.id) === selectedCategoryId
  );

  const selectedSubcategory = selectedCategory?.skills.find(
    (skill) => String(skill.id) === selectedSubcategoryId
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

  const MAX_IMAGES = 6;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImages((prev) => {
      const availableSlots = MAX_IMAGES - prev.length;
      if (availableSlots <= 0) return prev;

      const filesToAdd = Array.from(files).slice(0, availableSlots);

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages((current) =>
            current.length < MAX_IMAGES
              ? [...current, reader.result as string]
              : current
          );
        };
        reader.readAsDataURL(file);
      });

      return prev;
    });

    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: TStepThreeFormValues) => {
    dispatch(
      setProfile({
        ...profile,
        canTeach: [
          {
            id: Date.now(),
            name: data.skillName,
            category: getCategorySlugById(Number(data.categoryId)),
            subcategoryId: data.subcategoryId
              ? Number(data.subcategoryId)
              : undefined,
            description: data.description,
            images
          }
        ]
      })
    );
    setIsPreviewOpen(true);
  };

  const handleEdit = () => {
    setIsPreviewOpen(false);
  };

  const handleConfirm = () => {
    setIsPreviewOpen(false);
    onFinish();
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
            {images.map((src, index) => (
              <div key={index} className={styles.imageGridItem}>
                <img src={src} alt='' />
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

      {isPreviewOpen && (
        <Modal onClose={handleEdit}>
          <SkillProposalPreview
            skillName={skillName}
            category={selectedCategory?.category}
            subcategory={selectedSubcategory?.name}
            description={description}
            images={images}
            onEdit={handleEdit}
            onDone={handleConfirm}
          />
        </Modal>
      )}
    </>
  );
};
