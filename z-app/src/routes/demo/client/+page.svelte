<script lang="ts">
	import type { PageData } from './$types';
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	import { g } from '../../state.svelte';

	let { data }: { data: PageData } = $props();
	onMount(g.mountain);
</script>

<svelte:head>
	<title>Client Demo - Platformatic</title>
</svelte:head>

{#if navigating.to}
  <p>loading...</p>
{:else}
  <h2>Movies One</h2>
  <ul>
    {#each data.moviesOne as mo}
      <li>{mo.title}</li>
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