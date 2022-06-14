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

interface Comment {
  content: string;
  pub_date: string;
  creator: string;
}

function _ViewPost(props: Props): JSX.Element {
  const [options, setOptions] = useState<Array<string>>([]);
  const [expandContent, setExpandContent] = useState(false);
  const [expandCommentSection, setExpandCommentSection] = useState(false);
  const [postDetails, setPostDetails] = useState<PostDetails>();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Array<Comment>>([]);
  const navigate = useNavigate();

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
    console.log(response);
  }

  async function createComment(content: string, postId: number) {
    let response = await axios({
      data: { content: content, post_id: postId },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/comment',
    });
    console.log(response);
  }

  async function getComments(postId: number) {
    await axios({
      data: { post_id: postId },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/comment/get',
    })
      .then((response) => {
        if (response) {
          console.log(response.data.comments);
          setComments(response.data.comments);
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

  let displayComments = comments.map((x) => (
    <div className='comment' key={x.pub_date}>
      <p className='comment-creator'>{x.creator}</p>
      <p className='comment-content'>{x.content}</p>
    </div>
  ));

  useEffect(() => {
    getComments(props.id);
    getDetails(props.id);
    props.fetchAcc();
    document.body.style.overflow = 'hidden';
  }, []);

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
            </div>
            <hr className='solid-divider'></hr>
            <p className={expandContent ? 'content-expanded' : 'content'}>
              {postDetails?.content}
            </p>
            <p
              className='showmore'
              onClick={() => {
                setExpandContent(!expandContent);
              }}
            >
              show more
            </p>
            <hr className='solid-divider'></hr>
            <div
              className={
                expandCommentSection
                  ? 'comment-section-expanded'
                  : 'comment-section'
              }
            >
              {displayComments}
            </div>
            <p
              className='showmore'
              onClick={() => {
                setExpandCommentSection(!expandCommentSection);
              }}
            >
              show all comments
            </p>
            <Box className='create-comment-box'>
              <Input
                color='primary'
                className='input-box'
                placeholder='content'
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
              <div className='signup-btn'>
                <Button
                  fullWidth={true}
                  variant='contained'
                  onClick={() => {
                    createComment(newComment, props.id);
                  }}
                >
                  Send
                </Button>
              </div>
            </Box>
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
