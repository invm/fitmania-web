import { Grid } from '@material-ui/core';
import IUser from '../../../../interfaces/User';
import Friend from './Friend';

const FriendsSuggestions = ({ users }: { users: IUser[] }) => {
	return users.length > 0 ? (
		<Grid container item xs={12}>
			<Grid item xs={12}>
				<h2>
					<b>Friends suggestions</b>
				</h2>
			</Grid>
			{users.map((user) => (
				<Grid item xs={12} lg={6} key={user._id}>
					<Friend {...{ user }} suggestion />
				</Grid>
			))}
		</Grid>
	) : null;
};

export default FriendsSuggestions;
