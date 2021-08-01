import { useState, FormEvent } from 'react';
import { Grid, Button, Paper, TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PageContainer, Spinner } from '../../common';
import { sports } from '../Posts/Posts';
import { createGroup } from '../../../redux/actions/groups';
import { showMessage } from '../../../redux/actions';
import { RouteChildrenProps } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  cardHeader: {
    padding: '0 8px 0',
  },
  card: {
    marginTop: '8px',
    padding: '12px 8px 12px 8px',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    padding: '0px 10px 10px ',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const GroupCreate = ({ history }: RouteChildrenProps) => {
  const [state, setState] = useState({
    title: '',
    sport: '',
  });
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const handleGroupCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.title.length > 0 && state.sport.length > 0) {
      setLoading(true);
      await createGroup(state);
      setLoading(false);
      history.push('/groups');
    } else {
      // TODO: move texts into i18n
      showMessage('error', 'Please select a sport and give the group a title');
    }
  };

  // TODO: move text into i18n

  return (
    <PageContainer>
      <Grid container justifyContent="center" style={{ paddingTop: 20 }}>
        <Grid item xs={12} sm={4} component={Paper} elevation={6} container justifyContent="center" alignItems="center">
          <form className={classes.form} noValidate onSubmit={handleGroupCreate}>
            {loading && <Spinner />}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={(e) => setState({ ...state, title: e.target.value })}
              value={state.title}
              id="title"
              label="Group title"
              name="title"
              autoFocus
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Sport</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state.sport}
                onChange={(e) => setState({ ...state, sport: `${e.target.value}` })}
                label="Sport"
                fullWidth
              >
                {Object.keys(sports).map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sports[sport]} {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button disabled={loading} fullWidth variant="contained" type="submit">
              Create Group
            </Button>
          </form>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default GroupCreate;
