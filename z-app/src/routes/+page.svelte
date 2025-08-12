<!-- src/routes/+page.svelte -->
<script>
  import { theme, appliedTheme, themeManager, THEMES, getThemeDisplayName, isDarkTheme } from '$lib/stores/theme.js';
  // Demo state
  let message = '';
  let isLoading = false;
  
  // Reactive values
  $: currentTheme = $theme;
  $: currentAppliedTheme = $appliedTheme;
  $: isCurrentlyDark = isDarkTheme(currentTheme);
  
  // Demo functions
  const simulateLoading = async () => {
    isLoading = true;
    message = 'Loading...';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    isLoading = false;
    message = `Operation completed in ${isCurrentlyDark ? 'dark' : 'light'} mode!`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message = '';
    }, 3000);
  };
  
  const showNotification = (type) => {
    const notifications = {
      info: 'This is an info notification',
      success: 'Operation completed successfully!',
      warning: 'This is a warning message',
      error: 'An error occurred'
    };
    message = notifications[type] || 'Unknown notification';
    
    setTimeout(() => {
      message = '';
    }, 3000);
  };
</script>

<svelte:head>
  <title>Theme Demo - Twitch Extension</title>
</svelte:head>

<!-- Debug Component (remove after testing) -->
<!-- <DebugTheme /> -->

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
      on:click={() => themeManager.toggleTheme()}
      style="background: #9146ff; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Simple Toggle Test
    </button>
    <button 
      on:click={() => themeManager.setTheme(THEMES.DARK)}
      style="background: #374151; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Set Dark Test
    </button>
    <p style="margin: 0.5rem 0; color: #666; font-size: 14px;">
      Current: {currentTheme} | Applied: {currentAppliedTheme}
    </p>
  </div>

  <!-- Theme Status Card -->
  <div class="card">
    <h2 class="heading-secondary">Current Theme Status</h2>
    <div class="grid-2 gap-4">
      <div>
        <p class="text-small mb-2">Selected Theme:</p>
        <div class="badge badge-primary">{getThemeDisplayName(currentTheme)}</div>
      </div>
      <div>
        <p class="text-small mb-2">Applied Theme:</p>
        <div class="badge {isCurrentlyDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}">
          {getThemeDisplayName(currentAppliedTheme)}
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
        <div class="flex gap-2 flex-wrap">
          {#each Object.values(THEMES) as themeOption}
            <button
              class="btn {currentTheme === themeOption ? 'btn-primary' : 'btn-secondary'}"
              on:click={() => themeManager.setTheme(themeOption)}
            >
              {getThemeDisplayName(themeOption)}
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
          <button class="btn btn-primary" on:click={simulateLoading} disabled={isLoading}>
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
        <button class="btn btn-secondary" on:click={() => showNotification('info')}>
          Info
        </button>
        <button class="btn btn-secondary" on:click={() => showNotification('success')}>
          Success
        </button>
        <button class="btn btn-secondary" on:click={() => showNotification('warning')}>
          Warning
        </button>
        <button class="btn btn-secondary" on:click={() => showNotification('error')}>
          Error
        </button>
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
    <p class="text-body mb-4">
      This section demonstrates how content can adapt to the current theme.
    </p>
    
    <div class="space-y-2">
      <p class="text-body">
        🎨 Current mode: <strong>{isCurrentlyDark ? 'Dark' : 'Light'}</strong>
      </p>
      <p class="text-body">
        {#if isCurrentlyDark}
          🌙 Perfect for late-night streaming sessions
        {:else}
          ☀️ Great for daytime content creation
        {/if}
      </p>
      <p class="text-body">
        Theme automatically updates based on your selection and system preferences.
      </p>
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