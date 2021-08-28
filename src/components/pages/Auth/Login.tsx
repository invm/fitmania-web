import React, { useEffect, useState } from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, sendOTPorLogin, verifyOTP } from '../../../redux/actions/user';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../../common/Layout/Copyright';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../common';
import { RootState } from '../../../redux';

const useStyles = makeStyles((theme) => ({
	root: {
		height: 'calc(100vh - 64px)',
		[theme.breakpoints.down('xs')]: {
			height: 'calc(100vh - 58px)'
		}
	},
	image: {
		backgroundImage: 'url(https://source.unsplash.com/random/?group-sports,team-sport,sport,fitness)',
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	paper: {
		margin: theme.spacing(6, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		backgroundColor: theme.palette.primary.main,
		color: 'white'
	}
}));

const Login = ({ history }: RouteChildrenProps<{}>) => {
	const { t } = useTranslation();
	const classes = useStyles();
	const [otpSent, setOtpSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const { isAuthenticated } = useSelector((state: typeof RootState) => state.user);
	const dispatch = useDispatch();

	const loginHandler = async ({ email, otp }: { email: string; otp?: string }) => {
		setLoading(true);
		const cb = (success: boolean) => {
			setLoading(false);
			if (success) setOtpSent(true);
		};
		await sendOTPorLogin({
			sendEmail: login,
			sendCreds: verifyOTP,
			data: { email },
			cb,
			dispatch,
			...(otp && { otp })
		});
	};

	useEffect(() => {
		if (isAuthenticated) {
			history.push('/');
		}
		// eslint-disable-next-line
	}, [isAuthenticated]);

	const loginSchema = Yup.object().shape({
		email: Yup.string().email(t('errors.invalid_email')).required(t('errors.required_field')),
		otp: Yup.string().optional()
	});

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<div style={{ height: 60 }}>
						{loading ? (
							<Spinner size={0.55} />
						) : (
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
						)}
					</div>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Formik
						initialValues={{
							email: process.env.REACT_APP_ENV === 'development' ? 'imichaelionov@gmail.com' : '',
							otp: ''
						}}
						validationSchema={loginSchema}
						onSubmit={loginHandler}
					>
						{({ handleSubmit, values, errors, setFieldTouched, setFieldValue }) => (
							<form onSubmit={handleSubmit}>
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
										<Button fullWidth disabled={loading} type="submit" variant="contained" className={classes.submit}>
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
								<Grid container justifyContent="space-between" alignItems="center">
									<Grid item container justifyContent="flex-end" alignItems="center" xs={12}>
										<Link to="/register">{"Don't have an account? Sign Up"}</Link>
									</Grid>
								</Grid>
								<Box mt={5}>
									<Copyright />
								</Box>
							</form>
						)}
					</Formik>
				</div>
			</Grid>
		</Grid>
	);
};

export default Login;
