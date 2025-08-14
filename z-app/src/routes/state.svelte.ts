import { coreo } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

const privet = { loaded: false };
export const app = {
	client: {
		api: coreo.api,
		getMovies: (fetcher: typeof fetch, options: Partial<coreo.Opts<coreo.Api.GetMoviesRequest>> = {}) => {
			return coreo.Client.I.get<coreo.Api.GetMoviesResponses, coreo.Api.GetMoviesRequest>({
				endpoint: '/movies/',
				fetcher,
				...options
			});
		}
	},
	init: (reload = false) => {
		if (privet.loaded && !reload) return;
		coreo.api.setBaseUrl('http://127.0.0.1:3042');
		coreo.Client.I.setBaseUrl('http://127.0.0.1:3042');
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
