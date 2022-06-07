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

interface Post {
  content: string;
  created_by: string;
  image_path: string;
}

function _Profile(props: Props): JSX.Element {
  let navigate = useNavigate();
  const { user } = useParams();
  const [posts, setPosts] = useState<Array<Post>>([]);

  async function getPosts(profile: string) {
    let response = await axios({
      data: { profile: profile },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/get',
    });
    setPosts(JSON.parse(response.data.posts));
    let x = JSON.parse(response.data.posts[0]);
    console.log(x);
  }

  let displayPosts = posts.map((x) => (
    <div>
      <p>{x.content}</p>
      <p>{x.created_by}</p>
      <p>{x.image_path}</p>
    </div>
  ));

  async function follow(profile: string) {
    let response = await axios({
      data: { profile: profile },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'user/follow',
    });
    window.location.reload();
  }

  async function unfollow(profile: string) {
    let response = await axios({
      data: { profile: profile },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'user/unfollow',
    });
    window.location.reload();
  }

  useEffect(() => {
    props.fetchProfile(user);
    getPosts(user!);
  }, []);

  return (
    <>
      <Box className='profile-box'>
        <div className='profile-info'>
          <p className='username'>
            {props.profile.profile_name
              ? props.profile.profile_name
              : 'user not found'}
          </p>
          <div className='signup-btn'>
            <Button
              fullWidth={true}
              variant='contained'
              onClick={() => {
                if (props.profile.followed) {
                  unfollow(props.profile.profile_name);
                } else {
                  follow(props.profile.profile_name);
                }
              }}
            >
              {props.profile.followed ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
          <div className='stats'>
            <p className='followers'>followers {props.profile.followers}</p>
          </div>
        </div>
        <div className='avatar-box'>
          <Avatar
            className='avatar'
            alt='User avatar'
            src={`${serverUrl}static/avatar/${props.profile.avatar_path}`}
            sx={{ width: 150, height: 150 }}
          />
        </div>
        <p className='description'>Descirpiton:{props.profile.description}</p>
        {displayPosts}
      </Box>
    </>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const Profile = connect(mapStateToProps, { fetchProfile, fetchAcc })(
  _Profile
);
