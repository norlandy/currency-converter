import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

import { convertCurrency } from 'utils/currency';

export const fetchCurrencies = createAsyncThunk('FETCH_CURRENCIES', async () => {
	const {
		data: { Valute: valute },
	} = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');

	const RUB = {
		Name: 'Российский рубль',
		CharCode: 'RUB',
		Value: 1,
		Nominal: 1,
	};

	return {
		...valute,
		RUB,
	};
});

export type Currency = {
	Name: string;
	CharCode: string;
	Value: number;
	Nominal: number;
};

type State = {
	baseCurrencies: Currency[];
	targetCurrencies: Currency[];
	baseCurrency: Currency;
	loading: boolean;
};

const initialState: State = {
	baseCurrencies: [],
	targetCurrencies: [],
	baseCurrency: {} as Currency,
	loading: true,
};

const { actions, reducer } = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		changeBaseCurrency(state, action: PayloadAction<{ CharCode: string }>) {
			state.baseCurrency = _.find(
				state.baseCurrencies,
				({ CharCode }) => CharCode === action.payload.CharCode,
			)!;
			state.targetCurrencies = convertCurrency({
				baseCurrencies: state.baseCurrencies,
				baseCurrency: state.baseCurrency,
			});
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
			state.baseCurrencies = _.orderBy(action.payload, ['Name'], ['asc']);
			state.baseCurrency = _.find(state.baseCurrencies, ({ CharCode }) => {
				if (state.baseCurrency.CharCode) {
					return CharCode === state.baseCurrency.CharCode;
				}

				return CharCode === 'USD';
			})!;
			state.targetCurrencies = convertCurrency({
				baseCurrencies: state.baseCurrencies,
				baseCurrency: state.baseCurrency,
			});
			state.loading = false;
		});
	},
});

export const { changeBaseCurrency } = actions;

export default reducer;
