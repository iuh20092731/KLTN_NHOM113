import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import accountReducer from './slices/accountSlice';
import categoriesReducer from './slices/categories';
import serviceReducer from './slices/service';
import thongKeReducer from './slices/thongKe';
import statisticsReducer from './slices/statisticsSlice';
import clickTrackingReducer from './slices/clickTrackingSlice';
import advertisementReducer from './reducers/advertisementReducer';
import categoryReducer from './reducers/categoryReducer';
import questionReducer from './slices/question'
// import serviceReducer from './reducers/serviceReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
    categories: categoriesReducer,
    service: serviceReducer,
    thongKe: thongKeReducer,
    statistics: statisticsReducer,
    clickTracking: clickTrackingReducer,
    advertisement: advertisementReducer,
    // categories: categoryReducer,
    services: serviceReducer,
    question: questionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
