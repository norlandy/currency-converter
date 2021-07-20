import _ from 'lodash';

import { Currency } from 'store/currency';

type ConverOptions = {
	baseCurrencies: Currency[];
	baseCurrency: Currency;
};
export const convertCurrency = ({ baseCurrencies, baseCurrency }: ConverOptions): Currency[] => {
	const newCurrencies = _.cloneDeep(baseCurrencies);

	newCurrencies.forEach(item => {
		const baseCurrencyInRUB = baseCurrency.Value;
		const wantCurrencyInRUB = item.Value;
		const baseCurrencyNominal = baseCurrency.Nominal;
		const wantCurrencyNominal = item.Nominal;

		const result =
			(baseCurrencyInRUB / wantCurrencyInRUB / baseCurrencyNominal) * wantCurrencyNominal;

		item.Value = result;
	});

	return newCurrencies;
};

export const formatCurrency = (value: number) =>
	value > 1 ? value.toFixed(2) : value.toPrecision(2);
