import * as types from '../types/message';
import store from '../index';

const MESSAGE_IN_REDUCER_TIME = 1000;

export const showMessage = (
  title: string = 'Success',
  message: string,
  type: 'error' | 'warning' | 'info' | 'success' = 'info'
) => {
  store.dispatch({
    type: types.SHOW_MESSAGE,
    payload: { title, message, type },
  });
};

export const hideMessage = () => {
  store.dispatch({
    type: types.HIDE_MESSAGE,
  });
  setTimeout(() => {
    removeMessage();
  }, MESSAGE_IN_REDUCER_TIME);
};

export const removeMessage = () => {
  store.dispatch({
    type: types.REMOVE_MESSAGE,
  });
};
