import type { FC } from 'react';
import editIcon from '../../../../public/icons/edit.svg';
import styles from './skill-propsal-preview.module.css';
import { Button } from '../../../shared/ui/button';

type TSkillProposalPreviewProps = {
  skillName: string;
  category?: string;
  subcategory?: string;
  description: string;
  images: string[];
  onEdit: () => void;
  onDone: () => void;
};

export const SkillProposalPreview: FC<TSkillProposalPreviewProps> = ({
  skillName,
  category,
  subcategory,
  description,
  images,
  onEdit,
  onDone
}) => {
  const [mainImage, ...restImages] = images;
  const visibleThumbs = restImages.slice(0, 3);
  const hiddenCount = images.length - 4;

  return (
    <div className={styles.preview}>
      <div className={styles.heading}>
        <h2 className='h3'>Ваше предложение</h2>
        <p className={`body ${styles.subtitle}`}>
          Пожалуйста, проверьте и подтвердите правильность данных
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.info}>
          <h3 className='h3'>{skillName}</h3>
          <p className={`caption ${styles.category}`}>
            {category}
            {subcategory ? ` / ${subcategory}` : ''}
          </p>
          <p className={`body ${styles.description}`}>{description}</p>

          <div className={styles.actions}>
            <Button
              type='secondary'
              className={`body ${styles.editButton}`}
              onClick={onEdit}
            >
              Редактировать
              <img src={editIcon} alt='' />
            </Button>
            <Button
              type='primary'
              className={`body ${styles.doneButton}`}
              onClick={onDone}
            >
              Готово
            </Button>
          </div>
        </div>

        {mainImage && (
          <div className={styles.images}>
            <div className={styles.mainImage}>
              <img src={mainImage} alt='' loading='lazy' />
            </div>

            {visibleThumbs.length > 0 && (
              <div className={styles.thumbs}>
                {visibleThumbs.map((src, index) => {
                  const isLastVisible = index === visibleThumbs.length - 1;

                  return (
                    <div key={index} className={styles.thumb}>
                      <img src={src} alt='' />
                      {isLastVisible && hiddenCount > 0 && (
                        <div className={styles.thumbMore}>+{hiddenCount}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
