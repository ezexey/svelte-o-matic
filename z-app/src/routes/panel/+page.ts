import type { PageLoad } from './$types.js';
import { coreo, twitch } from '$lib';
import type { AppliedTheme } from '$lib/stores/theme.js';

coreo.api.setBaseUrl('http://127.0.0.1:3042');
export const load: PageLoad = async ({ fetch }) => {
	const data = {
		theme: 'light' as AppliedTheme,
		user: {},
		moviesOne: [] as coreo.Api.GetMoviesResponses,
		moviesToo: [] as coreo.Api.GetMoviesResponses
	};
	if (typeof window !== 'undefined' && window.Twitch?.ext) {
		const [auth, context] = await coreo
			.withTimeout(Promise.all([twitch.Extension.I.waitForAuth(), twitch.Extension.I.waitForContext()]))
			.catch((error) => {
				console.error('Error fetching Twitch context:', error);
				return [undefined, undefined];
			});
		data.theme = (context?.theme as AppliedTheme) || data.theme;
		data.user = auth
			? await twitch.Extension.I.apiRequest('/users?id=' + auth.userId?.substring(1), fetch)
			: data.user;
	} else console.warn('twitch.ext not found.');

	data.moviesOne = await coreo.Client.I.get<coreo.Api.GetMoviesResponses>('/movies/', fetch);
	data.moviesToo = await coreo.api.getMovies({});
	return data;
};
