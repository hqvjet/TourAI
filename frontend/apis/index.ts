import axios from 'axios';

export const AUTHEN_API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/auth',
    withCredentials: true,
    timeout: 10000
});

export const SERVICE_API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/service',
    withCredentials: true,
    timeout: 10000
});

export const USER_API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/user',
    withCredentials: true,
    timeout: 10000
});

export const COMMENT_API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/comment',
    withCredentials: true,
    timeout: 10000
});

export * from './auth';
export * from './service';
export * from './user';
export * from './comment';
