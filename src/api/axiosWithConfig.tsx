import axios, { AxiosInstance } from 'axios';
import { token } from '../utils';
import { REACT_APP_API_URL } from '../utils/constants';

// Attempts to read the API URL from your ENV, falls back to localhost
const baseURL = REACT_APP_API_URL;

export const axiosWithAuth = (): AxiosInstance =>
  axios.create({
    baseURL,
    headers: {
      Authorization: token.get(),
    },
  });

export const axiosWithoutAuth = (): AxiosInstance =>
  axios.create({
    baseURL,
  });
