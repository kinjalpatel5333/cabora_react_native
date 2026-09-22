const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_FULL_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats user input as they type on a numeric keypad.
 * When 8 digits (DDMMYYYY) are completed, returns formatted string like "14 Mar 1994".
 * If fewer than 8 digits, returns formatted string with slashes like "14/03/1994".
 */
export function formatDateNumberInput(text) {
  if (!text) {
    return '';
  }

  // Extract all numeric digits
  const digits = text.replace(/\D/g, '').slice(0, 8);

  if (digits.length < 8) {
    if (digits.length <= 2) {
      return digits;
    }
    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  // Exactly 8 digits: DDMMYYYY
  let day = parseInt(digits.slice(0, 2), 10);
  let month = parseInt(digits.slice(2, 4), 10);
  let year = parseInt(digits.slice(4, 8), 10);

  // Validate month (1 to 12)
  if (isNaN(month) || month < 1) {
    month = 1;
  } else if (month > 12) {
    month = 12;
  }

  // Validate day against maximum days in that month
  if (isNaN(year) || year < 1900) {
    year = 1994;
  }
  const maxDaysInMonth = new Date(year, month, 0).getDate();
  if (isNaN(day) || day < 1) {
    day = 1;
  } else if (day > maxDaysInMonth) {
    day = maxDaysInMonth;
  }

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthName = MONTH_SHORT_NAMES[month - 1];

  return `${dayStr} ${monthName} ${year}`;
}

/**
 * Parses a date string (e.g. "14 Mar 1994" or "14/03/1994") into a Date object.
 */
export function parseDateString(dateStr) {
  if (!dateStr) {
    return new Date();
  }

  // Try DD MMM YYYY (e.g. "14 Mar 1994")
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_SHORT_NAMES.findIndex(
      m => m.toLowerCase() === parts[1].toLowerCase(),
    );
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  // Try DD/MM/YYYY
  const slashParts = dateStr.split('/');
  if (slashParts.length === 3) {
    const day = parseInt(slashParts[0], 10);
    const month = parseInt(slashParts[1], 10) - 1;
    const year = parseInt(slashParts[2], 10);
    if (!isNaN(day) && month >= 0 && month < 12 && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Fallback
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formats a Date object to "DD MMM YYYY" (e.g. "14 Mar 1994")
 */
export function formatDateToUi(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  const day = dateObj.getDate();
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthName = MONTH_SHORT_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${dayStr} ${monthName} ${year}`;
}

export { MONTH_SHORT_NAMES, MONTH_FULL_NAMES };
