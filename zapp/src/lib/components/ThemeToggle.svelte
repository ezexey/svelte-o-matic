<!-- src/lib/components/ThemeToggle.svelte -->
<script>
  import { browser } from '$app/environment';
  import { theme, themeManager, THEMES, getThemeDisplayName, isDarkTheme } from '$lib/stores/theme.js';
  
  // Props
  export let variant = 'button'; // 'button' | 'dropdown' | 'switch'
  export let size = 'md'; // 'sm' | 'md' | 'lg'
  export let showLabel = false;
  export let position = 'none'; // 'fixed' | 'relative' | 'none' | 'inline' | 'static'
  
  // Use Svelte store reactivity (SSR-safe)
  $: currentTheme = $theme;
  $: isCurrentlyDark = isDarkTheme(currentTheme);
  $: displayName = getThemeDisplayName(currentTheme);
  
  // Local state
  let isDropdownOpen = false;
  
  // Icons (you can replace with your preferred icon library)
  const icons = {
    light: '☀️',
    dark: '🌙',
    auto: '🌓',
    toggle: '🎨'
  };
  
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  // Position classes
  const positionClasses = {
    fixed: 'fixed top-4 right-4 z-50',
    relative: 'relative',
    none: '',
    inline: 'inline-block',
    static: 'static'
  };
  
  // Computed position class
  $: computedPositionClass = positionClasses[position] || '';
  
  // Event handlers
  const handleToggle = () => {
    if (!browser) return;
    console.log('Toggle clicked, current theme:', currentTheme);
    themeManager.toggleTheme();
  };
  
  const handleThemeSelect = (selectedTheme) => {
    if (!browser) return;
    console.log('Theme selected:', selectedTheme);
    themeManager.setTheme(selectedTheme);
    closeDropdown();
  };
  
  const toggleDropdown = () => {
    console.log('Dropdown toggle clicked');
    isDropdownOpen = !isDropdownOpen;
  };
  
  const closeDropdown = () => {
    isDropdownOpen = false;
  };
  
  // Close dropdown when clicking outside (browser-only)
  const handleClickOutside = (event) => {
    if (!browser) return;
    if (!event.target.closest('.theme-dropdown')) {
      closeDropdown();
    }
  };
</script>

<!-- {#if browser}
  <svelte:window on:click={handleClickOutside} />
{/if} -->

<div class="theme-toggle-container {computedPositionClass}">
  
  {#if variant === 'button'}
    <!-- Simple Toggle Button -->
    <button
      type="button"
      class="theme-toggle btn-ghost {sizeClasses[size]} rounded-full border border-border-light hover:border-twitch-purple transition-all duration-200 flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary cursor-pointer"
      on:click={handleToggle}
      title="Toggle theme (currently {displayName})"
      aria-label="Toggle theme"
    >
      <span class="text-lg" role="img" aria-hidden="true">
        {isCurrentlyDark ? icons.dark : icons.light}
      </span>
      {#if showLabel}
        <span class="hidden sm:inline text-sm font-medium">
          {displayName}
        </span>
      {/if}
    </button>
    
  {:else if variant === 'dropdown'}
    <!-- Theme Dropdown -->
    <div class="theme-dropdown relative">
      <button
        type="button"
        class="theme-toggle {sizeClasses[size]} rounded-lg border border-border-light hover:border-twitch-purple transition-all duration-200 flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary px-3 cursor-pointer"
        on:click={toggleDropdown}
        title="Select theme"
        aria-label="Theme selector"
        aria-expanded={isDropdownOpen}
      >
        <span class="text-base" role="img" aria-hidden="true">
          {currentTheme === THEMES.AUTO ? icons.auto : isCurrentlyDark ? icons.dark : icons.light}
        </span>
        {#if showLabel}
          <span class="text-sm font-medium">
            {displayName}
          </span>
        {/if}
        <span class="text-xs transform transition-transform {isDropdownOpen ? 'rotate-180' : ''}">
          ▼
        </span>
      </button>
      
      {#if isDropdownOpen}
        <div class="absolute top-full right-0 mt-1 bg-bg-primary border border-border-light rounded-lg shadow-lg overflow-hidden min-w-32 z-10">
          {#each Object.values(THEMES) as themeOption}
            <button
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-bg-tertiary transition-colors duration-150 flex items-center gap-2 cursor-pointer {currentTheme === themeOption ? 'bg-bg-tertiary text-twitch-purple font-medium' : 'text-text-secondary'}"
              on:click={() => handleThemeSelect(themeOption)}
            >
              <span role="img" aria-hidden="true">
                {themeOption === THEMES.AUTO ? icons.auto : themeOption === THEMES.DARK ? icons.dark : icons.light}
              </span>
              {getThemeDisplayName(themeOption)}
              {#if currentTheme === themeOption}
                <span class="ml-auto text-twitch-purple">✓</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    
  {:else if variant === 'switch'}
    <!-- Toggle Switch -->
    <div class="flex items-center gap-3">
      {#if showLabel}
        <span class="text-sm font-medium text-text-secondary">
          {icons.light}
        </span>
      {/if}
      
      <label class="toggle cursor-pointer">
        <input
          type="checkbox"
          checked={isCurrentlyDark}
          on:change={handleToggle}
          aria-label="Toggle dark mode"
        />
        <span class="toggle-slider"></span>
      </label>
      
      {#if showLabel}
        <span class="text-sm font-medium text-text-secondary">
          {icons.dark}
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Override any fixed positioning when position is none/inline/static */
  .theme-toggle-container:not(.fixed) {
    position: static !important;
    top: auto !important;
    right: auto !important;
    left: auto !important;
    bottom: auto !important;
  }
  
  .theme-toggle {
    /* Ensure button is clickable */
    position: relative;
    z-index: 10;
    user-select: none;
  }
  
  .theme-toggle:focus-visible {
    outline: 2px solid var(--twitch-purple);
    outline-offset: 2px;
  }
  
  .theme-dropdown button:focus-visible {
    outline: 2px solid var(--twitch-purple);
    outline-offset: -2px;
  }
  
  /* Ensure proper stacking */
  .theme-dropdown .absolute {
    z-index: 1000;
  }
  
  /* Custom toggle switch styles */
  .toggle {
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 1.5rem;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-tertiary);
    transition: 0.2s;
    border-radius: 1.5rem;
    border: 1px solid var(--border-light);
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 1.125rem;
    width: 1.125rem;
    left: 0.125rem;
    bottom: 0.125rem;
    background-color: var(--bg-primary);
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .toggle input:checked + .toggle-slider {
    background-color: var(--twitch-purple);
    border-color: var(--twitch-purple);
  }

  .toggle input:checked + .toggle-slider:before {
    transform: translateX(1.375rem);
  }

  .toggle:hover .toggle-slider {
    border-color: var(--twitch-purple);
  }
  
  /* Debug styles to ensure buttons are visible and clickable */
  .theme-toggle:hover {
    transform: scale(1.05);
  }
</style>