import { createTheme, withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

export const theme = createTheme({
	palette: {
		primary: {
			main: purple[500],
		},
	},
	typography: {
		// default 14px
		fontSize: 18,
	},
});

export const GlobalCss = withStyles({
	'@global': {
		'*': {
			padding: 0,
			margin: 0,
			boxSizing: 'border-box',
		},
	},
})(() => null);
