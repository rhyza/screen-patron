const isProduction: boolean = process.env.NODE_ENV === 'production';

type DateOptions = {
  date: Date;
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

function getDateString({
  date,
  includeWeekDay = true,
  includeDate = true,
  includeYear = true,
  omitSameYear,
  fullWeekDay,
  fullMonth,
  fullYear = true,
} : DateOptions) {
  const today = new Date(Date.now());
  includeYear = includeYear && !(omitSameYear && date.getFullYear() === today.getFullYear());

  const options = {
    weekday: !includeWeekDay ? undefined : fullWeekDay ? 'long' : 'short',
    month: fullMonth ? 'long' : 'short',
    day: includeDate ? 'numeric' : undefined,
    year: !includeYear ? undefined : fullYear ? 'numeric' : '2-digit',
  } as const;

  return date.toLocaleDateString('en-US', options);
}

function getTimeString({date, timeZone, includeTimeZone}: DateOptions) {
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
 * @param condition Condition to evaluate as either truthy or falsy.
 * @param message Error message to show -- can provide a string, or a function
 * that returns a string for cases where the message takes a fair amount of
 * effort to compute.
 */
function invariant(
  condition: any,
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
 * Checks if file exists and is less than a certain file size.
 * @param event file input event
 * @param fileLimit file size limit in MB
 */
function validateFile(event: React.ChangeEvent<HTMLInputElement>, fileLimit: number) {
  const files = event.target.files || [];
  if (files.length === 0 || files[0].size > fileLimit * 1000000) {
    event.target.value = '';
    return false;
  }
  return true;
}

export { getDateString, getTimeString, invariant, validateFile };