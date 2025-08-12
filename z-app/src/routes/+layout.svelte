<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { theme, themeManager, appliedTheme } from '$lib/stores/theme.js';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { twitch } from '$lib';

	let { children } = $props();

	// SSR-safe theme state
	let currentAppliedTheme = $state('light');
	let mounted = $state(false);

	// Page route for transitions (using Svelte 5 $derived)
	const routeId = $derived(page.route?.id);

	// Initialize theme system on mount (browser-only)
	onMount(() => {
		mounted = true;
		const cleanup = themeManager.init();

		// Subscribe to appliedTheme changes (only in browser)
		const unsubscribe = appliedTheme.subscribe((value) => {
			currentAppliedTheme = value;
		});

		return () => {
			cleanup?.();
			unsubscribe();
		};
	});

	// Apply theme to document (browser-only, prevents hydration mismatch)
	$effect(() => {
		if (browser && mounted && typeof document !== 'undefined') {
			// Use requestAnimationFrame to ensure DOM is ready
			requestAnimationFrame(() => {
				document.documentElement.setAttribute('data-theme', currentAppliedTheme);
				document.documentElement.classList.remove('light', 'dark');
				document.documentElement.classList.add(currentAppliedTheme);
			});
		}
		
		// Handle async Twitch operations separately
		(async () => {
			try {
				const witch = twitch.TwitchExtension.getInstance();
				const auth = await witch.waitForAuth();
        console.log('User is authenticated:', auth);

        const context = await witch.waitForContext();
				console.log('User context:', context);
        
        // Check user role
				if (witch.isBroadcaster()) {
					console.log('User is the broadcaster');
				}

				// Send PubSub message
				witch.broadcast('update', { data: 'Hello viewers!' });
			} catch (error) {
				console.error('Error initializing Twitch extension:', error);
			}
		})();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Twitch Extension</title>
	<meta name="description" content="SvelteKit Twitch Extension" />
	<!-- SSR-safe meta tag with default value -->
	<meta
		name="theme-color"
		content={mounted ? (currentAppliedTheme === 'light' ? '#ffffff' : '#0e0e10') : '#ffffff'}
	/>
</svelte:head>

<!-- SSR-safe data-theme attribute -->
<div class="app-shell" data-theme={mounted ? currentAppliedTheme : 'light'}>
	<!-- Optional: Navigation Header -->
	<header class="extension-header">
		<div class="header-grid">
			<!-- Left: Title -->
			<div class="header-left">
				<h1 class="heading-secondary">Twitch Extension</h1>
			</div>

			<!-- Center: Theme Toggle (only show after mount to prevent hydration mismatch) -->
			<div class="header-center">
				{#if mounted}
					<ThemeToggle variant="button" size="sm" position="none" />
				{:else}
					<!-- SSR placeholder -->
					<div style="width: 2rem; height: 2rem;"></div>
				{/if}
			</div>

			<!-- Right: Navigation -->
			<div class="header-right">
				<nav class="hidden items-center gap-2 sm:flex">
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
			<p class="text-small">© 2025 Your Twitch Extension</p>
			<div class="flex items-center gap-2">
				<span class="text-small">Theme:</span>
				{#if mounted}
					<ThemeToggle variant="dropdown" size="sm" showLabel={false} position="none" />
				{:else}
					<!-- SSR placeholder -->
					<div style="width: 4rem; height: 1.5rem; background: #f0f0f0; border-radius: 4px;"></div>
				{/if}
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

	.header-center {
		justify-self: center;
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
		.header-center,
		.header-right {
			justify-self: center;
		}
	}
</style>
