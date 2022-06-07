import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile, UserProfile } from '../../redux/actions/profile';
import { StoreState } from '../../redux/reducers/root';
import { Box, TextField, Avatar, Input, Button } from '@mui/material';
import './style.css';
import { serverUrl } from '../../utils/constants';
import axios from 'axios';
import { Account } from '../../redux/actions/account';

interface Props {
  profile: UserProfile;
  acc: Account;
}

function _Signup(props: Props): JSX.Element {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function signup(username: string, password: string) {
    let response = await axios({
      data: { username: username, password: password },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'user/create',
    });
    console.log(response);
    if (response.status === 200) {
      if (response.data.error) {
        setMessage(response.data.msg);
      } else {
        navigate('/account/preferences');
      }
    }
  }

  return (
    <div>
      <nav>
        <Box position={'fixed'} className='nav'>
          <p className='logo'>LOGO</p>
        </Box>
        <Box className='signup-box'>
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
            className='input-box'
            placeholder='Password'
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <div className='signup-btn'>
            <Button
              fullWidth={true}
              variant='contained'
              onClick={() => {
                signup(username, password);
              }}
            >
              Sign up
            </Button>
          </div>
          <div className='loginback'>
            <Link to='/login'>Sign in</Link>
          </div>
          <div className='msg'>
            <p>{message}</p>
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

export const Signup = connect(mapStateToProps, { fetchProfile })(_Signup);
