import { Grid } from '@material-ui/core';
import IUser from '../../../../interfaces/User';
import Friend from './Friend';

const FriendList = ({ friends }: { friends: IUser[] }) => {
	return friends.length > 0 ? (
		<Grid container item xs={12}>
			<Grid item xs={12}>
				<h2>
					<b>Friends</b>
				</h2>
			</Grid>
			{friends.map((user) => (
				<Grid item xs={12} lg={6} key={user._id}>
					<Friend {...{ user }} />
				</Grid>
			))}
		</Grid>
	) : null;
};

export default FriendList;
