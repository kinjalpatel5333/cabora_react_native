import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {logoutUser} from './authSlice';
import {getDriverKycStatusApi} from '../../services/driverApi';

const initialState = {
  online: true,
  restricted: false,
  kycData: null,
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
      });
  },
});

export const {setDriverOnline, setDriverRestricted, setKycData} = driverSlice.actions;
export default driverSlice.reducer;
