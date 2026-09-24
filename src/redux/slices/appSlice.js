import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {storageGetItem, storageSetItem} from '../../utils/storage';
import {STORAGE_KEYS} from '../../config/setting';

const initialState = {
  walkthroughSeen: false,
  notifications: true,
  locationResolved: false,
  locationMode: null,
  bootstrapped: false,
};

export const bootstrapApp = createAsyncThunk('app/bootstrap', async () => {
  try {
    const [walkthrough, notifications, locationResolved] = await Promise.all([
      storageGetItem(STORAGE_KEYS.walkthrough),
      storageGetItem(STORAGE_KEYS.notifications),
      storageGetItem(STORAGE_KEYS.locationResolved),
    ]);
    return {
      walkthroughSeen: walkthrough === '1' || Boolean(walkthrough),
      notifications: notifications !== '0',
      locationResolved: Boolean(locationResolved),
      locationMode: locationResolved || null,
    };
  } catch (err) {
    console.error('bootstrapApp error:', err);
    return {
      walkthroughSeen: false,
      notifications: true,
      locationResolved: false,
      locationMode: null,
    };
  }
});

export const completeWalkthrough = createAsyncThunk(
  'app/completeWalkthrough',
  async () => {
    await storageSetItem(STORAGE_KEYS.walkthrough, '1');
    return true;
  },
);

export const completeLocationPrompt = createAsyncThunk(
  'app/completeLocationPrompt',
  async (mode = 'manual') => {
    await storageSetItem(STORAGE_KEYS.locationResolved, mode);
    return mode;
  },
);

export const setNotificationsEnabled = createAsyncThunk(
  'app/setNotifications',
  async enabled => {
    await storageSetItem(STORAGE_KEYS.notifications, enabled ? '1' : '0');
    return enabled;
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(bootstrapApp.fulfilled, (state, action) => {
        state.walkthroughSeen = action.payload.walkthroughSeen;
        state.notifications = action.payload.notifications;
        state.locationResolved = action.payload.locationResolved;
        state.locationMode = action.payload.locationMode;
        state.bootstrapped = true;
      })
      .addCase(bootstrapApp.rejected, state => {
        state.bootstrapped = true;
      })
      .addCase(completeWalkthrough.fulfilled, state => {
        state.walkthroughSeen = true;
      })
      .addCase(completeLocationPrompt.fulfilled, (state, action) => {
        state.locationResolved = true;
        state.locationMode = action.payload;
      })
      .addCase(setNotificationsEnabled.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export default appSlice.reducer;
