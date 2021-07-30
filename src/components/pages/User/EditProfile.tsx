import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Grid,
  Card,
  Typography,
  TextField,
  CardContent,
  CardActions,
  Button,
  Avatar,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { PageContainer } from '../../common';
import { sports } from '../Posts/Posts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import i18n from '../../../i18n';
import { updateProfile } from '../../../redux/actions';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: 100,
    textAlign: 'center',
    overflow: 'visible',
    padding: 12,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  large: {
    margin: '-100px auto 20px auto',
    width: 150,
    height: 150,
    border: '2px solid #999',
  },
  buttonProgress: {
    color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const profileSchema = Yup.object().shape({
  email: Yup.string().email(i18n.t('errors.invalid_email')).required(i18n.t('errors.required_field')),
  name: Yup.string()
    .min(2, i18n.t('errors.value_too_short'))
    .max(50, i18n.t('errors.value_too_short'))
    .required(i18n.t('errors.required_field')),
  lastname: Yup.string()
    .min(2, i18n.t('errors.value_too_short'))
    .max(50, i18n.t('errors.value_too_short'))
    .required(i18n.t('errors.required_field')),
  birthday: Yup.date(),
  location: Yup.string(),
  image: Yup.string(),
  preferable: Yup.array().of(Yup.string()),
  undesirable: Yup.array().of(Yup.string()),
});

const EditProfile = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: typeof RootState) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState<{ imgURI: string; image: any }>({
    imgURI: '',
    image: null,
  });

  const inputEl = useRef<HTMLInputElement>(null);

  // const saveProfile = () => {
  //   if (!state.lastname) {
  //     showError('Can not save without a last name.');
  //   } else if (!state.name) {
  //     showError('Can not save without a name.');
  //   } else if (!state.birthday) {
  //     showError('Please provide date of birth.');
  //   } else if (!state.location) {
  //     showError('Please provide your city.');
  //   } else {
  //     setLoading(true);
  //     updateUserProfile({
  //       ...state,
  //       birthday: new Date(state.birthday).getTime(),
  //     })
  //       .then((res) => {
  //         setState(res.data.data);
  //         setUserProfile(res.data.data);
  //         setLoading(false);
  //         showError('Profile updated');
  //       })
  //       .catch((err) => {
  //         showError(err.message);
  //         setLoading(false);
  //       });
  //   }
  // };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, setFieldValue: (key: string, value: any) => void) => {
    var file = inputEl?.current && inputEl.current?.files && inputEl.current?.files?.[0];
    if (file && inputEl?.current?.files?.[0] !== null) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        setImage({
          imgURI: reader.result as string,
          image: inputEl?.current?.files?.[0] ?? ({} as File),
        });
        inputEl?.current?.files?.[0] && setFieldValue('image', inputEl?.current?.files?.[0]);
      };
    }
  };

  // const handlePreferable = (e) => {
  //   if (state.preferable.includes(e.target.value)) {
  //     setState({
  //       ...state,
  //       preferable: state.preferable.filter((item) => item !== e.target.value),
  //     });
  //   } else {
  //     setState({ ...state, preferable: [...state.preferable, e.target.value] });
  //   }
  // };

  // const handleUndesirable = (e) => {
  //   if (state.undesirable.includes(e.target.value)) {
  //     setState({
  //       ...state,
  //       undesirable: state.undesirable.filter((item) => item !== e.target.value),
  //     });
  //   } else {
  //     setState({
  //       ...state,
  //       undesirable: [...state.undesirable, e.target.value],
  //     });
  //   }
  // };

  const saveProfile = async (values: {
    [key: string]: any;
    email: string;
    name: string;
    lastname: string;
    image: string;
    preferable: string[];
    undesirable: string[];
    birthday: string;
    location: string;
  }) => {
    let body = Object.keys(values)
      .filter((v) => v !== 'email' && values[v] !== user[v])
      .reduce((obj, key) => ({ ...obj, ...(values[key] && { [key]: values[key] }) }), {});
    if (Object.keys(body).length) {
      setLoading(true);
      await dispatch(updateProfile(body));
    }
  };

  return (
    <PageContainer>
      <Grid container>
        <Grid item xs={12} lg={4} sm={8} md={6} style={{ margin: '0 auto' }}>
          <Card className={classes.card} variant="outlined">
            <Formik
              initialValues={{
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                image: user?.avatar ?? '',
                preferable: user?.preferable ?? [],
                undesirable: user?.undesirable ?? [],
                birthday: user?.birthday ?? '',
                location: user?.location ?? '',
              }}
              validationSchema={profileSchema}
              onSubmit={saveProfile}
            >
              {({ handleSubmit, values, errors, setFieldValue }) => (
                <>
                  <CardContent>
                    <Avatar
                      alt=""
                      src={
                        image.imgURI
                          ? image.imgURI
                          : values.image
                          ? `${process.env.REACT_APP_MEDIA}${values.image}`
                          : ''
                      }
                      className={classes.large}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} justifyContent="center" container>
                        <input
                          accept="image/*"
                          ref={inputEl}
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e, setFieldValue)}
                          id="raised-button-file"
                          multiple
                          type="file"
                        />
                        <label htmlFor="raised-button-file">
                          <Button component="span">
                            <CameraAltIcon />
                          </Button>
                        </label>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          label="Name"
                          variant="outlined"
                          name="name"
                          fullWidth
                          disabled={loading}
                          required
                          value={values.name}
                          onChange={(e) => setFieldValue('name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          label="Last Name"
                          required
                          variant="outlined"
                          fullWidth
                          disabled={loading}
                          name="lastname"
                          value={values.lastname}
                          onChange={(e) => setFieldValue('lastname', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          fullWidth
                          variant="outlined"
                          disabled
                          name="email"
                          value={values.email}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Location"
                          variant="outlined"
                          fullWidth
                          disabled={loading}
                          value={values.location}
                          name="location"
                          onChange={(e) => setFieldValue('location', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="dd/MM/yyyy"
                            fullWidth
                            margin="normal"
                            label="Birthday"
                            value={values.birthday ? new Date(values.birthday) : null}
                            onChange={(date) => setFieldValue('birthday', date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <Grid container spacing={2}>
                        {Object.entries(sports).filter((item) => !values.preferable?.includes(item[0])).length > 0 && (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h5">Selected Preferred Sports</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              {Object.entries(sports)
                                .filter((item) => !values.undesirable.includes(item[0]))
                                .map((item) => (
                                  <FormControlLabel
                                    key={item[0]}
                                    control={
                                      <Checkbox
                                        color={'primary'}
                                        value={item[0]}
                                        checked={values.preferable.includes(item[0])}
                                        onChange={(e) => {
                                          if (values.preferable.includes(e.target.value)) {
                                            setFieldValue(
                                              'preferable',
                                              values.preferable.filter((v) => v !== e.target.value)
                                            );
                                          } else {
                                            setFieldValue('preferable', [...values.preferable, e.target.value]);
                                          }
                                        }}
                                        icon={item[1]}
                                      />
                                    }
                                    label={item[0]}
                                  />
                                ))}
                            </Grid>
                          </>
                        )}
                        {Object.entries(sports).filter((item) => !values.undesirable.includes(item[0])).length > 0 && (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h5">Selected Undesirable Sports</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              {Object.entries(sports)
                                .filter((item) => !values.preferable.includes(item[0]))
                                .map((item) => (
                                  <FormControlLabel
                                    key={item[0]}
                                    control={
                                      <Checkbox
                                        color={'secondary'}
                                        value={item[0]}
                                        checked={values.undesirable.includes(item[0])}
                                        onChange={(e) => {
                                          if (values.undesirable.includes(e.target.value)) {
                                            setFieldValue(
                                              'undesirable',
                                              values.undesirable.filter((v) => v !== e.target.value)
                                            );
                                          } else {
                                            setFieldValue('undesirable', [...values.undesirable, e.target.value]);
                                          }
                                        }}
                                        icon={item[1]}
                                      />
                                    }
                                    label={item[0]}
                                  />
                                ))}
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button size="small" disabled={loading} type="submit" onClick={(e) => handleSubmit()}>
                      Save Profile
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </Button>
                  </CardActions>
                </>
              )}
            </Formik>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EditProfile;
