import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import driverReducer from './slices/driverSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    driver: driverReducer,
  },
});

export default store;
