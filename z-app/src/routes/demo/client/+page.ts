import type { PageLoad } from './$types';
import type { Theme } from '$lib/stores/theme';
import { app } from '../../../app.svelte';

export const load: PageLoad = async ({ fetch }) => {
	app.init();
	return {
		theme: 'light' as Theme,
		user: {},
		movies: await app.client.movies(fetch),
		moviesToo: await app.client.api.getMovies({})
	};
};
