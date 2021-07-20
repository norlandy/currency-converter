import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';

import App from 'App';
import { theme, GlobalCss } from 'theme';
import store from 'store';

const AllTheProviders = () => (
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<GlobalCss />

			<App />
		</ThemeProvider>
	</Provider>
);

const customRender = (options?: RenderOptions) => render(<AllTheProviders />, options);

export * from '@testing-library/react';
export { customRender as render };
