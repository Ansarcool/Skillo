import * as yup from 'yup';

export const stepTwoSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Введите имя')
    .max(50, 'Количество символов не должно превышать 50'),
  birthDate: yup.string().required('Укажите дату рождения'),
  gender: yup
    .mixed<'any' | 'male' | 'female'>()
    .oneOf(['any', 'male', 'female'])
    .required('Укажите пол'),
  city: yup.string().required('Выберите город'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryIds: yup
    .array()
    .of(yup.string().required())
    .defined()
    .min(1, 'Выберите хотя бы одну подкатегорию')
});

export type TStepTwoFormValues = yup.InferType<typeof stepTwoSchema>;
