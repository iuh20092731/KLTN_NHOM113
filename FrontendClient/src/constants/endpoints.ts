const BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3'
} as const;

const createEndpoint = (path: string, version: keyof typeof API_VERSION = 'V1') => 
  `${BASE_URL}/api/${API_VERSION[version]}/${path}`;

export const ENDPOINTS = {
  BANNER2: createEndpoint('banners/type'),
  BANNER: createEndpoint('banners/type/TOP'),
  CATEGORIES: createEndpoint('categories'),
  LOGIN: createEndpoint('auth/token'),
  REGISTER: createEndpoint('users/create'),
  UPDATE_USER: createEndpoint('users'),
  INTROSPECT: createEndpoint('auth/introspect'),
  LOGIN_WITH_GG: createEndpoint('users/login-with-google'),
  VERIFY_OTP: createEndpoint('users/verify-account'),
  RESEND_OTP: createEndpoint('users/resend-otp'),
  SERVICE: createEndpoint('advertisement-services/category'),
  SERVICE_BY_ID: createEndpoint('advertisement-services'),
  POST_REVIEW: createEndpoint('reviews'),
  REVIEWS: createEndpoint('reviews/advertisement'),
  FAQS: createEndpoint('faqs/advertisement'),
  INC_VISITS: createEndpoint('web-visits/increment'),
  TOTAL_VISITS: createEndpoint('web-visits/total'),
  USER_INFO: createEndpoint('users/my-info'),
  TOP_FOOD: createEndpoint('main-advertisements/top-food'),
  UPDATE_CLICK_ADVER: createEndpoint('main-advertisements'),
  TRACKING_CLICK: createEndpoint('click-tracking'),
  UPLOAD_IMAGE: createEndpoint('upload/images'),
  SEARCH: createEndpoint('search'),
  MY_INFO: createEndpoint('users/my-info'),
  CHANGE_PASSWORD: createEndpoint('users'),
  POST_REAL_ESTATE: createEndpoint('real-estate-posts'),
  INCREASE_VIEW_REAL_ESTATE: createEndpoint('real-estate-posts/increase-views'),
  REAL_ESTATE_LISTING: createEndpoint('real-estate-listings'),
  REAL_ESTATE_MEDIA: createEndpoint('real-estate-media/listings'),
  FAVORITE_ADVERTISEMENT: createEndpoint('favorite-advertisements/all'),
  MANAGE_ADVERTISERMENT: createEndpoint('main-advertisements/user'),
  UPDATE_ADVERTISERMENT: createEndpoint('main-advertisements'),
  MEDIA_ADVERTISEMENT: createEndpoint('advertisement-media'),
  LINK_GROUP: createEndpoint('social-group-links'),
  QUESTIONS: createEndpoint('questions'),
  COMMENT: createEndpoint('comments'),
} as const;

export const LOGIN_WITH_GG = BASE_URL


export type EndpointKey = keyof typeof ENDPOINTS;

export const ENDPOINTS_V2 = {
  ADVERTISEMENT: createEndpoint('main-advertisements', 'V2'),
  ADVERTISEMENT_BY_SERVICE: createEndpoint('main-advertisements/service', 'V2'),
  TOP_RESTAURANTS: '/api/v2/main-advertisements/top-restaurants',
  FAVORITE_ADVERTISEMENTS: '/api/v1/favorite-advertisements',
  TOP_RESTAURANT: createEndpoint('main-advertisements/top-restaurants?serviceId=5&limit=5', 'V2'),
  SERVICE_V2: createEndpoint('advertisement-services/category', 'V2'),

} as const;

export const ENDPOINTS_V3 = {
  ADVERTISEMENT: createEndpoint("main-advertisements", "V3"),
};

export type EndpointKeyV2 = keyof typeof ENDPOINTS_V2;
