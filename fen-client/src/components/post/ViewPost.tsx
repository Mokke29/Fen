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
  avatar_path: string;
  id: number;
}

interface ReplyMode {
  status: boolean;
  replyTo: string;
  commentId: number;
}

function _ViewPost(props: Props): JSX.Element {
  const [options, setOptions] = useState<Array<string>>([]);
  const [postDetails, setPostDetails] = useState<PostDetails>();
  const [newComment, setNewComment] = useState('');
  const [postOwner, setPostOwner] = useState(false);
  const [replyMode, setReplyMode] = useState<ReplyMode>();
  const [viewReplies, setViewReplies] = useState(false);
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [replies, setReplies] = useState<Array<Comment>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getComments(props.id);
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

  async function createComment(content: string, postId: number, e: any) {
    e.preventDefault();
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

  async function createReply(
    content: string,
    postId: number,
    commentId: number,
    e: any
  ) {
    e.preventDefault();
    let response = await axios({
      data: { content: content, post_id: postId, comment_id: commentId },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/comment/reply',
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

  function getReplies(commentId: number) {
    axios({
      data: { comment_id: commentId },
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
          setReplies(response.data.comments);
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

  async function deleteComment(commentId: number) {
    await axios({
      data: { comment_id: commentId },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/comment/delete',
    })
      .then((response) => {
        if (response.status === 200) {
        }
      })
      .catch((error) => {
        console.log('CATCH BLOCK');
        if (error.response.status === 401) {
          navigate('/login');
        }
      });
  }

  let displayReplies = replies.map((x) => (
    <div className='comment' key={x.pub_date}>
      <div className='main-comment'>
        <div className='comment-row-content'>
          <Avatar
            className='avatar-comment'
            alt='User avatar'
            src={`${serverUrl}static/avatar/${x.avatar_path}`}
            sx={{ width: 30, height: 30 }}
          />
          <p className='comment-creator'>{x.creator}</p>
          <p className='comment-content'>{x.content}</p>
        </div>
        <div className='comment-row-info'>
          <p
            className='comment-reply'
            onClick={() => {
              setViewReplies(!viewReplies);
              getReplies(x.id);
            }}
          >
            Vhow replies
          </p>
          <p
            className='comment-reply'
            onClick={(e) => {
              setReplyMode({
                status: true,
                replyTo: x.creator,
                commentId: x.id,
              });
            }}
          >
            Reply
          </p>
          {x.creator === props.acc.profile_name ? (
            <p
              className='comment-reply'
              onClick={() => {
                deleteComment(x.id);
              }}
            >
              Delete comment
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  ));

  let displayComments = comments.map((x) => (
    <div className='comment' key={x.pub_date}>
      <div className='main-comment'>
        <div className='comment-row-content'>
          <Avatar
            className='avatar-comment'
            alt='User avatar'
            src={`${serverUrl}static/avatar/${x.avatar_path}`}
            sx={{ width: 30, height: 30 }}
          />
          <p className='comment-creator'>{x.creator}</p>
          <p className='comment-content'>{x.content}</p>
        </div>
        <div className='comment-row-info'>
          <p
            className='comment-reply'
            onClick={() => {
              setViewReplies(!viewReplies);
              getReplies(x.id);
            }}
          >
            View replies
          </p>
          <p
            className='comment-reply'
            onClick={(e) => {
              setReplyMode({
                status: true,
                replyTo: x.creator,
                commentId: x.id,
              });
            }}
          >
            Reply
          </p>
          {x.creator === props.acc.profile_name ? (
            <p
              className='comment-reply'
              onClick={() => {
                deleteComment(x.id);
              }}
            >
              Delete comment
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className='reply-comment'>
        {viewReplies ? (
          <div className='comment-section-reply'>{displayReplies}</div>
        ) : (
          ''
        )}
      </div>
    </div>
  ));

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
            <div className='comment-section'>{displayComments}</div>
            {replyMode?.status ? (
              <div>
                <p>{replyMode.replyTo}</p>
              </div>
            ) : (
              ''
            )}
            <Box className='create-comment-box'>
              <Input
                color='primary'
                className='comment-input-box'
                placeholder='content'
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
              <div className='send-btn'>
                <Button
                  fullWidth={true}
                  variant='contained'
                  onClick={(e) => {
                    if (replyMode?.status) {
                      createReply(newComment, props.id, replyMode.commentId, e);
                    } else {
                      createComment(newComment, props.id, e);
                    }
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
