import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';

describe('AllCurrencies', () => {
	it('testing list', async () => {
		render();

		await screen.findAllByLabelText(/amount/i);

		userEvent.click(screen.getByText(/all currencies/i));

		const baseCurrency = screen.getByLabelText(/base currency/i);

		userEvent.clear(baseCurrency);
		userEvent.type(baseCurrency, 'EUR');
		userEvent.keyboard('{enter}');

		screen.findByTestId('list-item-usd');

		userEvent.clear(baseCurrency);
		userEvent.type(baseCurrency, 'USD');
		userEvent.keyboard('{enter}');

		expect(screen.queryByTestId('list-item-usd')).not.toBeInTheDocument();
	});
});
