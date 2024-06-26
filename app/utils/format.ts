type DateOptions = {
  date: Date | null;
  timeZone?: string | null;
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
 * Calculates the GMT timezone offset based eother on the given timezone or the current
 * timezone of the user and appends it to the given date string.
 * @param date A date as a string representation
 * @param timeZone The timezone to calculate the offset of
 * @returns Date string in the format `"${date}±HH:MM"`
 */
export function addTimeZone(date: string, timeZone?: string) {
  const gmt = new Intl.DateTimeFormat('en-GB', {
    timeZoneName: 'longOffset',
    timeZone,
  }).format();
  return date + gmt.slice(-6);
}

/**
 * Takes a date representation and returns a string in the format 'YYYY-MM-DDTHH:MM'
 * or if a null value is passed, an empty string. This is the format accepted by html
 * "datetime-local" inputs.
 * @param date The date as a Date object, a date string, or a number representing the date
 * in miliseconds
 * @param timeZone The timezone to convert the date into
 * @returns Date string in the format 'YYYY-MM-DDT00:00'
 */
export function getDateInputString(
  value: Date | string | number | null,
  timeZone?: string,
  dateOnly?: boolean,
) {
  if (value === null) return '';

  const date = new Date(value);
  const dateString = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone,
  }).format(date);
  const dateParts = dateString.split(', ');

  return dateOnly ? dateParts[0] : dateParts[0] + 'T' + dateParts[1];
}

/**
 * Returns a date string for filtering by dates. The date given is set to either midnight
 * (00:00) or a minute before midnight (23:59) and then converted to UTC.
 * @param date The date as a Date object, a date string, or a number representing the date
 * in miliseconds
 * @param timeZone (optional) The timezone to convert the date into, defaults to user's
 * system default
 * @param atMidnight (optional) Sets the time to 00:00 if `true`, otherwise 23:59.
 * @returns Date string in the format 'YYYY-MM-DDT00:00±HH:MM' or if a null value is passed,
 * an empty string.
 */
export function getDateSearchString(
  value: Date | string | number | null,
  timeZone?: string,
  atMidnight: boolean = true,
) {
  if (!value) return '';

  let string = getDateInputString(value, timeZone, true);
  string += atMidnight ? 'T00:00' : 'T23:59';
  return addTimeZone(string, timeZone);
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
  if (timeZone === null) timeZone = undefined;

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
  if (timeZone === null) timeZone = undefined;

  const options = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: includeTimeZone ? 'short' : undefined,
  } as const;

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * @param days The number of days into the future with 0 being today
 * @returns A Date object for a given number of days in the future
 */
export function getFutureDate(days: number) {
  return new Date(Date.now() + 3600 * 1000 * 24 * days);
}

/**
 * @returns The user's system's default time zone, e.g. "America/New_York"
 */
export function getLocalTimeZone() {
  const intl = new Intl.DateTimeFormat();
  const options = intl.resolvedOptions();

  return options.timeZone;
}

/**
 * @returns An array of time zones, e.g. ["America/New_York", ... ]
 */
export function getTimeZones() {
  return Intl.supportedValuesOf('timeZone');
}
