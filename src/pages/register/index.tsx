import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StepOne } from './steps/step-one.tsx';
import { StepTwo } from './steps/step-two.tsx';
import { StepThree } from './steps/step-three.tsx';
import { RegistrationSuccessModal } from '../../shared/ui/registration-success-modal/registration-success-modal.tsx';
import logoIcon from '../../../public/icons/Logo.svg';
import bulbIcon from '../../../public/icons/light-bulb.svg';
import personIcon from '../../../public/icons/user-info.svg';
import easelIcon from '../../../public/icons/school-board.svg';
import styles from './register.module.css';
import crossIcon from '../../../public/icons/cross.svg';
import type { TRegisterFormValues } from './schema.ts';

const TOTAL_STEPS = 3;

type TStepTwoData = {
  name: string;
  avatar: string | null;
  birthDate: string;
  gender: 'any' | 'male' | 'female';
  city: string;
  wantsToLearn: {
    id: number;
    category: any;
    subcategoryId: any;
    name: any;
    description: string;
  }[];
};

const welcomeContent = {
  1: {
    icon: bulbIcon,
    title: 'Добро пожаловать в Skillo!',
    text: 'Присоединяйтесь к Skillo и обменивайтесь знаниями и навыками с другими людьми'
  },
  2: {
    icon: personIcon,
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена'
  },
  3: {
    icon: easelIcon,
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!'
  }
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [accountData, setAccountData] = useState<TRegisterFormValues | null>(
    null
  );
  const [stepTwoData, setStepTwoData] = useState<TStepTwoData | null>(null);

  const current = welcomeContent[step];

  const handleStepOneSuccess = (data: TRegisterFormValues) => {
    setAccountData(data);
    setStep(2);
  };

  const handleStepTwoNext = (data: TStepTwoData) => {
    setStepTwoData(data);
    setStep(3);
  };

  const handleFinish = () => {
    setIsSuccessModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/profile');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to='/' className={styles.logoLink}>
            <img src={logoIcon} alt='Skillo' className={styles.logo} />
          </Link>
          <Link to='/' className={`body ${styles.closeButton}`}>
            Закрыть
            <img src={crossIcon} alt='' />
          </Link>
        </div>
      </header>

      <div className={styles.stepsIndicator}>
        <h2>
          Шаг {step} из {TOTAL_STEPS}
        </h2>
        <div className={styles.stepsBar}>
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <div
              key={index}
              className={`${styles.step} ${index < step ? styles.stepActive : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={`${styles.card} ${styles[`cardStep${step}`]}`}>
          {step === 1 && <StepOne onSuccess={handleStepOneSuccess} />}

          {step === 2 && (
            <StepTwo onBack={() => setStep(1)} onNext={handleStepTwoNext} />
          )}

          {step === 3 && stepTwoData && (
            <StepThree
              stepTwoData={stepTwoData}
              accountData={accountData}
              onBack={() => setStep(2)}
              onFinish={handleFinish}
            />
          )}
        </div>

        <div className={styles.welcomeCard}>
          <img src={current.icon} alt='' className={styles.welcomeIcon} />
          <div className={styles.welcome}>
            <h2 className='h2'>{current.title}</h2>
            <p className={`body ${styles.subTitle}`}>{current.text}</p>
          </div>
        </div>
      </div>

      {isSuccessModalOpen && (
        <RegistrationSuccessModal onClose={handleSuccessModalClose} />
      )}
    </div>
  );
};
