import * as yup from 'yup';

export const stepTwoSchema = yup.object({
  name: yup.string().required('Введите имя'),
  birthDate: yup.string().required('Укажите дату рождения'),
  gender: yup
    .mixed<'any' | 'male' | 'female'>()
    .oneOf(['any', 'male', 'female'])
    .required('Укажите пол'),
  city: yup.string().required('Выберите город'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию')
});

export type TStepTwoFormValues = yup.InferType<typeof stepTwoSchema>;
