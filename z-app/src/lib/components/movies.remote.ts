import * as z from 'zod';
import { query, form, command } from '$app/server';
import { error } from '@sveltejs/kit';
import { app } from '../../app.svelte';
import { Corio } from '$lib';

export const getMovies = query(async () => {
	const movies = await app.client.movies({ limit: 99, offset: 0, 'orderby.title': 'asc' });
	return movies;
});
export const getMovie = query(z.number(), async (id) => {
	const movie = app.client.i.get('/movies/:id', { id });
	return movie;
});

export const createMovie = form(async (data) => {
	const title = data.get('title') as string;
	if (!title) error(400, 'Title is required');

	try {
	// await app.client.api.createMovie({ title });
	await app.client.i.post('/movies/', { title });
	return { success: true };
} catch (error) {
	console.error('Error creating movie:', error);
	return { success: false, error: 'Failed to create movie' };
}
});

export const updateMovie = command(z.object({ id: z.number(), title: z.string() }), async (data) => {
	const { id, title } = data;
	// await app.client.api.updateMovie({ id, title });
	app.client.i.put('/movies/:id', { id, title });
});

export const deleteMovie = command(z.number(), async (id) => {
	// await app.client.api.deleteMovies({ id: validate.id(id) });
	app.client.i.delete('/movies/:id', { id });
});
