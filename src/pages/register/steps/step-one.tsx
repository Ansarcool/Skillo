import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import { registerSchema, type TRegisterFormValues } from '../schema.ts';
import googleIcon from '../../../../public/icons/google.svg';
import appleIcon from '../../../../public/icons/apple.svg';
import eyeIcon from '../../../../public/icons/eye.svg';
import eyeSlashIcon from '../../../../public/icons/eye-slash.svg';
import styles from './step-one.module.css';
import { Button } from '../../../shared/ui/button';
import { clearAuthError } from '../../../slices/authSlice.ts';
import { checkEmailExists } from '../../../api/api.ts';

type TStepOneProps = {
  onSuccess: (data: TRegisterFormValues) => void;
};

export const StepOne = ({ onSuccess }: TStepOneProps) => {
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<TRegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: TRegisterFormValues) => {
    setIsChecking(true);
    try {
      const exists = await checkEmailExists(data.email);
      if (exists) {
        setError('email', {
          type: 'manual',
          message: 'Пользователь с таким email уже зарегистрирован'
        });
        return;
      }
      onSuccess(data);
    } catch {
      onSuccess(data);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.oauthButtons}>
        <button type='button' className={`body ${styles.oauthButton}`}>
          <img src={googleIcon} alt='' />
          Продолжить с Google
        </button>
        <button type='button' className={`body ${styles.oauthButton}`}>
          <img src={appleIcon} alt='' />
          Продолжить с Apple
        </button>
      </div>
      <div className={styles.divider}>
        <span className='body'>или</span>
      </div>
      <div className={styles.fields}>
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
              <img src={isPasswordVisible ? eyeSlashIcon : eyeIcon} alt='' />
            </button>
          </div>
          {errors.password ? (
            <p className={`caption ${styles.error}`}>
              {errors.password.message}
            </p>
          ) : (
            <p className={`caption ${styles.hint}`}>
              Пароль должен содержать не менее 8 знаков
            </p>
          )}
        </label>
      </div>

      {error && <p className={`caption ${styles.error}`}>{error}</p>}

      <Button
        type='primary'
        htmlType='submit'
        className={`body ${styles.nextButton}`}
        disabled={!isValid || isChecking}
      >
        {loading || isChecking ? 'Загрузка...' : 'Далее'}
      </Button>
    </form>
  );
};
