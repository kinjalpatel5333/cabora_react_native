import {createSlice} from '@reduxjs/toolkit';
import {logoutUser} from './authSlice';

const initialState = {
  online: true,
  restricted: false,
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
  },
  extraReducers: builder => {
    builder.addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const {setDriverOnline, setDriverRestricted} = driverSlice.actions;
export default driverSlice.reducer;
