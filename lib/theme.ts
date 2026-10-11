// Shared by the inline <head> script (app/layout.tsx) and the ThemeToggle.

export const THEME_STORAGE_KEY = 'owo-theme'

export type ThemeChoice = 'system' | 'light' | 'dark'

/**
 * Runs in <head> before the page is painted, so a saved dark theme never
 * flashes light first. Plain ES5 in a string because it runs before React or
 * any bundle has loaded.
 *
 * - A saved "light"/"dark" choice wins and is written to data-theme.
 * - With no saved choice there is no attribute at all, and `color-scheme:
 *   light dark` in globals.css follows the OS, live, with no script needed.
 * - If localStorage is blocked, the catch leaves no attribute (system theme).
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`
