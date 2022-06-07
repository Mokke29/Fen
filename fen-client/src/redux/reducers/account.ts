import { Account, FetchAccAction } from '../actions/account';
import { ActionTypes } from '../actions/types';

export const accReducer = (
  state: Account = {
    description: '',
    profile_name: '',
    avatar_path: 'user.png',
    followed: false,
    followers: 0,
  },
  action: FetchAccAction
) => {
  switch (action.type) {
    case ActionTypes.fetchAcc:
      return action.payload;
    default:
      return state;
  }
};
