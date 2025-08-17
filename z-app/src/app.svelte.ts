import { Corio } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

const privet = { loaded: false };
export const app = {
	init: (reload = false) => {
		if (privet.loaded && !reload) return;
		Corio.api.setBaseUrl('http://127.0.0.1:3042');
		Corio.core.Client.I.setUrl('http://127.0.0.1:3042');
	},
	client: {
		api: Corio.api,
		i: Corio.core.Client.I,
		movies: async (fetcher: typeof fetch, request: Partial<Corio.Types.GetMoviesRequest> = {}) =>
			Corio.core.Client.I.get({
				endpoint: '/movies',
				fetcher,
				request: {
					offset: 0,
					limit: 20,
					...request // Allow overriding defaults
				}
			})
	}
};
app.init();

export const config = $state({
	theme: { writer, reader, value: 'light' as Theme },
	mountain: () => {
		const cleanup = manager.init((theme) => (config.theme.value = theme));
		return () => {
			cleanup();
		};
	}
});
