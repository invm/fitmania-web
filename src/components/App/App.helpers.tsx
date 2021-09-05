/* Theme declaration for the app */

import { createTheme } from '@material-ui/core/styles';
import { responsiveFontSizes } from '@material-ui/core/styles';

const dark = createTheme({
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: '0.9em',
				fontWeight: 400,
				color: 'white'
			}
		},
		MuiOutlinedInput: {
			input: {
				padding: 12
			},
			multiline: {
				padding: 12
			}
		},
		MuiInputLabel: {
			outlined: {
				transform: 'translate(14px, 14px) scale(1)'
			}
		},
		MuiCardHeader: {
			subheader: {
				fontSize: '0.750rem',
				color: '#ccc'
			}
		},
		MuiCardContent: {
			root: {
				padding: '8px',
				color: '#ccc',
				'&:last-child': {
					paddingBottom: 8
				}
			}
		},
		MuiCardActions: {
			root: {
				padding: '4px'
			}
		}
	},
	palette: {
		type: 'dark',
		primary: {
			main: '#00acff'
		}
	}
});

const light = createTheme({
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: '0.9em',
				fontWeight: 400,
				color: 'white'
			}
		},
		MuiCardHeader: {
			subheader: {
				fontSize: '0.750rem',
				color: '#333'
			}
		},
		MuiOutlinedInput: {
			input: {
				padding: 12
			},
			multiline: {
				padding: 12
			}
		},
		MuiInputLabel: {
			outlined: {
				transform: 'translate(14px, 14px) scale(1)'
			}
		},
		MuiCardContent: {
			root: {
				color: '#333',
				padding: '8px',
				'&:last-child': {
					paddingBottom: 8
				}
			}
		},
		MuiCardActions: {
			root: {
				padding: '4px'
			}
		},
		MuiPaper: {
			root: {
				backgroundColor: '#e7e7eb'
			}
		},
		MuiButton: {
			contained: {
				'&:hover': {
					backgroundColor: '#00acff'
				}
			}
		}
	},
	palette: {
		type: 'light',
		primary: {
			main: '#0068ff'
		},
		background: {
			default: '#dadada'
		}
	}
});

const lightTheme = responsiveFontSizes(light);
const darkTheme = responsiveFontSizes(dark);

export { lightTheme, darkTheme };
