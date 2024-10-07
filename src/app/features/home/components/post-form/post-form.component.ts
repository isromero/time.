import { Component } from '@angular/core';
import { HlmAvatarComponent } from '@spartan-ng/ui-avatar-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '@shared/components/ui/icon.component';
import { FormsModule } from '@angular/forms';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    HlmAvatarComponent,
    HlmInputDirective,
    HlmButtonDirective,
    IconComponent,
    FormsModule,
    BrnTooltipContentDirective,
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  postContent: string = '';
}
