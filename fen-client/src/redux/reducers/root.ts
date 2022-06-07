import { combineReducers } from '@reduxjs/toolkit';
import { Account } from '../actions/account';
import { UserProfile } from '../actions/profile';
import { accReducer } from './account';
import { profileReducer } from './profile';

export interface StoreState {
  profile: UserProfile;
  acc: Account;
}

export const rootReducer = combineReducers<StoreState>({
  profile: profileReducer,
  acc: accReducer,
});
