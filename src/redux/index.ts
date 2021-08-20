import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import * as Reducers from './reducers';

const root = combineReducers({
  friends: Reducers.friends,
  groups: Reducers.groups,
  message: Reducers.message,
  notifications: Reducers.notifications,
  search: Reducers.search,
  posts: Reducers.posts,
  user: Reducers.user,
});

export const RootState = {
	friends: Reducers.friendsInitialState,
  groups: Reducers.groupsInitialState,
  message: Reducers.messageInitialState,
  notifications: Reducers.notificationsInitialState,
  search: Reducers.searchInitialState,
  posts: Reducers.postsInitialState,
  user: Reducers.userInitialState,
};

const middleware = [thunk];

let compose =
  process.env.REACT_APP_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(...middleware);

const store = createStore(root, RootState, compose);

export default store;
