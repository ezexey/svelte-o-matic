import { coreo } from '$lib';
import { type Theme, writer, reader, manager } from '$lib/stores/theme';

export const app = { loaded: false };

export const g = $state({
	theme: { writer, reader, value: 'light' as Theme },
	init: (reload = false) => {
		if(app.loaded && !reload) return;
		coreo.api.setBaseUrl('http://127.0.0.1:3042');
	},
	mountain: () => {
		const cleanup = manager.init((theme) => (g.theme.value = theme));
		return () => {
			cleanup();
		};
	}
});
