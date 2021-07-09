import * as types from '../types/message';
import store from '../index';

const MESSAGE_VISIBILITY_TIME = 3000;

export const showMessage = (
  title: string = 'Success',
  message: string,
  type: 'error' | 'warning' | 'info' | 'success' = 'info'
) => {
  store.dispatch({
    type: types.SHOW_MESSAGE,
    payload: { title, message, type },
  });
  setTimeout(() => {
    removeMessage();
  }, MESSAGE_VISIBILITY_TIME);
};

export const removeMessage = () => {
  store.dispatch({
    type: types.REMOVE_MESSAGE,
  });
};
