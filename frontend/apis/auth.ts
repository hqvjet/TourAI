import { AUTHEN_API } from './index';

export const authAPI = {
  registerUser: (userData: { [key: string]: any }) => {
    return AUTHEN_API.post('/register', userData, { withCredentials: true });
  },
  login: (loginData: { [key: string]: any }) => {
    return AUTHEN_API.post('/login', loginData, { withCredentials: true });
  },
  cookie: () => {
    return AUTHEN_API.get('/me', { withCredentials: true });
  },
  logout: () => {
    return AUTHEN_API.post('/logout', {}, { withCredentials: true });
  }
};
