import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { getLocalStorage, setLocalStorage } from '@core/utils/common.utils';
import { Theme } from '@shared/types/global.types';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<Theme>('dark');
  isToggled = signal<boolean>(false);
  private document: Document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  setTheme(theme: Theme) {
    if (isPlatformBrowser(this.platformId)) {
      const htmlDOM = this.document.querySelector('html');
      htmlDOM?.classList.remove('dark', 'light');
      htmlDOM?.classList.add(theme);
      setLocalStorage('theme', theme);
      this.currentTheme.set(theme);
      this.isToggled.set(theme === 'dark');
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
      this.currentTheme.set('dark');
      this.isToggled.set(true);
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const currentTheme = this.currentTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }
  }

  isDarkTheme(): boolean {
    return this.currentTheme() === 'dark';
  }
}
