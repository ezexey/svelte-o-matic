<script lang="ts">
	import type { PageData } from './$types';
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	import { config } from '../../../app.svelte';

	let { data }: { data: PageData } = $props();
	onMount(config.mountain);
</script>

<svelte:head>
	<title>Client Demo - Platformatic</title>
</svelte:head>

{#if navigating.to}
  <p>loading...</p>
{:else}
  <h2>Movies</h2>
  <ul>
    {#each data.movies as movie}
      <li>{movie.title}</li>
    {:else}
      <li>No movies found</li>
    {/each}
  </ul>
  
  <br />
  <h2>Movies Too</h2>
  <ul>
    {#each data.moviesToo as movie}
      <li>{movie.title}</li>
    {:else}
      <li>No movies found</li>
    {/each}
  </ul>
{/if}