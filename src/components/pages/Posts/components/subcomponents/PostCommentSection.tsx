import {
  Avatar,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createComment, editComment, deleteComment } from '../../../../../redux/actions/posts';
import IPost from '../../../../../interfaces/Post';
import IUser from '../../../../../interfaces/User';
import { Spinner } from '../../../../common';
import { Send, Edit, Delete, Save } from '@material-ui/icons';

interface PostItemProps {
  post: IPost;
  user: IUser;
  setCommentToggle: React.Dispatch<React.SetStateAction<boolean>>;
  commentToggle: boolean;
  expanded: boolean;
}

const useStyles = makeStyles((theme) => ({
  textarea: {
    minWidth: '200px',
    width: '100%',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  small: {
    fontSize: '0.8rem',
  },
}));

const PostCommentSection = ({ post, user, commentToggle, setCommentToggle, expanded }: PostItemProps) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [creatingComment, setCreatingComment] = useState(false);

  const handleCommentText = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSend = async () => {
    setCreatingComment(true);
    await dispatch(createComment(post._id, commentText));
    setCommentText('');
    setCommentToggle(!commentToggle);
    setCreatingComment(false);
  };

  const handleCommentEdit = (commentId: string, text: string) => {
    setCommentEditMode({ id: commentId, editMode: true });
    setCommentEditText(text);
  };

  const handleCommentEditSend = async () => {
    setCreatingComment(true);
    dispatch(editComment(post._id, commentEditMode.id, commentEditText));
    setCommentEditMode({ id: '', editMode: false });
    setCommentEditText('');
    setCreatingComment(false);
  };

  const handleCommentDelete = (commentId: string) => {
    dispatch(deleteComment(post._id, commentId));
  };

  const [commentEditMode, setCommentEditMode] = useState({
    id: '',
    editMode: false,
  });
  const [commentEditText, setCommentEditText] = useState('');

  return (
    <>
      <Collapse in={commentToggle} timeout="auto" unmountOnExit>
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
              {creatingComment ? (
                <Spinner />
              ) : (
                <IconButton onClick={handleCommentSend} style={{ marginLeft: '8px' }}>
                  <Send />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
      <Collapse in={expanded && post?.comments?.length > 0} timeout="auto" unmountOnExit>
        <CardContent>
          {expanded &&
            post?.comments?.length > 0 &&
            post?.comments.map((comment) => (
              <Grid container key={comment._id}>
                <Grid item container>
                  <Grid container item xs={2} md={1} justifyContent="center">
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
                    {comment.user._id === user._id && (
                      <Grid container item xs={4} sm={2}>
                        <Grid item xs={6}>
                          {commentEditMode.editMode && commentEditMode.id === comment._id ? (
                            <IconButton onClick={handleCommentEditSend} aria-label="save edited comment">
                              <Save />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleCommentEdit(comment._id, comment.text)}
                              aria-label="settings"
                            >
                              <Edit />
                            </IconButton>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <IconButton onClick={() => handleCommentDelete(comment._id)} aria-label="settings">
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}
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
  );
};

export default PostCommentSection;
