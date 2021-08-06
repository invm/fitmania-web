import {
	Card,
	CardContent,
	CardHeader,
	Avatar,
	Button,
	makeStyles,
} from '@material-ui/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import IBefriendRequest from '../../../../interfaces/BefriendRequest';
import {
	acceptFriendRequest,
	declineFriendRequest,
} from '../../../../redux/actions/friends';
import { Spinner } from '../../../common';

const useStyles = makeStyles((theme) => ({
	cardHeader: {
		padding: '0',
	},
	avatar: {
		backgroundColor: theme.palette.primary.main,
		width: 50,
		height: 50,
	},
}));

const FriendRequest = ({ request }: { request: IBefriendRequest }) => {
	const classes = useStyles();

	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const handleAccept = async () => {
		setLoading(true);
		await dispatch(acceptFriendRequest(request.from._id));
	};

	const handleDecline = async () => {
		setLoading(true);
		await dispatch(declineFriendRequest(request.from._id));
	};

	return (
		<Card variant="outlined">
			<CardContent>
				<CardHeader
					className={classes.cardHeader}
					avatar={
						<Link to={`/user/${request.from._id}`}>
							<Avatar
								src={`${process.env.REACT_APP_MEDIA}${request.from?.image}`}
								className={classes.avatar}
							>
								{request.from?.name?.[0].toUpperCase()}
							</Avatar>
						</Link>
					}
					title={
						<Link to={`/user/${request.from._id}`}>
							<b style={{ fontSize: 16 }}>
								{request.from?.name} {request.from?.lastname}
							</b>
						</Link>
					}
					action={
						<div style={{ display: 'flex', padding: '8px 8px 0 0' }}>
							{loading ? (
								<Spinner size={0.3} />
							) : (
								<>
									<Button
										variant="contained"
										color="primary"
										onClick={handleAccept}
										style={{ marginRight: 10 }}
									>
										Accept
									</Button>
									<Button variant="outlined" onClick={handleDecline}>
										Decline
									</Button>
								</>
							)}
						</div>
					}
					subheader={<b style={{ fontSize: 14 }}>{request?.from?.location}</b>}
				/>
				{request?.from?.preferable?.length > 0 && (
					<div>Likes: {request?.from?.preferable.join(', ')}</div>
				)}
				{request?.from?.undesirable?.length > 0 && (
					<div>Dislikes: {request?.from?.undesirable.join(', ')}</div>
				)}
			</CardContent>
		</Card>
	);
};

export default FriendRequest;
