import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import searchReducer from './slices/searchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    search: searchReducer,
  },
});

export default store;
