import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading/loading.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [HlmSpinnerComponent],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  private loadingService: LoadingService = inject(LoadingService);
  readonly loading = this.loadingService.loading;
}
