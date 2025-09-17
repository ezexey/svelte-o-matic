<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '../../../app.svelte';
	import Movie from '$lib/components/Movie.svelte';
	import { getMovies, createMovie } from '$lib/components/movies.remote';

	let loading = $state(false);
	onMount(config.mountain);
</script>

<svelte:head>
	<title>Client Demo - Platformatic</title>
</svelte:head>

<h1>Create Movie</h1>
<form {...createMovie} class="space-y-2">
	<label>
		<h2>Title</h2>
		<input class="input" name="title" placeholder="Enter movie title" />
	</label>
	<button class="btn btn-primary" disabled={loading}>
		{#if loading}
			<span class="loading"></span>
		{/if}
		Publish!
	</button>
</form>
{#if createMovie.result?.success}
	<p>Successfully published!</p>
{/if}

<svelte:boundary>
	<h2>Movies Remote</h2>
	<ul class="space-y-4">
		{#each await getMovies() as { id, title }}
			{#if id}
				<Movie {id} {title} />
			{/if}
		{/each}
	</ul>
	{#snippet pending()}
		<p>loading Remote...</p>
	{/snippet}
</svelte:boundary>
