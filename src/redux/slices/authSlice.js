import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  storageGetItem,
  storageSetItem,
  storageSetMultiple,
  storageRemoveMultiple,
} from '../../utils/storage';
import {STORAGE_KEYS, DEMO_CREDENTIALS} from '../../config/setting';
import {setAuthToken, getAuthToken, setRefreshToken} from '../../config/apicall';
import {getMeApi, logoutApi} from '../../services/authApi';
import {getPassengerProfileApi} from '../../services/userApi';
import {getDriverProfileApi, getOnboardingStatusApi} from '../../services/driverApi';
import {extractUserProfile} from '../../utils/user';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  registeredUsers: [],
  loading: false,
  bootstrapped: false,
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  try {
    let [token, refreshToken, userRaw, registeredRaw] = await Promise.all([
      storageGetItem(STORAGE_KEYS.token),
      storageGetItem(STORAGE_KEYS.refreshToken),
      storageGetItem(STORAGE_KEYS.user),
      storageGetItem(STORAGE_KEYS.registeredUsers),
    ]);
    if (token && String(token).startsWith('local-token-')) {
      token = null;
    }
    if (token) {
      setAuthToken(token);
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    let user = userRaw ? JSON.parse(userRaw) : null;
    let registeredUsers = [];
    if (registeredRaw) {
      try {
        const parsed = JSON.parse(registeredRaw);
        if (Array.isArray(parsed)) {
          registeredUsers = parsed;
        }
      } catch (err) {
        console.warn('Failed to parse registered users:', err);
      }
    }

    if (token) {
      try {
        const meRes = await getMeApi();
        const profile = extractUserProfile(meRes, user?.phone || user?.mobile);
        if (profile && (profile.id || profile.name || profile.email || profile.mobile)) {
          user = {
            ...(user || {}),
            ...profile,
          };
          await storageSetItem(STORAGE_KEYS.user, JSON.stringify(user));
        }
      } catch (meErr) {
        console.warn('bootstrapAuth getMeApi error:', meErr);
        if (meErr?.status === 401 || meErr?.status === 403) {
          token = null;
          user = null;
          refreshToken = null;
          setAuthToken(null);
          setRefreshToken(null);
          await storageRemoveMultiple([STORAGE_KEYS.token, STORAGE_KEYS.refreshToken, STORAGE_KEYS.user]);
        }
      }
    }

    return {token: token || null, refreshToken: refreshToken || null, user, registeredUsers};
  } catch (err) {
    console.error('bootstrapAuth error:', err);
    return {token: null, refreshToken: null, user: null, registeredUsers: []};
  }
});

async function persistSession(token, user, refreshToken) {
  const items = [[STORAGE_KEYS.user, JSON.stringify(user)]];
  if (token && !String(token).startsWith('local-token-')) {
    items.push([STORAGE_KEYS.token, token]);
  }
  if (refreshToken) {
    items.push([STORAGE_KEYS.refreshToken, refreshToken]);
  }
  await storageSetMultiple(items);
  return {token, user, refreshToken};
}

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({name, email, password}, {getState, rejectWithValue}) => {
    try {
      const state = getState();
      const existingUsers = Array.isArray(state.auth?.registeredUsers)
        ? state.auth.registeredUsers
        : [];
      const normalizedEmail = (email || '').trim().toLowerCase();

      // Check if email already registered
      const alreadyExists = existingUsers.some(
        u => (u.email || '').toLowerCase() === normalizedEmail,
      );
      if (alreadyExists) {
        return rejectWithValue('An account with this email already exists.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: (name || '').trim(),
        email: normalizedEmail,
        password,
      };

      const updatedUsers = [...existingUsers, newUser];

      // Save all registered users
      await storageSetItem(
        STORAGE_KEYS.registeredUsers,
        JSON.stringify(updatedUsers),
      );

      // Create active session (exclude password in session object)
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      const token = `local-token-${Date.now()}`;
      await persistSession(token, sessionUser);

      return {
        token,
        user: sessionUser,
        registeredUsers: updatedUsers,
      };
    } catch (err) {
      console.error('Sign up thunk error:', err);
      return rejectWithValue(err?.message || 'Sign up failed');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({email, password}, {getState, rejectWithValue}) => {
    try {
      const state = getState();
      const registeredUsers = state.auth.registeredUsers || [];
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Check if matches standard demo credentials
      const isDemo =
        normalizedEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.password;

      // 2. Or check if matches registered user
      const matchedUser = registeredUsers.find(
        u => u.email.toLowerCase() === normalizedEmail,
      );

      if (!isDemo && !matchedUser) {
        return rejectWithValue(
          'No account found with this email. Please sign up first.',
        );
      }

      if (!isDemo && matchedUser && matchedUser.password !== password) {
        return rejectWithValue('Incorrect password. Please try again.');
      }

      const sessionUser = matchedUser
        ? {id: matchedUser.id, name: matchedUser.name, email: matchedUser.email}
        : {
            id: 'demo-user',
            name: DEMO_CREDENTIALS.email.split('@')[0],
            email: DEMO_CREDENTIALS.email,
          };

      const token = `local-token-${Date.now()}`;
      await persistSession(token, sessionUser);

      return {token, user: sessionUser};
    } catch (err) {
      return rejectWithValue(err?.message || 'Login failed');
    }
  },
);

export const loginWithPhone = createAsyncThunk(
  'auth/loginPhone',
  async (
    {phone, role, name, email, dob, photo, gender, token: passedToken, refreshToken: passedRefreshToken, user: rawUser, isOnBoarding},
    {getState, rejectWithValue},
  ) => {
    try {
      const state = getState();
      const storedToken = await storageGetItem(STORAGE_KEYS.token);
      const storedRefreshToken = await storageGetItem(STORAGE_KEYS.refreshToken);
      const memoryToken = getAuthToken();
      const stateToken = state.auth?.token;

      let validToken =
        passedToken ||
        (memoryToken && !String(memoryToken).startsWith('local-token-') ? memoryToken : null) ||
        (storedToken && !String(storedToken).startsWith('local-token-') ? storedToken : null) ||
        (stateToken && !String(stateToken).startsWith('local-token-') ? stateToken : null) ||
        null;

      let validRefreshToken =
        passedRefreshToken ||
        rawUser?.refreshToken ||
        rawUser?.data?.refreshToken ||
        storedRefreshToken ||
        null;

      if (validToken) {
        setAuthToken(validToken);
      }
      if (validRefreshToken) {
        setRefreshToken(validRefreshToken);
      }

      const roleStr = (
        rawUser?.currentRole ||
        rawUser?.role ||
        role ||
        'passenger'
      ).toLowerCase();

      const isDriver = roleStr === 'driver';
      const isPassenger = roleStr === 'passenger';

      const isNewDriverOnboarding =
        isDriver &&
        (isOnBoarding === true ||
          rawUser?.isOnBoarding === true ||
          rawUser?.isNewUser === true ||
          rawUser?.kycComplete === false ||
          rawUser?.driver?.onboardingCompleted === false ||
          rawUser?.platform?.eligibleForRides === false);

      const driverOnboardingFinished = !isNewDriverOnboarding && (
        isOnBoarding === false ||
        rawUser?.isOnBoarding === false ||
        rawUser?.driver?.onboardingCompleted === true ||
        rawUser?.kycComplete === true ||
        rawUser?.platform?.eligibleForRides === true
      );

      const extracted = extractUserProfile(rawUser, phone);
      const userName = extracted.name || rawUser?.name || rawUser?.fullName || name || '';

      const isNewUserExplicit =
        rawUser?.isNewUser !== undefined
          ? Boolean(rawUser.isNewUser)
          : rawUser?.passenger?.isNewUser !== undefined
            ? Boolean(rawUser.passenger.isNewUser)
            : rawUser?.user?.isNewUser !== undefined
              ? Boolean(rawUser.user.isNewUser)
              : extracted.isNewUser;

      const isExistingPassenger =
        isPassenger &&
        (isNewUserExplicit === false ||
          rawUser?.isNewUser === false ||
          rawUser?.profileCompleted === true ||
          rawUser?.passenger?.profileCompleted === true);

      const isNewPassengerOnboarding =
        isPassenger &&
        !isExistingPassenger &&
        (isNewUserExplicit === true ||
          rawUser?.isNewUser === true ||
          isOnBoarding === true ||
          rawUser?.isOnBoarding === true ||
          rawUser?.profileCompleted === false ||
          rawUser?.passenger?.profileCompleted === false ||
          !userName ||
          userName.trim().length === 0);

      const passengerProfileFinished =
        !isNewPassengerOnboarding ||
        isExistingPassenger ||
        isNewUserExplicit === false ||
        rawUser?.isNewUser === false;

      const sessionUser = {
        ...(rawUser || {}),
        ...extracted,
        id: rawUser?._id || rawUser?.id || extracted.id || `phone-${phone}`,
        _id: rawUser?._id || rawUser?.id || extracted.id,
        name: userName,
        fullName: userName,
        email: extracted.email || rawUser?.email || email || `${phone}@cabora.local`,
        phone: rawUser?.mobile || rawUser?.phone || phone,
        mobile: rawUser?.mobile || rawUser?.phone || phone,
        role: roleStr,
        currentRole: rawUser?.currentRole || roleStr.toUpperCase(),
        roles: rawUser?.roles || [roleStr.toUpperCase()],
        dob: extracted.dob || rawUser?.dob || dob || null,
        photo: extracted.photo || rawUser?.photo || rawUser?.profilePhoto || photo || null,
        profilePhoto: extracted.photo || rawUser?.photo || rawUser?.profilePhoto || photo || null,
        gender: extracted.gender || rawUser?.gender || gender || null,
        isNewUser: isNewUserExplicit !== undefined ? isNewUserExplicit : false,
        isOnBoarding: isDriver ? isNewDriverOnboarding : isNewPassengerOnboarding,
        profileCompleted: isDriver ? Boolean(driverOnboardingFinished) : Boolean(passengerProfileFinished),
        isProfileComplete: isDriver ? Boolean(driverOnboardingFinished) : Boolean(passengerProfileFinished),
        kycComplete: isDriver ? Boolean(driverOnboardingFinished) : true,
        kycDocuments: rawUser?.kycDocuments || {},
      };

      if (validToken) {
        await persistSession(validToken, sessionUser, validRefreshToken);
      } else {
        await storageSetItem(STORAGE_KEYS.user, JSON.stringify(sessionUser));
      }

      return {token: validToken, refreshToken: validRefreshToken, user: sessionUser};
    } catch (err) {
      return rejectWithValue(err?.message || 'Verification failed');
    }
  },
);

export const saveDriverDocument = createAsyncThunk(
  'auth/saveDriverDocument',
  async ({id, uri, fileName, fileSize}, {getState, rejectWithValue}) => {
    try {
      const {token, user} = getState().auth;
      if (!token || !user) {
        return rejectWithValue('No session');
      }
      if (!id) {
        return rejectWithValue('Missing document');
      }
      const kycDocuments = {
        ...(user.kycDocuments || {}),
        [id]: {
          status: 'uploaded',
          meta: 'Uploaded',
          uri: uri || null,
          fileName: fileName || null,
          fileSize: fileSize || 0,
          uploadedAt: Date.now(),
        },
      };
      const nextUser = {...user, kycDocuments};
      await persistSession(token, nextUser);
      return nextUser;
    } catch (err) {
      return rejectWithValue(err?.message || 'Could not save document');
    }
  },
);

export const completeDriverKyc = createAsyncThunk(
  'auth/completeDriverKyc',
  async (_, {getState, rejectWithValue}) => {
    try {
      const {token, user} = getState().auth;
      if (!token || !user) {
        return rejectWithValue('No session');
      }
      const nextUser = {...user, kycComplete: true};
      await persistSession(token, nextUser);
      return nextUser;
    } catch (err) {
      return rejectWithValue(err?.message || 'Could not save documents');
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await getMeApi();
      const currentUser = getState().auth.user || {};
      const profile = extractUserProfile(res, currentUser.phone || currentUser.mobile);

      if (profile && (profile.id || profile.name || profile.email || profile.mobile)) {
        const mergedUser = {
          ...currentUser,
          ...profile,
        };
        const token = getState().auth.token;
        if (token) {
          await persistSession(token, mergedUser);
        }
        return mergedUser;
      }
      return null;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch user');
    }
  },
);

export const fetchPassengerProfile = createAsyncThunk(
  'auth/fetchPassengerProfile',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await getPassengerProfileApi();
      const currentUser = getState().auth.user || {};
      const profile = extractUserProfile(res, currentUser.phone || currentUser.mobile);

      if (profile && (profile.id || profile.name || profile.email || profile.mobile)) {
        const mergedUser = {
          ...currentUser,
          ...profile,
        };
        const token = getState().auth.token;
        if (token) {
          await persistSession(token, mergedUser);
        }
        return mergedUser;
      }
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch passenger profile');
    }
  },
);

export const fetchDriverProfile = createAsyncThunk(
  'auth/fetchDriverProfile',
  async (_, {getState, rejectWithValue}) => {
    try {
      let res;
      try {
        res = await getDriverProfileApi();
      } catch (e1) {
        console.warn('getDriverProfileApi fallback to getOnboardingStatusApi:', e1);
        res = await getOnboardingStatusApi();
      }
      const currentUser = getState().auth.user || {};
      const profile = extractUserProfile(res, currentUser.phone || currentUser.mobile);
      const rootData = res?.data || res;

      const resolvedName =
        profile?.name ||
        rootData?.personal?.fullName ||
        rootData?.personal?.name ||
        currentUser.name ||
        currentUser.fullName ||
        '';

      const resolvedPhoto =
        profile?.photo ||
        rootData?.personal?.profilePhoto ||
        rootData?.personal?.photo ||
        currentUser.photo ||
        currentUser.profilePhoto ||
        '';

      const isApproved =
        rootData?.platform?.eligibleForRides === true ||
        rootData?.driver?.onboardingCompleted === true ||
        String(rootData?.status || rootData?.onboardingStatus || '').toUpperCase() === 'APPROVED';

      const resolvedKycComplete = isApproved
        ? true
        : currentUser.kycComplete === false
          ? false
          : Boolean(currentUser.kycComplete);

      const mergedUser = {
        ...currentUser,
        ...(rootData?.driver || {}),
        ...(rootData?.user || {}),
        ...(rootData?.personal || {}),
        ...profile,
        name: resolvedName,
        fullName: resolvedName,
        photo: resolvedPhoto,
        profilePhoto: resolvedPhoto,
        kycComplete: resolvedKycComplete,
      };

      const token = getState().auth.token;
      if (token) {
        await persistSession(token, mergedUser);
      }
      return mergedUser;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch driver profile');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (payload = { deviceId: 'device_123' }, { getState }) => {
    try {
      const state = getState();
      const storedToken = await storageGetItem(STORAGE_KEYS.token).catch(() => null);
      const activeToken =
        state?.auth?.token ||
        getAuthToken() ||
        storedToken;

      if (activeToken && !String(activeToken).startsWith('local-token-')) {
        const apiCall = logoutApi(payload || { deviceId: 'device_123' }, activeToken).catch(err => {
          console.warn('Backend logout notice:', err);
        });
        const timeout = new Promise(resolve => setTimeout(resolve, 2000));
        await Promise.race([apiCall, timeout]);
      }
    } catch (err) {
      console.warn('Backend logout warning:', err);
    } finally {
      setAuthToken(null);
      await storageRemoveMultiple([STORAGE_KEYS.token, STORAGE_KEYS.user]).catch(() => {});
    }
    return null;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    updateToken(state, action) {
      const {token, refreshToken: rToken} = action.payload || {};
      if (token) {
        state.token = token;
        setAuthToken(token);
      }
      if (rToken) {
        state.refreshToken = rToken;
        setRefreshToken(rToken);
      }
    },
    logoutNow(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
      state.bootstrapped = true;
      setAuthToken(null);
      setRefreshToken(null);
      storageRemoveMultiple([STORAGE_KEYS.token, STORAGE_KEYS.refreshToken, STORAGE_KEYS.user]).catch(() => {});
    },
    setUser(state, action) {
      if (action.payload) {
        state.user = {
          ...state.user,
          ...action.payload,
          name:
            action.payload.name ||
            action.payload.fullName ||
            state.user?.name,
          phone:
            action.payload.phone ||
            action.payload.mobile ||
            state.user?.phone,
          photo:
            action.payload.photo ||
            action.payload.profilePhoto ||
            action.payload.avatar ||
            state.user?.photo,
        };
        storageSetItem(STORAGE_KEYS.user, JSON.stringify(state.user));
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(fetchPassengerProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      // bootstrap
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.registeredUsers = action.payload.registeredUsers || [];
        state.bootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, state => {
        state.bootstrapped = true;
      })
      // login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(loginWithPhone.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Verification failed';
      })
      .addCase(saveDriverDocument.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(completeDriverKyc.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // signup
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.registeredUsers = action.payload.registeredUsers;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign up failed';
      })
      // logout - clean auth state immediately on all states
      .addCase(logoutUser.pending, state => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.loading = false;
        state.bootstrapped = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.loading = false;
        state.bootstrapped = true;
      })
      .addCase(logoutUser.rejected, state => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.loading = false;
        state.bootstrapped = true;
      });
  },
});

export const {clearAuthError, logoutNow, setUser, updateToken} = authSlice.actions;
export default authSlice.reducer;
