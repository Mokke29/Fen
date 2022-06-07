import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile, UserProfile } from '../../redux/actions/profile';
import { StoreState } from '../../redux/reducers/root';
import { Box, TextField, Avatar, Input, Button } from '@mui/material';
import './style.css';
import { serverUrl } from '../../utils/constants';
import axios from 'axios';
import { Account, fetchAcc } from '../../redux/actions/account';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
}

function _Login(props: Props): JSX.Element {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function login(username: string, password: string) {
    let response = await axios({
      data: { username: username, password: password },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'auth/login',
    });
    console.log(response);
    if (response.status === 200) {
      props.fetchAcc();
      navigate('/');
    }
  }
  return (
    <div>
      <nav>
        <Box position={'fixed'} className='nav'>
          <p className='logo'>LOGO</p>
        </Box>
        <Box className='login-box'>
          <Input
            color='primary'
            className='input-box'
            placeholder='Username'
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <Input
            color='primary'
            className='input-box-text'
            placeholder='Password'
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          <div className='login-btn'>
            <Button
              fullWidth={true}
              variant='contained'
              onClick={() => {
                login(username, password);
              }}
            >
              Log In
            </Button>
          </div>
          <p className='or'>OR</p>
          <div className='signup'>
            <Button
              fullWidth={true}
              variant='contained'
              onClick={() => {
                navigate('/signup');
              }}
            >
              Sign up
            </Button>
          </div>
          <div className='forgot'>
            <Link to='/account/password/reset'>Forgot password?</Link>
          </div>
        </Box>
      </nav>
    </div>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const Login = connect(mapStateToProps, { fetchAcc })(_Login);
