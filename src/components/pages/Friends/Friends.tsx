import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { PageContainer } from '../../common/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import {
	getFriendRequests,
	getFriends,
	getFriendsSuggestions,
	resetFriends,
} from '../../../redux/actions/friends';
import FriendRequests from './components/FriendRequests';
import { Spinner } from '../../common';
import FriendsSuggestions from './components/FriendsSuggetions';
import FriendsList from './components/FriendsList';

const Friends = () => {
	const dispatch = useDispatch();
	const {
		friends,
		friendsExhausted,
		friendsLoading,
		friendsSuggestions,
		friendsSuggestionsLoading,
		requests,
		requestsExhausted,
		requestsLoading,
	} = useSelector((state: typeof RootState) => state.friends);

	useEffect(() => {
		(async () => {
			if (!friendsExhausted && !friendsLoading) {
				await dispatch(resetFriends());
				await dispatch(getFriends());
			}
			if (!friendsSuggestions.length) await dispatch(getFriendsSuggestions());
			if (!requestsExhausted && !requestsLoading) {
				await dispatch(getFriendRequests());
			}
		})();
		// eslint-disable-next-line
	}, []);

	return (
		<PageContainer>
			<Grid container>
				<Grid container item xs={12}>
					{requestsLoading ? (
						<Grid container justifyContent="center" item xs={12}>
							<Spinner />
						</Grid>
					) : (
						<FriendRequests {...{ requests }} />
					)}
				</Grid>
				<Grid container item xs={12}>
					{friendsSuggestionsLoading ? (
						<Grid container justifyContent="center" item xs={12}>
							<Spinner />
						</Grid>
					) : (
						<FriendsSuggestions users={friendsSuggestions} />
					)}
				</Grid>
				<Grid container item xs={12}>
					{friendsLoading ? (
						<Grid container justifyContent="center" item xs={12}>
							<Spinner />
						</Grid>
					) : (
						<FriendsList {...{ friends }} />
					)}
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default Friends;
