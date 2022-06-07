import React from 'react';
import { connect } from 'react-redux';
import { fetchProfile, UserProfile } from '../redux/actions/profile';
import { StoreState } from '../redux/reducers/root';

interface Props {
  profile: UserProfile;
}

function _tmp(props: Props): JSX.Element {
  return <div></div>;
}

const mapStateToProps = (state: StoreState): { profile: UserProfile } => {
  return { profile: state.profile };
};

export const tmp = connect(mapStateToProps, { fetchProfile })(_tmp);
