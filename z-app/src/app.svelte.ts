import { Corio, createClient } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

const privet = { loaded: false, client: createClient('http://127.0.0.1:3042') };
export const app = {
	init: (reload = false) => {
		if (privet.loaded && !reload) return;
		Corio.api.setBaseUrl('http://127.0.0.1:3042');
	},
	client: {
		api: Corio.api,
		i: privet.client,
		movies: async (req?: Partial<Corio.Api.GetMoviesRequest>, fetcher?: typeof fetch) =>
			privet.client.get(
				'/movies/',
				{
					offset: 0,
					limit: 20,
					...req // Allow overriding defaults
				},
				{ fetcher }
			)
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
