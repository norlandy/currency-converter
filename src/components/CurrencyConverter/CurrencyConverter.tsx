import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import Zoom from '@material-ui/core/Zoom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';

import { RootState } from 'store';
import { changeBaseCurrency, Currency } from 'store/currency';
import { formatCurrency } from 'utils/currency';
import { useConvert } from 'utils/hooks';

const useStyles = makeStyles(theme => ({
	root: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	form: {
		display: 'flex',
		alignItems: 'center',

		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column',
		},
	},
	formBlock: {
		display: 'flex',
		flexDirection: 'column',
	},
	select: {
		minWidth: 160,
		marginBottom: 20,
	},
	option: {
		'& .currency-flag': {
			marginRight: 10,
		},
	},
	flipButton: {
		margin: '0 20px',

		[theme.breakpoints.down('xs')]: {
			margin: '10px 0',
		},
	},
}));

type ResultOptions = {
	currency: number;
	amount: string;
};
const getResult = ({ currency, amount }: ResultOptions) => {
	const result = currency * +amount;

	if (isNaN(result)) {
		return '—';
	} else if (result <= 0) {
		return '0';
	} else if (result === +amount) {
		return amount;
	}

	return formatCurrency(result);
};

const CurrencyConverter = () => {
	const classes = useStyles();

	const targetCurrencies = useSelector((state: RootState) => state.currency.targetCurrencies);
	const baseCurrency = useSelector((state: RootState) => state.currency.baseCurrency);
	const dispatch = useDispatch();

	const [amount, setAmount] = useState('1');
	const [wantCurrency, setWantCurrency] = useState(
		_.find(targetCurrencies, ({ CharCode }) => CharCode === 'EUR')!,
	);
	const [result, setResult] = useState('0');
	const [inverted, setInverted] = useState(false);

	const { convert } = useConvert();

	const handleChangeHaveCurrency = (e: React.ChangeEvent<{}>, value: Currency | null) => {
		if (value) {
			dispatch(changeBaseCurrency(value));
		}
	};
	const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInverted(false);

		setAmount(e.target.value);
	};
	const handleChangeWantCurrency = (e: React.ChangeEvent<{}>, value: Currency | null) => {
		if (value) {
			setWantCurrency(value);
		}
	};
	const handleChangeResult = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInverted(true);

		setResult(e.target.value);
	};
	const handleFlipCurrencies = () => {
		dispatch(changeBaseCurrency(wantCurrency));
		setWantCurrency(baseCurrency);
	};

	useEffect(() => {
		if (!inverted) {
			setResult(getResult({ currency: wantCurrency.Value, amount }));
		}
	}, [baseCurrency, wantCurrency, amount, inverted]);

	useEffect(() => {
		if (inverted) {
			setAmount(
				getResult({
					currency: convert({ from: wantCurrency.CharCode, to: baseCurrency.CharCode }),
					amount: result,
				}),
			);
		}
	}, [baseCurrency, wantCurrency, result, inverted]);

	useEffect(() => {
		setWantCurrency(
			_.find(targetCurrencies, ({ CharCode }) => CharCode === wantCurrency.CharCode)!,
		);
	}, [targetCurrencies]);

	return (
		<div className={classes.root}>
			<div className={classes.form}>
				<div className={classes.formBlock}>
					<Autocomplete
						autoHighlight
						options={targetCurrencies}
						classes={{
							option: classes.option,
						}}
						value={baseCurrency}
						getOptionLabel={option => option.CharCode}
						getOptionSelected={(option, value) => option.CharCode === value.CharCode}
						renderOption={option => (
							<>
								<span
									className={`currency-flag  currency-flag-${option.CharCode.toLowerCase()}`}
								></span>
								{option.CharCode}
							</>
						)}
						className={classes.select}
						onChange={handleChangeHaveCurrency}
						renderInput={params => (
							<TextField {...params} label='Currency i have' variant='outlined' />
						)}
					/>

					<TextField
						autoFocus
						value={amount}
						onChange={handleChangeAmount}
						variant='outlined'
						inputProps={{ 'aria-label': 'Amount' }}
						label='Amount'
					/>
				</div>

				<Tooltip TransitionComponent={Zoom} title='Flip currencies' arrow>
					<IconButton
						centerRipple={false}
						onClick={handleFlipCurrencies}
						className={classes.flipButton}
						color='primary'
						data-testid='flip-button'
					>
						<SyncAltIcon />
					</IconButton>
				</Tooltip>

				<div className={classes.formBlock}>
					<Autocomplete
						autoHighlight
						options={targetCurrencies}
						classes={{
							option: classes.option,
						}}
						value={wantCurrency}
						getOptionLabel={option => option.CharCode}
						getOptionSelected={(option, value) => option.CharCode === value.CharCode}
						renderOption={option => (
							<>
								<span
									className={`currency-flag  currency-flag-${option.CharCode.toLowerCase()}`}
								></span>
								{option.CharCode}
							</>
						)}
						className={classes.select}
						onChange={handleChangeWantCurrency}
						renderInput={params => (
							<TextField {...params} label='Currency i want' variant='outlined' />
						)}
					/>
					<TextField
						value={result}
						inputProps={{ 'aria-label': 'Amount' }}
						variant='outlined'
						label='Amount'
						onChange={handleChangeResult}
					/>
				</div>
			</div>
		</div>
	);
};

export default CurrencyConverter;
