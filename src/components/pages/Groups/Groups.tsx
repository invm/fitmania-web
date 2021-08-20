import { useState, useEffect } from 'react';
import {
	Grid,
	FormControlLabel,
	Checkbox,
	Typography,
	Button,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../common';
import { RootState } from '../../../redux';
import { sports } from '../Posts/Posts';
import { getGroups, resetGroups } from '../../../redux/actions/groups';
import GroupListItem from './components/GroupListItem';

const Groups = () => {
	const [selectedSports, setSelectedSports] = useState<string[]>([]);
	const dispatch = useDispatch();
	const {
		user: { user },
		groups: { groups, groupsExhausted, groupsLoading },
	} = useSelector((state: typeof RootState) => state);

	const handleSelectSport = (e: any) => {
		if (selectedSports.includes(e.target.value)) {
			setSelectedSports([
				...selectedSports.filter((item) => item !== e.target.value),
			]);
		} else {
			setSelectedSports([...selectedSports, e.target.value]);
		}
	};

	useEffect(() => {
		(async () => {
			if (!groupsExhausted && !groupsLoading)
				if (selectedSports.length) {
					await dispatch(resetGroups());
					await dispatch(getGroups(selectedSports));
				} else {
					await dispatch(resetGroups());
					await dispatch(getGroups([]));
				}
		})();
		// eslint-disable-next-line
	}, [selectedSports, dispatch]);

	const handleLoadMore = () => {
		if (!groupsExhausted && !groupsLoading) dispatch(getGroups(selectedSports));
	};

	return (
		<PageContainer>
			<Grid spacing={4} container justifyContent="center">
				<div style={{ margin: '18px 0 0 0' }}>
					<Link to={'/create-group'}>
						<Button size="large">+ Create Group</Button>
					</Link>
				</div>
				<Grid item xs={12} container justifyContent="center">
					<Grid item xs={12}>
						<Typography align="center" variant="h5">
							Filter groups by sport
						</Typography>
					</Grid>
					{Object.entries(sports).map((item) => (
						<FormControlLabel
							key={item[0]}
							control={
								<Checkbox
									color={'primary'}
									value={item[0]}
									checked={selectedSports.includes(item[0])}
									onChange={handleSelectSport}
									icon={item[1]}
								/>
							}
							label={item[0]}
						/>
					))}
					<Grid item xs={12}>
						<Typography align="center" variant="h5">
							Showing results for{' '}
							{selectedSports.length > 0
								? selectedSports.join(', ')
								: 'all sports'}
						</Typography>
					</Grid>
				</Grid>
				{groups.map((group, key) => {
					return (
						<Grid container item xs={12} md={6}>
							<GroupListItem key={key} {...{ group, user }} />;
						</Grid>
					);
				})}
				<Grid item xs={12} container justifyContent="center">
					<Button
						disabled={groupsExhausted}
						variant="contained"
						onClick={handleLoadMore}
					>
						Load More
					</Button>
				</Grid>
			</Grid>
		</PageContainer>
	);
};

export default Groups;
