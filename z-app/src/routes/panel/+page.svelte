<script lang="ts">
	import type { PageData } from './$types';
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	import { appliedTheme, applyThemeToDocument, themeManager } from '$lib/stores/theme';

	let { data }: { data: PageData } = $props();
	onMount(() => {
		const cleanup = themeManager.init();

		// Subscribe to appliedTheme changes (only in browser)
		const unsubscribe = appliedTheme.subscribe((themeToApply) => applyThemeToDocument(themeToApply));
		themeManager.setTheme(data.theme);

		return () => {
			cleanup?.();
			unsubscribe();
		};
	});
</script>

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