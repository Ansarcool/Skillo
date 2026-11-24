import * as yup from 'yup';

export const stepThreeSchema = yup.object({
  skillName: yup
    .string()
    .trim()
    .required('Введите название навыка')
    .max(50, 'Количество символов не должно превышать 50'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryIds: yup
    .array()
    .of(yup.string().required())
    .defined()
    .min(1, 'Выберите хотя бы одну подкатегорию'),
  description: yup
    .string()
    .trim()
    .required('Добавьте описание')
    .max(500, 'Количество символов не должно превышать 500')
});

export type TStepThreeFormValues = yup.InferType<typeof stepThreeSchema>;
