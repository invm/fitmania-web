import { useState, useRef, ChangeEvent } from 'react';
import {
	Grid,
	Card,
	Typography,
	IconButton,
	TextField,
	CardHeader,
	CardContent,
	Checkbox,
	FormControlLabel,
	Collapse,
	CardMedia,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { useDispatch, useSelector } from 'react-redux';
import {
	createPost,
	CreatePostFunctionProps,
	getPosts,
	resetPosts,
} from '../../../../redux/actions';
import { showMessage } from '../../../../redux/actions';
import { RootState } from '../../../../redux';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useTranslation } from 'react-i18next';
import { IObject } from '../../../../interfaces/Common';
import { PlacesAutocomplete } from '../../../common';
import moment from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
	cardContent: {
		padding: 16,
	},
	textarea: {
		minWidth: '200px',
		width: '100%',
	},
	camera: {
		minWidth: '1px',
		padding: '8px',
		borderRadius: '50%',
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
		marginTop: '8px',
		borderRadius: '5px',
	},
	formControl: {
		width: '100%',
	},
}));

const initialState: IObject & { imgURI: string | ArrayBuffer | null } = {
	text: '',
	imgURI: '',
	image: {} as File,
	sport: '',
	pace: '',
	limitParticipants: 2,
	group: '',
	workoutChecked: false,
	privateChecked: false,
	openEvent: false,
	coordinates: [],
	address: '',
};

const CreatePost = () => {
	// TODO: refactor into smaller pieces!
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { user } = useSelector((state: typeof RootState) => state.user);
	const classes = useStyles();
	const [state, setState] = useState(initialState);
	const [loading, setLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(
		new Date(moment().add(2, 'days').format())
	);

	// File input ref
	let inputEl = useRef<HTMLInputElement>(null);

	const handleCheckboxChange = (
		event: ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		setState((s) => ({ ...s, workoutChecked: event?.target?.checked }));
	};

	const onChange = (
		e: ChangeEvent<{
			name?: any;
			value: number | string | unknown;
			id?: string;
		}>
	) => {
		if (e.target.id === 'participants-limit' && Number(e.target.value) > 0) {
			setState({ ...state, limitParticipants: Number(e.target.value) });
		} else {
			setState({
				...state,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handlePrivateCheckboxChange = () => {
		setState((s) => ({ ...s, privateChecked: !s.privateChecked }));
	};
	const handleOpenEventCheckboxChange = () => {
		setState((s) => ({ ...s, openEvent: !state.openEvent }));
	};

	const handlePostCreate = async () => {
		let post: CreatePostFunctionProps = {
			text: state.text,
			display: state.privateChecked ? 'friends' : 'all',
			group: state.group,
		};
		if (state.imgURI) post.image = state.image;
		if (state.workoutChecked) {
			post = {
				...post,
				eventType: state.sport,
				pace: state.pace,
				startDate: selectedDate,
				openEvent: state.openEvent,
				limitParticipants: state.limitParticipants,
				address: state.address,
				coordinates: state.coordinates,
			};
		}
		if (!post.text && !post?.image) {
			showMessage(
				t('common.error'),
				t('create_post.cant_create_empty_post'),
				'error'
			);
		} else if (
			state.workoutChecked &&
			(selectedDate.getTime() - new Date().getTime() < 900000 ||
				!post.eventType ||
				!post.limitParticipants ||
				!post.pace ||
				!post.startDate)
		) {
			showMessage(
				t('common.error'),
				t('create_post.event_time_too_early'),
				'error'
			);
		} else if (
			state.workoutChecked &&
			(!post.eventType ||
				!post.limitParticipants ||
				!post.pace ||
				!post.startDate)
		) {
			showMessage(
				t('common.error'),
				t('create_post.please_fill_all_details'),
				'error'
			);
		} else {
			setLoading(true);
			let success = await createPost(post);
			if (success) {
				dispatch(resetPosts());
				dispatch(getPosts());
				setState(initialState);
				if (inputEl?.current?.value) inputEl.current.value = '';
				setSelectedDate(new Date());
			}
			setLoading(false);
		}
	};

	const handleImageUpload = () => {
		var file =
			inputEl?.current && inputEl.current?.files && inputEl.current?.files?.[0];
		if (file && inputEl?.current?.files?.[0] !== null) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (ev) => {
				setState({
					...state,
					imgURI: reader.result,
					image: inputEl?.current?.files?.[0] ?? ({} as File),
				});
			};
		}
	};

	const handleDateChange = (date: MaterialUiPickersDate) => {
		if (date && date.getTime() - new Date().getTime() < 900000) {
			showMessage(
				t('common.error'),
				t('create_post.event_time_too_early', 'error')
			);
		} else {
			let _date = new Date((date ?? new Date())?.getTime());
			setSelectedDate(_date);
		}
	};

	return (
		<Card raised>
			<CardHeader
				action={
					<Tooltip
						style={{ marginTop: '8px', marginRight: '8px' }}
						title="Publish your post!"
					>
						{loading ? (
							<CircularProgress color="primary" size={30} />
						) : (
							<IconButton
								disabled={loading}
								onClick={handlePostCreate}
								aria-label="send"
							>
								<SendIcon />
							</IconButton>
						)}
					</Tooltip>
				}
				title={"Share what's on your mind or start an event!"}
			/>
			<CardContent className={classes.cardContent}>
				<Grid container>
					<Grid container item xs={12} alignItems="center">
						<Grid item xs={10}>
							<FormControl variant="outlined" className={classes.formControl}>
								<TextField
									className={classes.textarea}
									id="post-text"
									label="Share some thoughts..."
									placeholder=""
									multiline
									name="text"
									onChange={onChange}
									value={state.text}
									variant="outlined"
								/>
							</FormControl>
						</Grid>
						<Grid item xs={2} justifyContent="center" container>
							<input
								accept="image/*"
								ref={inputEl}
								style={{ display: 'none' }}
								onChange={handleImageUpload}
								id="raised-button-file"
								multiple
								type="file"
							/>
							<label htmlFor="raised-button-file">
								<Button
									disabled={loading}
									className={classes.camera}
									component="span"
								>
									<CameraAltIcon />
								</Button>
							</label>
						</Grid>
					</Grid>
					<Grid container item sm={12} alignItems="center">
						<Grid container item xs={6} justifyContent="center">
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.workoutChecked}
											onChange={handleCheckboxChange}
											name="display"
											color="primary"
										/>
									}
									label="Workout"
								/>
							</Grid>
						</Grid>
						<Grid container item xs={6} justifyContent="center">
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.privateChecked}
											onChange={handlePrivateCheckboxChange}
											name="display"
											color="primary"
										/>
									}
									label="Private post"
								/>
							</Grid>
						</Grid>
					</Grid>
					{!!user?.groups && user.groups?.length > 0 && (
						<Grid item xs={12}>
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel id="demo-simple-select-outlined-label">
									Share Group
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={state.group}
									name={'group'}
									onChange={onChange}
									label="Share Group"
								>
									{user?.groups?.map((group) => (
										<MenuItem key={group._id} value={group._id}>
											{group.title}{' '}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					)}
				</Grid>
				{!!state.imgURI && (
					<Grid item xs={12} md={6}>
						<CardMedia className={classes.media} image={`${state.imgURI}`} />
					</Grid>
				)}
			</CardContent>
			<Collapse in={state.workoutChecked} timeout={300} unmountOnExit>
				<CardContent>
					<Typography paragraph>
						Please specify the type of activity you are planning on:
					</Typography>
					<Grid container>
						<Grid item xs={12} md={6}>
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel id="demo-simple-select-outlined-label">
									Activity
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={state.sport}
									name={'sport'}
									onChange={onChange}
									label="Activity"
								>
									<MenuItem value={'Tennis'}>Tennis</MenuItem>
									<MenuItem value={'Hiking'}>Hiking</MenuItem>
									<MenuItem value={'Rugby'}>Rugby</MenuItem>
									<MenuItem value={'Basketball'}>Basketball</MenuItem>
									<MenuItem value={'Soccer'}>Soccer</MenuItem>
									<MenuItem value={'Running'}>Running</MenuItem>
									<MenuItem value={'Biking'}>Biking</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid container item xs={12} md={6} alignItems="center">
							<FormControl variant="outlined" className={classes.formControl}>
								<div style={{ flex: 1 }}>
									<PlacesAutocomplete
										// @ts-ignore
										handleSelect={(address, coordinates) => {
											setState((s) => ({ ...s, address, coordinates }));
										}}
										value={state.address}
									/>
								</div>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4}>
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel id="demo-simple-select-outlined-label">
									Pace
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={state.pace}
									name={'pace'}
									onChange={onChange}
									label="Pace"
								>
									<MenuItem value={'Easy'}>Easy</MenuItem>
									<MenuItem value={'Medium'}>Medium</MenuItem>
									<MenuItem value={'Fast'}>Fast</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4}>
							<FormControl variant="outlined" className={classes.formControl}>
								<TextField
									id="participants-limit"
									label="Limit Participants"
									type="number"
									onChange={onChange}
									value={state.limitParticipants}
									variant="outlined"
								/>
							</FormControl>
						</Grid>
						<Grid container item xs={12} md={4} alignItems="center">
							<Tooltip title="Open event means anybody can join your event, otherwise only your friends will be able to see and join this event.">
								<FormControlLabel
									control={
										<Checkbox
											checked={state.openEvent}
											onChange={handleOpenEventCheckboxChange}
											name="open-event"
											color="primary"
										/>
									}
									label="Open Event?"
								/>
							</Tooltip>
						</Grid>
					</Grid>

					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container justifyContent="space-around">
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="MM/dd/yyyy"
								margin="normal"
								id="date-picker-inline"
								label="Pick a date"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
							<KeyboardTimePicker
								margin="normal"
								id="time-picker"
								label="Pick a time"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change time',
								}}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
					<Typography paragraph>
						Making an event means you are inviting people to participate in a
						sport activity and will allow people to join, if you selected the
						option of open event. Otherwise, only your friends will be able to
						see and join those events.
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default CreatePost;
