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

function _ViewPost(props: Props): JSX.Element {
  const [options, setOptions] = useState<Array<string>>([]);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  async function searching(inputValue: string) {
    if (inputValue.length > 2) {
      let response = await axios({
        withCredentials: true,
        data: { profile: inputValue },
        method: 'post',
        url: serverUrl + 'user/search/profile',
      });
      setOptions(matchSorter(response.data.profiles, inputValue));
    }
  }

  useEffect(() => {
    props.fetchAcc();
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      <div>
        <div className='blur-bg'></div>
        <div className='post-bg'>
          <p>POST {props.id}</p>
          <div
            className='close-btn'
            onClick={() => {
              document.body.style.overflow = 'visible';
              props.setViewPost(false);
            }}
          >
            <CloseIcon color='info'></CloseIcon>
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
