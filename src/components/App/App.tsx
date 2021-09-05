/* Top level component, the root of all evil */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert, Sidebar } from '../common';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, Snackbar, Slide } from '@material-ui/core';
import { lightTheme } from './App.helpers';
import { verifySession } from '../../redux/actions';
import { getRoutes } from './routes';

const App = () => {
	const [creditOpen, setCreditOpen] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(verifySession());
	}, [dispatch]);

	return (
		<Router>
			<ThemeProvider theme={lightTheme}>
				<CssBaseline />
				<Sidebar />
				<Switch>
					{getRoutes()}
					<Redirect path="*" to="/404" />
				</Switch>
				<Alert />
				<Snackbar
					autoHideDuration={null}
					TransitionComponent={Slide}
					open={creditOpen}
					onClose={() => {
						setCreditOpen(false);
					}}
					message={'Images courtesy of Unsplash.com'}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				/>
			</ThemeProvider>
		</Router>
	);
};

export default App;
