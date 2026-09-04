import {isValidEmail, isValidPassword} from '../src/utils/validators';

test('validates email', () => {
  expect(isValidEmail('you@email.com')).toBe(true);
  expect(isValidEmail('bad')).toBe(false);
});

test('validates password', () => {
  expect(isValidPassword('123456')).toBe(true);
  expect(isValidPassword('123')).toBe(false);
});
