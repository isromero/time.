import { Component, OnInit, inject, signal } from '@angular/core';
import { GoBackComponent } from '@shared/components/go-back/go-back.component';
import { UsersService } from '@core/services/users/users.service';
import { AuthService } from '@core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/components/ui/icon.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { User } from '@shared/models/user.interface';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    GoBackComponent,
    IconComponent,
    HlmSkeletonComponent,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private usersService: UsersService = inject(UsersService);
  private authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);

  userProfile$: Observable<User> = of();
  currentUser = this.authService.currentUserSignal();
  userId = this.route.snapshot.paramMap.get('userId');
  isMyProfile: boolean = this.userId === this.currentUser?.uid;
  isProfileLoading = signal(true);

  ngOnInit(): void {
    if (this.userId) {
      this.loadProfile();
    }
  }

  private loadProfile(): void {
    this.userProfile$ = this.usersService
      .getUser(this.userId!)
      .pipe(tap(() => this.isProfileLoading.set(false)));
  }

  changePhotoURL(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files) return;

    this.isProfileLoading.set(true);
    this.usersService
      .changeImage(fileInput.files[0], this.currentUser!.uid, 'photoURL')
      .pipe(tap(() => this.loadProfile()))
      .subscribe();
  }

  changeBannerURL(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files) return;

    this.isProfileLoading.set(true);
    this.usersService
      .changeImage(fileInput.files[0], this.currentUser!.uid, 'bannerURL')
      .pipe(tap(() => this.loadProfile()))
      .subscribe();
  }
}
