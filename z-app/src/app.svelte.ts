import { corio } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

const privet = { loaded: false };
export const app = {
	init: (reload = false) => {
		if (privet.loaded && !reload) return;
		corio.api.setBaseUrl('http://127.0.0.1:3042');
		corio.core.Client.I.setUrl('http://127.0.0.1:3042');
	},
	client: {
		api: corio.api,
		i: corio.core.Client.I,
		movies: async (fetcher: typeof fetch, request: Partial<corio.core.Api.GetMoviesRequest> = {}) =>
			corio.core.Client.I.get({
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

export const config = $state({
	theme: { writer, reader, value: 'light' as Theme },
	mountain: () => {
		const cleanup = manager.init((theme) => (config.theme.value = theme));
		return () => {
			cleanup();
		};
	}
});
