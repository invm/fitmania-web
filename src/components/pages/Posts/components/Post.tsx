import { useState } from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux';
import { Spinner } from '../../../common';
import IPost from '../../../../interfaces/Post';
import IUser from '../../../../interfaces/User';

import PostHeader from './subcomponents/PostHeader';
import PostEventSection from './subcomponents/PostEventSection';
import PostBody from './subcomponents/PostBody';
import PostCommentSection from './subcomponents/PostCommentSection';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: '8px',
    padding: '12px 8px 0 8px',
  },
}));

interface PostItemProps {
  post: IPost;
  user: IUser;
}

const Post = ({ post, user }: PostItemProps) => {
  const {
    posts: { singlePostId, singlePostLoading },
  } = useSelector((state: typeof RootState) => state);

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <Card raised className={classes.card} key={post._id}>
      {singlePostId === post._id && singlePostLoading && <Spinner />}
      {singlePostId !== post._id && (
        <>
          <PostHeader {...{ post, editMode, setEditMode, user }} />
          {!!post.event && <PostEventSection {...{ post, user }} />}
          <PostBody
            {...{ post, user, setEditMode, setExpanded, editMode, expanded, commentToggle, setCommentToggle }}
          />
          <PostCommentSection {...{ post, expanded, user, commentToggle, setCommentToggle }} />
        </>
      )}
    </Card>
  );
};

export default Post;
