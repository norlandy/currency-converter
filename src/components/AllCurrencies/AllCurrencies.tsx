import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import NumberFormat from 'react-number-format';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import { RootState } from 'store';
import { changeBaseCurrency, Currency, fetchCurrencies } from 'store/currency';
import { formatCurrency } from 'utils/currency';

const useStyles = makeStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 20,
		position: 'sticky',
		top: 0,
		zIndex: 1000,

		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column',
		},
	},
	select: {
		minWidth: 160,

		[theme.breakpoints.down('xs')]: {
			width: '100%',
		},
	},
	option: {
		'& .currency-flag': {
			marginRight: 10,
		},
	},
	info: {
		display: 'flex',
		alignItems: 'center',

		'& .currency-flag': {
			marginRight: 20,
		},
	},
}));

const AllCurrencies = () => {
	const classes = useStyles();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

	const targetCurrencies = useSelector((state: RootState) => state.currency.targetCurrencies);
	const baseCurrency = useSelector((state: RootState) => state.currency.baseCurrency);
	const dispatch = useDispatch();

	const handleChangeBaseCurrency = (e: React.ChangeEvent<{}>, value: Currency | null) => {
		if (value) {
			dispatch(changeBaseCurrency(value));
		}
	};
	const handleSelectCurrency = (value: Currency) => {
		dispatch(changeBaseCurrency(value));
	};

	useEffect(() => {
		const interval = setInterval(() => dispatch(fetchCurrencies()), 15000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div>
			<Paper className={classes.header}>
				<Hidden xsDown>
					<div className={classes.info}>
						<div
							className={`currency-flag currency-flag-xl currency-flag-${baseCurrency.CharCode.toLowerCase()}`}
						></div>
						<div>
							<Typography variant='h5'>{baseCurrency.Name}</Typography>
							<Typography variant='body2' color='textSecondary'>
								{baseCurrency.CharCode}
							</Typography>
						</div>
					</div>
				</Hidden>

				<Autocomplete
					autoHighlight
					classes={{
						option: classes.option,
					}}
					options={targetCurrencies}
					value={baseCurrency}
					getOptionLabel={option => option.CharCode}
					getOptionSelected={(option, value) => option.CharCode === value.CharCode}
					renderOption={option => (
						<>
							<span
								className={`currency-flag currency-flag-${option.CharCode.toLowerCase()}`}
							></span>
							{option.CharCode}
						</>
					)}
					className={classes.select}
					onChange={handleChangeBaseCurrency}
					renderInput={params => <TextField {...params} label='Base currency' variant='outlined' />}
				/>
			</Paper>

			<Paper>
				<List>
					{targetCurrencies.map(
						(item, index) =>
							item.CharCode !== baseCurrency.CharCode && (
								<React.Fragment key={item.CharCode}>
									<ListItem
										button
										onClick={() => handleSelectCurrency(item)}
										data-testid={`list-item-${item.CharCode.toLowerCase()}`}
									>
										<ListItemAvatar>
											<span
												className={`currency-flag currency-flag-lg currency-flag-${item.CharCode.toLowerCase()}`}
											></span>
										</ListItemAvatar>
										<ListItemText
											primary={
												isSmallScreen ? (
													<Typography variant='body2'>
														{item.CharCode} —{' '}
														<Typography
															variant='body2'
															component={NumberFormat}
															color='primary'
															displayType='text'
															thousandSeparator={true}
															value={formatCurrency(item.Value)}
														/>
													</Typography>
												) : (
													<Typography variant='body2'>
														{item.Name}{' '}
														<Typography variant='body2' color='textSecondary' component='span'>
															{item.CharCode}
														</Typography>{' '}
														—{' '}
														<Typography
															variant='body2'
															component={NumberFormat}
															color='primary'
															displayType='text'
															thousandSeparator={true}
															value={formatCurrency(item.Value)}
														/>
													</Typography>
												)
											}
										/>
									</ListItem>

									{index !== targetCurrencies.length - 1 && <Divider variant='middle' />}
								</React.Fragment>
							),
					)}
				</List>
			</Paper>
		</div>
	);
};

export default AllCurrencies;
