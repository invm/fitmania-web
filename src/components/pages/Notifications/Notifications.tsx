import { useEffect } from 'react';

import { Grid, Container, Button } from '@material-ui/core/';
import { PageContainer, Spinner } from '../../common';
import { RootState } from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import {
	getNotifications,
	resetNotifications,
	resetNotificationsCount,
} from '../../../redux/actions/notifications';
import { useTranslation } from 'react-i18next';
import Notification from './components/Notification';

const Notifications = () => {
	const { notificationsLoading, notifications, notificationsExhausted } =
		useSelector((state: typeof RootState) => state.notifications);
	const dispatch = useDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		dispatch(resetNotifications());
		dispatch(getNotifications());
		dispatch(resetNotificationsCount());
	}, [dispatch]);

	if (notificationsLoading) return <Spinner />;

	const expandList = () => {
		!notificationsExhausted && dispatch(getNotifications());
	};

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
							{notifications.map((notification) => (
								<Notification key={notification._id} {...{ notification }} />
							))}
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
							disabled={notificationsLoading || notificationsExhausted}
							variant="contained"
							onClick={expandList}
							style={{ height: 40 }}
						>
							{notificationsLoading ? (
								<Spinner size={0.3} />
							) : notificationsExhausted ? (
								'No more notifications'
							) : (
								'Load More'
							)}
						</Button>
					</Grid>
				</Container>
			</div>
		</PageContainer>
	);
};

export default Notifications;
