import axios, { AxiosResponse } from 'axios';

const API = process.env.REACT_APP_API_URL;

export const getReactions = (): Promise<AxiosResponse> =>
  axios.get(`${API}/api/reactions`);

export const getWords = (): Promise<AxiosResponse> =>
  axios.get(`${API}/api/words/scoop/3`);

export const postChoice = (choice: any): Promise<AxiosResponse> =>
  axios.post(`${API}/api/choice/`);
