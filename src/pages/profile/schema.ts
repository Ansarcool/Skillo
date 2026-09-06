import * as yup from 'yup';

export const profileSchema = yup.object({
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  name: yup.string().required('Имя обязательно'),
  birthDate: yup.string().required('Дата рождения обязательна'),
  gender: yup.string().required('Выберите пол'),
  city: yup.string().required('Выберите город'),
  bio: yup.string().optional()
});

export type TProfileFormValues = yup.InferType<typeof profileSchema>;
