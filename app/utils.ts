import { parse } from '@supabase/ssr';

const isProduction: boolean = process.env.NODE_ENV === 'production';

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
 * or if a null value is passed, an empty string.
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

/**
 * Throws an error if the condition fails.
 * @param condition The condition to evaluate as either truthy or falsy
 * @param message The Error message to show -- can provide a string, or a function
 * that returns a string for cases where the message takes a fair amount of
 * effort to compute
 */
// Borrowed from alexreardon's tiny-invariant.
export function invariant(
  condition: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  message?: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }
  // Condition not passed

  // In production we strip the message but still throw
  const prefix: string = 'Invariant failed';
  if (isProduction) {
    throw new Error(prefix);
  }

  // When not in production we allow the message to pass through
  const provided: string | undefined = typeof message === 'function' ? message() : message;

  // Options:
  // 1. message provided: `${prefix}: ${provided}`
  // 2. message not provided: prefix
  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
}

/**
 * Evaluates to `false` if a given value is both an Array and is empty,
 * otherwise returns `true`.
 */
export function isNotEmptyArray(value: unknown) {
  if (!Array.isArray(value)) {
    return true;
  } else if (value.length > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * @returns The session cookie in JSON form
 */
export function parseAuthCookie(request: Request) {
  const cookies = parse(request.headers.get('Cookie') ?? '');
  try {
    return JSON.parse(cookies["sb-nxqeybdopyqtnmgtrmvf-auth-token"]);
  } catch {
    return null;
  }
}

/**
 * Returns `value` unchanged if not `null`. If `value` is `null`, returns `alt` if given or
 * `undefined`. If `value` is an object, then any property that's `null` gets set to `alt`
 * if given or `undefined`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function retypeNull(value: any, alt?: any) {
  if (typeof value === 'object' && value != null) {
    const keys = Object.keys(value);
    keys.forEach((key) => {
      if (value[key] === null) value[key] = alt;
    });
    return value;
  } else {
    return value === null ? alt : value;
  }
}

// Borrowed from https://github.com/remix-run/blues-stack/blob/main/app/singleton.server.ts
export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  const g = global as unknown as { __singletons: Record<string, unknown> };
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name] as Value;
};

/**
 * Takes an object and if any property is falsy, remove that property altogether.
 * @param values The object to strip
 * @returns An object with no falsy values
 */
export function stripFalseValues(values: { [x: string]: unknown }) {
  const result: { [x: string]: unknown } = {};
  const keys = Object.keys(values);
  keys.forEach((key) => {
    if (values[key]) result[key] = values[key];
  });
  return result;
}

/**
 * Checks if file exists and is less than a certain file size.
 * @param event The file input event
 * @param fileLimit The file size limit in MB
 */
export function validateFile(event: React.ChangeEvent<HTMLInputElement>, fileLimit: number) {
  const files = event.target.files || [];
  if (files.length === 0 || files[0].size > fileLimit * 1000000) {
    event.target.value = '';
    return false;
  }
  return true;
}
