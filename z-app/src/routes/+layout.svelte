<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { g } from './state.svelte';

	let { children } = $props();
	const routeId = $derived(page.route?.id);

	onMount(g.mountain);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
</svelte:head>

<!-- SSR-safe data-theme attribute -->
<div class="app-shell" data-theme={g.theme.value}>
	<!-- Optional: Navigation Header -->
	<header class="extension-header">
		<div class="header-grid">
			<!-- Left: Title -->
			<div class="header-left">
				<h1 class="heading-secondary">Demo</h1>
			</div>

			<!-- Right: Navigation -->
			<div class="header-right">
				<nav class="items-center gap-2 sm:flex">
					<a href="/" class="nav-link {page.url.pathname === '/' ? 'active' : ''}"> Home </a>
					<a href="/demo/client" class="nav-link {page.url.pathname === '/demo/client' ? 'active' : ''}">
						Client
					</a>
					<a href="/demo/theme" class="nav-link {page.url.pathname === '/demo/theme' ? 'active' : ''}">
						Theme
					</a>
				</nav>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="main-content">
		<div class="route-container">
			<!-- Page content with transition -->
			{#key routeId}
				<div class="page-transition">
					{@render children?.()}
				</div>
			{/key}
		</div>
	</main>

	<!-- Optional: Footer -->
	<footer class="extension-footer">
		<div class="flex-between">
			<p class="text-small">© 2025 Extenzioneer</p>
			<div class="flex items-center gap-2">
				<span class="text-small">Theme: {g.theme.value}</span>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Layout-specific styles */
	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	/* Header grid layout */
	.header-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.header-left {
		justify-self: start;
	}

	.header-right {
		justify-self: end;
	}

	/* Page transitions */
	.page-transition {
		animation: pageEnter 0.3s ease-out;
	}

	@keyframes pageEnter {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive navigation */
	@media (max-width: 640px) {
		.extension-header {
			padding: 0.75rem 1rem;
		}

		.extension-header h1 {
			font-size: 1.125rem;
		}

		/* Stack header items on mobile */
		.header-grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			text-align: center;
			gap: 0.5rem;
		}

		.header-left,
		.header-right {
			justify-self: center;
		}
	}
</style>
