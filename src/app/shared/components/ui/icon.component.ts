import { Component, Input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideGoal,
  lucideHouse,
  lucideListTodo,
  lucideLogs,
  lucideTimer,
  lucideBookmark,
  lucideSettings2,
  lucideUsers,
  lucideEllipsis,
  lucideImage,
  lucideChartBarBig,
} from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

interface IconConfig {
  name: string;
  size?: 'sm' | 'base' | 'lg' | 'xl';
}

@Component({
  selector: 'app-hlm-icon',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [
    provideIcons({
      lucideHouse,
      lucideLogs,
      lucideGoal,
      lucideListTodo,
      lucideTimer,
      lucideUsers,
      lucideBookmark,
      lucideSettings2,
      lucideEllipsis,
      lucideImage,
      lucideChartBarBig,
    }),
  ],
  template: `
    <hlm-icon [size]="config.size || 'base'" [name]="config.name" />
  `,
})
export class IconComponent {
  @Input() config!: IconConfig;
}
