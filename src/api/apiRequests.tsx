import axios, { AxiosResponse } from 'axios';

const API = process.env.REACT_APP_API_URL;

export const getReactions = (): Promise<AxiosResponse> =>
  axios.get(`${API}/api/reactions`);

// interface GetReactionsResponseData {}
