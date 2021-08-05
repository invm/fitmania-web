import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
	Grid,
	Card,
	Typography,
	IconButton,
	TextField,
	CardHeader,
	CardContent,
	CardActions,
	Paper,
	ButtonBase,
	Avatar,
	Button,
} from '@material-ui/core';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { PageContainer } from '../../common/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import {
	getFriends,
	getFriendsSuggestions,
	resetFriends,
} from '../../../redux/actions/friends';
import Friend from './components/Friend';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		width: '100%',
	},
	img: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	cardHeader: {
		padding: '0 8px 0',
	},
	avatar: {
		backgroundColor: theme.palette.primary.main,
	},
}));

const Friends = ({}: RouteChildrenProps) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const {
		friends,
		friendsExhausted,
		friendsLoading,
		friendsSuggestions,
		friendsSuggestionsLoading,
	} = useSelector((state: typeof RootState) => state.friends);

	// const handleRemoveFriend = (id) => {
	// 	removeFriend(id);
	// };

	// useEffect(() => {
	// 	getFriendsSuggestions();
	// }, []);

	useEffect(() => {
		(async () => {
			if (!friendsExhausted && !friendsLoading) {
				await dispatch(resetFriends());
				await dispatch(getFriends());
			}
			if (!friendsSuggestions.length) await dispatch(getFriendsSuggestions());
		})();
		// eslint-disable-next-line
	}, []);

	return (
		<PageContainer>
			<Grid container>
				<Grid container item xs={12}>
					<Grid item xs={12}>
						<h3>Friends suggestions</h3>
					</Grid>
					<Grid container item xs={12} style={{ paddingTop: '10px' }}>
						{!friendsSuggestionsLoading && friendsSuggestions?.length > 0 && (
							<>
								{friendsSuggestions.map((user) => (
									<Grid item xs={12} lg={6} key={user._id}>
										<Friend {...{ user }} />
									</Grid>
								))}
							</>
						)}
					</Grid>
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
