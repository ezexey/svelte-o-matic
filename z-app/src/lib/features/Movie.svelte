<script lang="ts">
	import { Corio } from '$lib';
	import { updateMovie, getMovie, deleteMovie } from '$lib/features/movies.remote';
	import { error } from '@sveltejs/kit';

	let { id, title = $bindable() }: { id: number; title?: string | null } = $props();
	let { loading, message } = $state({ loading: false, message: '' });
</script>

<div class="flex items-center gap-4">
	<input class="input" bind:value={title} />
	<button
		class="btn btn-secondary"
		disabled={loading}
		onclick={async () => {
			try {
				if (!title) error(400, 'Movie title cannot be empty');
				loading = true;
				await updateMovie({ id, title });
				message = 'Movie updated successfully';
			} catch (error) {
				message = `Error updating movie: ${error}`;
			} finally {
				const movie = await getMovie(id);
				id = movie.id!;
				title = movie.title;
				loading = false;
				message = await Corio.polly.delay(3000, () => '');
			}
		}}>
		{#if loading}
			<span class="loading"></span>
		{/if}
		Update
	</button>
	<button
		class="btn btn-ghost"
		disabled={loading}
		onclick={async () => {
			try {
				if (!id) error(400, 'Movie ID is required for deletion');
				loading = true;
				await deleteMovie(id);
				message = 'Movie deleted successfully';
			} catch (error) {
				message = `Error deleting movie: ${error}`;
			} finally {
				loading = false;
				message = await Corio.polly.delay(3000, () => '');
			}
		}}>
		{#if loading}
			<span class="loading"></span>
		{/if}
		Delete
	</button>
</div>
{#if message}
	<div class="notification notification-info fade-in">
		{message}
	</div>
{/if}
