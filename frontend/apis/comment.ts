import { COMMENT_API } from './index';

export const commentAPI = { 
  getComments: (params = {}) => {
    return COMMENT_API.get('/', { params });
  },
  getCommentById: (service_id: number) => {
    return COMMENT_API.get(`/${service_id}`);
  },
  createComment: (comment: any) => {
    return COMMENT_API.post('/', comment);
  },
  getCommentsByBusiness: (user_id: number, params = {}) => {
    return COMMENT_API.get(`/business/${user_id}`, { params });
  }
};
