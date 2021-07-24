import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import IPost from '../../../../../interfaces/Post';
import { sports } from '../../Posts';

import { Info, ExpandMore } from '@material-ui/icons';
import {
  askToJoinEvent,
  admitToEvent,
  joinEvent,
  leaveEvent,
  rejectJoinRequest,
  removeFromRejectedList,
} from '../../../../../redux/actions/posts';
import { Link } from 'react-router-dom';
import IUser from '../../../../../interfaces/User';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface PostItemProps {
  post: IPost;
  user: IUser;
}

const useStyles = makeStyles((theme) => ({
  media: {
    width: '95%',
    paddingTop: '56.25%', // 16:9
    margin: '8px',
    borderRadius: '5px',
  },

  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
}));

const PostEventSection = ({ post, user }: PostItemProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const handleEventModalOpen = () => {
    setEventModalOpen(true);
  };

  const handleEventModalClose = () => {
    setEventModalOpen(false);
  };

  const handleAskToJoinEvent = async () => {
    setEventLoading(true);
    dispatch(askToJoinEvent(post._id));
    setEventLoading(false);
  };

  const handleAdmitToEvent = async (userId: string) => {
    setEventLoading(true);
    await dispatch(admitToEvent(post._id, userId));
    setEventLoading(false);
  };

  const handleRejectFromEvent = async (userId: string) => {
    setEventLoading(true);
    await dispatch(rejectJoinRequest(post._id, userId));
    setEventLoading(false);
  };

  const handleRemoveFromRejected = async (userId: string) => {
    setEventLoading(true);
    await dispatch(removeFromRejectedList(post._id, userId));
    setEventLoading(false);
  };

  const handleJoinEvent = async () => {
    setEventLoading(true);
    await dispatch(joinEvent(post._id));
    setEventLoading(false);
    setEventModalOpen(false);
  };

  const handleLeaveEvent = async () => {
    setEventLoading(true);
    await dispatch(leaveEvent(post._id));
    setEventLoading(false);
  };

  if (post.event)
    return (
      <Grid
        container
        alignItems="center"
        style={{ padding: 8, marginTop: 8 }}
        className={post.event && 'bg-gradient rounded-border '}
      >
        <Grid item xs={6} lg={4} container justifyContent="center">
          <Typography align="center" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            {sports[post.event.eventType]}
            {`${post.event.eventType} at ${post.event.pace} pace`}
          </Typography>
        </Grid>
        {new Date(post.event.startDate).getTime() - new Date().getTime() < 0 && (
          <Grid item xs={6} lg={2}>
            <Typography style={{ color: 'white' }} align="center">
              {'Past Event'}
            </Typography>
          </Grid>
        )}
        {new Date(post.event.startDate).getTime() - new Date().getTime() > 0 && post.event && post.event.openEvent ? (
          <Grid item xs={6} lg={2}>
            <Typography style={{ color: 'white' }} align="center">
              {'Everybody can join'}
            </Typography>
          </Grid>
        ) : new Date(post.event.startDate).getTime() - new Date().getTime() > 0 &&
          post.event &&
          !post.event.openEvent ? (
          <Grid item xs={6} lg={2}>
            <Typography style={{ color: 'white' }} align="center">
              {'You may ask to join'}
            </Typography>
          </Grid>
        ) : null}
        <Grid item xs={6} lg={2}>
          <Typography style={{ color: 'white' }} align="center">
            {post.event.participants.length}/{post.event.limitParticipants} {t('post.joined')}.
          </Typography>
        </Grid>
        <Grid item xs={4} lg={3}>
          <Typography style={{ color: 'white' }} align="center">
            {new Date(post.event.startDate).toLocaleString('en-GB').substr(0, 17)}
          </Typography>
        </Grid>
        <Grid item xs={2} lg={1}>
          <Typography align="center">
            <IconButton style={{ color: 'white' }} onClick={handleEventModalOpen} aria-label="settings">
              <Info />
            </IconButton>
            <Modal
              style={{ overflowY: 'auto' }}
              open={eventModalOpen}
              onClose={handleEventModalClose}
              aria-labelledby="event"
              aria-describedby="event-description"
            >
              <Card
                style={{
                  top: `${40}%`,
                  left: `${42}%`,
                  transform: `translate(-${40}%, -${40}%)`,
                }}
                className={classes.paper}
              >
                <CardMedia
                  className={classes.media}
                  image={`https://source.unsplash.com/random/500x300?${post.event.eventType}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.event.eventType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    A {post.event.eventType} event is scheduled for the{' '}
                    {new Date(post.event.startDate).toLocaleString('en-GB').substr(0, 17)}, looking for{' '}
                    {post.event.limitParticipants - post.event.participants.length} more{' '}
                    {post.event.participants.length > 1 ? 'participants' : 'participant'} out of{' '}
                    {post.event.limitParticipants} total invited.
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                      <Typography>Participants</Typography>
                    </AccordionSummary>
                    {post.event.participants.map((item) => (
                      <AccordionDetails key={item._id}>
                        <Link to={item._id === user._id ? `/profile` : `/user/${item._id}`}>
                          <Typography>{item.name}</Typography>
                        </Link>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                  {post.author._id === user._id &&
                    new Date(post.event.startDate).getTime() - new Date().getTime() > 0 &&
                    post.event.pendingApprovalParticipants.length > 0 && (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{t('post.awaiting_admission')}</Typography>
                        </AccordionSummary>
                        {post.event.pendingApprovalParticipants.map((item) => (
                          <AccordionDetails key={item._id}>
                            <Link
                              to={item._id === user._id ? `/profile` : `/user/${item._id}`}
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography>{item.name}</Typography>
                            </Link>

                            <div style={{ display: 'flex' }}>
                              {!eventLoading ? (
                                <>
                                  <Button size="small" color="primary" onClick={() => handleAdmitToEvent(item._id)}>
                                    {t('post.admit')}
                                  </Button>
                                  <Button size="small" color="primary" onClick={() => handleRejectFromEvent(item._id)}>
                                    {t('post.reject')}
                                  </Button>
                                </>
                              ) : (
                                <CircularProgress color="primary" size={20} />
                              )}
                            </div>
                          </AccordionDetails>
                        ))}
                      </Accordion>
                    )}
                  {post.author._id === user._id &&
                    new Date(post.event.startDate).getTime() - new Date().getTime() > 0 &&
                    post.event.rejectedParticipants.length > 0 && (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{t('post.rejected')}</Typography>
                        </AccordionSummary>
                        {post.event.rejectedParticipants.map((item) => (
                          <AccordionDetails key={item._id}>
                            <Link
                              to={item._id === user._id ? `/profile` : `/user/${item._id}`}
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography>{item.name}</Typography>
                              <div>
                                {!eventLoading ? (
                                  <>
                                    <Button
                                      size="small"
                                      color="primary"
                                      onClick={() => handleRemoveFromRejected(item._id)}
                                    >
                                      {t('post.remove')}
                                    </Button>
                                  </>
                                ) : (
                                  <CircularProgress color="primary" size={20} />
                                )}
                              </div>
                            </Link>
                          </AccordionDetails>
                        ))}
                      </Accordion>
                    )}
                </CardContent>
                {new Date(post.event.startDate).getTime() - new Date().getTime() > 0 && post.author._id !== user._id && (
                  <CardActions>
                    {(post.event.openEvent &&
                      post.event.limitParticipants - post.event.participants.length > 0 &&
                      post.event.pendingApprovalParticipants.findIndex((item) => item._id === user._id) === -1 &&
                      post.event.rejectedParticipants.findIndex((item) => item._id === user._id) === -1 &&
                      post.event.participants.findIndex((item) => item._id === user._id) === -1) ||
                    (post.event.openEvent &&
                      post.event.limitParticipants - post.event.participants.length > 0 &&
                      post.event.participants.findIndex((item) => item._id === user._id) === -1) ? (
                      <>
                        {!eventLoading ? (
                          <Button size="small" color="primary" onClick={handleJoinEvent}>
                            {t('post.join')}
                          </Button>
                        ) : (
                          <CircularProgress color="primary" size={20} />
                        )}
                      </>
                    ) : null}
                    {post.event.pendingApprovalParticipants.findIndex((item) => item._id === user._id) > -1 && (
                      <Typography>{t('post.asked_to_join')}</Typography>
                    )}
                    {!post.event.openEvent &&
                      post.event.limitParticipants - post.event.participants.length > 0 &&
                      post.event.rejectedParticipants.findIndex((item) => item._id === user._id) === -1 &&
                      post.event.participants.findIndex((item) => item._id === user._id) === -1 &&
                      post.event.pendingApprovalParticipants.findIndex((item) => item._id === user._id) === -1 && (
                        <>
                          {!eventLoading ? (
                            <Button size="small" color="primary" onClick={handleAskToJoinEvent}>
                              {t('post.ask_to_join')}
                            </Button>
                          ) : (
                            <CircularProgress color="primary" size={20} />
                          )}
                        </>
                      )}
                    {post.event.participants.findIndex((item) => item._id === user._id) !== -1 &&
                      post.author._id !== user._id && (
                        <>
                          {!eventLoading ? (
                            <Button size="small" color="primary" onClick={handleLeaveEvent}>
                              {t('post.leave_event')}
                            </Button>
                          ) : (
                            <CircularProgress color="primary" size={20} />
                          )}
                        </>
                      )}
                  </CardActions>
                )}
              </Card>
            </Modal>
          </Typography>
        </Grid>
      </Grid>
    );
  return null;
};

export default PostEventSection;
