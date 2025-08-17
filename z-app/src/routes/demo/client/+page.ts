import type { PageLoad } from './$types';
import type { Theme } from '$lib/stores/theme';
import { app } from '../../../app.svelte';

export const load: PageLoad = async ({ fetch }) => {
	return {
		theme: 'light' as Theme,
		movies: await app.client.movies({ 'orderby.id': 'asc' }, fetch)
	};
};
