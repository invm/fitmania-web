import IUser from '../../interfaces/User';
import * as types from '../types/user';
import Action from './Action';

interface userInitialState {
  verifyingSession: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser;
  theme: string;
  notificationsCount: number;
}

export const initialState: userInitialState = {
  notificationsCount: 0,
  verifyingSession: true,
  isAuthenticated: false,
  loading: false,
  theme: localStorage.getItem('theme') ?? 'dark',
  user: {
    _id: '',
    name: '',
    lastname: '',
    email: '',
  },
};
export default function state(state = initialState, action: Action) {
  switch (action.type) {
    case types.THEME_CHANGE: {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
    }
    case types.USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false,
      };
    case types.LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false,
        verifyingSession: false,
      };
    case types.AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: action.payload,
        verifyingSession: false,
      };
    default:
      return state;
  }
}
