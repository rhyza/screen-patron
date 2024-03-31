type DateOptions = {
  date: Date | null;
  timeZone?: string;
  timeZoneName?: string;
  includeTimeZone?: boolean;
  includeWeekDay?: boolean;
  includeDate?: boolean;
  includeYear?: boolean;
  omitSameYear?: boolean;
  fullWeekDay?: boolean;
  fullMonth?: boolean;
  fullYear?: boolean;
};

/**
 * Takes a date representation and returns a string in the format 'YYYY-MM-DDT00:00'
 * or if a null value is passed, an empty string.
 * @param date The date as a Date object, a date string, or a number representing the date
 * in miliseconds
 * @param timeZone The timezone to convert the date into
 * @returns Date string in the format 'YYYY-MM-DDT00:00'
 */
export function getDateInputString(value: Date | string | number | null, timeZone?: string) {
  if (value === null) return '';

  const date = new Date(value);
  const dateString = new Intl.DateTimeFormat('en-CA', {
    timeZone,
  }).format(date);
  const timeString = new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone,
  }).format(date);

  return dateString + 'T' + timeString;
}

/**
 * Takes a Date object, `date` (**required**), and formats it into a String based off of
 * additional specifications (**optional**).
 *
 * Default string format
 * > Mon, Jan 1, 2024
 *
 * Call format
 * > `getDateString({ date: date, [optionName]: [boolean], ... })`
 * @returns A formatted date string
 */
export function getDateString({
  date,
  includeWeekDay = true,
  includeDate = true,
  includeYear = true,
  omitSameYear = false,
  fullWeekDay = false,
  fullMonth = false,
  fullYear = true,
  timeZone,
}: DateOptions) {
  if (!date) return '';

  const today = new Date(Date.now());
  includeYear = includeYear && !(omitSameYear && date.getFullYear() === today.getFullYear());

  const options = {
    weekday: includeWeekDay ? (fullWeekDay ? 'long' : 'short') : undefined,
    month: fullMonth ? 'long' : 'short',
    day: includeDate ? 'numeric' : undefined,
    year: includeYear ? (fullYear ? 'numeric' : '2-digit') : undefined,
    timeZone,
  } as const;

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Takes a Date object, `date` (**required**), and formats it into a String based off of
 * additional specifications (**optional**).
 *
 * Default string format
 * > Mon, Jan 1, 2024
 *
 * Call format
 * > `getTimeString({ date: date, [timeZone]: [string], [includeTimeZone]: [boolean] })`
 * @returns A formatted time string
 */
export function getTimeString({ date, timeZone, includeTimeZone }: DateOptions) {
  if (!date) return '';

  const options = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: includeTimeZone ? 'short' : undefined,
  } as const;

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
