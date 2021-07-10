import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  Avatar,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import heroImage from '../../../assets/crossfit-box.jpg';
import heroImage2 from '../../../assets/girls-running.jpg';

import PageContainer from '../../common/Layout/PageContainer';
import PostItem from './components/PostItem';
import CreatePost from './components/CreatePost';

// import { getPosts, getStatistics, clearPosts } from '../../actions/posts';
// import { getFeaturedGroups } from '../../actions/groups';

// Sports!
import {
  SportsBaseball,
  SportsRugby,
  SportsBasketball,
  SportsSoccer,
  DirectionsWalk,
  DirectionsRun,
  DirectionsBike,
} from '@material-ui/icons';
import { RootState } from '../../../redux';
import { Spinner } from '../../common';
import { getPosts } from '../../../redux/actions';

const images = [heroImage, heroImage2];

const sports = {
  Running: <DirectionsRun />,
  Biking: <DirectionsBike />,
  Hiking: <DirectionsWalk />,
  Soccer: <SportsSoccer />,
  Basketball: <SportsBasketball />,
  Rugby: <SportsRugby />,
  Tennis: <SportsBaseball />,
};

const useStyles = makeStyles((theme) => ({
  textarea: {
    minWidth: '200px',
    width: '100%',
  },
  list: {
    padding: theme.spacing(1),
  },
  media: {
    height: 140,
  },
  cardHeader: {
    padding: '0 8px 0',
  },
  card: {
    marginTop: '8px',
    padding: '12px 8px 12px 8px',
    width: '100%',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));
const Posts = () => {
  const dispatch = useDispatch();
  const {
    posts: { posts, postsLoading },
    // groups: { featuredGroupsLoading, featuredGroups }, // TODO:
  } = useSelector((state: typeof RootState) => state);

  const classes = useStyles();
  const [state, setState] = useState({
    selectedSports: [] as string[],
    offset: 0,
    isEvent: 0,
  });

  // TODO:
  // useEffect(() => {
  //   if (!stats) getStatistics();
  //   if (!featuredGroups.length) getFeaturedGroups();
  // }, []);

  useEffect(() => {
    dispatch(getPosts(state));
  }, [dispatch, state]);

  const handleSelectSport = (e: ChangeEvent<HTMLInputElement>) => {
    // dispatch(clearPosts()); // TODO: add clear posts function
    if (state.selectedSports.includes(e.target.value)) {
      let obj = {
        ...state,
        selectedSports: state.selectedSports.filter((item) => item !== e.target.value),
      };
      if (state.selectedSports.length === 1) {
        obj.isEvent = 0;
      }
      setState(obj);
    } else {
      let obj = {
        ...state,
        selectedSports: [...state.selectedSports, e.target.value],
      };
      if (state.selectedSports.length === 0) {
        obj.isEvent = 1;
      }
      setState(obj);
    }
  };

  const handleLoadMore = () => {
    setState({ ...state, offset: state.offset + 1 });
  };

  return (
    <PageContainer>
      <div style={styles.heroImage}>
        <div>
          <Typography
            variant="h2"
            style={{
              marginBottom: 20,
              fontWeight: 700,
              textShadow: '1px 1px #444',
            }}
          >
            FitMania! 🏃
          </Typography>
          <Typography
            variant="h4"
            style={{
              marginBottom: 10,
              textShadow: '1px 1px #444',
            }}
          >
            Meet new people with common sport preferences!
          </Typography>
          <Typography
            variant="h6"
            style={{
              marginBottom: 10,
              textShadow: '1px 1px #444',
            }}
          >
            Join local communities and train together to achieve your health goals and become a better self!
          </Typography>
        </div>
      </div>
      <Grid container>
        {/* <Grid container item direction="column" justify="flex-start" alignItems="center" xs={12} sm={4} md={3}>
          <Grid item xs={12} style={{ paddingTop: '10px', width: '100%' }}>
            {!stats ? (
              <Spinner />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3>Our top statistics!</h3>
                {Object.entries(stats).map((entry) => (
                  <Typography key={entry[0]} style={{ textAlign: 'center' }}>
                    {`Total ${entry[0].charAt(0).toUpperCase() + entry[0].slice(1)}: ${entry[1]}`}{' '}
                  </Typography>
                ))}
                <h4>And counting!</h4>
              </div>
            )}
            {!featuredGroupsLoading && featuredGroups?.length > 0 && (
              <>
                <h3 style={{ textAlign: 'center' }}>Featured groups around the globe!</h3>
                <div>
                  {featuredGroups.map((group) => (
                    <Card key={group._id} className={classes.paper} variant="outlined" className={classes.card}>
                      <CardContent>
                        <CardHeader
                          className={classes.cardHeader}
                          avatar={
                            <Link to={`/groups/${group._id}`}>
                              <Avatar
                                src={`https://source.unsplash.com/random/?${group.sport}`}
                                aria-label="group"
                                className={classes.avatar}
                              >
                                {group?.title?.[0].toUpperCase()}
                              </Avatar>
                            </Link>
                          }
                          title={<Link to={`/groups/${group._id}`}>{group?.title}</Link>}
                        />
                        <p>{group.users.length} active users!</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </Grid>
        </Grid> */}
        <Grid container item xs={12} sm={8} md={9}>
          <Grid item xs={12} container justify="center">
            <Grid item xs={12}>
              <Typography align="center" variant="h5">
                Filter events by sport
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
          <Grid item xs={12} className={classes.list}>
            <CreatePost />
          </Grid>
          {/* TODO: uncomment and fix */}
          {/* <Grid item xs={12}>
            <Grid container direction="row" alignItems="center" justify="space-between" className={classes.list}>
              <Grid item xs={12}>
                {createPostLoading && <Spinner />}
                {posts.length > 0 && posts.map((post) => <PostItem key={post._id} postItem={post} />)}
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={12} container style={{ marginTop: 30, marginBottom: 30 }} justify="center">
            <Button
              disabled={postsLoading}
              variant="contained"
              onClick={handleLoadMore}
              style={{ height: 40, width: 120 }}
            >
              {postsLoading ? <Spinner size={1.3} /> : 'Load More'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Posts;

const styles = {
  heroImage: {
    backgroundImage: `url(${images[Math.floor(Math.random() * 2)]})`,
    width: '100%',
    height: 400,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 30,
    marginTop: 30,
  },
};
