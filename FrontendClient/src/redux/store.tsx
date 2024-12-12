import { configureStore } from '@reduxjs/toolkit';
import {categoriesReducer, authReducer , serviceReducer , advertisementReducer , reviewReducer , faqReducer, userReducer, foodReducer, visitReducer, tabReducer, uploadReducer, searchReducer, realEstateReducer, banner2Reducer, linkGroupReducer, questionsReducer} from './slices';
// import topRestaurantsReducer from './slices/topRestaurants';
// import favoriteAdvertisementsReducer from './slices/favoriteAdvertisements';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    auth: authReducer,
    service: serviceReducer,
    advertisement: advertisementReducer,
    review: reviewReducer,
    faq: faqReducer,
    user: userReducer,
    topFood: foodReducer,
    visit: visitReducer,
    tab: tabReducer,
    upload: uploadReducer,
    search: searchReducer,
    realEstate: realEstateReducer,
    banner2: banner2Reducer,
    linkGroup: linkGroupReducer,
    question: questionsReducer
    // topRestaurants: topRestaurantsReducer,
    // favoriteAdvertisements: favoriteAdvertisementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
