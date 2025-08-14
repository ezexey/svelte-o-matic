import type { PageLoad } from './$types';
import type { Theme } from '$lib/stores/theme';
import { coreo } from '$lib';
import { g } from '../../state.svelte';

export const load: PageLoad = async ({ fetch }) => {
	g.init();
	return {
		theme: 'light' as Theme,
		user: {},
		moviesOne: await coreo.Client.I.get<coreo.Api.GetMoviesResponses>('/movies/', fetch),
		moviesToo: await coreo.api.getMovies({})
	};
};
