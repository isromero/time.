import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { IconComponent } from '@shared/components/ui/icon.component';

@Component({
  selector: 'app-go-back',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './go-back.component.html',
})
export class GoBackComponent {
  private location: Location = inject(Location);

  navigateBack(): void {
    this.location.back();
  }
}
