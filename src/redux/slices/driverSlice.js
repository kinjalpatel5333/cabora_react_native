import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {logoutUser} from './authSlice';
import {
  getDriverKycStatusApi,
  setDriverAvailabilityApi,
  getDriverEarningsApi,
  getDriverIncentivesApi,
} from '../../services/driverApi';

const initialState = {
  online: true,
  restricted: false,
  kycData: null,
  earningsData: null,
  incentivesData: null,
  earningsLoading: false,
  incentivesLoading: false,
  rating: 4.92,
  zones: 'Whitefield & Marathahalli',
  wallet: 6420,
  gpsLabel: 'GPS strong',
  today: {
    earnings: 1840,
    rides: 11,
    onlineLabel: '4h 12m',
  },
  streak: {
    current: 12,
    target: 18,
    reward: 450,
    hint: '6 more rides before 11:00 pm to unlock this bonus',
  },
  demand: {
    km: 1.8,
  },
  requirements: [
    {
      id: 'insurance',
      title: 'Insurance certificate expired 2 Sep',
      action: 'Re-upload',
      kind: 'link',
    },
    {
      id: 'police',
      title: 'Police verification submitted 9 Sep',
      action: 'In review',
      kind: 'review',
    },
  ],
};

export const fetchDriverKycStatus = createAsyncThunk(
  'driver/fetchKycStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDriverKycStatusApi();
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch KYC status');
    }
  },
);

export const fetchDriverEarnings = createAsyncThunk(
  'driver/fetchEarnings',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getDriverEarningsApi(params);
      return res?.data || res;
    } catch (err) {
      console.warn('fetchDriverEarnings API error:', err);
      return rejectWithValue(err?.message || 'Failed to fetch driver earnings');
    }
  },
);

export const fetchDriverIncentives = createAsyncThunk(
  'driver/fetchIncentives',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getDriverIncentivesApi(params);
      return res?.data || res;
    } catch (err) {
      console.warn('fetchDriverIncentives API error:', err);
      return rejectWithValue(err?.message || 'Failed to fetch driver incentives');
    }
  },
);

export const updateDriverAvailability = createAsyncThunk(
  'driver/updateAvailability',
  async (payload, { rejectWithValue }) => {
    try {
      const onlineStatus = Boolean(payload?.online);
      const lat = payload?.latitude ?? 22.7000;
      const lng = payload?.longitude ?? 72.8700;
      const res = await setDriverAvailabilityApi({
        online: onlineStatus,
        latitude: lat,
        longitude: lng,
      });
      return { online: onlineStatus, data: res?.data || res };
    } catch (err) {
      console.warn('updateDriverAvailability API error:', err);
      return rejectWithValue(err?.message || 'Failed to update availability');
    }
  },
);

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDriverOnline(state, action) {
      if (state.restricted) {
        state.online = false;
        return;
      }
      state.online = Boolean(action.payload);
    },
    setDriverRestricted(state, action) {
      state.restricted = Boolean(action.payload);
      if (state.restricted) {
        state.online = false;
      }
    },
    setKycData(state, action) {
      state.kycData = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(fetchDriverKycStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.kycData = action.payload;
          const platformStatus = String(
            action.payload?.platform?.kycStatus ||
            action.payload?.platform?.onboardingStatus ||
            action.payload?.status ||
            '',
          ).toUpperCase();

          const isFailed =
            platformStatus === 'REJECTED' ||
            platformStatus === 'FAILED' ||
            platformStatus === 'EXPIRED';

          if (isFailed) {
            state.restricted = true;
            state.online = false;
          }
        }
      })
      .addCase(updateDriverAvailability.fulfilled, (state, action) => {
        if (typeof action.payload?.online === 'boolean') {
          state.online = action.payload.online;
        }
      })
      .addCase(fetchDriverEarnings.pending, state => {
        state.earningsLoading = true;
      })
      .addCase(fetchDriverEarnings.fulfilled, (state, action) => {
        state.earningsLoading = false;
        if (action.payload) {
          state.earningsData = action.payload;
        }
      })
      .addCase(fetchDriverEarnings.rejected, state => {
        state.earningsLoading = false;
      })
      .addCase(fetchDriverIncentives.pending, state => {
        state.incentivesLoading = true;
      })
      .addCase(fetchDriverIncentives.fulfilled, (state, action) => {
        state.incentivesLoading = false;
        if (action.payload) {
          state.incentivesData = action.payload;
        }
      })
      .addCase(fetchDriverIncentives.rejected, state => {
        state.incentivesLoading = false;
      });
  },
});

export const {setDriverOnline, setDriverRestricted, setKycData} = driverSlice.actions;
export default driverSlice.reducer;
