import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import INotification from '../../../../interfaces/Notification';
import { Button, CardActions, CardHeader, IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { red } from '@material-ui/core/colors';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { deleteNotification } from '../../../../redux/actions/notifications';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../common';

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		marginBottom: 10,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 16,
	},
	pos: {
		marginBottom: 12,
	},
	avatar: {
		backgroundColor: red[500],
	},
});

const Notification = ({ notification }: { notification: INotification }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();

	let route = `${notification.type === 'post' ? 'posts' : 'user'}/${
		notification.resource
	}`;

	const handleDelete = async () => {
		setLoading(true);
		await dispatch(deleteNotification(notification._id));
	};

	return (
		<Card
			className={classes.root}
			style={{
				backgroundColor: notification.read ? '' : 'var(--light-overlay)',
			}}
			variant="outlined"
		>
			<CardHeader
				titleTypographyProps={{
					variant: 'body1',
					color: 'primary',
				}}
				style={{ padding: 8 }}
				action={
					loading ? (
						<div style={{ padding: 8 }}>
							<Spinner size={0.4} />
						</div>
					) : notification.resource ? (
						<Link to={route}>
							<IconButton aria-label="settings">
								<ArrowForwardIcon />
							</IconButton>
						</Link>
					) : null
				}
				title={notification.title}
				subheader={moment(notification.created_at).format('DD/MM/YY HH:mm')}
			/>
			<CardContent style={{ padding: '0px 8px 4px' }}>
				<Typography variant="body1" component="p">
					{notification.body}
				</Typography>
			</CardContent>
			<CardActions>
				<Button disabled={loading} onClick={handleDelete}>
					{t('common.delete')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default Notification;
