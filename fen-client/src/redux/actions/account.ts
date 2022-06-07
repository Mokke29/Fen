import axios from 'axios';
import { Dispatch } from 'redux';
import { serverUrl } from '../../utils/constants';
import { ActionTypes } from './types';

export interface Account {
  description: string;
  profile_name: string;
  avatar_path: string;
  followed: boolean | null;
  followers: number;
}

export interface FetchAccAction {
  type: ActionTypes.fetchAcc;
  payload: Account;
}

export const fetchAcc = () => {
  return async (dispatch: Dispatch) => {
    let response: any;
    console.log('TEST');
    response = await axios({
      url: serverUrl + 'user/account',
      method: 'get',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    dispatch<FetchAccAction>({
      type: ActionTypes.fetchAcc,
      payload: response.data,
    });
  };
};
