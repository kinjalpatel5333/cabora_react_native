/**
 * Normalize and extract user profile details from backend responses.
 * Backend returns:
 * {
 *   data: {
 *     user: { id, mobile, countryCode, roles, currentRole, ... },
 *     passenger: { name, fullName, email, dob, gender, profilePhoto, profileCompleted },
 *     driver: { name, fullName, email, dob, gender, profilePhoto, ... },
 *     isNewUser: false,
 *     isOnBoarding: false,
 *   }
 * }
 */

import { BASE_URL } from '../config/setting';

export function formatImageUrl(path) {
  if (!path || typeof path !== 'string') return '';
  const str = path.trim();
  if (!str) return '';
  if (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('file://') ||
    str.startsWith('content://') ||
    str.startsWith('data:')
  ) {
    return str;
  }
  const cleanBase = (BASE_URL || '').endsWith('/')
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const cleanPath = str.startsWith('/') ? str : `/${str}`;
  return `${cleanBase}${cleanPath}`;
}

export function extractUserProfile(apiResponse, fallbackPhone = '') {
  if (!apiResponse) {
    return {
      id: '',
      name: '',
      fullName: '',
      dob: '',
      email: '',
      mobile: fallbackPhone,
      phone: fallbackPhone,
      photo: '',
      profilePhoto: '',
      gender: '',
      cityCode: '',
      role: 'passenger',
      isProfileComplete: false,
    };
  }

  const root = apiResponse?.data || apiResponse;
  const user = root?.user || {};
  const passenger = root?.passenger || {};
  const driver = root?.driver || {};

  const rawRole =
    root.currentRole ||
    user.currentRole ||
    root.role ||
    user.role ||
    (root.driver || root.isDriver || user.isDriver ? 'driver' : 'passenger');

  const currentRole = String(rawRole).toLowerCase();
  const isDriverRole = currentRole === 'driver';

  const primaryObj = isDriverRole ? (Object.keys(driver).length > 0 ? driver : root) : (Object.keys(passenger).length > 0 ? passenger : root);
  const secondaryObj = isDriverRole ? passenger : driver;
  const personalObj =
    driver.personal ||
    driver.personalDetails ||
    root.personal ||
    root.personalDetails ||
    root.onboarding?.personal ||
    driver.onboarding?.personal ||
    {};

  const rawFirstName = primaryObj.firstName || secondaryObj.firstName || personalObj.firstName || user.firstName || root.firstName || '';
  const rawLastName = primaryObj.lastName || secondaryObj.lastName || personalObj.lastName || user.lastName || root.lastName || '';
  const combinedFirstLast = `${rawFirstName} ${rawLastName}`.trim();

  const name = (
    primaryObj.fullName ||
    primaryObj.name ||
    personalObj.fullName ||
    personalObj.name ||
    secondaryObj.fullName ||
    secondaryObj.name ||
    user.fullName ||
    user.name ||
    root.fullName ||
    root.name ||
    root.user?.name ||
    root.user?.fullName ||
    combinedFirstLast ||
    ''
  ).trim();

  const dob =
    primaryObj.dob ||
    primaryObj.dateOfBirth ||
    personalObj.dob ||
    personalObj.dateOfBirth ||
    secondaryObj.dob ||
    user.dob ||
    root.dob ||
    '';

  const email =
    primaryObj.email ||
    personalObj.email ||
    secondaryObj.email ||
    user.email ||
    root.email ||
    '';

  const mobile =
    primaryObj.mobile ||
    primaryObj.phone ||
    personalObj.mobile ||
    personalObj.phone ||
    secondaryObj.mobile ||
    secondaryObj.phone ||
    user.mobile ||
    user.phone ||
    root.mobile ||
    root.phone ||
    fallbackPhone ||
    '';

  const rawPhoto =
    primaryObj.profilePhoto ||
    primaryObj.photo ||
    primaryObj.avatar ||
    personalObj.profilePhoto ||
    personalObj.photo ||
    personalObj.avatar ||
    secondaryObj.profilePhoto ||
    secondaryObj.photo ||
    secondaryObj.avatar ||
    user.profilePhoto ||
    user.photo ||
    user.avatar ||
    root.profilePhoto ||
    root.photo ||
    root.user?.profilePhoto ||
    root.user?.photo ||
    '';

  const photo = formatImageUrl(rawPhoto);

  const gender =
    primaryObj.gender ||
    secondaryObj.gender ||
    user.gender ||
    root.gender ||
    '';

  const cityCode =
    primaryObj.cityCode ||
    secondaryObj.cityCode ||
    user.cityCode ||
    root.cityCode ||
    '';

  const isProfileComplete = Boolean(
    (root.isNewUser === false && name.length > 0) ||
    passenger.profileCompleted === true ||
    driver.profileCompleted === true ||
    root.profileCompleted === true ||
    name.length > 0 ||
    dob.length > 0
  );

  return {
    id: user.id || user._id || root.userId || root.id || root._id || '',
    name,
    fullName: name,
    dob,
    email,
    mobile,
    phone: mobile,
    photo,
    profilePhoto: photo,
    gender,
    cityCode,
    role: currentRole,
    isProfileComplete,
  };
}
