import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен'),
  password: yup
    .string()
    .min(8, 'Пароль должен содержать не менее 8 знаков')
    .required('Пароль обязателен')
});

export type TRegisterFormValues = yup.InferType<typeof registerSchema>;
