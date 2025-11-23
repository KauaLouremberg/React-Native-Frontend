import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import userTypeSlice from './userTypeSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    userType: userTypeSlice.reducer
  },
});

export default store;
