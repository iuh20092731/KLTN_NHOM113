import { RootState } from '../store';

export const selectIsAuthenticated = (state: RootState) => {
  return !!state.user.token || !!sessionStorage.getItem('token');
};
export const selectAuthToken = (state: RootState) => state.user.token;