import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListIcon from '@material-ui/icons/List';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import 'currency-flags/dist/currency-flags.min.css';

import CurrencyConverter from 'components/CurrencyConverter';
import AllCurrencies from 'components/AllCurrencies';
import { fetchCurrencies } from 'store/currency';
import { RootState } from 'store';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		padding: 20,

		[theme.breakpoints.down('xs')]: {
			padding: '20px 0',
		},
	},
}));

const App = () => {
	const classes = useStyles();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

	const loading = useSelector((state: RootState) => state.currency.loading);
	const dispatch = useDispatch();

	const [tab, setTab] = useState(0);

	useEffect(() => {
		dispatch(fetchCurrencies());
	}, []);

	useEffect(() => {
		if (!loading) {
			setTab(1);
		}
	}, [loading]);

	const handleChangeTab = (e: React.ChangeEvent<{}>, value: number) => {
		setTab(value);
	};

	return (
		<div className={classes.root}>
			<Paper square>
				<Tabs
					value={tab}
					onChange={handleChangeTab}
					textColor='primary'
					indicatorColor='primary'
					variant='fullWidth'
				>
					{/* for loading */}
					<Tab disabled style={{ display: 'none' }} />

					<Tab
						label={!isSmallScreen && 'Currency converter'}
						disabled={loading}
						icon={
							isSmallScreen ? (
								<span className='material-icons' style={{ fontSize: 45 }}>
									calculate
								</span>
							) : undefined
						}
					/>
					<Tab
						label={!isSmallScreen && 'All currencies'}
						disabled={loading}
						icon={isSmallScreen ? <ListIcon fontSize='large' /> : undefined}
					/>
				</Tabs>

				{loading && <LinearProgress />}
			</Paper>

			<div className={classes.content}>
				{tab === 1 && <CurrencyConverter />}

				{tab === 2 && <AllCurrencies />}
			</div>
		</div>
	);
};

export default App;
