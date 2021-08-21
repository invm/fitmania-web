import React, { useEffect, useState } from 'react';
import {
	Grid,
	Card,
	Typography,
	CardContent,
	CardActions,
	Button,
	Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, RouteChildrenProps } from 'react-router-dom';
import Spinner from '../../common/Spinner';
import { PageContainer } from '../../common';
import IUser from '../../../interfaces/User';
import { RootState } from '../../../redux';
import { useSelector } from 'react-redux';
import { getUsersPosts, POSTS_LIMIT } from '../../../redux/actions';
import IPost from '../../../interfaces/Post';
import Post from '../Posts/components/Post';
import { sports } from '../Posts/Posts';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT } from '../../../utils/utils';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
	card: {
		marginTop: 100,
		textAlign: 'center',
		overflow: 'visible',
	},
	smallCard: {
		marginTop: 10,
		textAlign: 'center',
		overflow: 'visible',
	},
	title: {
		fontSize: 16,
	},
	pos: {
		marginRight: 10,
	},
	large: {
		margin: '-100px auto 20px auto',
		width: 150,
		height: 150,
		border: '2px solid #999',
	},
	small: {
		width: 50,
		height: 50,
		border: '2px solid #999',
	},
}));

const MyProfile = ({ match, history }: RouteChildrenProps<{ id: string }>) => {
	const { t } = useTranslation();
	const classes = useStyles();
	const [profile, setProfile] = useState<IUser>({} as IUser);
	const [posts, setPosts] = useState<IPost[]>([]);
	const [postsLoading, setPostsLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [exhausted, setExhausted] = useState(false);
	const { user, loading } = useSelector(
		(state: typeof RootState) => state.user
	);

	const fetchAndSetPosts = async (userId: string, offset: number) => {
		setPostsLoading(true);
		let { response } = await getUsersPosts(userId, offset);
		let _posts: IPost[] = response.data?.data;
		if (_posts.length < POSTS_LIMIT) {
			setExhausted(true);
		} else {
			setOffset((s) => s + 1);
		}
		setPosts((s) => [...s, ..._posts]);
		setPostsLoading(false);
	};

	useEffect(() => {
		if (profile?._id) {
			(async () => {
				await fetchAndSetPosts(profile._id, 0);
			})();
		}
	}, [profile._id]);

	useEffect(() => {
		setProfile(user);
	}, [user]);

	if (loading) return <Spinner />;

	// TODO: add to translations
	const UserButtons = (
		<Link to="/edit-profile">
			<Button size="small">Edit Profile</Button>
		</Link>
	);

	return (
		<PageContainer>
			<Grid container spacing={2}>
				<Grid item xs={12} md={4}>
					<Card className={classes.card} variant="outlined">
						<CardContent>
							<Avatar
								alt=""
								src={`${process.env.REACT_APP_MEDIA}${profile.image}`}
								className={classes.large}
							/>
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
								variant="h6"
							>
								{profile.name} {profile.lastname}
							</Typography>
							{!!profile.birthday && (
								<Grid container>
									<Grid item xs={12} container justifyContent="center">
										<Typography className={classes.pos} color="textSecondary">
											{moment(profile.birthday).format(DATE_FORMAT)}
										</Typography>
									</Grid>
								</Grid>
							)}
							{!!profile.location && (
								<Grid container>
									<Grid item xs={12} container justifyContent="center">
										<Typography className={classes.pos} color="textSecondary">
											{profile.location}
										</Typography>
									</Grid>
								</Grid>
							)}
							<Grid container>
								{profile?.preferable && profile?.preferable?.length > 0 && (
									<>
										<Grid
											item
											xs={12}
											container
											justifyContent="center"
											style={{ marginTop: 10 }}
										>
											<Typography className={classes.title}>
												{t('profile.preferable')}
											</Typography>
										</Grid>
										<Grid item xs={12} container justifyContent="center">
											{profile?.preferable?.map((item, key) => {
												return <div key={key}>{sports[item]}</div>;
											})}
										</Grid>
									</>
								)}
								{profile?.undesirable && profile?.undesirable?.length > 0 && (
									<>
										<Grid
											item
											xs={12}
											container
											justifyContent="center"
											style={{ marginTop: 10 }}
										>
											<Typography className={classes.title}>
												{t('profile.preferable')}
											</Typography>
										</Grid>
										<Grid item xs={12} container justifyContent="center">
											{profile?.undesirable?.map((item, key) => (
												<div key={key}>{sports[item]}</div>
											))}
										</Grid>
									</>
								)}
							</Grid>
							<Typography variant="body2" component="p"></Typography>
						</CardContent>
						<CardActions>{UserButtons}</CardActions>
					</Card>
					{!!profile?.friends?.length && (
						<div style={{ paddingTop: 20 }}>
							<Typography variant="h4" style={{ textAlign: 'center' }}>
								{t('profile.friends')}
							</Typography>
						</div>
					)}
					{profile?.friends?.map((friend) => (
						<Link key={friend._id} to={`/user/${friend._id}`}>
							<Card className={classes.smallCard} variant="outlined">
								<CardContent>
									<Grid container>
										<Grid item xs={2}>
											<Avatar
												src={`${process.env.REACT_APP_MEDIA}${friend.image}`}
												className={classes.small}
											/>
										</Grid>
										<Grid item xs={10} style={{ paddingLeft: 10 }}>
											<Typography
												className={classes.title}
												color="textSecondary"
												gutterBottom
												style={{ textAlign: 'left' }}
											>
												{friend.name} {friend.lastname}
											</Typography>
											<Typography variant="body2" style={{ textAlign: 'left' }}>
												{friend.location}
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Link>
					))}
				</Grid>
				<Grid item xs={12} md={8}>
					{posts.map((post) => (
						<Post key={post._id} {...{ post, user }} />
					))}
					{postsLoading && <Spinner />}
					<Grid container justifyContent="center" style={{ marginTop: 20 }}>
						<Button
							disabled={exhausted}
							onClick={() => {
								if (!exhausted) {
									fetchAndSetPosts(profile._id, offset);
								}
							}}
						>
							{t('common.load_more')}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default MyProfile;
