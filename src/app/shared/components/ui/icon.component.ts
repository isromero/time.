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
  lucideMessageCircle,
} from '@ng-icons/lucide';
import { ionHeart, ionHeartOutline } from '@ng-icons/ionicons';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

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
      ionHeart,
      ionHeartOutline,
      lucideMessageCircle,
    }),
  ],
  template: `<hlm-icon [size]="size" [name]="name" [color]="color" />`,
})
export class IconComponent {
  @Input() size: 'sm' | 'base' | 'lg' | 'xl' = 'base';
  @Input() name!: string;
  @Input() color: string | undefined;
}
