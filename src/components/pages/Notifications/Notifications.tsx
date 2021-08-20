import { useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';

import { Grid, Container } from '@material-ui/core/';
import { PageContainer, Spinner } from '../../common';
import { RootState } from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../../../redux/actions/notifications';
import { useTranslation } from 'react-i18next';

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		flexGrow: 1,
// 	},
// 	paper: {
// 		padding: theme.spacing(1),
// 		marginTop: theme.spacing(3),
// 	},
// 	img: {
// 		width: 50,
// 		height: 50,
// 		borderRadius: 25,
// 	},
// }));

const Notifications = () => {
	// const classes = useStyles();
	const { notificationsLoading, notifications } = useSelector(
		(state: typeof RootState) => state.notifications
	);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(getNotifications());
	}, [dispatch]);

	if (notificationsLoading) return <Spinner />;

	// const Notification = ({ notification }) => {
	// 	const {
	// 		friend: { avatar, name, lastname, _id },
	// 		title,
	// 		responded,
	// 		read,
	// 		created_at,
	// 	} = notification;

	// 	const handleDeleteNotification = (notificationId) => {
	// 		deleteNotification(notification._id);
	// 	};

	// 	return (
	// 		<Grid item container justifyContent="center" xs={12}>
	// 			<Paper
	// 				className={classes.paper}
	// 				style={{
	// 					backgroundColor: read ? '#505050' : 'grey',
	// 					border: '1px solid',
	// 					borderColor: !read ? '#00acff' : 'grey',
	// 				}}
	// 			>
	// 				<Grid container spacing={2} justifyContent="center">
	// 					<Grid item>
	// 						<ButtonBase className={classes.image}>
	// 							<Link to={`/profile/${_id}`}>
	// 								<img
	// 									className={classes.img}
	// 									alt="complex"
	// 									src={`${process.env.MEDIA}${avatar}`}
	// 								/>
	// 							</Link>
	// 						</ButtonBase>
	// 					</Grid>
	// 					<Grid item xs={12} sm container justifyContent="center">
	// 						<Grid item xs container direction="column" justifyContent="center">
	// 							{created_at && (
	// 								<Grid item xs>
	// 									<Typography gutterBottom variant="caption">
	// 										{new Date(created_at).toLocaleDateString('en-gb')}
	// 									</Typography>
	// 								</Grid>
	// 							)}
	// 							<Grid item xs>
	// 								<Typography gutterBottom variant="subtitle1">
	// 									{title}
	// 								</Typography>
	// 							</Grid>
	// 							<Grid item xs>
	// 								<Typography gutterBottom variant="subtitle1">
	// 									You have a new friend request from{' '}
	// 									<span>
	// 										{name} {lastname}
	// 									</span>
	// 								</Typography>
	// 							</Grid>
	// 							{!responded && (
	// 								<Grid item container justify="space-around">
	// 									<Grid item>
	// 										<Button onClick={handleAcceptRequest} color="primary">
	// 											Accept
	// 										</Button>
	// 									</Grid>
	// 									<Grid item>
	// 										<Button onClick={handleDeclineRequest} color="secondary">
	// 											Decline
	// 										</Button>
	// 									</Grid>
	// 								</Grid>
	// 							)}
	// 							<Grid item container justify="space-around">
	// 								<Grid item>
	// 									<Button
	// 										onClick={handleDeleteNotification}
	// 										color="secondary"
	// 									>
	// 										Delete
	// 									</Button>
	// 								</Grid>
	// 							</Grid>
	// 						</Grid>
	// 					</Grid>
	// 				</Grid>
	// 			</Paper>
	// 		</Grid>
	// 	);
	// };

	return (
		<PageContainer>
			<div className="fade">
				<Container maxWidth="md">
					<Grid container justifyContent="center">
						<Grid item container justifyContent="center" xs={12} md={6}>
							{!notifications.length && (
								<p style={{ textAlign: 'center', fontSize: 20 }}>
									{t('common.nothing_new')}
								</p>
							)}
							{notifications.map((item) => {
								return <div key={item._id}>{item._id}</div>;
								// switch (item.type) {
								//   case 'friend':
								//     return (
								//       <FriendNotification key={item._id} notification={item} />
								//     );
								//   default:
								//     return (
								//       <DefaultNotification key={item._id} notification={item} />
								//     );
								// }
							})}
						</Grid>
					</Grid>
				</Container>
			</div>
		</PageContainer>
	);
};

export default Notifications;
