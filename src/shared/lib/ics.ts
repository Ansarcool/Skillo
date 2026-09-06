export type TIcsEventParams = {
  title: string;
  description: string;
  startDate: Date;
  durationMinutes?: number;
};

const formatIcsDate = (date: Date): string =>
  date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');

const escapeIcsText = (text: string): string =>
  text.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');

export const generateIcsContent = ({
  title,
  description,
  startDate,
  durationMinutes = 60
}: TIcsEventParams): string => {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();
  const uid = `${now.getTime()}-${Math.random().toString(36).slice(2)}@skillo`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skillo//Exchange//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return lines.join('\r\n');
};

export const downloadIcsFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
