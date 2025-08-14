import type { PageLoad } from './$types';
import type { Theme } from '$lib/stores/theme';
import { app } from '../../state.svelte';

export const load: PageLoad = async ({ fetch }) => {
	app.init();
	return {
		theme: 'light' as Theme,
		user: {},
		moviesOne: await app.client.getMovies(fetch),
		moviesToo: await app.client.api.getMovies({})
	};
};
