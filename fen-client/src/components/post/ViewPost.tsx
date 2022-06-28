import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProfile, UserProfile } from '../../redux/actions/profile';
import { StoreState } from '../../redux/reducers/root';
import {
  Box,
  Autocomplete,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
  ListItemIcon,
  Button,
  Input,
} from '@mui/material';
import { matchSorter } from 'match-sorter';
import axios from 'axios';
import './style.css';
import bg from '../../assets/images/bg.jpg';
import { serverUrl } from '../../utils/constants';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Account, fetchAcc } from '../../redux/actions/account';
import CloseIcon from '@mui/icons-material/Close';
import { CommentSection } from './CommentSection';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
  setViewPost: Function;
  id: number;
}

interface PostDetails {
  content: string;
  image_path: string;
  likes: number;
  comments: number;
  creator: string;
  creator_avatar: string;
}

function _ViewPost(props: Props): JSX.Element {
  const [postDetails, setPostDetails] = useState<PostDetails>();
  const [newComment, setNewComment] = useState('');
  const [postOwner, setPostOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getDetails(props.id);
    props.fetchAcc();
    document.body.style.overflow = 'hidden';
  }, []);

  async function getDetails(id: number) {
    let response = await axios({
      withCredentials: true,
      data: { id: id },
      method: 'post',
      url: serverUrl + 'post/details',
    });
    setPostDetails({
      content: response.data.content,
      image_path: response.data.image_path,
      likes: response.data.likes,
      comments: response.data.comments,
      creator: response.data.creator,
      creator_avatar: response.data.creator_avatar,
    });
    if (response.data.creator === props.acc.profile_name) {
      setPostOwner(true);
    }
  }

  async function deletePost(postId: number) {
    await axios({
      data: { post_id: postId },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/delete',
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Window refresh');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log('CATCH BLOCK');
        if (error.response.status === 401) {
          navigate('/login');
        }
      });
  }

  return (
    <>
      <div>
        <div className='blur-bg'></div>
        <div className='post-bg'>
          <img
            className='post-left-div'
            src={`${serverUrl}static/posts/${postDetails?.image_path}`}
            alt='post'
          />
          <div className='post-right-div'>
            <div
              className='close-btn'
              onClick={() => {
                document.body.style.overflow = 'visible';
                props.setViewPost(false);
              }}
            >
              <CloseIcon color='info'></CloseIcon>
            </div>
            <div className='avatar-user'>
              <Avatar
                className='avatar'
                alt='User avatar'
                src={`${serverUrl}static/avatar/${postDetails?.creator_avatar}`}
                sx={{ width: 40, height: 40 }}
              />
              <p className='post-creator'>{postDetails?.creator}</p>
              {postOwner ? (
                <div className='post-delete-btn'>
                  <Button
                    fullWidth={true}
                    variant='contained'
                    onClick={(e) => {
                      deletePost(props.id);
                    }}
                  >
                    Delete post
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>
            <hr className='solid-divider'></hr>
            <div className='creator-comment'>
              <Avatar
                className='avatar-comment'
                alt='User avatar'
                src={`${serverUrl}static/avatar/${postDetails?.creator_avatar}`}
                sx={{ width: 30, height: 30 }}
              />
              <p className='comment-creator'>{postDetails?.creator}</p>
              <p className='content'>{postDetails?.content}</p>
            </div>
            <hr className='solid-divider'></hr>
            <CommentSection postId={props.id}></CommentSection>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const ViewPost = connect(mapStateToProps, { fetchProfile, fetchAcc })(
  _ViewPost
);
