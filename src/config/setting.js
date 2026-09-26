export const BASE_URL = 'https://cabora-backend.vercel.app';

export const API_TIMEOUT = 20000;

export const STORAGE_KEYS = {
  token: 'cabora.auth.token',
  user: 'cabora.auth.user',
  registeredUsers: 'cabora.auth.registered_users',
  walkthrough: 'cabora.app.walkthrough',
  notifications: 'cabora.app.notifications',
  locationResolved: 'cabora.app.location_resolved',
};

export const DEMO_MODE = true;

export const APP_VERSION = '1.0.0';
export const APP_MARKET = 'Made for India';
export const STORE_URL = 'https://cabora.app';

/** Flip these when the backend reports an app-level splash gate. */
export const SPLASH = {
  holdOnSplash: false,
  forceUpdate: false,
  maintenance: false,
};

export const DEMO_CREDENTIALS = {
  email: 'demo@email.com',
  password: 'password',
};
