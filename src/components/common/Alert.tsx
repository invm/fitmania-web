import React from 'react';
import { Snackbar, Slide } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { hideMessage } from '../../redux/actions/message';
import { Alert, AlertTitle } from '@material-ui/lab';

const Message = (props: any) => {
  const { message, open, type, title } = useSelector((state: typeof RootState) => state.message);

  return (
    <Snackbar open={open} TransitionComponent={Slide} autoHideDuration={4000} onClose={hideMessage}>
      <Alert severity={type}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Message;
