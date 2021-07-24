import {
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import IPost from '../../../../../interfaces/Post';
import IUser from '../../../../../interfaces/User';
import { Save, Favorite, Share, Close, AddComment, CommentRounded } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updatePost, sharePost, unsharePost, likePost, dislikePost } from '../../../../../redux/actions/posts';
import { showMessage } from '../../../../../redux/actions';
import { Spinner } from '../../../../common';

interface PostItemProps {
  post: IPost;
  user: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentToggle: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  expanded: boolean;
  commentToggle: boolean;
}

const useStyles = makeStyles((theme) => ({
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
  imageRemoveIcon: {
    top: 50,
    marginTop: -30,
    left: '88%',
    zIndex: 10,
    padding: 4,
  },
}));

const PostBody = ({
  editMode,
  post,
  setEditMode,
  user,
  setExpanded,
  expanded,
  commentToggle,
  setCommentToggle,
}: PostItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [likeShareLoading, setLikeShareLoading] = useState(false);
  const [editedPost, setEditedPost] = useState({
    _id: post._id ?? '',
    text: post.text ?? '',
    image: post.image ?? '',
  });
  const [prevPostDetails] = useState({
    _id: post._id ?? '',
    text: post.text ?? '',
    image: post.image ?? '',
  });

  const handleImageRemove = () => {
    setEditedPost({ ...editedPost, image: '' });
  };
  const handlePostEdit = () => {
    if (editedPost.text.length) {
      dispatch(updatePost(editedPost));
      setEditMode(!editMode);
    } else {
      showMessage(t('common.error'), t('create_post.cant_create_empty_post'));
    }
  };

  const handlePostEditCancel = () => {
    setEditedPost(prevPostDetails);
    setEditMode(false);
  };

  const handleShare = async () => {
    setLikeShareLoading(true);
    if (post.sharedBy.includes(user._id)) {
      await dispatch(unsharePost(post._id));
      setLikeShareLoading(false);
    } else {
      await dispatch(sharePost(post._id));
      setLikeShareLoading(false);
    }
  };

  const handleLike = async (_id: string) => {
    setLikeShareLoading(true);
    await dispatch(likePost(_id));
    setLikeShareLoading(false);
  };

  const handleDislike = async (_id: string) => {
    setLikeShareLoading(true);
    await dispatch(dislikePost(_id));
    setLikeShareLoading(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Grid container>
        {editedPost.image && (
          <Grid item xs={12} md={5}>
            {editMode && (
              <IconButton
                className={classes.imageRemoveIcon}
                onClick={handleImageRemove}
                aria-label="remove image from post"
              >
                <Close />
              </IconButton>
            )}
            <CardMedia
              className={classes.media}
              image={`${process.env.REACT_APP_MEDIA}${post.image}`}
              title={post.text}
            />
          </Grid>
        )}
        <Grid item xs={12} md={post.image ? 7 : 12}>
          <CardContent>
            {editMode ? (
              <TextField
                className={classes.textarea}
                id="post-text"
                label={t('post.share_some_thoughts')}
                placeholder=""
                multiline
                name="text"
                onChange={(e) => setEditedPost({ ...editedPost, text: e.target.value })}
                value={editedPost.text}
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" color="textPrimary" component="p">
                {post.text}
              </Typography>
            )}
          </CardContent>
        </Grid>
      </Grid>
      <CardActions>
        {likeShareLoading ? (
          <Spinner size={0.3} />
        ) : (
          <>
            {editMode && (
              <>
                <Tooltip style={{ marginTop: '8px', marginRight: '8px' }} title="Save Changes">
                  <IconButton onClick={handlePostEdit} aria-label="save edited post">
                    <Save />
                  </IconButton>
                </Tooltip>
                <Tooltip style={{ marginTop: '8px', marginRight: '8px' }} title="Discard Changes">
                  <IconButton onClick={handlePostEditCancel} aria-label="cancel editing post">
                    <Close />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {!editMode && (
              <Grid container>
                <Grid container item xs={4} md={2}>
                  {post.author._id !== user._id && (
                    <>
                      <Grid item xs={6}>
                        <Tooltip title={post?.likes?.includes(user._id) ? 'Disike' : 'Like'}>
                          <IconButton
                            color="default"
                            aria-label={post?.likes?.includes(user._id) ? 'Disike' : 'Like'}
                            onClick={() => {
                              post?.likes?.includes(user._id) ? handleDislike(post._id) : handleLike(post._id);
                            }}
                          >
                            <Favorite color={post?.likes?.includes(user._id) ? 'primary' : 'action'} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={6}>
                        <Tooltip title="Share">
                          <IconButton aria-label="share" onClick={handleShare}>
                            <Share color={post?.sharedBy?.includes(user._id) ? 'primary' : 'action'} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </>
                  )}
                </Grid>
                <Grid container item xs={8} md={10} justifyContent="flex-end">
                  <Tooltip title="Comment">
                    <IconButton
                      onClick={() => setCommentToggle(!commentToggle)}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <AddComment />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Comments">
                    <IconButton
                      style={{ marginLeft: '8px' }}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <Typography style={{ marginRight: '5px' }}>{post.comments.length}</Typography>
                      <CommentRounded />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </CardActions>
    </>
  );
};

export default PostBody;
