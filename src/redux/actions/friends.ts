import { Methods, Request } from '../../utils/Wrapper';
import * as types from '../types//friends';
import { RootState } from '..';

export const FRIENDS_LIMIT = 10;

export const resetFriends = () => (dispatch: Function) => {
	dispatch({ type: types.RESET_FRIENDS });
};

export const getFriends =
	() => async (dispatch: Function, getState: () => typeof RootState) => {
		dispatch({ type: types.GET_FRIENDS_ATTEMPT });

		const { offset } = getState().friends;

		let requestParams = {
			method: Methods.GET,
			endpoint: `/friends?offset=${offset}&limit=${FRIENDS_LIMIT}`,
		};

		try {
			let res = await Request(dispatch, requestParams);
			dispatch({
				type: types.GET_FRIENDS_SUCCESS,
				payload: {
					data: res.data.data,
					friendsExhausted: res.data.data.length < FRIENDS_LIMIT,
				},
			});
		} catch (error) {
			dispatch({
				type: types.GET_FRIENDS_FAIL,
			});
		}
	};

export const getFriendsSuggestions =
	() => async (dispatch: Function, getState: () => typeof RootState) => {
		dispatch({ type: types.GET_FRIENDS_SUGGESTIONS_ATTEMPT });

		let requestParams = {
			method: Methods.GET,
			endpoint: `/friends/suggestions`,
		};

		try {
			let res = await Request(dispatch, requestParams);
			dispatch({
				type: types.GET_FRIENDS_SUGGESTIONS_SUCCESS,
				payload: res.data.data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_FRIENDS_SUGGESTIONS_FAIL,
			});
		}
	};
