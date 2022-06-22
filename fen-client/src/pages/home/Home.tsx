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
import useInfiniteScroll from './useInfiniteScroll';
import { ViewPost } from '../../components/post/ViewPost';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchProfile(profileName?: string): any;
  fetchAcc(): any;
}

interface FollowedPosts {
  likes: number;
  comments: number;
  id: number;
  creator: string;
  image_path: string;
  content: string;
}

function _Home(props: Props): JSX.Element {
  const [data, setData] = useState<Array<FollowedPosts>>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useInfiniteScroll(moreData);
  const [postInfo, setPostInfo] = useState(false);
  const [viewPost, setViewPost] = useState(false);
  const [postId, setPostId] = useState(0);

  const loadData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + 'post/get/followed/1',
    })
      .then((response) => {
        setData(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function moreData() {
    axios({
      method: 'get',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: serverUrl + `post/get/followed/${page}?sort=latest`,
    })
      .then((response) => {
        setData([...data, ...response.data.posts]);
        setPage(page + 1);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  if (data.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <ul className='posts-ul'>
        {data.map((x, key) => (
          <li className='post-li' key={x.id}>
            <p className='post-creator-name'>{x.creator}</p>
            <img
              onMouseEnter={(e) => {
                setPostInfo(true);
              }}
              onMouseLeave={(e) => {
                setPostInfo(false);
              }}
              className='post-img-home'
              src={`${serverUrl}static/posts/${x.image_path}`}
              alt=''
            ></img>
            <p className='post-likes'>
              {x.likes} {x.comments}
            </p>
            <p className='post-content'>{x.content}</p>
          </li>
        ))}
      </ul>
      <div>
        {viewPost ? (
          <ViewPost setViewPost={setViewPost} id={postId}></ViewPost>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const Home = connect(mapStateToProps, { fetchProfile, fetchAcc })(_Home);
