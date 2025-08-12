// src/lib/stores/theme.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Default theme (SSR-safe)
const DEFAULT_THEME = THEMES.LIGHT;

// Initialize theme from localStorage or default (SSR-safe)
const getInitialTheme = () => {
  if (!browser) return DEFAULT_THEME;
  
  try {
    const saved = localStorage.getItem('theme');
    console.log('Loading saved theme:', saved);
    return saved && Object.values(THEMES).includes(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

// System theme detection (SSR-safe)
const getSystemTheme = () => {
  if (!browser) return THEMES.LIGHT;
  
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  } catch {
    return THEMES.LIGHT;
  }
};

// Create the theme stores
export const theme = writable(getInitialTheme());

// Derived store for applied theme that handles AUTO mode (SSR-safe)
export const appliedTheme = derived(theme, ($theme) => {
  if ($theme === THEMES.AUTO) {
    return getSystemTheme();
  }
  return $theme;
});

// Theme management functions
export const themeManager = {
  // Set theme and persist to localStorage
  setTheme: (newTheme) => {
    console.log('Setting theme to:', newTheme);
    
    if (!Object.values(THEMES).includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }
    
    theme.set(newTheme);
    
    if (browser) {
      try {
        localStorage.setItem('theme', newTheme);
        console.log('Theme saved to localStorage:', newTheme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  },

  // Toggle between light and dark
  toggleTheme: () => {
    console.log('Toggle theme called');
    
    theme.update(current => {
      console.log('Current theme:', current);
      const newTheme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      console.log('New theme will be:', newTheme);
      
      if (browser) {
        try {
          localStorage.setItem('theme', newTheme);
          console.log('Theme toggled and saved:', newTheme);
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error);
        }
      }
      return newTheme;
    });
  },

  // Get current theme value (useful for non-reactive contexts)
  getCurrentTheme: () => {
    let currentTheme;
    const unsubscribe = theme.subscribe(value => currentTheme = value);
    unsubscribe();
    return currentTheme;
  },

  // Initialize theme system (browser-only)
  init: () => {
    if (!browser) {
      console.log('Not in browser, skipping theme init');
      return () => {}; // Return empty cleanup function
    }

    console.log('Initializing theme system');

    try {
      // Handle system theme changes when in auto mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        console.log('System theme changed');
        // Trigger reactivity by updating the theme
        theme.update(current => current);
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    } catch (error) {
      console.warn('Error setting up media query listener:', error);
      return () => {}; // Return empty cleanup function
    }
  }
};

// Apply theme to document (browser-only, prevents hydration mismatch)
const applyThemeToDocument = (themeToApply) => {
  if (!browser || typeof document === 'undefined') return;
  
  // Use requestAnimationFrame to avoid hydration issues
  requestAnimationFrame(() => {
    try {
      document.documentElement.setAttribute('data-theme', themeToApply);
      console.log('Document data-theme set to:', themeToApply);
      
      // Also set class for easier CSS targeting
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeToApply);
      console.log('Document class updated to:', themeToApply);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const themeColors = {
          light: '#ffffff',
          dark: '#0e0e10'
        };
        metaThemeColor.setAttribute('content', themeColors[themeToApply]);
        console.log('Meta theme-color updated for:', themeToApply);
      }
    } catch (error) {
      console.warn('Failed to apply theme to document:', error);
    }
  });
};

// Subscribe to applied theme changes and update document (browser-only)
if (browser) {
  appliedTheme.subscribe((themeToApply) => {
    console.log('Applied theme updated:', themeToApply);
    applyThemeToDocument(themeToApply);
  });

  // Initialize on mount (browser-only)
  console.log('Theme store loaded, initializing...');
  themeManager.init();
}

// Utility function to check if dark theme is active (SSR-safe)
export const isDarkTheme = (themeValue) => {
  if (themeValue === THEMES.AUTO) {
    return getSystemTheme() === THEMES.DARK;
  }
  return themeValue === THEMES.DARK;
};

// Utility function to get theme display name (SSR-safe)
export const getThemeDisplayName = (themeValue) => {
  const names = {
    [THEMES.LIGHT]: 'Light',
    [THEMES.DARK]: 'Dark',
    [THEMES.AUTO]: 'Auto'
  };
  return names[themeValue] || 'Unknown';
};

// Export for use in components
export { theme as default };