// src/lib/stores/theme.ts
import { writable, derived, type Writable, type Readable } from 'svelte/store';

// types
export const THEMES = { LIGHT: 'light', DARK: 'dark' } as const;
export type Theme = typeof THEMES.LIGHT | typeof THEMES.DARK;

// props
const mediaQuery = typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)');

// stores
export const writer: Writable<Theme> = writable(
	(() => (mediaQuery?.matches ? THEMES.DARK : THEMES.LIGHT))()
);
export const reader: Readable<Theme> = derived(writer, ($theme) => $theme);

// Theme management functions
export const manager = {
	// Initialize theme system (browser-only)
	init: (subscription: (theme: Theme) => void) => {
		if (!mediaQuery) return () => {}; // No media query support

		// Handle system theme changes when in auto mode
		const handleSystemThemeChange = () => writer.update((current: Theme) => current);
		mediaQuery.addEventListener('change', handleSystemThemeChange);
		const unsubscribe = writer.subscribe((theme) => {
			subscription(theme);
			// Use requestAnimationFrame to avoid hydration issues
			requestAnimationFrame(() => {
				try {
					document.documentElement.setAttribute('data-theme', theme);

					// Also set class for easier CSS targeting
					document.documentElement.classList.remove('light', 'dark');
					document.documentElement.classList.add(theme);
				} catch (error) {
					console.warn('Failed to apply theme to document:', error);
				}
			});
		});

		// Cleanup function
		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
			unsubscribe();
		};
	},
	// Toggle between light and dark
	toggleTheme: () =>
		writer.update((current: Theme) => (current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT)),

	// Set theme
	setTheme: (theme: Theme) => writer.set(theme)
} as const;
