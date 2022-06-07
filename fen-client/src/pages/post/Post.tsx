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

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
}

interface Image {
  file: string | Blob;
}
interface ImageUrl {
  file: string | ArrayBuffer | null;
}

function _Post(props: Props): JSX.Element {
  let navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<Image>({ file: '' });
  const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const formRef = React.useRef() as React.MutableRefObject<HTMLFormElement>;

  async function save(e: any) {
    e.preventDefault();
    if (image.file !== '') {
      const formData = new FormData();
      formData.append('image', image?.file!);
      formData.append('content', description);
      let response = await axios({
        method: 'post',
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
        url: serverUrl + 'post/create',
        data: formData,
      });
      console.log(response);
    } else {
      console.log('You didnt select any avatar...');
    }
    // window.location.reload();
  }
  //serverUrl + `static/assets/post.png`
  return (
    <div>
      <Box className='post-box'>
        <form onSubmit={save} ref={formRef} className='post-form'>
          <img
            className='image'
            onClick={() => {
              fileRef.current.click();
            }}
            src={serverUrl + `static/assets/post.png`}
            alt='avatar'
          />
          <input
            ref={fileRef}
            type='file'
            name='customAvatar'
            hidden
            accept='image/*'
            onChange={(e) => {
              setImage({ file: e.target.files![0] });
            }}
          />
          <div className='input-box-post'>
            <label>
              Post description
              <textarea
                value={description}
                placeholder=''
                className='post-description'
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </label>
            <button type='submit' className='save-btn'>
              Create post
            </button>
          </div>
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

export const Post = connect(mapStateToProps, { fetchAcc })(_Post);
