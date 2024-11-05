import { Component, inject } from '@angular/core';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '@shared/components/ui/icon.component';
import { FormsModule } from '@angular/forms';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '@spartan-ng/ui-tooltip-helm';
import { PostFormService } from './post-form.service';
import { UsersService } from '@core/services/users/users.service';
import { Observable, of } from 'rxjs';
import { User } from '@shared/models/user.interface';
import { AuthService } from '@core/auth/auth.service';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
    HlmInputDirective,
    HlmButtonDirective,
    IconComponent,
    FormsModule,
    BrnTooltipContentDirective,
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    HlmSkeletonComponent,
  ],
  templateUrl: './post-form.component.html',
})
export class PostFormComponent {
  postFormService: PostFormService = inject(PostFormService);
  authService: AuthService = inject(AuthService);
  usersService: UsersService = inject(UsersService);

  user$ = this.usersService.user$;

  postContent: string = '';
  uploadedImages: { file: File; url: string }[] = [];
  errorMaxImages: boolean = false;
  isSubmitting: boolean = false;

  createPost() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.postFormService
      .createPost(this.postContent, this.uploadedImages)
      .subscribe({
        next: () => {
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating post: ', error);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  onImageUpload(event: Event) {
    if (this.uploadedImages.length >= 4) {
      this.errorMaxImages = true;
      return;
    }
    this.errorMaxImages = false;

    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.uploadedImages = [
        ...this.uploadedImages,
        ...Array.from(fileInput.files).map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ];
    }
  }

  removeImage(index: number) {
    this.errorMaxImages = false;
    URL.revokeObjectURL(this.uploadedImages[index].url);
    this.uploadedImages.splice(index, 1);
  }

  private resetForm() {
    this.postContent = '';
    this.cleanupImages();
    this.uploadedImages = [];
  }

  private cleanupImages() {
    for (const image of this.uploadedImages) {
      URL.revokeObjectURL(image.url);
    }
  }

  ngOnDestroy() {
    this.cleanupImages();
  }
}
