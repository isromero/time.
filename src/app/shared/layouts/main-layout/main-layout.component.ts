import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
import { ThemeService } from '@core/services/theme/theme.service';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    IconComponent,
    HlmAvatarComponent,
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmButtonDirective,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  themeService: ThemeService = inject(ThemeService);
  authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
