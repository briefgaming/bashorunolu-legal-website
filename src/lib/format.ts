const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Africa/Lagos',
});
const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos' });

export const formatDate = (date: Date | string) => dateFormat.format(new Date(date));
/** yyyy-mm-dd in Lagos time. */
export const lagosDay = (date: Date = new Date()) => dayFormat.format(date);
export const minutesFromChars = (chars: number) => Math.max(1, Math.round(chars / 1250));
export const minutesFromText = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 220));
