import { useSelector } from 'react-redux';
import _ from 'lodash';

import { RootState } from 'store';

type ConvertOptions = {
	from: string;
	to: string;
};

export default () => {
	const baseCurrencies = useSelector((state: RootState) => state.currency.baseCurrencies);

	const convert = ({ from, to }: ConvertOptions): number => {
		const baseCurrency = _.find(baseCurrencies, ({ CharCode }) => CharCode === from);
		const wantCurrency = _.find(baseCurrencies, ({ CharCode }) => CharCode === to);

		if (baseCurrency && wantCurrency) {
			const baseCurrencyInRUB = baseCurrency.Value;
			const wantCurrencyInRUB = wantCurrency.Value;
			const baseCurrencyNominal = baseCurrency.Nominal;
			const wantCurrencyNominal = wantCurrency.Nominal;

			const result =
				(baseCurrencyInRUB / wantCurrencyInRUB / baseCurrencyNominal) * wantCurrencyNominal;

			return result;
		}

		return 0;
	};

	return {
		convert,
	};
};
