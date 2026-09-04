import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  storageGetItem,
  storageSetItem,
  storageSetMultiple,
  storageRemoveMultiple,
} from '../../utils/storage';
import {STORAGE_KEYS, DEMO_CREDENTIALS} from '../../config/setting';

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
    const [token, userRaw, registeredRaw] = await Promise.all([
      storageGetItem(STORAGE_KEYS.token),
      storageGetItem(STORAGE_KEYS.user),
      storageGetItem(STORAGE_KEYS.registeredUsers),
    ]);
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
  await storageSetMultiple([
    [STORAGE_KEYS.token, token],
    [STORAGE_KEYS.user, JSON.stringify(user)],
  ]);
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

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await storageRemoveMultiple([STORAGE_KEYS.token, STORAGE_KEYS.user]);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
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

export const {clearAuthError} = authSlice.actions;
export default authSlice.reducer;
