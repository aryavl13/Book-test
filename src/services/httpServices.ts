import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const instance: AxiosInstance = axios.create({
  baseURL: `http://172.206.238.83/api`,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      const accessToken = parsedUserInfo.authentication.accessToken;
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const responseBody = (response: any) => response.data;

const requests = {
  get: (url: string, params?: any) => instance.get(url, { params }).then(responseBody),
 
  post: (url: string, data?: any, headers?: any) =>
    instance.post(url, data, headers).then(responseBody),

  put: (url: string, data?: any) => instance.put(url, data).then(responseBody),
  delete: (url: string, data?: any) => instance.delete(url, data).then(responseBody),
};

export default requests;