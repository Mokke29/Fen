import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Profile } from './pages/profile/Profile';
import Error from './pages/Error';
import { NavBar } from './components/NavBar/NavBar';
import './style.css';
import { Login } from './pages/login/Login';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Signup } from './pages/signup/Signup';
import { Preferences } from './pages/preferences/Preferences';
import { Account, fetchAcc } from './redux/actions/account';
import { UserProfile } from './redux/actions/profile';
import { connect } from 'react-redux';
import { StoreState } from './redux/reducers/root';
import { Post } from './pages/post/Post';

interface Props {
  profile: UserProfile;
  acc: Account;
  fetchAcc(): any;
}

function _App(props: Props): JSX.Element {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/account/preferences'
            element={
              props.acc.profile_name !== '' ? <Preferences /> : <Login />
            }
          />
          <Route
            path='/account/post'
            element={props.acc.profile_name !== '' ? <Post /> : <Login />}
          />
          <Route
            path='/'
            element={props.acc.profile_name !== '' ? <Home /> : <Login />}
          />
          <Route
            path='/:user'
            element={props.acc.profile_name !== '' ? <Profile /> : <Login />}
          />
          <Route path='*' element={<Error />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

const mapStateToProps = (
  state: StoreState
): { profile: UserProfile; acc: Account } => {
  return { profile: state.profile, acc: state.acc };
};

export const App = connect(mapStateToProps, { fetchAcc })(_App);
