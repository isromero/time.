import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
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
import { CommentFormService } from './comment-form.service';
import { Post } from '@shared/models/post.interface';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { Observable, of } from 'rxjs';
import { User } from '@shared/models/user.interface';
import { UsersService } from '@core/services/users/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-form',
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
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  @Output() closeDialog = new EventEmitter<void>();

  commentFormService: CommentFormService = inject(CommentFormService);
  usersService: UsersService = inject(UsersService);

  user$: Observable<User> = of();

  commentContent: string = '';
  uploadedImages: { file: File; url: string }[] = [];
  errorMaxImages: boolean = false;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.user$ = this.usersService.getUser(this.post.authorId);
  }

  onCloseClick() {
    this.closeDialog.emit();
  }

  comment() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.commentFormService
      .createComment(this.post, this.commentContent, this.uploadedImages)
      .subscribe({
        next: () => {
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating the comment: ', error);
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
    this.commentContent = '';
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
