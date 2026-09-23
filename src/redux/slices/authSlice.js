import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  storageGetItem,
  storageSetItem,
  storageSetMultiple,
  storageRemoveMultiple,
} from '../../utils/storage';
import {STORAGE_KEYS, DEMO_CREDENTIALS} from '../../config/setting';
import {setAuthToken, getAuthToken} from '../../config/apicall';
import {getMeApi, logoutApi} from '../../services/authApi';
import {getPassengerProfileApi} from '../../services/userApi';
import {extractUserProfile} from '../../utils/user';

const initialState = {
  user: null,
  token: null,
  registeredUsers: [],
  loading: false,
  bootstrapped: false,
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  try {
    let [token, userRaw, registeredRaw] = await Promise.all([
      storageGetItem(STORAGE_KEYS.token),
      storageGetItem(STORAGE_KEYS.user),
      storageGetItem(STORAGE_KEYS.registeredUsers),
    ]);
    if (token && String(token).startsWith('local-token-')) {
      token = null;
    }
    if (token) {
      setAuthToken(token);
    }
    const user = userRaw ? JSON.parse(userRaw) : null;
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
    return {token: token || null, user, registeredUsers};
  } catch (err) {
    console.error('bootstrapAuth error:', err);
    return {token: null, user: null, registeredUsers: []};
  }
});

async function persistSession(token, user) {
  if (token && !String(token).startsWith('local-token-')) {
    await storageSetMultiple([
      [STORAGE_KEYS.token, token],
      [STORAGE_KEYS.user, JSON.stringify(user)],
    ]);
  } else {
    await storageSetItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
  return {token, user};
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
    {phone, role, name, email, dob, photo, gender, token: passedToken},
    {getState, rejectWithValue},
  ) => {
    try {
      const state = getState();
      const storedToken = await storageGetItem(STORAGE_KEYS.token);
      const memoryToken = getAuthToken();
      const stateToken = state.auth?.token;

      let validToken =
        passedToken ||
        (memoryToken && !String(memoryToken).startsWith('local-token-') ? memoryToken : null) ||
        (storedToken && !String(storedToken).startsWith('local-token-') ? storedToken : null) ||
        (stateToken && !String(stateToken).startsWith('local-token-') ? stateToken : null) ||
        null;

      if (validToken) {
        setAuthToken(validToken);
      }

      const sessionUser = {
        id: `phone-${phone}`,
        name: name || (role === 'driver' ? 'Driver' : 'User'),
        email: email || `${phone}@cabora.local`,
        phone,
        role: role || 'passenger',
        dob: dob || null,
        photo: photo || null,
        gender: gender || null,
        kycComplete: role !== 'driver',
        kycDocuments: {},
      };

      if (validToken) {
        await persistSession(validToken, sessionUser);
      } else {
        await storageSetItem(STORAGE_KEYS.user, JSON.stringify(sessionUser));
      }

      return {token: validToken, user: sessionUser};
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

      if (profile && profile.id) {
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

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (payload = { deviceId: 'device_123' }) => {
    try {
      await logoutApi(payload || { deviceId: 'device_123' });
    } catch (err) {
      console.warn('Backend logout warning (proceeding with local session cleanup):', err);
    } finally {
      await storageRemoveMultiple([STORAGE_KEYS.token, STORAGE_KEYS.user]);
      setAuthToken(null);
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
      // logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const {clearAuthError, setUser} = authSlice.actions;
export default authSlice.reducer;
