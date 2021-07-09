import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItemIcon,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {
  ExitToApp,
  Home,
  Group,
  PersonAdd,
  Notifications,
  AccountCircle,
  Close,
  ArrowForward,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/user';
import { Link } from 'react-router-dom';
import Header from './Header';
import { RootState } from '../../../redux';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

const Sidebar = () => {
  const { isAuthenticated } = useSelector(
    (state: typeof RootState) => state.user
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (side: string, open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = (side: string) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      {isAuthenticated ? (
        <>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Close />
              </ListItemIcon>
            </ListItem>
            {[
              { text: 'Home', link: '/', icon: <Home /> },
              { text: 'Groups', link: '/groups', icon: <Group /> },
              { text: 'Friends', link: '/friends', icon: <PersonAdd /> },
            ].map(({ text, link, icon }) => (
              <Link to={link} key={text}>
                <ListItem button>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {[
              { text: 'Profile', link: '/profile', icon: <AccountCircle /> },
              {
                text: 'Notifications',
                link: '/notifications',
                icon: <Notifications />,
              },
            ].map(({ text, link, icon }) => (
              <Link to={link} key={text}>
                <ListItem button>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>

          <Divider />
          <List>
            <Link to="/" onClick={() => dispatch(logout())}>
              <ListItem button>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary={'Log Out'} />
              </ListItem>
            </Link>
          </List>
        </>
      ) : (
        <>
          <List>
            {[
              { text: 'Register', link: '/register', icon: <AccountCircle /> },
              {
                text: 'Login',
                link: '/login',
                icon: <ArrowForward />,
              },
            ].map(({ text, link, icon }) => (
              <Link to={link} key={text}>
                <ListItem button>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </>
      )}
    </div>
  );

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
    </div>
  );
};

export default Sidebar;
