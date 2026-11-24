import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileThunk,
  updateProfileThunk
} from '../../slices/profileSlice.ts';
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

  const canTeach = profile.canTeach ?? [];
  const existingSkill = canTeach[0];

  const groupSkills = existingSkill
    ? canTeach.filter(
        (skill) =>
          skill.name === existingSkill.name &&
          skill.category === existingSkill.category
      )
    : [];

  const legacyCategoryId = (existingSkill as any)?.categoryId;
  const existingCategoryId = existingSkill?.category
    ? getCategoryIdBySlug(existingSkill.category)
    : (legacyCategoryId ?? null);
  const existingSubcategoryIds = groupSkills
    .map((skill) => skill.subcategoryId)
    .filter((id): id is number => id !== undefined && id !== null)
    .map(String);
  const existingSubcategoryKey = existingSubcategoryIds.join(',');

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<TStepThreeFormValues>({
    resolver: yupResolver(stepThreeSchema),
    mode: 'onChange',
    defaultValues: {
      skillName: existingSkill?.name ?? '',
      categoryId: existingCategoryId ? String(existingCategoryId) : '',
      subcategoryIds: existingSubcategoryIds,
      description: existingSkill?.description ?? ''
    }
  });

  useEffect(() => {
    if (existingSkill) {
      reset({
        skillName: existingSkill.name ?? '',
        categoryId: existingCategoryId ? String(existingCategoryId) : '',
        subcategoryIds: existingSubcategoryIds,
        description: existingSkill.description ?? ''
      });
    }
  }, [
    existingSkill?.name,
    existingSkill?.category,
    existingSubcategoryKey,
    legacyCategoryId,
    existingSkill?.description
  ]);

  const selectedCategoryId = watch('categoryId');
  const selectedSubcategoryIds = watch('subcategoryIds') ?? [];
  const selectedSubcategoryKey = selectedSubcategoryIds.join(',');

  const selectedCategory = skillCategories.find(
    (cat) => String(cat.id) === selectedCategoryId
  );

  useEffect(() => {
    if (!selectedCategory) return;

    const valid = selectedSubcategoryIds.filter((id) =>
      selectedCategory.skills.some(
        (skill: { id: number }) => String(skill.id) === id
      )
    );

    if (valid.length !== selectedSubcategoryIds.length) {
      setValue('subcategoryIds', valid, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [selectedCategory, selectedSubcategoryKey]);

  const selectedSubcategoryLabels =
    selectedCategory?.skills
      .filter((skill: { id: number }) =>
        selectedSubcategoryIds.includes(String(skill.id))
      )
      .map((skill: { name: string }) => skill.name)
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

  const onSubmit = (data: TStepThreeFormValues) => {
    const categorySlug = getCategorySlugById(Number(data.categoryId));
    const groupIds = new Set(groupSkills.map((skill) => skill.id));
    const otherSkills = canTeach.filter((skill) => !groupIds.has(skill.id));
    const images = existingSkill?.images ?? [];

    const updatedGroup = data.subcategoryIds.map((subId, index) => ({
      id: groupSkills[index]?.id ?? Date.now() + index,
      name: data.skillName,
      category: categorySlug,
      subcategoryId: Number(subId),
      description: data.description,
      images
    }));

    dispatch(
      updateProfileThunk({ canTeach: [...updatedGroup, ...otherSkills] })
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
      selectedSubcategoryLabel={selectedSubcategoryLabels}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
