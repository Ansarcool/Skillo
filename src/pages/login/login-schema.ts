import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен'),
  password: yup.string().required('Пароль обязателен')
});

export type TLoginFormValues = yup.InferType<typeof loginSchema>;
