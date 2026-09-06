import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginThunk } from '../../slices/authSlice.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import { loginSchema, type TLoginFormValues } from './login-schema.ts';
import logoIcon from '../../../public/icons/Logo.png';
import bulbIcon from '../../../public/icons/light-bulb.svg';
import googleIcon from '../../../public/icons/google.svg';
import appleIcon from '../../../public/icons/apple.svg';
import eyeIcon from '../../../public/icons/eye.svg';
import styles from '../register/register.module.css';
import { Button } from '../../shared/ui/button';
import closeIcon from '../../../public/icons/cross.svg';

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<TLoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: TLoginFormValues) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to='/' className={styles.logoLink}>
          <img src={logoIcon} alt='Skillo' className={styles.logo} />
        </Link>
        <Link to='/' className={`body ${styles.closeButton}`}>
          Закрыть <img src={closeIcon} alt='' />
        </Link>
      </header>

      <div className={styles.stepsIndicator}>
        <span className='h3'>Вход</span>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
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
                className={`body ${styles.input} ${
                  errors.email || error ? styles.inputError : ''
                }`}
              />
              {errors.email && (
                <p className={`caption ${styles.error}`}>
                  {errors.email.message}
                </p>
              )}
            </label>

            <label className={styles.field}>
              <span className='body'>Пароль</span>
              <div className={styles.passwordWrapper}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder='Введите ваш пароль'
                  {...register('password')}
                  className={`body ${styles.input} ${
                    errors.password || error ? styles.inputError : ''
                  }`}
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
              {errors.password && (
                <p className={`caption ${styles.error}`}>
                  {errors.password.message}
                </p>
              )}
            </label>

            {error && <p className={`caption ${styles.error}`}>{error}</p>}

            <Button
              type='primary'
              htmlType={'submit'}
              className={`body`}
              disabled={!isValid}
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </Button>

            <Link to='/register' className={`body ${styles.registerLink}`}>
              Зарегистрироваться
            </Link>
          </form>
        </div>

        <div className={styles.card}>
          <div className={styles.welcome}>
            <img src={bulbIcon} alt='' className={styles.welcomeIcon} />
            <h2 className='h2'>С возвращением в Skillo!</h2>
            <p className='body'>
              Обменивайтесь знаниями и навыками с другими людьми
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
