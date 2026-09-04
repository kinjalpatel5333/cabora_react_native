import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../config/setting';

const initialState = {
  walkthroughSeen: false,
  notifications: true,
  bootstrapped: false,
};

export const bootstrapApp = createAsyncThunk('app/bootstrap', async () => {
  const [[, walkthrough], [, notifications]] = await AsyncStorage.multiGet([
    STORAGE_KEYS.walkthrough,
    STORAGE_KEYS.notifications,
  ]);
  return {
    walkthroughSeen: walkthrough === '1',
    notifications: notifications !== '0',
  };
});

export const completeWalkthrough = createAsyncThunk(
  'app/completeWalkthrough',
  async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.walkthrough, '1');
    return true;
  },
);

export const setNotificationsEnabled = createAsyncThunk(
  'app/setNotifications',
  async enabled => {
    await AsyncStorage.setItem(STORAGE_KEYS.notifications, enabled ? '1' : '0');
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
        state.bootstrapped = true;
      })
      .addCase(bootstrapApp.rejected, state => {
        state.bootstrapped = true;
      })
      .addCase(completeWalkthrough.fulfilled, state => {
        state.walkthroughSeen = true;
      })
      .addCase(setNotificationsEnabled.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export default appSlice.reducer;
