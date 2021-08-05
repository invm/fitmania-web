import IUser, { IUserMin } from '../../interfaces/User';
import * as types from '../types/friends';
import Action from './Action';

export interface friendsInitialState {
	friends: IUserMin[];
	friendsExhausted: boolean;
	friendsLoading: boolean;
	offset: number;
	friendsSuggestions: IUser[];
	friendsSuggestionsLoading: boolean;
}

export const initialState: friendsInitialState = {
	friends: [],
	friendsLoading: false,
	friendsExhausted: false,
	offset: 0,
	friendsSuggestions: [],
	friendsSuggestionsLoading: false,
};

export default function state(state = initialState, action: Action) {
	switch (action.type) {
		case types.GET_FRIENDS_SUGGESTIONS_ATTEMPT:
			return {
				...state,
				friendsSuggestionsLoading: true,
			};
		case types.GET_FRIENDS_SUGGESTIONS_FAIL:
			return {
				...state,
				friendsSuggestionsLoading: false,
			};
		case types.GET_FRIENDS_SUGGESTIONS_SUCCESS:
			return {
				...state,
				friendsSuggestionsLoading: false,
				friendsSuggestions: action.payload,
			};
		case types.RESET_FRIENDS:
			return initialState;
		case types.GET_FRIENDS_ATTEMPT:
			return {
				...state,
				friendsLoading: true,
			};
		case types.GET_FRIENDS_SUCCESS:
			return {
				...state,
				friendsLoading: false,
				friends: [...state.friends, ...action.payload.data],
				friendsExhausted: action.payload.friendsExhausted,
				offset: !action.payload.friendsExhausted
					? state.offset + 1
					: state.offset,
			};
		case types.GET_FRIENDS_FAIL:
			return {
				...state,
				friendsLoading: false,
			};
		default:
			return state;
	}
}
