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
import { refreshToken } from '../../utils/refreshToken';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
}

function _NavBar(props: Props): JSX.Element {
  const [options, setOptions] = useState<Array<string>>([]);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken(() => {
      navigate('/login');
    });
    props.fetchAcc();
  }, []);

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

  return (
    <nav className='nav-obj'>
      <Box className='nav'>
        <p className='logo'>LOGO</p>
        <Autocomplete
          loading={true}
          options={options}
          freeSolo={true}
          className='search'
          onChange={(event, value) => {
            console.log(event.type);
            if (event.type === 'click') {
              if (value != null) {
                navigate(`${value}`);
                window.location.reload();
              }
            }
            if (event.type === 'keydown') {
              navigate(`${options[0]}`);
              window.location.reload();
            }
          }}
          onInputChange={(event, value) => {
            searching(value);
          }}
          renderInput={(params) => <TextField {...params} label='Search' />}
        ></Autocomplete>
        <div className='link'>
          <Link to='/account/inbox'>
            <ChatBubbleOutlineIcon />
          </Link>
        </div>
        <div className='link'>
          <Link to='/account/post'>
            <AddBoxIcon />
          </Link>
        </div>
        <div className='link'>
          <Link to='/notprofile/discover'>
            <ExploreIcon />
          </Link>
        </div>
        <div className='link'>
          <Link to='/favpopup'>
            <FavoriteBorderIcon />
          </Link>
        </div>
        <div
          className='link'
          onClick={() => {
            if (menu) {
              setMenu(false);
            } else {
              setMenu(true);
            }
          }}
        >
          <Avatar
            className='nav-avatar'
            alt='User avatar'
            src={`${serverUrl}static/avatar/${props.acc.avatar_path}`}
          />
          <Box
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          ></Box>
        </div>
      </Box>
      {menu ? (
        <div className='popup-box link'>
          <div
            className='list-item'
            onClick={() => {
              navigate(`/${props.acc.profile_name}`);
              window.location.reload();
            }}
          >
            Profile
          </div>
          <div
            className='list-item'
            onClick={() => {
              navigate('/account/preferences');
              window.location.reload();
            }}
          >
            Preferences
          </div>
        </div>
      ) : (
        ''
      )}
    </nav>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const NavBar = connect(mapStateToProps, { fetchProfile, fetchAcc })(
  _NavBar
);
