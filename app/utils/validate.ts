import { parse } from '@supabase/ssr';

const isProduction: boolean = process.env.NODE_ENV === 'production';

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
 * Returns `true` if give value is a valid Date object.
 */
export function isValidDate(value: unknown) {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * @returns The session cookie in JSON form
 */
export function parseAuthCookie(request: Request) {
  const cookies = parse(request.headers.get('Cookie') ?? '');
  try {
    return JSON.parse(cookies['sb-nxqeybdopyqtnmgtrmvf-auth-token']);
  } catch {
    return null;
  }
}

/**
 * Returns `value` type as a Date. If date isn't valid, then returns null instead of
 * "Invalid Date".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function retypeAsDate(value: any) {
  try {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Returns `value` type as a number. If number isn't valid, then returns null instead of NaN.
 */
export function retypeAsNum(value: unknown) {
  const num = Number(value);
  return !isNaN(num) ? num : null;
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

/**
 * Returns `value` unchanged if not falsy or explcitly `null`. If `value` is falsy but not
 * `null`, returns `alt` if given or `null`. If `value` is an object, then any property
 * that's falsy but not explcitly `null` gets set to `alt` if given or `null`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function retypeFalsyAsNull(value: any, alt: any = null) {
  if (typeof value === 'object' && value != null) {
    const keys = Object.keys(value);
    keys.forEach((key) => {
      if (!value[key]) value[key] = alt;
    });
    return value;
  } else {
    return value ? value : alt;
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