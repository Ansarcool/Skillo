import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../../../slices/authSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import { registerSchema, type TRegisterFormValues } from '../schema.ts';
import googleIcon from '../../../../public/icons/google.svg';
import appleIcon from '../../../../public/icons/apple.svg';
import eyeIcon from '../../../../public/icons/eye.svg';
import styles from '../register.module.css';
import { Button } from '../../../shared/ui/button';

type TStepOneProps = {
  onSuccess: () => void;
};

export const StepOne = ({ onSuccess }: TStepOneProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<TRegisterFormValues>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data: TRegisterFormValues) => {
    const result = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <button type='button' className={`body ${styles.oauthButton}`}>
        <img src={googleIcon} alt='' />
        Продолжить с Google
      </button>
      <button type='button' className={`body ${styles.oauthButton}`}>
        <img src={appleIcon} alt='' />
        Продолжить с Apple
      </button>

      <div className={styles.divider}>
        <span className='caption'>или</span>
      </div>

      <label className={styles.field}>
        <span className='body'>Email</span>
        <input
          type='email'
          placeholder='Введите email'
          {...register('email')}
          className={`body ${styles.input}`}
        />
        {errors.email && (
          <p className={`caption ${styles.error}`}>{errors.email.message}</p>
        )}
      </label>

      <label className={styles.field}>
        <span className='body'>Пароль</span>
        <div className={styles.passwordWrapper}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='Придумайте надёжный пароль'
            {...register('password')}
            className={`body ${styles.input}`}
          />
          <button
            type='button'
            className={styles.eyeButton}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label='Показать пароль'
          >
            <img src={eyeIcon} alt='' />
          </button>
        </div>
        {errors.password ? (
          <p className={`caption ${styles.error}`}>{errors.password.message}</p>
        ) : (
          <p className={`caption ${styles.hint}`}>
            Пароль должен содержать не менее 8 знаков
          </p>
        )}
      </label>

      {error && <p className={`caption ${styles.error}`}>{error}</p>}

      <Button
        type='primary'
        htmlType='submit'
        className='body'
        disabled={!isValid}
      >
        {loading ? 'Загрузка...' : 'Далее'}
      </Button>
    </form>
  );
};
