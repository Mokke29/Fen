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
  postId: number;
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
  commentId: number | undefined;
}

interface ViewReplies {
  status: boolean;
  commentId: number;
}

function _CommentSection(props: Props): JSX.Element {
  const [newComment, setNewComment] = useState('');
  const [replyMode, setReplyMode] = useState<ReplyMode>();
  const [viewReplies, setViewReplies] = useState<ViewReplies>();

  const [comments, setComments] = useState<Array<Comment>>([]);
  const [replies, setReplies] = useState<Array<Comment>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getComments(props.postId);
    props.fetchAcc();
    document.body.style.overflow = 'hidden';
  }, []);

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
    getComments(props.postId);
  }

  async function createReply(
    content: string,
    postId: number,
    commentId: number | undefined,
    e: any
  ) {
    e.preventDefault();
    let response = await axios({
      data: {
        content: content,
        post_id: postId,
        comment_id: viewReplies?.commentId,
      },
      method: 'post',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/comment/reply',
    });
    getReplies(viewReplies?.commentId);
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
        console.log('ERROR');
        if (error.response.status === 401) {
          navigate('/login');
        }
      });
  }

  function getReplies(commentId: number | undefined) {
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
        console.log('ERROR');
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
          console.log(replyMode?.status);
          if (commentId > -1) {
            console.log('GET REPLIES');
            getReplies(viewReplies?.commentId);
          } else {
            console.log('GET COMMENTS');
            getComments(props.postId);
          }
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
            onClick={(e) => {
              console.log(viewReplies?.commentId);
              setReplyMode({
                status: true,
                replyTo: x.creator,
                commentId: viewReplies?.commentId,
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
              setViewReplies({ status: !viewReplies?.status, commentId: x.id });
              getReplies(x.id);
            }}
          >
            View replies
          </p>
          <p
            className='comment-reply'
            onClick={(e) => {
              setViewReplies({ status: !viewReplies?.status, commentId: x.id });
              setReplyMode({
                status: true,
                replyTo: x.creator,
                commentId: viewReplies?.commentId,
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
      <div className='comment-section'>{displayComments}</div>
      {replyMode?.status ? (
        <div>
          <p className='reply-to'>{replyMode.replyTo}</p>
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
                createReply(
                  newComment,
                  props.postId,
                  viewReplies?.commentId,
                  e
                );
              } else {
                createComment(newComment, props.postId, e);
              }
            }}
          >
            Send
          </Button>
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

export const CommentSection = connect(mapStateToProps, {
  fetchProfile,
  fetchAcc,
})(_CommentSection);
