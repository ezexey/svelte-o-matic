import * as z from 'zod';
import { query, form, command } from '$app/server';
import { error } from '@sveltejs/kit';
import { app } from '../../app.svelte';

export const getMovies = query(async () => {
	const movies = await app.client.api.getMovies({ limit: 99, offset: 0 });
	return movies;
});
export const getMovie = query(z.number().nullish(), async (id) => {
	if (typeof id !== 'number') error(400, 'ID is required');
	if (id < 1) error(400, 'ID must be greater than 0');
	
	const movie = await app.client.api.getMovieById({ id });
	return movie;
});

export const createMovie = form(async (data) => {
	const title = data.get('title');
	if (typeof title !== 'string') error(400, 'Title is required');

	await app.client.api.createMovie({ title });
	return { success: true };
});

export const updateMovie = command(z.object({ id: z.number().nullish(), title: z.string().nullish() }), async (data) => {
	const { id, title } = data;
	if (!id || !title) error(400, 'ID and title are required');

	await app.client.api.updateMovie({ id, title });
});

export const deleteMovie = command(z.number().nullish(), async (id) => {
	if (!id) error(400, 'ID is required');
	if (id < 1) error(400, 'ID must be greater than 0');

	await app.client.api.deleteMovies({ id: id });
});
