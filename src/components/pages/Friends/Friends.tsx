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
				<Grid container item xs={12} sm={8} md={9}>
					{/* {auth?.user?.friends.length === 0 && (
						<div style={{ textAlign: 'center' }}>
							<h2>Add some friends today and start training together!</h2>
						</div>
					)}
					{auth?.user.friends.map((v, key) => (
						<Grid item key={key} xs={12} md={6}>
							<Card className={classes.paper} variant="outlined">
								<CardContent>
									<Grid container spacing={2}>
										<Grid item>
											<ButtonBase className={classes.image}>
												<img
													className={classes.img}
													alt="complex"
													src={`${process.env.MEDIA}${v.avatar}`}
												/>
											</ButtonBase>
										</Grid>
										<Grid item xs={12} sm container>
											<Grid item xs container direction="column" spacing={2}>
												<Grid item xs>
													<Typography gutterBottom variant="subtitle1">
														{v.name} {v?.lastname}
													</Typography>
												</Grid>

												<Grid item container justify="space-around">
													<Grid item>
														<Link to={`/profile/${v._id}`}>
															<Button color="primary">View Profile</Button>
														</Link>
													</Grid>
													<Grid item>
														<Button
															onClick={() => handleRemoveFriend(v._id)}
															color="secondary"
														>
															Remove
														</Button>
													</Grid>
												</Grid>
											</Grid>
											{v.location && (
												<Grid item>
													<Typography variant="subtitle1">
														{v.location}
													</Typography>
												</Grid>
											)}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					))} */}
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default Friends;
