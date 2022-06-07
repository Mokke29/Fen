import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile, UserProfile } from '../../redux/actions/profile';
import { StoreState } from '../../redux/reducers/root';
import { Box, TextField, Avatar, Button } from '@mui/material';
import './style.css';
import { serverUrl } from '../../utils/constants';
import { FollowTheSigns } from '@mui/icons-material';
import axios from 'axios';
import { Account, fetchAcc } from '../../redux/actions/account';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchProfile(profileName?: string): any;
  fetchAcc(): any;
}

function _Home(props: Props): JSX.Element {
  let navigate = useNavigate();

  return (
    <>
      <Box className='home-box'>
        <p>HOME PAGE</p>
      </Box>
    </>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const Home = connect(mapStateToProps, { fetchProfile, fetchAcc })(_Home);
