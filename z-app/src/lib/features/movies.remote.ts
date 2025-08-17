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
	const movie = Corio.core.Client.I.get('/movies/:id', { id });
	return movie;
});

export const createMovie = form(async (data) => {
	const title = data.get('title') as string;
	if (!title) error(400, 'Title is required');

	// await app.client.api.createMovie({ title });
	Corio.core.Client.I.post('/movies/', { title });
	return { success: true };
});

export const updateMovie = command(z.object({ id: z.number(), title: z.string() }), async (data) => {
	const { id, title } = data;
	// await app.client.api.updateMovie({ id, title });
	Corio.core.Client.I.put('/movies/:id', { id, title });
});

export const deleteMovie = command(z.number(), async (id) => {
	// await app.client.api.deleteMovies({ id: validate.id(id) });
	Corio.core.Client.I.delete('/movies/:id', { id });
});
