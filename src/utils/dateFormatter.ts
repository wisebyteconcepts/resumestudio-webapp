import { DateValue, DatePrecision } from '../types/resume';

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1, '01': 1, '1': 1,
  feb: 2, february: 2, '02': 2, '2': 2,
  mar: 3, march: 3, '03': 3, '3': 3,
  apr: 4, april: 4, '04': 4, '4': 4,
  may: 5, '05': 5, '5': 5,
  jun: 6, june: 6, '06': 6, '6': 6,
  jul: 7, july: 7, '07': 7, '7': 7,
  aug: 8, august: 8, '08': 8, '8': 8,
  sep: 9, september: 9, '09': 9, '9': 9,
  oct: 10, october: 10, '10': 10,
  nov: 11, november: 11, '11': 11,
  dec: 12, december: 12, '12': 12,
};

/**
 * Normalises legacy string / month / year into a structured DateValue
 */
export function parseToDateValue(
  raw?: DateValue | string | null,
  defaultPrecision: DatePrecision = 'day'
): DateValue | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'object' && 'year' in raw && 'precision' in raw) {
    return raw as DateValue;
  }

  const str = String(raw).trim();
  if (!str) return undefined;

  // 1. ISO YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    return { precision: defaultPrecision, year, month, day };
  }

  // 2. DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const month = parseInt(slashMatch[2], 10);
    const year = parseInt(slashMatch[3], 10);
    return { precision: 'day', year, month, day };
  }

  // 3. "12 March 1998" or "12 Mar 1998"
  const textDayMatch = str.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (textDayMatch) {
    const day = parseInt(textDayMatch[1], 10);
    const mStr = textDayMatch[2].toLowerCase();
    const month = MONTH_MAP[mStr];
    const year = parseInt(textDayMatch[3], 10);
    if (month && year) {
      return { precision: 'day', year, month, day };
    }
  }

  // 4. "Jun 2021" or "June 2021"
  const myMatch = str.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (myMatch) {
    const mStr = myMatch[1].toLowerCase();
    const month = MONTH_MAP[mStr];
    const year = parseInt(myMatch[2], 10);
    if (month && year) {
      return { precision: 'month', year, month };
    }
  }

  // 5. "2021"
  const yMatch = str.match(/^(\d{4})$/);
  if (yMatch) {
    return { precision: 'year', year: parseInt(yMatch[1], 10) };
  }

  return undefined;
}

/**
 * Formats a DateValue for display.
 * - Full: "12 March 1998" (uses full month)
 * - Month: "Jun 2021" (uses 3-letter month)
 * - Year: "2021"
 */
export function formatDateValue(
  val?: DateValue | string | null,
  options?: { fullMonthName?: boolean }
): string {
  if (!val) return '';
  const dateObj = typeof val === 'object' && 'precision' in val ? val : parseToDateValue(val);
  if (!dateObj || !dateObj.year) return typeof val === 'string' ? val : '';

  if (dateObj.precision === 'year') {
    return String(dateObj.year);
  }

  const monthIdx = (dateObj.month || 1) - 1;
  const monthName = options?.fullMonthName
    ? MONTH_NAMES_FULL[monthIdx] || MONTH_NAMES_SHORT[monthIdx] || ''
    : MONTH_NAMES_SHORT[monthIdx] || '';

  if (dateObj.precision === 'month') {
    return `${monthName} ${dateObj.year}`.trim();
  }

  // day
  const day = dateObj.day ? String(dateObj.day) : '';
  const fullMonth = MONTH_NAMES_FULL[monthIdx] || monthName;
  return `${day} ${fullMonth} ${dateObj.year}`.trim();
}

/**
 * Format range from DateValue or legacy month/year
 */
export function formatDateValueRange(
  from?: DateValue | string | null,
  to?: DateValue | string | null,
  isCurrent?: boolean,
  legacyFallback?: {
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }
): string {
  if (isCurrent) {
    const fromStr = from
      ? formatDateValue(from)
      : legacyFallback?.fromYear
      ? [legacyFallback.fromMonth, legacyFallback.fromYear].filter(Boolean).join(' ')
      : '';
    return fromStr ? `${fromStr} – Present` : 'Present';
  }

  const fromStr = from
    ? formatDateValue(from)
    : legacyFallback?.fromYear
    ? [legacyFallback.fromMonth, legacyFallback.fromYear].filter(Boolean).join(' ')
    : '';

  const toStr = to
    ? formatDateValue(to)
    : legacyFallback?.toYear
    ? [legacyFallback.toMonth, legacyFallback.toYear].filter(Boolean).join(' ')
    : '';

  if (!fromStr && !toStr) return '';
  if (fromStr && !toStr) return fromStr;
  if (!fromStr && toStr) return toStr;
  return `${fromStr} – ${toStr}`;
}

export function formatYearValueRange(
  from?: DateValue | string | null,
  to?: DateValue | string | null,
  isCurrent?: boolean,
  legacyFallback?: {
    fromYear?: string;
    toYear?: string;
  }
): string {
  if (isCurrent) {
    const fromStr = from
      ? formatDateValue(from)
      : legacyFallback?.fromYear || '';
    return fromStr ? `${fromStr} – Present` : 'Present';
  }

  const fromStr = from
    ? formatDateValue(from)
    : legacyFallback?.fromYear || '';

  const toStr = to
    ? formatDateValue(to)
    : legacyFallback?.toYear || '';

  if (!fromStr && !toStr) return '';
  if (fromStr && !toStr) return fromStr;
  if (!fromStr && toStr) return toStr;
  return `${fromStr} – ${toStr}`;
}

export function formatDOB(dob?: DateValue | string | null): string {
  if (!dob) return '';
  return formatDateValue(dob, { fullMonthName: true });
}

export function formatDatePretty(date?: DateValue | string | null): string {
  if (!date) return '';
  return formatDateValue(date, { fullMonthName: true });
}
