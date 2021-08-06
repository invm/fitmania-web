import { Grid } from '@material-ui/core';
import IBefriendRequest from '../../../../interfaces/BefriendRequest';
import FriendRequest from './FriendRequest';

const FriendRequests = ({ requests }: { requests: IBefriendRequest[] }) => {
	return requests.length > 0 ? (
		<Grid container item xs={12}>
			<Grid item xs={12}>
				<h2>
					<b>Friend requests</b>
				</h2>
			</Grid>
			{requests.map((request) => (
				<Grid item xs={12} lg={6} key={request._id}>
					<FriendRequest {...{ request }} />
				</Grid>
			))}
		</Grid>
	) : null;
};

export default FriendRequests;
