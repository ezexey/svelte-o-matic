<script lang="ts">
	import { manager, THEMES } from '$lib/stores/theme';
	import { corio } from '$lib';
	import { config } from '../../../app.svelte.js';
	// Demo state
	let message = $state('');
	let isLoading = $state(false);

	// Reactive values
	
	let { children } = $props();
	const themeWriter = $derived(config.theme.writer);
	const themeReader = $derived(config.theme.reader);
	const isDarkMode = $derived(config.theme.value === THEMES.DARK);

	// Demo functions
	const simulateLoading = async () => {
		isLoading = true;
		message = 'Loading...';

		await corio.delay(3000, async () => {
			isLoading = false;
			message = `Operation completed in ${$themeReader} mode!`;
			await corio.delay(3000);
			message = '';
		});
	};

	const showNotification = async (type: string) => {
		const notifications = {
			info: 'This is an info notification',
			success: 'Operation completed successfully!',
			warning: 'This is a warning message',
			error: 'An error occurred'
		};
		message = notifications[type] || 'Unknown notification';

		await corio.delay(3000);
		message = '';
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center">
		<h1 class="heading-primary text-gradient">Theme Management Demo</h1>
		<p class="text-body">
			Demonstrating Platformatic + SvelteKit with a Twitch Extension and a simple theme system
		</p>
	</div>

	<!-- Simple Test Buttons -->
	<div style="background: #f0f0f0; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
		<h2 style="margin: 0 0 1rem 0; color: #333;">Simple Test (Inline Styles)</h2>
		<button
			onclick={() => manager.toggleTheme()}
			style="background: #9146ff; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
		>
			Simple Toggle Test
		</button>
		<button
			onclick={() => manager.setTheme(THEMES.DARK)}
			style="background: #374151; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
		>
			Set Dark Test
		</button>
		<p style="margin: 0.5rem 0; color: #666; font-size: 14px;">
			Current: {$themeWriter} | Applied: {config.theme.reader} | Value: {config.theme.value}
		</p>
	</div>

	<!-- Theme Status Card -->
	<div class="card">
		<h2 class="heading-secondary">Current Theme Status</h2>
		<div class="grid-2 gap-4">
			<div>
				<p class="text-small mb-2">Selected Theme:</p>
				<div class="badge badge-primary">{config.theme.value}</div>
			</div>
			<div>
				<p class="text-small mb-2">Applied Theme:</p>
				<div
					class="badge {config.theme.value === THEMES.DARK
						? 'bg-gray-800 text-white'
						: 'bg-gray-100 text-gray-800'}"
				>
					{config.theme.reader}
				</div>
			</div>
		</div>

		<div class="mt-4">
			<p class="text-small mb-2">System Preference:</p>
			<p class="text-body">
				{#if typeof window !== 'undefined'}
					{window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
				{:else}
					Loading...
				{/if}
			</p>
		</div>
	</div>

	<!-- Theme Controls -->
	<div class="card">
		<h2 class="heading-secondary">Theme Controls</h2>
		<div class="space-y-4">
			<!-- Direct Theme Selection -->
			<div>
				<p class="text-small mb-2">Direct Selection:</p>
				<div class="flex flex-wrap gap-2">
					{#each Object.values(THEMES) as themeOption}
						<button
							class="btn {config.theme.value === themeOption ? 'btn-primary' : 'btn-secondary'}"
							onclick={() => manager.setTheme(themeOption)}
						>
							{themeOption}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Component Showcase -->
	<div class="card">
		<h2 class="heading-secondary">Component Showcase</h2>
		<div class="space-y-4">
			<!-- Buttons -->
			<div>
				<p class="text-small mb-2">Buttons:</p>
				<div class="component-cluster">
					<button class="btn btn-primary" onclick={simulateLoading} disabled={isLoading}>
						{#if isLoading}
							<span class="loading"></span>
						{/if}
						Primary Button
					</button>
					<button class="btn btn-secondary">Secondary</button>
					<button class="btn btn-ghost">Ghost</button>
				</div>
			</div>

			<!-- Form Elements -->
			<div>
				<p class="text-small mb-2">Form Elements:</p>
				<div class="space-y-2">
					<input class="input" placeholder="Enter some text..." />
					<div class="flex items-center gap-4">
						<label class="flex items-center gap-2">
							<input type="checkbox" class="accent-purple-600" />
							<span class="text-body">Enable notifications</span>
						</label>
						<label class="flex items-center gap-2">
							<input type="radio" name="demo" class="accent-purple-600" />
							<span class="text-body">Option A</span>
						</label>
						<label class="flex items-center gap-2">
							<input type="radio" name="demo" class="accent-purple-600" />
							<span class="text-body">Option B</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Badges -->
			<div>
				<p class="text-small mb-2">Badges:</p>
				<div class="component-cluster">
					<span class="badge">Default</span>
					<span class="badge badge-primary">Primary</span>
					<span class="badge badge-success">Success</span>
					<span class="status-online">● Online</span>
					<span class="status-offline">● Offline</span>
					<span class="status-live">🔴 Live</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Notifications Demo -->
	<div class="card">
		<h2 class="heading-secondary">Notifications</h2>
		<div class="space-y-3">
			<div class="component-cluster">
				<button class="btn btn-secondary" onclick={() => showNotification('info')}> Info </button>
				<button class="btn btn-secondary" onclick={() => showNotification('success')}> Success </button>
				<button class="btn btn-secondary" onclick={() => showNotification('warning')}> Warning </button>
				<button class="btn btn-secondary" onclick={() => showNotification('error')}> Error </button>
			</div>

			{#if message}
				<div class="notification notification-info fade-in">
					{message}
				</div>
			{/if}
		</div>
	</div>

	<!-- Progress Demo -->
	<div class="card">
		<h2 class="heading-secondary">Progress Indicators</h2>
		<div class="space-y-3">
			<div class="progress-bar">
				<div class="progress-fill" style="width: 75%"></div>
			</div>
			<p class="text-small">Progress: 75%</p>

			{#if isLoading}
				<div class="flex items-center gap-2">
					<span class="loading"></span>
					<span class="text-body">Processing...</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Theme-Aware Content -->
	<div class="card glass-effect">
		<h2 class="heading-secondary">Theme-Aware Content</h2>
		<p class="text-body mb-4">This section demonstrates how content can adapt to the current theme.</p>

		<div class="space-y-2">
			<p class="text-body">
				🎨 Current mode: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
			</p>
			<p class="text-body">
				{#if isDarkMode}
					🌙 Perfect for late-night streaming sessions
				{:else}
					☀️ Great for daytime content creation
				{/if}
			</p>
			<p class="text-body">Theme automatically updates based on your selection and system preferences.</p>
		</div>
	</div>
</div>

<style>
	/* Page-specific styles */
	.text-gradient {
		background: linear-gradient(135deg, var(--twitch-purple), var(--twitch-purple-light));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Demo-specific animations */
	.fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>


{@render children?.()}
