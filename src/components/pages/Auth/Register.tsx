import { useEffect, useState } from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { register, sendOTPorLogin, verifyOTP } from '../../../redux/actions';
import { useTranslation } from 'react-i18next';
import Copyright from '../../common/Layout/Copyright';
import { RootState } from '../../../redux';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const Register = ({ history }: RouteChildrenProps<{}>) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state: typeof RootState) => state.user);
  const [otpSent, setOtpSent] = useState(false);

  const registerSchema = Yup.object().shape({
    email: Yup.string().email(t('errors.invalid_email')).required(t('errors.required_field')),
    name: Yup.string().min(2).max(50).required(t('errors.required_field')),
    lastname: Yup.string().min(2).max(50).required(t('errors.required_field')),
    otp: Yup.string().optional(),
  });

  const registerHandler = async ({
    email,
    name,
    lastname,
    otp,
  }: {
    email: string;
    name: string;
    lastname: string;
    otp?: string;
  }) => {
    setLoading(true);
    const cb = (success: boolean) => {
      setLoading(false);
      if (success) setOtpSent(true);
    };
    await sendOTPorLogin({
      sendEmail: register,
      sendCreds: verifyOTP,
      data: { email, name, lastname },
      cb,
      dispatch,
      ...(otp && { otp }),
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{
            email: process.env.REACT_APP_ENV === 'development' ? 'jdoe@mail.com' : '',
            name: process.env.REACT_APP_ENV === 'development' ? 'John' : '',
            lastname: process.env.REACT_APP_ENV === 'development' ? 'Doe' : '',
            otp: '',
          }}
          validationSchema={registerSchema}
          onSubmit={registerHandler}
        >
          {({ handleSubmit, values, errors, setFieldTouched, setFieldValue }) => (
            <>
              <Grid container spacing={2}>
                {!otpSent ? (
                  <>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={(e) => setFieldValue('email', e.target.value)}
                      value={values.email}
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={!!errors.email}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={(e) => setFieldValue('name', e.target.value)}
                      value={values.name}
                      id="name"
                      label="Name"
                      name="name"
                      error={!!errors.name}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={(e) => setFieldValue('lastname', e.target.value)}
                      value={values.lastname}
                      id="lastname"
                      label="Last name"
                      name="lastname"
                      autoComplete="lastname"
                      autoFocus
                      error={!!errors.lastname}
                    />
                    <Button
                      fullWidth
                      disabled={loading}
                      variant="contained"
                      className={classes.submit}
                      onClick={() => {
                        handleSubmit();
                      }}
                      type="submit"
                    >
                      Send One-time-password
                    </Button>
                  </>
                ) : (
                  <>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          onChange={(e) => setFieldValue('otp', e.target.value)}
                          id="OTP"
                          label="One time password"
                          name="OTP"
                          autoFocus
                          placeholder="One time password"
                          type="password"
                          value={values.otp}
                          error={!!errors.otp}
                        />
                      </Grid>
                      <Grid item xs={12} container justifyContent="space-between">
                        <Grid item xs={12} lg={4} style={{ padding: 4 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={() => handleSubmit()}
                            type="submit"
                            disabled={loading || !values.otp}
                          >
                            Login
                          </Button>
                        </Grid>
                        <Grid item xs={12} lg={4} style={{ padding: 4 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={() => handleSubmit()}
                            style={{ whiteSpace: 'nowrap' }}
                            disabled={loading}
                          >
                            Resend OTP
                          </Button>
                        </Grid>
                        <Grid item xs={12} lg={4} style={{ padding: 4 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            disabled={loading}
                            onClick={() => {
                              setFieldValue('email', '');
                              setFieldValue('otp', '');
                              setOtpSent(false);
                            }}
                          >
                            Back
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
