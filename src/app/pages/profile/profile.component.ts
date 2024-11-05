import { Component, inject } from '@angular/core';
import { GoBackComponent } from '@shared/components/go-back/go-back.component';
import { UsersService } from '@core/services/users/users.service';
import { AuthService } from '@core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/components/ui/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, GoBackComponent, IconComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private usersService: UsersService = inject(UsersService);
  private authService: AuthService = inject(AuthService);

  user$ = this.usersService.user$;
  currentUser = this.authService.currentUserSignal();

  onImageUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files) return;

    this.usersService
      .editImage(fileInput.files[0], this.currentUser!.uid)
      .subscribe();
  }
}
