import { Avatar, Button, CardHeader, Grid, IconButton, Popover, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IPost from '../../../../../interfaces/Post';
import { MoreVert, Edit, Delete, ViewHeadline } from '@material-ui/icons';
import IUser from '../../../../../interfaces/User';
import { deletePost } from '../../../../../redux/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '0 8px 8px',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface PostItemProps {
  post: IPost;
  user: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
}

const PostHeader = ({ post, user, setEditMode, editMode }: PostItemProps) => {
  const classes = useStyles();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handlePopoverClick = (currentTarget: EventTarget & HTMLButtonElement) => {
    setPopoverAnchorEl(currentTarget);
  };

  const handleDeleteClick = (currentTarget: EventTarget & HTMLButtonElement) => {
    setDeleteAnchorEl(currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const handleDeleteClose = () => {
    setDeleteAnchorEl(null);
  };

  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  const deleteOpen = Boolean(deleteAnchorEl);
  const deletePopoverId = deleteOpen ? 'delete-popover' : undefined;

  const handlePostDelete = () => {
    dispatch(deletePost(post._id));
  };

  return (
    <CardHeader
      className={classes.cardHeader}
      avatar={
        <Link to={`/profile/${post.author._id}`}>
          <Avatar aria-label="user initials" className={classes.avatar}>
            {post.author?.name?.[0].toUpperCase()}
          </Avatar>
        </Link>
      }
      action={
        <>
          <IconButton onClick={({ currentTarget }) => handlePopoverClick(currentTarget)} aria-label="settings">
            <MoreVert />
          </IconButton>
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
                <Link to={{ pathname: `/posts/${post._id}` }}>
                  <Button style={{ width: '100%' }}>
                    <ViewHeadline style={{ marginRight: '8px' }} />
                    {t('post.view_details')}
                  </Button>
                </Link>
              </Grid>
              {user._id === post.author._id && (
                <>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => {
                        setEditMode(!editMode);
                        handlePopoverClose();
                      }}
                      style={{ width: '100%' }}
                    >
                      <Edit style={{ marginRight: '8px' }} />
                      {t('post.edit_post')}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={({ currentTarget }) => handleDeleteClick(currentTarget)} style={{ width: '100%' }}>
                      <Delete style={{ marginRight: '8px' }} />
                      {t('post.delete_post')}
                    </Button>
                    <Popover
                      id={deletePopoverId}
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
                          <Typography>{t('post.are_you_sure')}</Typography>
                        </Grid>
                        <Grid container item xs={12} justify="center">
                          <Grid item>
                            <Button onClick={handlePostDelete}>Yes</Button>
                          </Grid>
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
        <Link to={`/profile/${post.author._id}`}>
          {post.author?.name} {post.author?.lastname}
        </Link>
      }
      subheader={new Date(post.created_at).toLocaleString('en-GB').substr(0, 17)}
    />
  );
};

export default PostHeader;
