import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, getProfileThunk } from '../../slices/profileSlice.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import {
  stepThreeSchema,
  type TStepThreeFormValues
} from '../register/step-three-chema.ts';
import { MySkillsPageUI } from '../../shared/ui/silly-components/my-skill-page/my-skill-page-ui.tsx';
import { useEffect } from 'react';
import { getSkillsThunk } from '../../slices/skillsSlice.ts';
import {
  getCategoryIdBySlug,
  getCategorySlugById
} from '../../shared/lib/category-labels.ts';

export const MySkillsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile);
  const skillCategories = useSelector(
    (state: RootState) => state.skills.skills
  );

  useEffect(() => {
    if (skillCategories.length === 0) {
      dispatch(getSkillsThunk());
    }
  }, [skillCategories.length, dispatch]);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  const existingSkill = profile.canTeach?.[0];
  const legacyCategoryId = (existingSkill as any)?.categoryId;
  const existingCategoryId = existingSkill?.category
    ? getCategoryIdBySlug(existingSkill.category)
    : (legacyCategoryId ?? null);
  const existingSubcategoryId = existingSkill?.subcategoryId ?? null;

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<TStepThreeFormValues>({
    resolver: yupResolver(stepThreeSchema),
    mode: 'onChange',
    defaultValues: {
      skillName: existingSkill?.name ?? '',
      categoryId: existingCategoryId ? String(existingCategoryId) : '',
      subcategoryId: existingSubcategoryId ? String(existingSubcategoryId) : '',
      description: existingSkill?.description ?? ''
    }
  });

  useEffect(() => {
    if (existingSkill) {
      reset({
        skillName: existingSkill.name ?? '',
        categoryId: existingCategoryId ? String(existingCategoryId) : '',
        subcategoryId: existingSubcategoryId
          ? String(existingSubcategoryId)
          : '',
        description: existingSkill.description ?? ''
      });
    }
  }, [
    existingSkill?.name,
    existingSkill?.category,
    existingSkill?.subcategoryId,
    legacyCategoryId,
    existingSkill?.description
  ]);

  const selectedCategoryId = watch('categoryId');
  const selectedSubcategoryId = watch('subcategoryId');

  const selectedCategory = skillCategories.find(
    (cat) => String(cat.id) === selectedCategoryId
  );

  const selectedSubcategory = selectedCategory?.skills.find(
    (skill: { id: number; name: string }) =>
      String(skill.id) === selectedSubcategoryId
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

  const onSubmit = (data: TStepThreeFormValues) => {
    dispatch(
      setProfile({
        ...profile,
        canTeach: [
          {
            id: existingSkill?.id ?? Date.now(),
            name: data.skillName,
            category: getCategorySlugById(Number(data.categoryId)),
            subcategoryId: data.subcategoryId
              ? Number(data.subcategoryId)
              : undefined,
            description: data.description,
            images: existingSkill?.images ?? []
          }
        ]
      })
    );
  };

  return (
    <MySkillsPageUI
      register={register}
      control={control}
      errors={errors}
      isValid={isValid}
      isDirty={isDirty}
      categoryOptions={categoryOptions}
      subcategoryOptions={subcategoryOptions}
      selectedCategoryLabel={selectedCategory?.category}
      selectedSubcategoryLabel={selectedSubcategory?.name}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
