import { coreo as oreo } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

const privet = { loaded: false };
export const app = {
	client: {
		api: oreo.api,
		i: oreo.coreo.Client.I,
		getMovies: async (fetcher: typeof fetch, request: Partial<oreo.Api.GetMoviesRequest> = {}) => {
			const response = await oreo.coreo.Client.I.get({
				endpoint: '/movies',
				fetcher,
				request: {
					offset: 0,
					limit: 20,
					...request // Allow overriding defaults
				}
			});

			console.log('Movies:', response);
			return response;
		}
	},
	init: (reload = false) => {
		if (privet.loaded && !reload) return;
		oreo.api.setBaseUrl('http://127.0.0.1:3042');
		oreo.coreo.Client.I.setBaseUrl('http://127.0.0.1:3042');
	}
};

export const g = $state({
	theme: { writer, reader, value: 'light' as Theme },
	mountain: () => {
		const cleanup = manager.init((theme) => (g.theme.value = theme));
		return () => {
			cleanup();
		};
	}
});
