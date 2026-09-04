import {apiGet, apiPost} from './apicall';

export const endpoints = {
  login: '/auth/login',
  signup: '/auth/register',
  profile: '/users/1',
  keywordSearch: '/keyword-search',
};

export function loginApi(payload) {
  return apiPost(endpoints.login, payload);
}

export function signupApi(payload) {
  return apiPost(endpoints.signup, payload);
}

export function profileApi() {
  return apiGet(endpoints.profile);
}

export function keywordSearchApi(payload) {
  return apiGet(endpoints.keywordSearch, payload);
}
