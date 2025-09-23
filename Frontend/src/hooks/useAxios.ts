/* eslint-disable @typescript-eslint/no-explicit-any */
import axios,{ type AxiosRequestConfig }  from 'axios';
import { useState } from 'react';
import type { ApiResponseType } from '../base-axios/types';
import { VITE_APP_API_URL } from '../config/env';

export const Axios = axios.create({ baseURL: `${VITE_APP_API_URL}` });

export const useAxiosGet = (): [
  (
    url: string,
    config?: AxiosRequestConfig<object>,
    baseUrl?: boolean
  ) => Promise<{ data?: any; error?: any; response_type?: string }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean },
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getRequest = async (
    url: string,
    config: AxiosRequestConfig<object> = {},
    baseUrl = true
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);

      // TODO: give appropriate type here
      let response: any;
      if (baseUrl) {
        response = await Axios.get(url, { ...config });
      } else {
        response = await axios(url, { ...config });
      }

      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data, response_type: response.response_type };
    } catch (error: any) {
      const typedError = error as ApiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [getRequest, { isLoading, isError, isSuccess }];
};

export const useAxiosPost = (): [
  (
    url: string,
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any; response_type?: string }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean },
] => {
  // ** State **
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const postRequest = async (
    url: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);
      const response: { data: any; response_type?: string } = await Axios.post(
        url,
        data,
        { ...config }
      );
      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data, response_type: response.response_type };
    } catch (error: any) {
      const typedError = error as ApiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
        response_type: "ERROR",
      };
    }
  };

  return [postRequest, { isLoading, isError, isSuccess }];
};
