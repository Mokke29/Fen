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
import { Post } from '../post/Post';
import { ViewPost } from '../../components/post/ViewPost';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchProfile(profileName?: string): any;
  fetchAcc(): any;
}

interface Post {
  likes: number;
  comments: number;
  id: number;
  image_path: string;
}

function _Profile(props: Props): JSX.Element {
  let navigate = useNavigate();
  const { user } = useParams();
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [expandDescription, setExpandDescription] = useState(false);
  const [postInfo, setPostInfo] = useState(false);
  const [viewPost, setViewPost] = useState(false);
  const [postId, setPostId] = useState(0);

  async function getPosts(profile: string) {
    await axios({
      data: { profile: profile },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/get',
    })
      .then((response) => {
        if (response) {
          console.log(response.data.posts);
          setPosts(response.data.posts);
        } else {
          console.log('Unauthorized');
        }
      })
      .catch((error) => {
        console.log('CATCH BLOCK');
        if (error.response.status === 401) {
          navigate('/login');
        }
      });
  }

  let displayPosts = posts.map((x) => (
    <div className='post' key={x.id}>
      <img
        onMouseEnter={(e) => {
          setPostInfo(true);
        }}
        onMouseLeave={(e) => {
          setPostInfo(false);
        }}
        className='post-img'
        src={`${serverUrl}static/posts/${x.image_path}`}
        alt=''
      ></img>
      <p
        className='post-img-info'
        onClick={() => {
          setViewPost(true);
          setPostId(x.id);
        }}
      >
        {x.likes} {x.comments}
      </p>
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
        <div className='profile-info-box'>
          <div className='avatar-box'>
            <Avatar
              className='avatar'
              alt='User avatar'
              src={`${serverUrl}static/avatar/${props.profile.avatar_path}`}
              sx={{ width: 150, height: 150 }}
            />
          </div>
          <div className='profile-stats-box'>
            <div className='profile-btn-box'>
              <p className='username'>
                {props.profile.profile_name
                  ? props.profile.profile_name
                  : 'user not found'}
              </p>
              <div className='follow-btn'>
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
              <div className='message-btn'>
                <Button fullWidth={true} variant='contained' onClick={() => {}}>
                  Message
                </Button>
              </div>
            </div>
            <div className='stats'>
              <p className='followers'>
                <b>{props.profile.followers} </b>followers
              </p>
            </div>
            <p
              className={
                expandDescription ? 'description-expanded' : 'description'
              }
            >
              {props.profile.description}
            </p>
            <p
              className='showmore'
              onClick={() => {
                setExpandDescription(!expandDescription);
              }}
            >
              show more
            </p>
          </div>
        </div>

        <div className='posts'>{displayPosts}</div>
        <div>
          {viewPost ? (
            <ViewPost setViewPost={setViewPost} id={postId}></ViewPost>
          ) : (
            ''
          )}
        </div>
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
