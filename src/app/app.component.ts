import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { IconComponent } from '@shared/components/ui/icon.component';
import { HlmAvatarComponent } from '@spartan-ng/ui-avatar-helm';
import {
  BrnPopoverCloseDirective,
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import {
  HlmPopoverCloseDirective,
  HlmPopoverContentDirective,
} from '@spartan-ng/ui-popover-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    IconComponent,
    HlmAvatarComponent,
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmButtonDirective,
    HlmSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  loading: boolean = true;
  themeService: ThemeService = inject(ThemeService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

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

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
