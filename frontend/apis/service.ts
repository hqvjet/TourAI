import { SERVICE_API } from './index';

export const serviceAPI = {
  createService: (serviceData: any) => {
    return SERVICE_API.post('/create', serviceData, { withCredentials: true });
  },
  createServiceImage: (serviceId: number, imageData: FormData) => {
    return SERVICE_API.post(`/${serviceId}/images`, imageData, {
      headers: {'Content-Type': 'multipart/form-data'},});
  },
  getServices: (params?: { type?: string, page?: number, limit?: number }) => {
    return SERVICE_API.get('/', { params });
  },
  searchServices: (search: string, type: string) => {
    const query = `?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}`;
    return SERVICE_API.get(`/${query}`);
  },
  getServiceById: (serviceId: number) => {
    return SERVICE_API.get(`/${serviceId}`);
  },
  getServiceImages: (serviceId: number) => {
    return SERVICE_API.get(`/${serviceId}/images`);
  },
  getAllServices: (params: any = {}) => {
    return SERVICE_API.get('/all', { params });
  },
  deleteService: (serviceId: number) => {
    return SERVICE_API.delete(`/${serviceId}`);
  },
  getMyServices: (userId: number) => {
    return SERVICE_API.get('/my_services', { params: { user_id: userId }, withCredentials: true });
  },
};
