import axios, { AxiosResponse } from 'axios';
import { postApiReaction } from '../types/apiTypes';
import { REACT_APP_API_URL } from '../utils/constants';

export const getReactions = (): Promise<AxiosResponse> =>
  axios.get(`${REACT_APP_API_URL}/api/reactions`);

export const getWords = (): Promise<AxiosResponse> =>
  axios.get(`${REACT_APP_API_URL}/api/words/scoop/3`);

export const postReaction = (
  reaction: postApiReaction,
): Promise<AxiosResponse> =>
  axios.post(`${REACT_APP_API_URL}/api/definition-reactions`, reaction);
