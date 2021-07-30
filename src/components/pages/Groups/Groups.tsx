import React, { useState, useEffect } from 'react';
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
// import { getGroups, joinGroup, leaveGroup } from '../../actions/groups';
import { PageContainer } from '../../common';
import { RootState } from '../../../redux';
import { sports } from '../Posts/Posts';
import { getGroups } from '../../../redux/actions/groups';

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const Groups = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    selectedSports: [] as string[],
    page: 0,
  });
  const dispatch = useDispatch();
  const {
    groups: { groups },
  } = useSelector((state: typeof RootState) => state);

  const handleSelectSport = (e: any) => {
    if (state.selectedSports.includes(e.target.value)) {
      setState({
        ...state,
        selectedSports: state.selectedSports.filter((item) => item !== e.target.value),
      });
    } else {
      setState({
        ...state,
        selectedSports: [...state.selectedSports, e.target.value],
      });
    }
  };

  useEffect(() => {
    dispatch(getGroups(state.selectedSports));
  }, [state.selectedSports]);

  const handleLoadMore = () => {
    setState({ ...state, page: state.page + 1 });
  };

  // const handleJoinGroup = (groupId) => {
  //   dispatch(joinGroup(groupId, user._id));
  // };

  // const handleLeaveGroup = (groupId) => {
  //   dispatch(leaveGroup(groupId, user._id));
  // };

  return (
    <PageContainer>
      <Grid spacing={4} container justifyContent="center">
        <div style={{ margin: '18px 0 0 0' }}>
          <Link to={'/create-group'}>
            <Button size="large">+ Create Group</Button>
          </Link>
        </div>
        <Grid item xs={12} container justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h5">
              Filter groups by sport
            </Typography>
          </Grid>
          {Object.entries(sports).map((item) => (
            <FormControlLabel
              key={item[0]}
              control={
                <Checkbox
                  color={'primary'}
                  value={item[0]}
                  checked={state.selectedSports.includes(item[0])}
                  onChange={handleSelectSport}
                  icon={item[1]}
                />
              }
              label={item[0]}
            />
          ))}
          <Grid item xs={12}>
            <Typography align="center" variant="h5">
              Showing results for {state.selectedSports.length > 0 ? state.selectedSports.join(', ') : 'all sports'}
            </Typography>
          </Grid>
        </Grid>
        {groups.map((group, key) => {
          return (
            <Grid key={key} item xs={12} md={6} container justifyContent="center">
              <Card style={{ width: '100%' }} className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image={`https://source.unsplash.com/random/?${group.sport}`}
                  title={group.title}
                />
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="h2">
                      {group.title}
                    </Typography>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" component="span">
                        {group.users?.length}
                      </Typography>
                      <PersonOutlinedIcon />
                    </div>
                  </div>
                  {group.description && (
                    <Typography variant="body2" color="textSecondary" component="p">
                      {group.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {/* {group.users.map(({ _id }) => _id).includes(user._id) ? (
                      <>
                        {leavingGroup._id === group._id && leavingGroup.loading === true ? (
                          <Spinner />
                        ) : (
                          <Button onClick={() => handleLeaveGroup(group._id)} size="small" color="primary">
                            Leave group
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {joiningGroup._id === group._id && joiningGroup.loading === true ? (
                          <Spinner />
                        ) : (
                          <Button onClick={() => handleJoinGroup(group._id)} size="small" color="primary">
                            Join group
                          </Button>
                        )}
                      </>
                    )} */}

                    <Link to={`/groups/${group._id}`}>
                      <Button size="small" color="primary">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
        <Grid item xs={12} container justifyContent="center">
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Groups;
