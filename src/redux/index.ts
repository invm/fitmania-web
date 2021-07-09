import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import * as Reducers from './reducers';

const root = combineReducers({
  message: Reducers.message,
  user: Reducers.user,
  search: Reducers.search,
  posts: Reducers.posts,
});

export const RootState = {
  message: Reducers.messageInitialState,
  user: Reducers.userInitialState,
  search: Reducers.searchInitialState,
  posts: Reducers.postsInitialState,
};

const middleware = [thunk];

let compose =
  process.env.REACT_APP_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(...middleware);

const store = createStore(root, RootState, compose);

export default store;
