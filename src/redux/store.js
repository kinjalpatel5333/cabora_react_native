import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import driverReducer from './slices/driverSlice';

const appCombinedReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  driver: driverReducer,
});

const rootReducer = (state, action) => {
  if (
    action.type === 'auth/logout/pending' ||
    action.type === 'auth/logout/fulfilled' ||
    action.type === 'auth/logout/rejected' ||
    action.type === 'auth/logoutNow'
  ) {
    const walkthroughSeen = state?.app?.walkthroughSeen ?? true;
    const notifications = state?.app?.notifications ?? true;
    const registeredUsers = state?.auth?.registeredUsers ?? [];

    state = {
      auth: {
        user: null,
        token: null,
        registeredUsers,
        loading: false,
        bootstrapped: true,
        error: null,
      },
      app: {
        walkthroughSeen,
        notifications,
        locationResolved: false,
        locationMode: null,
        bootstrapped: true,
      },
      driver: undefined,
    };
  }
  return appCombinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
