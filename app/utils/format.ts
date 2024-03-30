type DateOptions = {
  date: Date | null;
  timeZone?: string;
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
 * or if a null value is passed, an empty string. If a string is passed, then it is assume
 * it is in ISO format and just needs the time zone removed.
 * @param date The date as a Date object or an ISO string
 * @returns Date string in the format 'YYYY-MM-DDT00:00'
 */
export function getDateInputString(date: Date | string | null): string {
  if (date === null) {
    return '';
  } else if (typeof date === 'string') {
    return date.substring(0, 16);
  } else {
    const isoString = date.toISOString();
    return isoString.substring(0, 16);
  }
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
}: DateOptions) {
  if (!date) return '';

  const today = new Date(Date.now());
  includeYear = includeYear && !(omitSameYear && date.getFullYear() === today.getFullYear());

  const options = {
    weekday: includeWeekDay ? (fullWeekDay ? 'long' : 'short') : undefined,
    month: fullMonth ? 'long' : 'short',
    day: includeDate ? 'numeric' : undefined,
    year: includeYear ? (fullYear ? 'numeric' : '2-digit') : undefined,
  } as const;

  return date.toLocaleDateString('en-US', options);
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
    timeZone: timeZone || undefined,
    timeZoneName: includeTimeZone ? 'short' : undefined,
  } as const;

  return date.toLocaleTimeString('en-US', options);
}
