import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import Spinner from '../../common/Spinner';

import { PageContainer } from '../../common';
import { RootState } from '../../../redux';
import Post from './components/Post';
import { getPost, resetSinglePost } from '../../../redux/actions';

const PostDetails = ({ match, history }: RouteChildrenProps<{ id: string }>) => {
  const {
    posts: { singlePost, singlePostLoading },
    user: { user },
  } = useSelector((state: typeof RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (match?.params.id) {
      dispatch(getPost(match?.params.id));
    } else {
      history.push('/404');
    }
    return () => {
      dispatch(resetSinglePost());
    };
  }, [match?.params.id, history, dispatch]);

  useEffect(() => {
    if (!singlePostLoading && !singlePost._id) {
      history.push('/404');
    }
  }, [history, singlePostLoading, singlePost]);

  return (
    <PageContainer>
      {singlePostLoading ? <Spinner /> : <>{!!singlePost?._id && <Post {...{ post: singlePost, user }} />}</>}
    </PageContainer>
  );
};

export default PostDetails;
