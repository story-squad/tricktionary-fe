import axios, { AxiosPromise } from 'axios';

const API = process.env.REACT_APP_API_URL;

export const getReactions = (): any => axios.get(`${API}/api/reactions`);
