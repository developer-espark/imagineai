import axios from 'axios';


import { VITE_APP_API_URL } from '../config/env';
import type { ApiResponseType } from './types';

export const Axios = axios.create({ baseURL: `${VITE_APP_API_URL}` });

export const setupAxios = (store) => {
  // logic of set token in header
  Axios.interceptors.request.use((request) => {
    const authToken = store.getState().token?.token || null;

    if (request.headers !== undefined && authToken) {
      request.headers.Authorization = `Bearer ${authToken}`;
    }

    request.withCredentials = true;
    return request;
  });
  // for toast message setup
  Axios.interceptors.response.use(
    (res) => {
      const { toast } = res.data;
      
      return res.data;
    },
    (e) => {
      if (e?.response?.status === 401) {
      }
      if (
        e.response.status === 400 ||
        e.response.status === 500 ||
        e.response.status === 401 ||
        e.response.status === 422
      ) {
        const { toast } = e.response.data;
         
      }

      throw e.response.data;
    }
  );
};

// ******************
type AxiosArgsType = Readonly<{
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  extraOptions?: AxiosRequestConfig;
}>;

export const axiosBaseQuery = async (args: AxiosArgsType) => {
  try {
    const result = await Axios({
      url: args.url,
      method: args.method,
      data: args.data,
      params: args.params,
      ...args.extraOptions,
    });

    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as ApiResponseType;
    return {
      error: err,
    };
  }
};

export default axios;