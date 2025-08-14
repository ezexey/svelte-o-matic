import {
	type AppliedTheme,
	theme,
	appliedTheme,
	applyThemeToDocument,
	themeManager
} from '$lib/stores/theme';

export const g = $state({
	theme: {
		current: theme,
		applied: appliedTheme,
		value: 'light' as AppliedTheme
	},
	mountain: () => {
		const cleanup = themeManager.init();
		// Subscribe to appliedTheme changes (only in browser)
		const unsubscribe = g.theme.applied.subscribe((themeToApply) => {
			g.theme.value = themeToApply;
			applyThemeToDocument(themeToApply);
		});
		return () => {
			cleanup?.();
			unsubscribe();
		};
	}
});
