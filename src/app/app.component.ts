import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { AuthService } from '@core/auth/auth.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { UsersService } from '@core/services/users/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HlmSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private themeService: ThemeService = inject(ThemeService);
  private authService: AuthService = inject(AuthService);
  private usersService: UsersService = inject(UsersService);
  loading: boolean = true;

  constructor() {
    /* Init theme */
    this.themeService.updateTheme();
    /* Init current user signal */
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSignal.set({
          uid: user.uid,
          photoURL: user.photoURL,
          email: user.email,
          username: (user as any).displayName,
        });
        /* Init global state user */
        this.usersService.loadUser(this.authService.currentUserSignal()!.uid);
      } else {
        this.authService.currentUserSignal.set(null);
      }
      this.loading = false;
    });
  }
}
