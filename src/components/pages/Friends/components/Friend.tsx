import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	makeStyles,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import IUser, { IUserMin } from '../../../../interfaces/User';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		width: '100%',
	},
	cardHeader: {
		padding: '0 8px 0',
	},
	avatar: {
		backgroundColor: theme.palette.primary.main,
		width: 60,
		height: 60,
	},
}));

const Friend = ({ user }: { user: IUser }) => {
	const classes = useStyles();

	console.log(user);

	return (
		<Card className={classes.paper} variant="outlined">
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
							<b>
								{user?.name} {user?.lastname}
							</b>
							<b>{user?.location && <p>{user?.location}</p>}</b>
						</Link>
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
	);
};

export default Friend;
