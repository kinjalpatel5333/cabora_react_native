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
  const str = String(dateStr).trim();
  if (!str) {
    return new Date();
  }

  const cleanStr = str.includes('T') ? str.split('T')[0] : str;

  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
    const parts = cleanStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(day) && month >= 0 && month < 12 && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Try DD / MM / YYYY or DD/MM/YYYY or YYYY / MM / DD
  const slashParts = cleanStr.split(/[\/\-]/);
  if (slashParts.length === 3) {
    const p0 = parseInt(slashParts[0].trim(), 10);
    const p1 = parseInt(slashParts[1].trim(), 10);
    const p2 = parseInt(slashParts[2].trim(), 10);

    if (slashParts[2].trim().length === 4) {
      const day = p0;
      const month = p1 - 1;
      const year = p2;
      if (!isNaN(day) && month >= 0 && month < 12 && !isNaN(year)) {
        return new Date(year, month, day);
      }
    } else if (slashParts[0].trim().length === 4) {
      const year = p0;
      const month = p1 - 1;
      const day = p2;
      if (!isNaN(day) && month >= 0 && month < 12 && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }

  // Try DD MMM YYYY (e.g. "14 Mar 1994" or "24 Aug 2008")
  const parts = cleanStr.split(/\s+/);
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

  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formats a Date object to "DD / MM / YYYY"
 */
export function formatDateToUi(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  const day = dateObj.getDate();
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const month = dateObj.getMonth() + 1;
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const year = dateObj.getFullYear();
  return `${dayStr} / ${monthStr} / ${year}`;
}

/**
 * Formats a Date object or date string to API format "YYYY-MM-DD"
 */
export function formatDateToApi(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return String(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates age in full years from a date string or Date object.
 */
export function calculateAge(dateInput) {
  if (!dateInput) return 0;
  const birthDate = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (!birthDate || isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export { MONTH_SHORT_NAMES, MONTH_FULL_NAMES };
