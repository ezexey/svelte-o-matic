// src/lib/stores/theme.ts
import { writable, derived, type Writable, type Readable } from 'svelte/store';

// Theme types
export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark',
	AUTO: 'auto'
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];
export type AppliedTheme = typeof THEMES.LIGHT | typeof THEMES.DARK;


// System theme detection (SSR-safe)
const getSystemTheme = (): AppliedTheme => {
	try {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
	} catch {
		return THEMES.LIGHT;
	}
};

// Create the theme stores
const getInitialTheme = (): Theme => {
	try {
		const saved = localStorage.getItem('theme') as Theme;
		if(saved) return saved;
		throw new Error('Invalid theme');
	} catch {
		return getSystemTheme();
	}
};
export const theme: Writable<Theme> = writable(getInitialTheme());
export const appliedTheme: Readable<AppliedTheme> = derived(theme, ($theme): AppliedTheme => {
	return $theme == THEMES.AUTO ? getSystemTheme() : $theme as AppliedTheme;
});

// Theme management functions
export const themeManager = {
	// Set theme and persist to localStorage
	setTheme: (newTheme: Theme): void => {
		console.log('Setting theme to:', newTheme);

		if (!Object.values(THEMES).includes(newTheme)) {
			console.warn(`Invalid theme: ${newTheme}`);
			return;
		}

		theme.set(newTheme);
		try {
			localStorage.setItem('theme', newTheme);
		} catch (error) {
			console.warn('Failed to save theme to localStorage:', error);
		}
	},

	// Toggle between light and dark
	toggleTheme: (): void => {
		theme.update((current: Theme): Theme => {
			const newTheme: Theme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
			try {
				localStorage.setItem('theme', newTheme);
			} catch (error) {
				console.warn('Failed to save theme to localStorage:', error);
			}
			return newTheme;
		});
	},

	// Get current theme value (useful for non-reactive contexts)
	getCurrentTheme: (): Theme => {
		let currentTheme: Theme;
		const unsubscribe = theme.subscribe((value: Theme) => (currentTheme = value));
		unsubscribe();
		return currentTheme!;
	},

	// Initialize theme system (browser-only)
	init: (): (() => void) => {
		try {
			// Handle system theme changes when in auto mode
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			const handleSystemThemeChange = () => theme.update((current: Theme) => current);

			mediaQuery.addEventListener('change', handleSystemThemeChange);

			// Cleanup function
			return (): void => {
				mediaQuery.removeEventListener('change', handleSystemThemeChange);
			};
		} catch (error) {
			console.warn('Error setting up media query listener:', error);
			return () => {}; // Return empty cleanup function
		}
	}
} as const;

// Apply theme to document (browser-only, prevents hydration mismatch)
export const applyThemeToDocument = (themeToApply: AppliedTheme): void => {
	if (typeof document === 'undefined') return;

	// Use requestAnimationFrame to avoid hydration issues
	requestAnimationFrame(() => {
		try {
			document.documentElement.setAttribute('data-theme', themeToApply);

			// Also set class for easier CSS targeting
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(themeToApply);
		} catch (error) {
			console.warn('Failed to apply theme to document:', error);
		}
	});
};

// Utility function to get theme display name (SSR-safe)
export const getThemeDisplayName = (themeValue: Theme): string => {
	const names: Record<Theme, string> = {
		[THEMES.LIGHT]: 'Light',
		[THEMES.DARK]: 'Dark',
		[THEMES.AUTO]: 'Auto'
	};
	return names[themeValue] || 'Unknown';
};

// Export for use in components
export { theme as default };
