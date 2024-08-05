import { USER_API } from './index';

export const userAPI = {
  getAllUser: (params: any = {}) => {
    return USER_API.get('/get', { params });
  },
  createUser: (userData: any) => {
    return USER_API.post('/create', userData);
  },
  getUserById: (userId: number) => {
    return USER_API.get(`/${userId}`);
  },
  updateUser: (userId: number, userData: any) => {
    return USER_API.put(`/${userId}`, userData);
  },
  deleteUser: (userId: number) => {
    return USER_API.delete(`/${userId}`);
  },
};
