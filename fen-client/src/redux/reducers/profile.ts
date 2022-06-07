import { FetchProfileAction, UserProfile } from '../actions/profile';
import { ActionTypes } from '../actions/types';

export const profileReducer = (
  state: UserProfile = {
    description: '',
    profile_name: '',
    avatar_path: 'user.png',
    followed: false,
    followers: 0,
  },
  action: FetchProfileAction
) => {
  switch (action.type) {
    case ActionTypes.fetchProfile:
      return action.payload;
    default:
      return state;
  }
};
