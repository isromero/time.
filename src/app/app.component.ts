import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HlmSwitchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'time';

  themeService: ThemeService = inject(ThemeService);

  constructor() {
    this.themeService.updateTheme();
  }
}
