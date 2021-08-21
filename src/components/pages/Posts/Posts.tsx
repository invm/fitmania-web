import { ChangeEvent, useEffect, useState } from 'react';
import {
	Grid,
	Typography,
	Checkbox,
	FormControlLabel,
	Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import heroImage from '../../../assets/crossfit-box.jpg';
import heroImage2 from '../../../assets/girls-running.jpg';

import PageContainer from '../../common/Layout/PageContainer';
import Post from './components/Post';
import CreatePost from './components/CreatePost';

// Sports!
import {
	SportsBaseball,
	SportsRugby,
	SportsBasketball,
	SportsSoccer,
	DirectionsWalk,
	DirectionsRun,
	DirectionsBike,
} from '@material-ui/icons';
import { RootState } from '../../../redux';
import { Spinner } from '../../common';
import { getPosts, resetPosts } from '../../../redux/actions';
import { IObject } from '../../../interfaces/Common';
import { getFeaturedGroups } from '../../../redux/actions/groups';
import GroupListItem from '../Groups/components/GroupListItem';

const images = [heroImage, heroImage2];

export const sports: IObject = {
	Running: <DirectionsRun />,
	Biking: <DirectionsBike />,
	Hiking: <DirectionsWalk />,
	Soccer: <SportsSoccer />,
	Basketball: <SportsBasketball />,
	Rugby: <SportsRugby />,
	Tennis: <SportsBaseball />,
};

const useStyles = makeStyles((theme) => ({
	textarea: {
		minWidth: '200px',
		width: '100%',
	},
	list: {
		padding: theme.spacing(1),
	},
	media: {
		height: 140,
	},
	cardHeader: {
		padding: '0 8px 0',
	},
	card: {
		marginTop: '8px',
		padding: '12px 8px 12px 8px',
		width: '100%',
	},
	avatar: {
		backgroundColor: theme.palette.primary.main,
	},
}));
const Posts = () => {
	const dispatch = useDispatch();
	const {
		posts: { posts, postsLoading, postsExhausted },
		groups: { featuredGroupsLoading, featuredGroups },
		user: { user },
	} = useSelector((state: typeof RootState) => state);

	const classes = useStyles();
	const [sportsFilter, setSportsFilter] = useState<string[]>([]);

	useEffect(() => {
		// if (!stats) getStatistics();
		dispatch(getFeaturedGroups());
	}, [dispatch]);

	useEffect(() => {
		if (sportsFilter.length && !postsLoading) {
			dispatch(resetPosts());
			dispatch(getPosts(sportsFilter));
		} else if (!postsLoading) {
			dispatch(resetPosts());
			dispatch(getPosts());
		}
		// eslint-disable-next-line
	}, [dispatch, sportsFilter]);

	// useEffect(() => {
	// 	!postsExhausted && dispatch(getPosts(sportsFilter));
	// }, [dispatch, sportsFilter, postsExhausted]);

	const expandList = () => {
		!postsExhausted && dispatch(getPosts());
	};

	const handleSelectSport = (e: ChangeEvent<HTMLInputElement>) => {
		if (sportsFilter.includes(e.target.value)) {
			setSportsFilter(sportsFilter.filter((item) => item !== e.target.value));
		} else {
			setSportsFilter([...sportsFilter, e.target.value]);
		}
	};

	return (
		<PageContainer>
			<div style={styles.heroImage}>
				<div>
					<Typography
						variant="h2"
						style={{
							marginBottom: 20,
							fontWeight: 700,
							color: 'white',
							textShadow: '1px 1px #444',
						}}
					>
						FitMania! 🏃
					</Typography>
					<Typography
						variant="h4"
						style={{
							marginBottom: 10,
							color: 'white',
							textShadow: '1px 1px #444',
						}}
					>
						Meet new people with common sport preferences!
					</Typography>
					<Typography
						variant="h6"
						style={{
							marginBottom: 10,
							color: 'white',
							textShadow: '1px 1px #444',
						}}
					>
						Join local communities, train, play, motivate and progress together!
					</Typography>
				</div>
			</div>
			<Grid container>
				<Grid
					container
					item
					direction="column"
					justifyContent="flex-start"
					alignItems="center"
					xs={12}
					sm={4}
					md={3}
				>
					<Grid item xs={12} style={{ paddingTop: '10px', width: '100%' }}>
						{/* {!stats ? (
							<Spinner />
						) : (
							<div style={{ textAlign: 'center' }}>
								<h3>Our top statistics!</h3>
								{Object.entries(stats).map((entry) => (
									<Typography key={entry[0]} style={{ textAlign: 'center' }}>
										{`Total ${
											entry[0].charAt(0).toUpperCase() + entry[0].slice(1)
										}: ${entry[1]}`}{' '}
									</Typography>
								))}
								<h4>And counting!</h4>
							</div>
						)} */}
						{!featuredGroupsLoading && featuredGroups?.length > 0 && (
							<>
								<h3 style={{ textAlign: 'center' }}>
									Featured groups around the globe!
								</h3>
								<div>
									{featuredGroups.map((group, key) => {
										return <GroupListItem key={key} {...{ group, user }} />;
									})}
								</div>
							</>
						)}
					</Grid>
				</Grid>
				<Grid container item xs={12} sm={12} md={9}>
					<Grid item xs={12} container justifyContent="center">
						<Grid item xs={12}>
							<Typography align="center" variant="h5">
								Filter events by sport
							</Typography>
						</Grid>
						{Object.entries(sports).map((item) => (
							<FormControlLabel
								key={item[0]}
								control={
									<Checkbox
										color={'primary'}
										value={item[0]}
										checked={sportsFilter.includes(item[0])}
										onChange={handleSelectSport}
										icon={item[1]}
									/>
								}
								label={item[0]}
							/>
						))}
						<Grid item xs={12}>
							<Typography align="center" variant="h5">
								Showing results for{' '}
								{sportsFilter.length > 0
									? sportsFilter.join(', ')
									: 'all sports'}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.list}>
						<CreatePost />
					</Grid>
					<Grid item xs={12}>
						<Grid
							container
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							className={classes.list}
						>
							<Grid item xs={12}>
								{/* {createPostLoading && <Spinner />} */}
								{posts.map((post) => (
									<Post key={post._id} {...{ post, user }} />
								))}
							</Grid>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						container
						style={{ marginTop: 30, marginBottom: 30 }}
						justifyContent="center"
					>
						<Button
							disabled={postsLoading || postsExhausted}
							variant="contained"
							onClick={expandList}
							style={{ height: 40, width: 150 }}
						>
							{postsLoading ? (
								<Spinner size={0.3} />
							) : postsExhausted ? (
								'No more posts'
							) : (
								'Load More'
							)}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default Posts;

const styles = {
	heroImage: {
		backgroundImage: `url(${images[Math.floor(Math.random() * 2)]})`,
		width: '100%',
		height: 400,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		borderRadius: 20,
		padding: 20,
		display: 'flex',
		justifyContent: 'flex-start',
		marginBottom: 30,
		marginTop: 30,
	},
};
