import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Sidebar } from '../common';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, Snackbar, Slide } from '@material-ui/core';

// import {
//   Posts,
//   Groups,
//   Profile,
//   Friends,
//   NotFoundPage,
//   Notifications,
//   EditProfile,
//   SinglePost,
//   GroupDetails,
//   GroupCreate,
//   UpdateGroup,
//   SearchResults
// } from './pages';

import { RootState } from '../../redux';
import { darkTheme, lightTheme } from './App.helpers';
import { verifySession } from '../../redux/actions';
import { getRoutes } from './routes';

const App = () => {
  const { theme } = useSelector((state: typeof RootState) => state.user);
  const [creditOpen, setCreditOpen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifySession());
  }, [dispatch]);

  return (
    <Router>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Sidebar />
        <Switch>
          {/* <PrivateRoute exact path="/" component={Posts} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
          <PrivateRoute exact path="/groups" component={Groups} />
          <PrivateRoute exact path="/group/create/" component={GroupCreate} />
          <PrivateRoute
            exact
            path="/group/update/:id"
            component={UpdateGroup}
          /> */}
          {/* <PrivateRoute exact path="/groups/:id" component={GroupDetails} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/profile/:id" component={Profile} />
          <PrivateRoute exact path="/friends" component={Friends} />
          <PrivateRoute exact path="/search/:query" component={SearchResults} />
          <PrivateRoute exact path="/notifications" component={Notifications} />
          <PrivateRoute exact path="/posts/:id" component={SinglePost} /> */}
          {/* <PublicRoute exact path="/register" component={Register} /> */}
          {getRoutes()}
          <Redirect path="*" to="/404" />
        </Switch>
        <Alert />
        <Snackbar
          autoHideDuration={null}
          TransitionComponent={Slide}
          open={creditOpen}
          onClose={() => {
            setCreditOpen(false);
          }}
          message={'Images courtesy of Unsplash.com'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </ThemeProvider>
    </Router>
  );
};

export default App;
