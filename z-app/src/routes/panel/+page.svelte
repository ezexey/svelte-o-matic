<!-- +page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  import { navigating } from '$app/state';
  import { twitch } from "$lib";

  let { data, auth }: { data: PageData, auth: string } = $props();
  auth = twitch.Extension.I.auth?.token || '';
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