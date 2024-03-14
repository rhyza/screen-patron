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
function getDateString({
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
function getTimeString({ date, timeZone, includeTimeZone }: DateOptions) {
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
function invariant(condition: any, message?: string | (() => string)): asserts condition {
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
function isNotEmptyArray(value: any) {
  if (!Array.isArray(value)) {
    return true;
  } else if (value.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Borrowed from https://github.com/remix-run/blues-stack/blob/main/app/singleton.server.ts
const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  const g = global as unknown as { __singletons: Record<string, unknown> };
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name] as Value;
};

/**
 * Checks if file exists and is less than a certain file size.
 * @param event The file input event
 * @param fileLimit The file size limit in MB
 */
function validateFile(event: React.ChangeEvent<HTMLInputElement>, fileLimit: number) {
  const files = event.target.files || [];
  if (files.length === 0 || files[0].size > fileLimit * 1000000) {
    event.target.value = '';
    return false;
  }
  return true;
}

export { getDateString, getTimeString, invariant, isNotEmptyArray, singleton, validateFile };
