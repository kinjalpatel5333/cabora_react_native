import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../config/setting';

const initialState = {
  user: null,
  token: null,
  loading: false,
  bootstrapped: false,
  error: null,
};

function demoUser(email, name) {
  return {
    id: 'demo-user',
    name: name || email.split('@')[0],
    email,
  };
}

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const [[, token], [, userRaw]] = await AsyncStorage.multiGet([
    STORAGE_KEYS.token,
    STORAGE_KEYS.user,
  ]);
  const user = userRaw ? JSON.parse(userRaw) : null;
  return {token: token || null, user};
});

async function persistSession(token, user) {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.token, token],
    [STORAGE_KEYS.user, JSON.stringify(user)],
  ]);
  return {token, user};
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({email}, {rejectWithValue}) => {
    try {
      return persistSession('demo-token', demoUser(email));
    } catch (err) {
      return rejectWithValue(err?.message || 'Login failed');
    }
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({name, email}, {rejectWithValue}) => {
    try {
      return persistSession('demo-token', demoUser(email, name));
    } catch (err) {
      return rejectWithValue(err?.message || 'Sign up failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
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
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.bootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, state => {
        state.bootstrapped = true;
      })
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
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign up failed';
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const {clearAuthError} = authSlice.actions;
export default authSlice.reducer;
