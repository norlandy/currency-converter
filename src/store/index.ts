import { configureStore } from '@reduxjs/toolkit';

import currency from './currency';

const store = configureStore({
	reducer: {
		currency,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
