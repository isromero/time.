import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { getLocalStorage, setLocalStorage } from '@core/utils/common.utils';
import { Theme } from '@shared/types/global.types';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document: Document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private currentThemeSignal = signal<Theme>('dark');
  isToggledSignal = signal<boolean>(false);

  setTheme(theme: Theme) {
    if (isPlatformBrowser(this.platformId)) {
      const htmlDOM = this.document.querySelector('html');
      htmlDOM?.classList.remove('dark', 'light');
      htmlDOM?.classList.add(theme);
      setLocalStorage('theme', theme);
      this.currentThemeSignal.set(theme);
      this.isToggledSignal.set(theme === 'dark');
    }
  }

  updateTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const theme = getLocalStorage('theme') as Theme;
      if (!theme) {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
      } else {
        this.setTheme(theme);
      }
    } else {
      this.currentThemeSignal.set('dark');
      this.isToggledSignal.set(true);
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const currentThemeSignal = this.currentThemeSignal();
      const newTheme = currentThemeSignal === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }
  }

  isDarkTheme(): boolean {
    return this.currentThemeSignal() === 'dark';
  }
}
