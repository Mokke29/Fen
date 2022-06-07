import axios from 'axios';
import { Dispatch } from 'redux';
import { serverUrl } from '../../utils/constants';
import { ActionTypes } from './types';

export interface UserProfile {
  description: string;
  profile_name: string;
  avatar_path: string;
  followed: boolean | null;
  followers: number;
}

export interface FetchProfileAction {
  type: ActionTypes.fetchProfile;
  payload: UserProfile;
}

export const fetchProfile = (profileName?: string) => {
  return async (dispatch: Dispatch) => {
    let response: any;
    response = await axios({
      data: { profile: profileName },
      url: serverUrl + 'user/profile',
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    dispatch<FetchProfileAction>({
      type: ActionTypes.fetchProfile,
      payload: response.data,
    });
  };
};
