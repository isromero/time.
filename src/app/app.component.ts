import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { AuthService } from '@core/auth/auth.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HlmSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  loading: boolean = true;
  themeService: ThemeService = inject(ThemeService);
  authService: AuthService = inject(AuthService);

  constructor() {
    this.themeService.updateTheme();
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email,
          username: (user as any).displayName,
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
      this.loading = false;
    });
  }
}
