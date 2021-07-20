import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';

describe('CurrencyConverter', () => {
	it('testing amount inputs', async () => {
		render();

		const [input, output] = await screen.findAllByLabelText(/amount/i);

		expect(input).toHaveValue('1');

		userEvent.clear(input);
		userEvent.type(input, 'some text');

		expect(input).toHaveValue('some text');
		expect(output).toHaveValue('—');

		userEvent.clear(input);
		userEvent.type(input, '-123');

		expect(input).toHaveValue('-123');
		expect(output).toHaveValue('0');

		userEvent.clear(input);
		userEvent.type(input, '0');

		expect(input).toHaveValue('0');
		expect(output).toHaveValue('0');

		userEvent.clear(input);

		expect(input).toHaveValue('');
		expect(output).toHaveValue('0');

		userEvent.clear(output);

		expect(input).toHaveValue('0');
		expect(output).toHaveValue('');

		const baseCurrency = screen.getByLabelText(/currency i have/i);
		const wantCurrency = screen.getByLabelText(/currency i want/i);

		userEvent.clear(baseCurrency);
		userEvent.type(baseCurrency, 'USD');
		userEvent.keyboard('{enter}');

		userEvent.clear(wantCurrency);
		userEvent.type(wantCurrency, 'USD');
		userEvent.keyboard('{enter}');

		userEvent.clear(input);
		userEvent.type(input, '2');

		expect(input).toHaveValue('2');
		expect(output).toHaveValue('2');

		userEvent.clear(wantCurrency);
		userEvent.type(wantCurrency, 'EUR');
		userEvent.keyboard('{enter}');

		userEvent.click(screen.getByTestId('flip-button'));

		expect(baseCurrency).toHaveValue('EUR');
		expect(wantCurrency).toHaveValue('USD');
	});
});
