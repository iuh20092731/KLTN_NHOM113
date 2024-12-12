import { store } from '../redux/store';
// Import your logout action if you have one
// import { logout } from '../redux/slices/authSlice';

export const handleAuthError = () => {
  sessionStorage.removeItem('token');
  // store.dispatch(logout());
  window.location.href = '/auth/signin';
};

export const getAuthToken = () => {
  return sessionStorage.getItem('token');
}; 