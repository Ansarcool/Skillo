import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../services/store.ts';
import { profileSchema, type TProfileFormValues } from './schema.ts';
import {
  updateProfileThunk,
  getProfileThunk,
  setProfile,
  type TProfileState
} from '../../slices/profileSlice.ts';

import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { SearchSelect } from '../../shared/ui/search-select/search-select.tsx';
import { Select } from '../../shared/ui/select/select.tsx';
import { DatePicker } from '../../shared/ui/date';

import emailIcon from '../../../public/icons/request.svg';
import heartIcon from '../../../public/icons/like.svg';
import ideaIcon from '../../../public/icons/idea.svg';
import userIcon from '../../../public/icons/user.svg';
import messageIcon from '../../../public/icons/message-text.svg';
import cameraIcon from '../../../public/icons/gallery-edit.svg';
import editIcon from '../../../public/icons/edit.svg';
import guestIcon from '../../../public/icons/nonAvatar.png';
import styles from './profile.module.css';

const CITIES = [
  { label: 'Лондон', value: 'Лондон' },
  { label: 'Хельсинки', value: 'Хельсинки' },
  { label: 'Будапешт', value: 'Будапешт' },
  { label: 'Таллин', value: 'Таллин' },
  { label: 'Роттердам', value: 'Роттердам' }
];

const GENDERS = [
  { label: 'Мужской', value: 'male' },
  { label: 'Женский', value: 'female' }
];

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile);
  const { isLoading, error } = useSelector((state: RootState) => state.profile);

  const authDbStr = localStorage.getItem('skillo_auth_mock_db');
  const authDb = authDbStr ? JSON.parse(authDbStr) : null;
  const userEmail = authDb?.user?.email ?? '';

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: userEmail,
      name: profile.name || '',
      birthDate: profile.birthDate || '',
      gender: profile.gender || 'any',
      city: profile.city || '',
      bio: ''
    }
  });

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (
      profile.name ||
      profile.city ||
      profile.birthDate ||
      profile.description
    ) {
      reset({
        email: userEmail,
        name: profile.name || '',
        birthDate: profile.birthDate || '',
        gender: profile.gender || '',
        city: profile.city || '',
        bio: profile.description || ''
      });
    }
  }, [profile.name, profile.city, profile.birthDate, profile.description]);

  const onSubmit = async (data: TProfileFormValues) => {
    console.log('onSubmit сработал', data);
    const { isLoading: isLoading, error: error, ...cleanProfile } = profile;

    const updatedData = {
      ...cleanProfile,
      ...data,
      description: data.bio,
      gender: data.gender as 'any' | 'male' | 'female'
    };

    const result = await dispatch(updateProfileThunk(updatedData));
    if (updateProfileThunk.fulfilled.match(result)) {
      console.log('Профиль успешно обновлен');
    } else {
      console.log('Профиль не обновился');
    }
  };

  const handleCardIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedProfile: TProfileState = {
      ...profile,
      cardId: value === '' ? null : Number(value)
    };
    dispatch(setProfile(updatedProfile));
  };

  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <aside className={styles.sidebar}>
          <nav className={styles.sideMenu}>
            <Link to='/requests' className={`body ${styles.sideItem}`}>
              <img src={emailIcon} alt='' /> Заявки
            </Link>
            <Link to='/exchanges' className={`body ${styles.sideItem}`}>
              <img src={messageIcon} alt='' /> Мои обмены
            </Link>
            <Link to='/favorites' className={`body ${styles.sideItem}`}>
              <img src={heartIcon} alt='' /> Избранное
            </Link>
            <Link to='/my-skills' className={`body ${styles.sideItem}`}>
              <img src={ideaIcon} alt='' /> Мои навыки
            </Link>
            <Link
              to='/profile'
              className={`body ${styles.sideItem} ${styles.sideItemActive}`}
            >
              <img src={userIcon} alt='' /> Личные данные
            </Link>
          </nav>
        </aside>

        <main className={styles.contentCard}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.leftSection}>
              <div className={styles.field}>
                <div className={styles.inputWithIcon}>
                  <Input
                    label='Почта'
                    type='email'
                    size={'medium'}
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <img src={editIcon} className={styles.fieldIcon} alt='' />
                </div>
                <Link
                  to='/change-password'
                  className={`body ${styles.passwordLink}`}
                >
                  Изменить пароль
                </Link>
              </div>

              <div className={styles.inputWithIcon}>
                <Input
                  label='Имя'
                  type='text'
                  {...register('name')}
                  error={errors.name?.message}
                />
                <img src={editIcon} className={styles.fieldIcon} alt='' />
              </div>

              <div className={styles.rowFields}>
                <Controller
                  name='birthDate'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата рождения'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select
                      label='Пол'
                      options={GENDERS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Выберите пол'
                    />
                  )}
                />
              </div>

              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    label='Город'
                    options={CITIES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Выберите город'
                  />
                )}
              />

              <div className={styles.field}>
                <label className='body'>О себе</label>
                <div className={styles.textareaWrapper}>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className={`body ${styles.textarea} ${errors.bio ? styles.inputError : ''}`}
                  />
                  <img src={editIcon} className={styles.textareaIcon} alt='' />
                </div>
                {errors.bio && (
                  <p className={`caption ${styles.error}`}>
                    {errors.bio?.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className='body'>
                  Тестовый ID карточки (для демо заявок)
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type='number'
                    value={profile.cardId ?? ''}
                    onChange={handleCardIdChange}
                    placeholder='Например, 1 - это Иван'
                    className={`body ${styles.input}`}
                  />
                </div>
                <p className='caption'>
                  Введи id мок-карточки, за которую "отвечает" этот аккаунт -
                  тогда заявки на неё появятся во Входящих.
                </p>
              </div>

              {error && <p className={`caption ${styles.error}`}>{error}</p>}
              <Button type='primary' htmlType='submit' className={'body'}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.avatarContainer}>
                <img
                  src={profile.avatar || guestIcon}
                  alt='Аватар'
                  className={styles.avatarImage}
                />
                <button className={styles.avatarEditButton}>
                  <img src={cameraIcon} alt='Изменить фото' />
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
