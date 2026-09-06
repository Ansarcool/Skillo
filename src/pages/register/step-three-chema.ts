import * as yup from 'yup';

export const stepThreeSchema = yup.object({
  skillName: yup.string().required('Введите название навыка'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию'),
  description: yup.string().required('Добавьте описание')
});

export type TStepThreeFormValues = yup.InferType<typeof stepThreeSchema>;
