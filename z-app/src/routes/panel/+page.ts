import type { PageLoad } from './$types.js';
import { twitch, api, type Api } from '$lib';
import type { AppliedTheme } from '$lib/stores/theme.js';

export interface RequestConfig {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
}
async function request<T>(endpoint: string, fetcher = fetch, config: RequestConfig = {}): Promise<T> {
	const url = `http://127.0.0.1:3042${endpoint}`;
	const controller = new AbortController();
	const timeout = config.timeout || 30000;

	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetcher(url, {
			method: config.method || 'GET',
			headers: {
				...config.headers
			},
			body: config.body ? JSON.stringify(config.body) : undefined,
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json() as Promise<T>;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('Request timeout');
		}
		throw error;
	}
}
	function get<T>(endpoint: string, fetcher = fetch, config?: RequestConfig): Promise<T> {
		return request<T>(endpoint, fetcher, { ...config, method: "GET" });
	}
export const load: PageLoad = async ({ fetch }) => {
	let theme: AppliedTheme = 'light';
	let user = {};
	if (typeof window !== 'undefined' && window.Twitch?.ext) {
		const [auth, context] = await Promise.all([
			twitch.Extension.I.waitForAuth(),
			twitch.Extension.I.waitForContext()
		]);
		theme = (context.theme as AppliedTheme) || 'auto';
		user = await twitch.Extension.I.apiRequest('/users?id=' + auth.userId?.substring(1), fetch);
	} else console.warn('window and twitch.ext not found.');

	const moviesOne = await get<Api.GetMoviesResponses>('/movies/', fetch) ;

	api.setBaseUrl('http://127.0.0.1:3042');
	const moviesToo = await api.getMovies({});
	return { moviesOne, moviesToo, theme, user: JSON.stringify(user) };
};
