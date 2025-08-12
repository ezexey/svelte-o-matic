<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		themeManager,
		appliedTheme,
		applyThemeToDocument,
		type AppliedTheme
	} from '$lib/stores/theme.js';
	import { twitch } from '$lib';

	let { children } = $props();

	// SSR-safe theme state
	let currentAppliedTheme: AppliedTheme = $state('light');

	// Page route for transitions (using Svelte 5 $derived)
	const routeId = $derived(page.route?.id);

	// Initialize theme system on mount (browser-only)
	onMount(() => {
		const cleanup = themeManager.init();

		// Subscribe to appliedTheme changes (only in browser)
		const unsubscribe = appliedTheme.subscribe((themeToApply) => {
			console.log('Applied theme updated:', themeToApply);
			currentAppliedTheme = themeToApply;
			applyThemeToDocument(currentAppliedTheme);
		});

		// Handle async Twitch operations separately
			(async () => {
				try {
					const resolve = Promise.all([
						twitch.Extension.I.waitForAuth(),
						twitch.Extension.I.waitForContext()
					]);
					const [auth, context] = await Promise.race([
						resolve,
						new Promise((_, reject) => setTimeout(() => reject(new Error('Auth and context timeout')), 1000))
					]) as [twitch.AuthData, twitch.Context];
          
					console.log('User is authenticated:', auth);
					console.log('User context:', context);

					themeManager.setTheme(context.theme);

					// Check user role
					if (twitch.Extension.I.isBroadcaster()) {
						console.log('User is the broadcaster');
					}
				} catch (error) {
					console.error('Error initializing Twitch extension:', error);
				}
			})();

		return () => {
			cleanup?.();
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Extenzion</title>
	<meta name="description" content="Platformatic + SvelteKit + Twitch + Extension" />
	<!-- SSR-safe meta tag with default value -->
	<meta name="theme-color" content={currentAppliedTheme === 'light' ? '#ffffff' : '#0e0e10'} />
</svelte:head>

<!-- SSR-safe data-theme attribute -->
<div class="app-shell" data-theme={currentAppliedTheme}>
	<!-- Optional: Navigation Header -->
	<header class="extension-header">
		<div class="header-grid">
			<!-- Left: Title -->
			<div class="header-left">
				<h1 class="heading-secondary">Extenzion</h1>
			</div>

			<!-- Right: Navigation -->
			<div class="header-right">
				<nav class="items-center gap-2 sm:flex">
					<a href="/" class="nav-link {page.url.pathname === '/' ? 'active' : ''}"> Home </a>
					<a href="/panel" class="nav-link {page.url.pathname === '/panel' ? 'active' : ''}">
						Panel
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
				<span class="text-small">Theme: {currentAppliedTheme}</span>
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
