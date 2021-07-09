import * as types from '../types/message';
import Action from './Action';

export interface messageInitialState {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  open: boolean;
}

export const initialState: messageInitialState = {
  title: '',
  message: '',
  type: 'success',
  open: false,
};

export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.SHOW_MESSAGE:
      return {
        ...state,
        open: true,
        ...action.payload,
      };
    case types.REMOVE_MESSAGE:
      return initialState;
    default:
      return state;
  }
}
