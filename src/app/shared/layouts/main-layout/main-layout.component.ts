import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
import { LoadingComponent } from '../../components/loading/loading/loading.component';
import { LoadingService } from '@core/services/loading/loading.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    HlmAvatarComponent,
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmButtonDirective,
    LoadingComponent,
  ],
  templateUrl: './main-layout.component.html',
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
