import { type FC, useEffect, useRef, useState } from 'react';
import styles from './date.module.css';
import type { TDatePickerProps } from './types.ts';
import calendarIcon from '../../../../public/icons/calendar.svg';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const parseDate = (value: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

const formatValue = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getStartWeekday = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

export const DatePicker: FC<TDatePickerProps> = ({
  label,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = parseDate(value);
  const today = new Date();

  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth()
  );
  const [tempSelected, setTempSelected] = useState<Date | null>(selectedDate);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startWeekday = getStartWeekday(viewYear, viewMonth);

  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const month = viewMonth === 0 ? 11 : viewMonth - 1;
    const year = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month, prevMonthDays - i)
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      isCurrentMonth: true,
      date: new Date(viewYear, viewMonth, day)
    });
  }

  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const month = viewMonth === 11 ? 0 : viewMonth + 1;
    const year = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month, day)
    });
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i);

  const handleOpen = () => {
    setTempSelected(selectedDate);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onChange(formatValue(tempSelected));
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <span className='body'>{label}</span>

      <button
        type='button'
        className={`body ${styles.trigger}`}
        onClick={handleOpen}
      >
        <span className={selectedDate ? styles.value : styles.placeholder}>
          {selectedDate ? formatDisplay(selectedDate) : 'дд.мм.гггг'}
        </span>
        <img
          src={calendarIcon}
          alt='календарь'
          className={styles.calendarIcon}
        />
      </button>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <select
              className={`body ${styles.monthSelect}`}
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className={`body ${styles.yearSelect}`}
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={`caption ${styles.weekday}`}>
                {day}
              </span>
            ))}
          </div>

          <div className={styles.days}>
            {cells.map((cell, index) => {
              const isSelected =
                tempSelected && isSameDay(cell.date, tempSelected);

              return (
                <button
                  key={index}
                  type='button'
                  className={`body ${styles.day} ${
                    !cell.isCurrentMonth ? styles.dayMuted : ''
                  } ${isSelected ? styles.daySelected : ''}`}
                  onClick={() => setTempSelected(cell.date)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className={styles.calendarActions}>
            <button
              type='button'
              className={`body ${styles.cancelButton}`}
              onClick={handleCancel}
            >
              Отменить
            </button>
            <button
              type='button'
              className={`body ${styles.confirmButton}`}
              onClick={handleConfirm}
            >
              Выбрать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
