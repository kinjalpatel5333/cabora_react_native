export {
  default as colors,
  palette,
  themes,
  light,
  dark,
  DEFAULT_THEME,
  getThemeColors,
} from './color';
export {
  BASE_URL,
  API_TIMEOUT,
  STORAGE_KEYS,
  DEMO_MODE,
  DEMO_CREDENTIALS,
  APP_VERSION,
  APP_MARKET,
  STORE_URL,
  SPLASH,
} from './setting';
export {
  default as apiClient,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  setAuthToken,
  getAuthToken,
} from './apicall';
export {
  loginApi,
  signupApi,
  profileApi,
  keywordSearchApi,
  sendOtpApi,
  verifyOtpApi,
  selectRoleApi,
  getMeApi,
  getPassengerProfileApi,
  updatePassengerProfileApi,
  logoutApi,
  endpoints,
  ENDPOINTS,
  AUTH_ENDPOINTS,
  PASSENGER_ENDPOINTS,
  USER_ENDPOINTS,
  DRIVER_ENDPOINTS,
  RIDE_ENDPOINTS,
} from './api';
export {apiPostFormData} from './apicallFormData';
export {fonts, typography, fontByWeight} from './typography';
