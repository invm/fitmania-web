import { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import {
	AppBar,
	Container,
	Toolbar,
	IconButton,
	Typography,
	InputBase,
	Badge,
	MenuItem,
	Menu,
} from '@material-ui/core';
import {
	Menu as MenuIcon,
	Search,
	AccountCircle,
	Notifications,
	MoreVert,
	ExitToApp,
} from '@material-ui/icons/';
import { Link, useHistory } from 'react-router-dom';
import { clearSearch, logout } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';

interface HeaderProps {
	toggleDrawer: (side: any, open: any) => (event: any) => void;
}

const Header = ({ toggleDrawer }: HeaderProps) => {
	const classes = useStyles();
	let history = useHistory();
	const {
		user: { isAuthenticated },
		notifications: { count: notificationsCount },
	} = useSelector((state: typeof RootState) => state);
	const dispatch = useDispatch();
	const [titleStyle, setTitleStyle] = useState('block');
	const [searchQuery, setSearchQuery] = useState('');
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event: any) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const onFocus = () => {
		if (window.innerWidth < 420) {
			// On smaller screens set the width of the title to 0
			setTitleStyle('0px');
		}
	};

	const onBlur = () => {
		if (window.innerWidth < 420) {
			// On larger screens set the width of the title to 85px
			setTitleStyle('85px');
		}
	};

	const menuId = 'primary-search-account-menu';

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<Link to="/notifications" className={classes.link}>
					<IconButton
						aria-label={`Show ${0} new notifications`}
						color="inherit"
					>
						<Badge badgeContent={notificationsCount} color="secondary">
							<Notifications />
						</Badge>
					</IconButton>
					<p>Notifications</p>
				</Link>
			</MenuItem>

			{isAuthenticated && (
				<MenuItem onClick={handleMenuClose}>
					<Link to="/profile" className={classes.link}>
						<IconButton
							aria-label="account of current user"
							aria-controls="primary-search-account-menu"
							aria-haspopup="true"
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<p>Profile</p>
					</Link>
				</MenuItem>
			)}
			{isAuthenticated && (
				<MenuItem onClick={() => dispatch(logout())}>
					<Link to="/" className={classes.link}>
						<IconButton
							aria-label="log out"
							aria-controls="log-out"
							aria-haspopup="true"
							color="inherit"
						>
							<ExitToApp />
						</IconButton>
						<p>Log Out</p>
					</Link>
				</MenuItem>
			)}
		</Menu>
	);

	return (
		<div>
			<div className={classes.grow}>
				<AppBar className={'bg-gradient white-text'} position="static">
					<Container className={classes.container}>
						<Toolbar>
							<IconButton
								onClick={toggleDrawer('left', true)}
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="open drawer"
							>
								<MenuIcon />
							</IconButton>
							{isAuthenticated && (
								<div className={classes.titleSearchSection}>
									<Link className={classes.link} to="/">
										<Typography
											className={classes.title}
											style={{ width: titleStyle }}
											variant="h6"
											noWrap
										>
											FitMania
										</Typography>
									</Link>
									<div
										className={classes.search}
										onBlur={onBlur}
										onFocus={onFocus}
									>
										<div className={classes.searchIcon}>
											<Search />
										</div>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												if (searchQuery?.length) {
													dispatch(clearSearch());
													history.push(`/search/${searchQuery}`);
												}
											}}
										>
											<InputBase
												placeholder="Search…"
												classes={{
													root: classes.inputRoot,
													input: classes.inputInput,
												}}
												value={searchQuery}
												onChange={(e) =>
													setSearchQuery(e.target.value.replace(/\W/, ''))
												}
												inputProps={{
													'aria-label': 'search',
												}}
											/>
										</form>
									</div>
								</div>
							)}

							<div className={classes.grow} />
							<div className={classes.sectionDesktop}>
								{isAuthenticated && (
									<>
										<Link to="/notifications" className={classes.link}>
											<IconButton
												aria-label={`Show ${0} new notifications`}
												color="inherit"
											>
												<Badge
													badgeContent={notificationsCount}
													color="secondary"
												>
													<Notifications />
												</Badge>
											</IconButton>
										</Link>

										<Link to="/profile" className={classes.link}>
											<IconButton
												edge="end"
												aria-label="account of current user"
												aria-controls={menuId}
												aria-haspopup="true"
												color="inherit"
											>
												<AccountCircle />
											</IconButton>
										</Link>
										<Link
											to="/"
											onClick={() => dispatch(logout())}
											className={classes.link}
										>
											<IconButton
												aria-label="log out"
												aria-controls="log-out"
												aria-haspopup="true"
												color="inherit"
											>
												<ExitToApp />
											</IconButton>
										</Link>
									</>
								)}
							</div>
							<div className={classes.sectionMobile}>
								<IconButton
									aria-label="show more"
									aria-controls={mobileMenuId}
									aria-haspopup="true"
									onClick={handleMobileMenuOpen}
									color="inherit"
								>
									<MoreVert />
								</IconButton>
							</div>
						</Toolbar>
					</Container>
				</AppBar>
				{renderMobileMenu}
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: alpha(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
	},
	link: {
		textDecoration: 'none',
		display: 'flex',
	},
	title: {
		width: '85px',
		transition: theme.transitions.create('width'),
	},
	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 6),
		transition: theme.transitions.create('width'),
		width: '0px',
		[theme.breakpoints.up('xs')]: {
			width: 0,
			'&:focus': {
				width: 110,
			},
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	titleSearchSection: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},
	container: {
		[theme.breakpoints.down('xs')]: {
			padding: 0,
		},
	},
}));

export default Header;
