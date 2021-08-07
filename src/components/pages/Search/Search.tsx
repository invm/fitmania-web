import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import {
	Grid,
	Card,
	Typography,
	CardContent,
	CardActions,
	Button,
	CardHeader,
	Avatar,
} from '@material-ui/core';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { PageContainer, Spinner } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { search } from '../../../redux/actions';
import { RootState } from '../../../redux';

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
		padding: '0',
	},
	avatar: {
		backgroundColor: theme.palette.primary.main,
		width: 50,
		height: 50,
	},
}));

const SearchResults = ({
	match,
	history,
}: RouteChildrenProps<{ query: string }>) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { usersLoading, users, groups, groupsLoading } = useSelector(
		(state: typeof RootState) => state.search
	);

	useEffect(() => {
		if (match?.params?.query) {
			(async () => {
				await dispatch(search(match?.params?.query));
			})();
		}
	}, [dispatch, match?.params?.query]);

	return (
		<PageContainer>
			<Grid container justify="center">
				<Grid item xs={12}>
					{usersLoading && (
						<div style={{ paddingTop: 50, textAlign: 'center' }}>
							<Spinner />
						</div>
					)}
					{!usersLoading && !users.length && !groups.length && (
						<div style={{ paddingTop: 50, textAlign: 'center' }}>
							<h3>No result found for query {match?.params?.query}</h3>
						</div>
					)}
					{!usersLoading &&
						users.map((user, key) => (
							<Grid item key={key} xs={12} md={6}>
								<Card variant="outlined">
									<CardContent>
										<CardHeader
											className={classes.cardHeader}
											avatar={
												<Link to={`/user/${user._id}`}>
													<Avatar
														src={`${process.env.REACT_APP_MEDIA}${user?.image}`}
														className={classes.avatar}
													>
														{user?.name?.[0].toUpperCase()}
													</Avatar>
												</Link>
											}
											title={
												<Link to={`/user/${user._id}`}>
													<b style={{ fontSize: 16 }}>
														{user?.name} {user?.lastname}
													</b>
												</Link>
											}
											action={
												<div
													style={{ display: 'flex', padding: '8px 8px 0 0' }}
												>
													<Link to={`/user/${user._id}`}>
														<Button size="small" color="primary">
															{/* TODO: move to i18n */}
															View profile
														</Button>
													</Link>
												</div>
											}
											subheader={
												<b style={{ fontSize: 14 }}>{user?.location}</b>
											}
										/>
										{user?.preferable?.length > 0 && (
											<div>Likes: {user?.preferable.join(', ')}</div>
										)}
										{user?.undesirable?.length > 0 && (
											<div>Dislikes: {user?.undesirable.join(', ')}</div>
										)}
									</CardContent>
								</Card>
							</Grid>
						))}
				</Grid>
				<Grid item xs={12}>
					{!groupsLoading &&
						groups.map((group, key) => {
							return (
								<Grid key={key} item xs={12} md={6} container justify="center">
									<Card style={{ width: '100%' }} className={classes.root}>
										<CardContent>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}
											>
												<Typography gutterBottom variant="h5" component="h2">
													{group.title}
												</Typography>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<Typography variant="h6" component="span">
														{group.users?.length}
													</Typography>
													<PersonOutlinedIcon />
												</div>
											</div>
											{group.description && (
												<Typography
													variant="body2"
													color="textSecondary"
													component="p"
												>
													{group.description}
												</Typography>
											)}
										</CardContent>
										<CardActions>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													width: '100%',
												}}
											>
												<Link to={`/groups/${group._id}`}>
													<Button size="small" color="primary">
														Learn More
													</Button>
												</Link>
											</div>
										</CardActions>
									</Card>
								</Grid>
							);
						})}
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default SearchResults;
