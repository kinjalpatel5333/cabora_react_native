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
      role: 'passenger',
      isProfileComplete: false,
    };
  }

  const root = apiResponse?.data || apiResponse;
  const user = root?.user || {};
  const passenger = root?.passenger || {};
  const driver = root?.driver || {};

  const name = (
    passenger.fullName ||
    passenger.name ||
    driver.fullName ||
    driver.name ||
    user.fullName ||
    user.name ||
    root.fullName ||
    root.name ||
    ''
  ).trim();

  const dob =
    passenger.dob ||
    driver.dob ||
    user.dob ||
    root.dob ||
    '';

  const email =
    passenger.email ||
    driver.email ||
    user.email ||
    root.email ||
    '';

  const mobile =
    passenger.mobile ||
    driver.mobile ||
    user.mobile ||
    root.mobile ||
    fallbackPhone ||
    '';

  const photo =
    passenger.profilePhoto ||
    passenger.photo ||
    passenger.avatar ||
    driver.profilePhoto ||
    driver.photo ||
    driver.avatar ||
    user.profilePhoto ||
    user.photo ||
    user.avatar ||
    root.profilePhoto ||
    root.photo ||
    '';

  const gender =
    passenger.gender ||
    driver.gender ||
    user.gender ||
    root.gender ||
    '';

  const isProfileComplete = Boolean(
    (root.isNewUser === false && name.length > 0) ||
    passenger.profileCompleted === true ||
    root.profileCompleted === true ||
    name.length > 0 ||
    dob.length > 0
  );

  return {
    id: user.id || user._id || root.userId || root.id || '',
    name,
    fullName: name,
    dob,
    email,
    mobile,
    phone: mobile,
    photo,
    profilePhoto: photo,
    gender,
    role: (root.currentRole || user.currentRole || 'passenger').toLowerCase(),
    isProfileComplete,
  };
}
