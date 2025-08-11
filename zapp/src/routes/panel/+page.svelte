<!-- +page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  import { navigating } from '$app/state';
  
  let { data }: { data: PageData } = $props();
</script>

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
{/if}