import React, { ChangeEvent, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Avatar,
  IconButton,
  TextField,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Popover,
  Collapse,
  Divider,
  Tooltip,
  Button,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentRoundedIcon from '@material-ui/icons/CommentRounded';
import AddCommentIcon from '@material-ui/icons/AddComment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';

// Sports!
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import SportsRugbyIcon from '@material-ui/icons/SportsRugby';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import { RootState } from '../../../../redux';
import { Spinner } from '../../../common';

// import {
//   deletePost,
//   editPost,
//   createComment,
//   editComment,
//   deleteComment,
//   askToJoinEvent,
//   admitToEvent,
//   joinEvent,
//   leaveEvent,
//   rejectJoinRequest,
//   removeFromRejectedList,
//   sharePost,
//   unsharePost,
//   likePost,
//   dislikePost,
// } from '../../../actions/posts';

const sports = {
  Running: <DirectionsRunIcon />,
  Biking: <DirectionsBikeIcon />,
  Hiking: <DirectionsWalkIcon />,
  Soccer: <SportsSoccerIcon />,
  Basketball: <SportsBasketballIcon />,
  Rugby: <SportsRugbyIcon />,
  Tennis: <SportsBaseballIcon />,
};

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: '8px',
    padding: '12px 8px 0 8px',
  },
  cardHeader: {
    padding: '0 8px 0',
  },
  cardContent: {
    paddingBottom: 0,
  },
  textarea: {
    minWidth: '200px',
    width: '100%',
  },
  media: {
    width: '95%',
    paddingTop: '56.25%', // 16:9
    margin: '8px',
    borderRadius: '5px',
  },
  list: {
    padding: theme.spacing(1),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  small: {
    fontSize: '0.8rem',
  },
  typography: {
    padding: theme.spacing(2),
  },
  imageRemoveIcon: {
    top: 50,
    marginTop: -30,
    left: '88%',
    zIndex: 10,
    padding: 4,
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

interface Comment {
  // TODO: extract interfaces from here
  _id: string;
  user: {
    _id: string;
    name: string;
    lastname: string;
  };
  created_at: Date;
  text: string;
}

interface PostItemProps {
  user: {
    _id: string;
    name: string;
    lastname: string;
  };
  likes: string[];
  _id: string;
  text: string;
  image: string;
  comments: Comment[]; // TODO: check the model
  created_at: Date;
}

const PostItem = (postItem: PostItemProps) => {
  // const {
  //   postItem,
  //   eventLoading,
  //   deletePost,
  //   editPost,
  //   singlePostId,
  //   singlePostLoading,
  //   createPostLoading,
  //   createComment,
  //   editComment,
  //   deleteComment,
  //   user,
  //   askToJoinEvent,
  //   admitToEvent,
  //   joinEvent,
  //   leaveEvent,
  //   rejectJoinRequest,
  //   removeFromRejectedList,
  //   sharePost,
  //   unsharePost,
  //   likePost,
  //   dislikePost,
  // } = props;

  const {
    user: { user },
    posts: { singlePostId, singlePostLoading },
  } = useSelector((state: typeof RootState) => state);

  const dispatch = useDispatch();

  const classes = useStyles();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({
    _id: postItem._id,
    text: postItem.text,
    image: postItem.image,
  });
  const [prevPostDetails, setPrevPostDetails] = useState({
    _id: postItem._id,
    text: postItem.text,
    image: postItem.image,
  });
  const [commentEditMode, setCommentEditMode] = useState({
    id: '',
    editMode: false,
  });
  const [commentEditText, setCommentEditText] = useState('');

  // const handleDeleteClick = (event) => {
  //   setDeleteAnchorEl(event.currentTarget);
  // };

  const handleDeleteClose = () => {
    setDeleteAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const handlePopoverClick = (event: ChangeEvent<HTMLInputElement>) => {
  //   setPopoverAnchorEl(event.currentTarget);
  // };

  const handleCommentText = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  // const handlePostEdit = () => {
  //   if (editedPost.text.length) {
  //     editPost(editedPost);
  //     setEditMode(!editMode);
  //   } else {
  //     props.showError('Please do not send empty posts.');
  //   }
  // };

  // const handlePostDelete = () => {
  //   deletePost(postItem._id);
  // };

  // const handleCommentSend = () => {
  //   createComment(postItem._id, commentText);
  //   setCommentText('');
  //   setCommentToggle(!commentToggle);
  // };

  // const handleCommentEdit = (commentId, text) => {
  //   setCommentEditMode({ id: commentId, editMode: true });
  //   setCommentEditText(text);
  // };

  // const handleCommentEditSend = () => {
  //   editComment(postItem._id, commentEditMode.id, commentEditText);
  //   setCommentEditMode({ id: null, editMode: false });
  //   setCommentEditText('');
  // };

  // const handleCommentDelete = (commentId: string) => {
  //   dispatch(deleteComment(postItem._id, commentId));
  // };

  // const handleImageRemove = () => {
  //   setEditedPost({ ...editedPost, image: null });
  // };

  const handlePostEditCancel = () => {
    setEditedPost(prevPostDetails);
    setEditMode(false);
  };

  const [eventModalOpen, setEventModalOpen] = React.useState(false);

  // const handleEventModalOpen = () => {
  //   setEventModalOpen(true);
  // };

  // const handleEventModalClose = () => {
  //   setEventModalOpen(false);
  // };

  // const handleAskToJoinEvent = () => {
  //   askToJoinEvent(postItem._id, user._id);
  // };

  // const handleAdmitToEvent = (userId, entryId) => {
  //   admitToEvent(postItem._id, userId, entryId);
  // };

  // const handleRejectFromEvent = (userId, entryId) => {
  //   rejectJoinRequest(postItem._id, userId, entryId);
  // };

  // const handleRemoveFromRejected = (userId, entryId) => {
  //   removeFromRejectedList(postItem._id, userId, entryId);
  // };

  // const handleJoinEvent = () => {
  //   joinEvent(postItem._id, user._id);
  // };

  // const handleLeaveEvent = () => {
  //   let entryId = postItem.event.participants.find((item) => item.id === user._id)._id;
  //   leaveEvent(postItem._id, user._id, entryId);
  // };

  // const handleShare = () => {
  //   if (user.sharedPosts.includes(postItem._id)) {
  //     unsharePost(postItem._id);
  //   } else {
  //     sharePost(postItem._id);
  //   }
  // };

  // const handleLike = (_id: string) => {
  //   dispatch(likePost(_id));
  // };

  // const handleDislike = (_id: string) => {
  //   disptach(dislikePost(_id));
  // };

  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  const deleteOpen = Boolean(deleteAnchorEl);
  const id = deleteOpen ? 'delete-popover' : undefined;

  return (
    <Card raised className={classes.card} key={postItem._id}>
      {singlePostId === postItem._id && singlePostLoading && <Spinner />}
      {!(singlePostId === postItem._id) && (
        <>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <Link to={`/profile/${postItem.user._id}`}>
                <Avatar aria-label="user initials" className={classes.avatar}>
                  {postItem.user?.name?.[0].toUpperCase()}
                </Avatar>
              </Link>
            }
            action={
              <>
                {/* <IconButton onClick={handlePopoverClick} aria-label="settings"> */}
                {/* <MoreVertIcon />
                </IconButton> */}
                <Popover
                  id={popoverId}
                  open={popoverOpen}
                  anchorEl={popoverAnchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Grid style={{ padding: '8px' }}>
                    <Grid item xs={12}>
                      <Link to={{ pathname: `/posts/${postItem._id}` }}>
                        <Button style={{ width: '100%' }}>
                          <ViewHeadlineIcon style={{ marginRight: '8px' }} />
                          View Post Details
                        </Button>
                      </Link>
                    </Grid>
                    {user._id === postItem.user._id && (
                      <>
                        <Grid item xs={12}>
                          <Button
                            onClick={() => {
                              setEditMode(!editMode);
                              handlePopoverClose();
                            }}
                            style={{ width: '100%' }}
                          >
                            <EditIcon style={{ marginRight: '8px' }} />
                            Edit Post
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          {/* <Button onClick={handleDeleteClick} style={{ width: '100%' }}>
                            <DeleteIcon style={{ marginRight: '8px' }} />
                            Delete Post
                          </Button> */}
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
                            <Grid container justify="center">
                              <Grid container item xs={12} justify="center">
                                <Typography>Are you sure?</Typography>
                              </Grid>
                              <Grid container item xs={12} justify="center">
                                <Grid item>{/* <Button onClick={handlePostDelete}>Yes</Button> */}</Grid>
                                <Grid item>
                                  <Button onClick={handleDeleteClose}>No</Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Popover>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Popover>
              </>
            }
            title={
              <Link to={`/profile/${postItem.user._id}`}>
                {postItem.user?.name} {postItem.user?.lastname}
              </Link>
            }
            subheader={new Date(postItem.created_at).toLocaleString('en-GB').substr(0, 17)}
          />
          {/* TODO: kill yourself after seeing that younger you wrote somethings like this */}
          {/* {postItem.isEvent && (
            <Grid
              container
              alignItems="center"
              style={{ padding: 8, marginTop: 8 }}
              className={postItem.isEvent && 'bg-gradient rounded-border '}
            >
              {postItem.isEvent && new Date(postItem.event.startDate).getTime() - new Date().getTime() < 0 && (
                <Grid item xs={6} lg={2}>
                  <Typography align="center">{'Past Event'}</Typography>
                </Grid>
              )}
              {new Date(postItem.event.startDate).getTime() - new Date().getTime() > 0 &&
                postItem.event &&
                postItem.event.openEvent && (
                  <Grid item xs={6} lg={2}>
                    <Typography align="center">{'Free to join'}</Typography>
                  </Grid>
                )}
              {new Date(postItem.event.startDate).getTime() - new Date().getTime() > 0 &&
                postItem.event &&
                !postItem.event.openEvent && (
                  <Grid item xs={6} lg={2}>
                    <Typography align="center">{'Private Event'}</Typography>
                  </Grid>
                )}
              <Grid item xs={6} lg={2}>
                <Typography align="center">
                  {postItem.event.participants.length}/{postItem.event.limitParticipants} joined.
                </Typography>
              </Grid>
              <Grid item xs={6} lg={4} container justify="center">
                <Typography align="center" style={{ display: 'flex', alignItems: 'center' }}>
                  {sports[postItem.event.eventType]}
                  {`${postItem.event.eventType} at ${postItem.event.pace} pace`}
                </Typography>
              </Grid>
              <Grid item xs={4} lg={3}>
                <Typography align="center">
                  {new Date(postItem.event.startDate).toLocaleString('en-GB').substr(0, 17)}
                </Typography>
              </Grid>
              <Grid item xs={2} lg={1}>
                <Typography align="center">
                  <IconButton onClick={handleEventModalOpen} aria-label="settings">
                    <InfoIcon />
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
                        image={`https://source.unsplash.com/random/500x300?${postItem.event.eventType}`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {postItem.event.eventType}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          A {postItem.event.eventType} event is scheduled for the{' '}
                          {new Date(postItem.event.startDate).toLocaleString('en-GB').substr(0, 17)}, looking for{' '}
                          {postItem.event.limitParticipants - postItem.event.participants.length} more{' '}
                          {postItem.event.participants.length > 1 ? 'participants' : 'participant'} out of{' '}
                          {postItem.event.limitParticipants} total invited.
                        </Typography>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>Participants</Typography>
                          </AccordionSummary>
                          {postItem.event.participants.map((item) => (
                            <AccordionDetails key={item._id}>
                              <Link to={`/profile/${item.id}`}>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                        {postItem.user._id === user._id &&
                          new Date(postItem.event.startDate).getTime() - new Date().getTime() > 0 &&
                          postItem.event.awaitingApprovalParticipants.length > 0 && (
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography className={classes.heading}>Awaiting Admission</Typography>
                              </AccordionSummary>
                              {postItem.event.awaitingApprovalParticipants.map((item) => (
                                <AccordionDetails key={item._id}>
                                  <Link
                                    to={`/profile/${item.id}`}
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
                                            onClick={() => handleAdmitToEvent(item.id, item._id)}
                                          >
                                            Admit
                                          </Button>
                                          <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleRejectFromEvent(item.id, item._id)}
                                          >
                                            Reject
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
                        {postItem.user._id === user._id &&
                          new Date(postItem.event.startDate).getTime() - new Date().getTime() > 0 &&
                          postItem.event.rejectedParticipants.length > 0 && (
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography className={classes.heading}>Rejected</Typography>
                              </AccordionSummary>
                              {postItem.event.rejectedParticipants.map((item) => (
                                <AccordionDetails key={item._id}>
                                  <Link
                                    to={`/profile/${item.id}`}
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
                                            onClick={() => handleRemoveFromRejected(item.id, item._id)}
                                          >
                                            Remove
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
                      {new Date(postItem.event.startDate).getTime() - new Date().getTime() > 0 &&
                        postItem.user._id !== user._id && (
                          <CardActions>
                            {(postItem.event.openEvent &&
                              postItem.event.limitParticipants - postItem.event.participants.length > 0 &&
                              postItem.event.awaitingApprovalParticipants.findIndex((item) => item.id === user._id) ===
                                -1 &&
                              postItem.event.participants.findIndex((item) => item.id === user._id) === -1) ||
                            (postItem.event.openEvent &&
                              postItem.event.limitParticipants - postItem.event.participants.length > 0 &&
                              postItem.event.participants.findIndex((item) => item.id === user._id) === -1) ? (
                              <>
                                {!eventLoading ? (
                                  <Button size="small" color="primary" onClick={handleJoinEvent}>
                                    Join
                                  </Button>
                                ) : (
                                  <CircularProgress color="primary" size={20} />
                                )}
                              </>
                            ) : null}
                            {postItem.event.awaitingApprovalParticipants.findIndex((item) => item.id === user._id) >
                              -1 && <Typography>Asked to join.</Typography>}
                            {!postItem.event.openEvent &&
                              postItem.event.limitParticipants - postItem.event.participants.length > 0 &&
                              postItem.event.rejectedParticipants.findIndex((item) => item.id === user._id) === -1 &&
                              postItem.event.participants.findIndex((item) => item.id === user._id) === -1 &&
                              postItem.event.awaitingApprovalParticipants.findIndex((item) => item.id === user._id) ===
                                -1 && (
                                <>
                                  {!eventLoading ? (
                                    <Button size="small" color="primary" onClick={handleAskToJoinEvent}>
                                      Ask To Join
                                    </Button>
                                  ) : (
                                    <CircularProgress color="primary" size={20} />
                                  )}
                                </>
                              )}
                            {postItem.event.participants.findIndex((item) => item.id === user._id) !== -1 &&
                              postItem.event.initiator.id !== user._id && (
                                <>
                                  {!eventLoading ? (
                                    <Button size="small" color="primary" onClick={handleLeaveEvent}>
                                      Leave Event
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
          )} */}
          <Grid container>
            {editedPost.image && (
              <Grid item xs={12} md={5}>
                {editMode && (
                  <IconButton
                    className={classes.imageRemoveIcon}
                    // onClick={handleImageRemove}
                    aria-label="remove image from post"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <CardMedia
                  className={classes.media}
                  image={`${process.env.MEDIA}${postItem.image}`}
                  title={postItem.text}
                />
              </Grid>
            )}
            <Grid item xs={12} md={postItem.image ? 7 : 12}>
              <CardContent>
                {editMode && (
                  <TextField
                    className={classes.textarea}
                    id="post-text"
                    label="Share some thoughts..."
                    placeholder=""
                    multiline
                    name="text"
                    onChange={(e) => setEditedPost({ ...editedPost, text: e.target.value })}
                    value={editedPost.text}
                    variant="outlined"
                  />
                )}
                {!editMode && (
                  <Typography variant="body1" color="textPrimary" component="p">
                    {postItem.text}
                  </Typography>
                )}
              </CardContent>
            </Grid>
          </Grid>
          <CardActions>
            {/* {editMode && (
              <>
                <Tooltip style={{ marginTop: '8px', marginRight: '8px' }} title="Save Changes">
                  <IconButton onClick={handlePostEdit} aria-label="save edited post">
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip style={{ marginTop: '8px', marginRight: '8px' }} title="Discard Changes">
                  <IconButton onClick={handlePostEditCancel} aria-label="cancel editing post">
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </>
            )} */}
            {!editMode && (
              <Grid container>
                <Grid container item xs={4} md={2}>
                  {postItem.user._id !== user._id && (
                    <>
                      {/* <Grid item xs={6}>
                        <Tooltip title={postItem?.likes?.includes(user._id) ? 'Disike' : 'Like'}>
                          <IconButton
                            color="default"
                            aria-label={postItem?.likes?.includes(user._id) ? 'Disike' : 'Like'}
                            onClick={() => {
                              postItem?.likes?.includes(user._id)
                                ? handleDislike(postItem._id)
                                : handleLike(postItem._id);
                            }}
                          >
                            <FavoriteIcon color={postItem?.likes?.includes(user._id) ? 'primary' : 'action'} />
                          </IconButton>
                        </Tooltip>
                      </Grid> */}
                      {/* <Grid item xs={6}>
                        <Tooltip title="Share">
                          <IconButton aria-label="share" onClick={handleShare}>
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid> */}
                    </>
                  )}
                </Grid>
                <Grid container item xs={8} md={10} justify="flex-end">
                  <Tooltip title="Comment">
                    <IconButton
                      onClick={() => setCommentToggle(!commentToggle)}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <AddCommentIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Comments">
                    <IconButton
                      style={{ marginLeft: '8px' }}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <Typography style={{ marginRight: '5px' }}>{postItem.comments.length}</Typography>
                      <CommentRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
          </CardActions>
          {/* <Collapse in={commentToggle} timeout="auto" unmountOnExit>
            <CardContent>
              <Grid container>
                <Grid item xs={10} md={11}>
                  <TextField
                    className={classes.textarea}
                    id="post-text"
                    label="Leave a comment"
                    placeholder=""
                    multiline
                    name="text"
                    onChange={handleCommentText}
                    value={commentText}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  {createPostLoading ? (
                    <Spinner />
                  ) : (
                    <IconButton onClick={handleCommentSend} style={{ marginLeft: '8px' }}>
                      <SendIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Collapse> */}
          <Collapse in={expanded && postItem?.comments?.length > 0} timeout="auto" unmountOnExit>
            <CardContent>
              {expanded &&
                postItem?.comments?.length > 0 &&
                postItem?.comments.map((comment) => (
                  <Grid container key={comment._id}>
                    <Grid item container>
                      <Grid container item xs={2} md={1} justify="center">
                        <Link to={`/profile/${comment.user._id}`}>
                          <Avatar aria-label="user initials" className={classes.avatar}>
                            {comment.user.name[0].toUpperCase()}
                          </Avatar>
                        </Link>
                      </Grid>
                      <Grid container item xs={10} md={4} direction="column">
                        <Link to={`/profile/${comment.user._id}`}>
                          <Typography className={classes.small}>
                            {comment.user?.name} {comment.user?.lastname}
                          </Typography>
                        </Link>

                        <Typography className={classes.small}>
                          {new Date(comment.created_at).toLocaleString('en-GB')}
                        </Typography>
                      </Grid>
                      <Grid container item xs={12} md={7}>
                        <Grid container alignItems="center" item xs={comment.user._id === user._id ? 8 : 12} sm={10}>
                          {commentEditMode.editMode && commentEditMode.id === comment._id ? (
                            <TextField
                              className={classes.textarea}
                              id="comment-text"
                              placeholder=""
                              multiline
                              name="text"
                              onChange={(e) => setCommentEditText(e.target.value)}
                              value={commentEditText}
                              variant="outlined"
                            />
                          ) : (
                            <Typography>{comment.text}</Typography>
                          )}
                        </Grid>
                        {/* {comment.user._id === user._id && (
                          <Grid container item xs={4} sm={2}>
                            <Grid item xs={6}>
                              {commentEditMode.editMode && commentEditMode.id === comment._id ? (
                                <IconButton onClick={handleCommentEditSend} aria-label="save edited comment">
                                  <SaveIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() => handleCommentEdit(comment._id, comment.text)}
                                  aria-label="settings"
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            </Grid>
                            <Grid item xs={6}>
                              <IconButton onClick={() => handleCommentDelete(comment._id)} aria-label="settings">
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        )} */}
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider style={{ marginTop: '4px', marginBottom: '4px' }} />
                    </Grid>
                  </Grid>
                ))}
            </CardContent>
          </Collapse>
        </>
      )}
    </Card>
  );
};

export default PostItem;
