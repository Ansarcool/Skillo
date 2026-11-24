import * as yup from 'yup';

export const MAX_TAGS = 5;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const skillFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Введите название')
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов'),
  description: yup
    .string()
    .trim()
    .required('Добавьте описание')
    .max(500, 'Максимум 500 символов'),
  type: yup
    .mixed<'teach' | 'learn'>()
    .oneOf(['teach', 'learn'], 'Выберите тип')
    .required('Выберите тип'),
  categoryId: yup.string().required('Выберите категорию'),
  image: yup
    .mixed<File>()
    .nullable()
    .defined()
    .test(
      'file-type',
      'Допустимы только JPEG и PNG',
      (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type)
    )
    .test(
      'file-size',
      'Файл не должен быть больше 2 МБ',
      (file) => !file || file.size <= MAX_IMAGE_SIZE
    ),
  tags: yup
    .array()
    .of(yup.string().required())
    .defined()
    .max(MAX_TAGS, `Не больше ${MAX_TAGS} тегов`)
});

export type TSkillFormValues = yup.InferType<typeof skillFormSchema>;
