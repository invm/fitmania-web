import { useState, useEffect } from 'react';
import { Grid, Typography, Button, Card, CardHeader, Avatar, Popover, CardActions } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { PageContainer, Spinner } from '../../common';
import { getGroup, deleteGroup, resetGroups, joinGroup, leaveGroup } from '../../../redux/actions/groups';
import IGroup from '../../../interfaces/Group';
import { showMessage } from '../../../redux/actions';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../redux';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  cardHeader: {
    padding: '0 8px 0',
  },
  card: {
    marginTop: '8px',
    padding: '12px 8px 12px 8px',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const GroupDetails = ({ match, history }: RouteChildrenProps<{ id: string }>) => {
  const classes = useStyles();
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState({} as IGroup);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // TODO: pull user from redux and redirect to own profile in case the user is listed

  const handleJoinGroup = async (groupId: string) => {
    setLoading(true);
    await joinGroup(groupId);
    await fetchAndSetGroup(groupId);
    setLoading(false);
  };

  const handleLeaveGroup = async (groupId: string) => {
    setLoading(true);
    await leaveGroup(groupId);
    await fetchAndSetGroup(groupId);
    setLoading(false);
  };
  const { user } = useSelector((state: typeof RootState) => state.user);

  const fetchAndSetGroup = async (id: string) => {
    setLoading(true);
    let _group = await getGroup(id);
    if (_group) setGroup(_group);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      match?.params?.id && (await fetchAndSetGroup(match?.params.id));
    })();
  }, [match?.params?.id]);

  // let obj = {
  //   image: `https://source.unsplash.com/random/?${group?.sport}`,
  //   imageText: group?.sport,
  //   title: group?.title,
  //   athletes: group?.users?.length,
  // };

  const handleGroupDelete = async () => {
    try {
      await deleteGroup(group._id);
      await dispatch(resetGroups());
      history.push('/groups');
    } catch (error) {
      showMessage(t('common.error'), error?.message, 'error');
    }
  };

  const handleDeleteClick = (currentTarget: EventTarget & HTMLButtonElement) => {
    setDeleteAnchorEl(currentTarget);
  };

  const handleDeleteClose = () => {
    setDeleteAnchorEl(null);
  };

  const deleteOpen = Boolean(deleteAnchorEl);
  const id = deleteOpen ? 'delete-popover' : undefined;

  return (
    <PageContainer>
      <Grid container justifyContent="center" style={{ paddingBottom: 50 }}>
        {loading ? (
          <Spinner size={3} />
        ) : !group?._id ? (
          'Group not found'
        ) : (
          <>
            <Grid item xs={12}></Grid>
            <Grid container spacing={1} item xs={12} direction="column">
              <Grid item container>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title={group.title} />
                    <CardActions>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        {loading ? (
                          <Spinner />
                        ) : (
                          <>
                            <div>
                              {group?.admin?._id === user?._id && (
                                <Button
                                  variant="outlined"
                                  onClick={({ currentTarget }) => handleDeleteClick(currentTarget)}
                                  size="large"
                                  color="primary"
                                >
                                  Delete Group
                                </Button>
                              )}
                            </div>

                            {group?.admin?._id !== user?._id && (
                              <>
                                {group?.users?.map(({ _id }) => _id).includes(user?._id) ? (
                                  <Button
                                    variant="outlined"
                                    onClick={() => handleLeaveGroup(group._id)}
                                    size="medium"
                                    color="primary"
                                  >
                                    Leave group
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    onClick={() => handleJoinGroup(group._id)}
                                    size="medium"
                                    color="primary"
                                  >
                                    Join group
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </CardActions>
                  </Card>
                  <Popover
                    id={id}
                    open={deleteOpen}
                    anchorEl={deleteAnchorEl}
                    onClose={handleDeleteClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Grid container justifyContent="center">
                      <Grid container item xs={12} justifyContent="center">
                        <Typography>Are you sure?</Typography>
                      </Grid>
                      <Grid container item xs={12} justifyContent="center">
                        <Grid item>
                          <Button onClick={handleGroupDelete}>Yes</Button>
                        </Grid>
                        <Grid item>
                          <Button onClick={handleDeleteClose}>No</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Popover>
                </Grid>
              </Grid>
              <h3>Group athletes</h3>
              <Grid container spacing={1}>
                {group.users.map((user) => (
                  <Grid key={user._id} item xs={12} md={6}>
                    <Card raised className={classes.card}>
                      <CardHeader
                        className={classes.cardHeader}
                        avatar={
                          <Link to={`/user/${user._id}`}>
                            <Avatar
                              src={`${process.env.REACT_APP_MEDIA}${user?.image}`}
                              aria-label="user initials"
                              className={classes.avatar}
                            >
                              {user?.name?.[0].toUpperCase()}
                            </Avatar>
                          </Link>
                        }
                        title={
                          <Link to={`/user/${user._id}`}>
                            {user.name} {user.lastname}
                          </Link>
                        }
                        subheader={group?.admin._id === user._id ? 'Group admin' : ''}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* TODO: move to i18n */}
              {/* <h4>Group posts</h4> */}
              {/* <Grid container spacing={1}>
                <Grid item xs={12}>
                  {groupPostsLoading && <Spinner />}
                  {!groupPostsLoading &&
                    groupPosts.length > 0 &&
                    groupPosts.map((post) => <PostItem key={post._id} postItem={post} />)}
                </Grid>
              </Grid> */}
            </Grid>
          </>
        )}
      </Grid>
    </PageContainer>
  );
};

export default GroupDetails;
