import React, { useState } from 'react';
import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardHeader,
	makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import IUser from '../../../../interfaces/User';
import { addFriend, removeFriend } from '../../../../redux/actions/friends';
import { useDispatch } from 'react-redux';
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

const Friend = ({
	user,
	suggestion = false,
}: {
	user: IUser;
	suggestion?: boolean;
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const handleAddFriend = async () => {
		setLoading(true);
		await dispatch(addFriend(user._id));
		setLoading(false);
	};

	const handleRemoveFriend = async () => {
		setLoading(true);
		await dispatch(removeFriend(user._id));
		setLoading(false);
	};

	return (
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
						<div style={{ display: 'flex', padding: '8px 8px 0 0' }}>
							{loading ? (
								<Spinner size={0.3} />
							) : suggestion ? (
								<Button variant="outlined" onClick={handleAddFriend}>
									Add friend
								</Button>
							) : (
								<Button variant="outlined" onClick={handleRemoveFriend}>
									Remove friend
								</Button>
							)}
						</div>
					}
					subheader={<b style={{ fontSize: 14 }}>{user?.location}</b>}
				/>
				{user?.preferable?.length > 0 && (
					<div>Likes: {user?.preferable.join(', ')}</div>
				)}
				{user?.undesirable?.length > 0 && (
					<div>Dislikes: {user?.undesirable.join(', ')}</div>
				)}
			</CardContent>
		</Card>
	);
};

export default Friend;
