import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile, UserProfile } from '../../redux/actions/profile';
import { StoreState } from '../../redux/reducers/root';
import { Box, TextField, Avatar, Input, Button } from '@mui/material';
import './style.css';
import { serverUrl } from '../../utils/constants';
import axios from 'axios';
import { Account, fetchAcc } from '../../redux/actions/account';
import { refreshToken } from '../../utils/refreshToken';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
}

interface CustomAvatar {
  file: string | Blob;
}

function _Preferences(props: Props): JSX.Element {
  let navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [profileName, setProfileName] = useState(props.acc.profile_name);
  const [message, setMessage] = useState('');
  const [avatars] = useState(['koala', 'panda', 'pug', 'raccoon', 'shiba']);
  const [customAvatar, setCustomAvatar] = useState<CustomAvatar>({ file: '' });
  const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const formRef = React.useRef() as React.MutableRefObject<HTMLFormElement>;

  useEffect(() => {
    props.fetchAcc();
  }, []);

  async function save(e: any) {
    e.preventDefault();
    if (customAvatar.file !== '') {
      const formData = new FormData();
      formData.append('file', customAvatar?.file!);
      formData.append('profile_name', profileName);
      formData.append('description', description);
      let response = await axios({
        method: 'post',
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
        url: serverUrl + 'user/edit/profile',
        data: formData,
      });
      console.log(response);
    } else {
      console.log('You didnt select any avatar...');
      const formData = new FormData();
      formData.append('file', 'false');
      formData.append('profile_name', profileName);
      formData.append('description', description);
      let response = await axios({
        method: 'post',
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
        url: serverUrl + 'user/edit/profile',
        data: formData,
      });
      console.log(response);
    }
    window.location.reload();
  }

  return (
    <div>
      <Box className='pref-box'>
        <p>PREFERENCES {props.acc.profile_name}</p>
        <form onSubmit={save} ref={formRef}>
          <img
            className='avatar'
            onClick={() => {
              fileRef.current.click();
            }}
            src={serverUrl + `static/avatar/${props.acc.avatar_path}`}
            alt='avatar'
          />
          <input
            ref={fileRef}
            type='file'
            name='customAvatar'
            hidden
            accept='image/*'
            onChange={(e) => {
              setCustomAvatar({ file: e.target.files![0] });
            }}
          />
          <label>
            Change displayed name:
            <Input
              color='primary'
              className='input-box'
              onChange={(event) => {
                setProfileName(event.target.value);
              }}
            />
          </label>
          <div className='input-box'>
            <label>
              Description:
              <textarea
                value={description}
                placeholder={props.acc.description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </label>
          </div>

          <button type='submit' className='save-btn'>
            SAVE
          </button>
        </form>
      </Box>
    </div>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const Preferences = connect(mapStateToProps, { fetchAcc })(_Preferences);
