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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../../../redux/actions';
import { showMessage } from '../../../../redux/actions';
import { RootState } from '../../../../redux';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useTranslation } from 'react-i18next';

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
    margin: theme.spacing(1),
    width: '90%',
  },
}));

const initialState = {
  text: '',
  imgURI: '',
  image: {} as File,
  sport: '',
  pace: '',
  limitParticipants: 1,
  group: '',
  workoutChecked: false,
  privateChecked: false,
  openEvent: false,
};

const CreatePost = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state: typeof RootState) => state.user);
  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [workoutChecked, setWorkoutChecked] = useState(false);
  const [privateChecked, setPrivateChecked] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);

  // File input ref
  const inputEl = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setWorkoutChecked(event?.target?.checked);
  };

  const onChange = (e: ChangeEvent<{ name?: any; value: number | string | unknown; id?: string }>) => {
    if (e.target.id === 'participants-limit' && typeof e.target.value === 'number' && e.target.value > 0) {
      setState({ ...state, limitParticipants: Number(e.target.value) });
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePrivateCheckboxChange = () => {
    setPrivateChecked(!privateChecked);
  };
  const handleOpenEventCheckboxChange = () => {
    setOpenEvent(!openEvent);
  };

  const handlePostCreate = async () => {
    let post = {
      isEvent: workoutChecked,
      text: state.text,
      image: state.image,
      display: privateChecked ? 'friends' : 'all',
      group: state.group,
    };
    if (post.isEvent) {
      post = {
        ...post,
        // event: {
        //   eventType: state.sport,
        //   pace: state.pace,
        //   startDate: selectedDate,
        //   openEvent: openEvent,
        //   limitParticipants: state.limitParticipants,
        //   // location: {
        //   //   type: 'Point',
        //   //   coordinates: [34.803042, 31.248062],
        //   // },
        // },
      };
    }
    if (!post.text && !post.image) {
      showMessage(t('common.error'), t('create_post.cant_create_empty_post'), 'error');
    } else if (post.isEvent && selectedDate.getTime() - new Date().getTime() < 900000) {
      showMessage(t('common.error'), t('create_post.event_time_too_early'), 'error');
    } else {
      await dispatch(createPost(post));
      setState(initialState);
      setWorkoutChecked(false);
      setPrivateChecked(false);
      setSelectedDate(new Date());
    }
  };

  const handleImageUpload = () => {
    var file = inputEl?.current && inputEl.current?.files && inputEl.current?.files?.[0];
    if (file && inputEl?.current?.files?.[0] !== null) {
      let reader = new FileReader();
      // var url = reader.readAsDataURL(file); // TODO: remove?
      reader.onload = (ev) => {
        if (typeof reader.result === 'string')
          setState({
            ...state,
            imgURI: reader.result,
            image: inputEl?.current?.files?.[0] ?? ({} as File),
          });
      };
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (date && date.getTime() - new Date().getTime() < 900000) {
      showMessage(t('common.error'), t('create_post.event_time_too_early', 'error'));
    } else {
      let _date = new Date((date ?? new Date())?.getTime());
      setSelectedDate(_date);
    }
  };

  return (
    <Card raised>
      <CardHeader
        action={
          <Tooltip style={{ marginTop: '8px', marginRight: '8px' }} title="Publish your post!">
            <IconButton onClick={handlePostCreate} aria-label="send">
              <SendIcon />
            </IconButton>
          </Tooltip>
        }
        title={"Share what's on your mind or start an event!"}
      />
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid container item xs={12} md={6} alignItems="center">
            <Grid item xs={10}>
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
            </Grid>

            <Grid item xs={2} justify="center" container>
              <Grid item xs={12} justify="center" container>
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
                  <Button className={classes.camera} component="span">
                    <CameraAltIcon />
                  </Button>
                </label>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item sm={12} md={3} alignItems="center">
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.privateChecked}
                  onChange={handlePrivateCheckboxChange}
                  name="display"
                  color="primary"
                />
              }
              label="Private"
            />
          </Grid>
          {!!user?.groups && user.groups?.length > 0 && (
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Share Group</InputLabel>
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
        {state.imgURI && (
          <Grid item xs={12} md={6}>
            <CardMedia className={classes.media} image={state.imgURI} />
          </Grid>
        )}
      </CardContent>
      <Collapse in={workoutChecked} timeout={300} unmountOnExit>
        <CardContent>
          <Typography paragraph>Please specify the type of activity you are planning on:</Typography>
          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Type Of Sport</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={state.sport}
                  name={'sport'}
                  onChange={onChange}
                  label="Type Of Sport"
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
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Pace</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={state.pace}
                  name={'pace'}
                  onChange={onChange}
                  label="Pace"
                >
                  <MenuItem value={'Easy'}>Easy</MenuItem>
                  <MenuItem value={'Light'}>Light</MenuItem>
                  <MenuItem value={'Medium'}>Medium</MenuItem>
                  <MenuItem value={'Fast'}>Fast</MenuItem>
                  <MenuItem value={'Ultra'}>Ultra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
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
            <Grid container item xs={12} md={3} alignItems="center">
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
            <Grid container justify="space-around">
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
            Making an event means you are inviting people to participate in a sport activity and will allow people to
            join, if you selected the option of open event. Otherwise, only your friends will be able to see and join
            those events.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CreatePost;
