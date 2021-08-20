import {
	Button,
	Card,
	CardContent,
	Checkbox,
	Grid,
	Typography,
} from '@material-ui/core';
import IGroup from '../../../../interfaces/Group';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import { sports } from '../../Posts/Posts';
import { CardActions } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface GroupListItemProps {
	group: IGroup;
}

const GroupListItem = ({ group }: GroupListItemProps) => {
	return (
		<Grid item xs={12} container justifyContent="center">
			<Card style={{ width: '100%' }}>
				<CardContent>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Checkbox disabled color={'primary'} icon={sports[group.sport]} />
							<Typography variant="h5">{group.title}</Typography>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Typography variant="h6" component="span">
								{group.users?.length}
							</Typography>
							<PersonOutlinedIcon />
						</div>
					</div>
					{group.description && (
						<Typography variant="body2" color="textSecondary" component="p">
							{group.description}
						</Typography>
					)}
				</CardContent>
				<CardActions>
					<Link to={`/groups/${group._id}`}>
						<Button size="small" color="primary">
							Learn More
						</Button>
					</Link>
				</CardActions>
			</Card>
		</Grid>
	);
};

export default GroupListItem;
