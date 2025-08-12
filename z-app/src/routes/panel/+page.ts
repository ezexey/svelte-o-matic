import type { PageLoad } from './$types.js';
import { twitch, type Api } from '$lib';

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const [auth] = (await Promise.race([
			twitch.Extension.I.waitForAuth(),
			new Promise((_, reject) => setTimeout(() => reject(new Error('Auth and context timeout')), 1000))
		])) as [twitch.AuthData];
		twitch.Client.I.setAuthToken(auth.token);
	} catch (error) {
		console.error('Load error:', error);
	}
	const movies = await twitch.Client.I.get<Api.GetMoviesResponses>('http://127.0.0.1:3042/movies/', fetch);
	return { movies };
};
