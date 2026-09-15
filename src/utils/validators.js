export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPassword(password) {
  return String(password).length >= 6;
}

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

export function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(digitsOnly(value));
}

export function formatIndianMobile(value) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
