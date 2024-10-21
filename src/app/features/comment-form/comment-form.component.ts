import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
import { CommentFormService } from './comment-form.service';
import { Post } from '@shared/models/post.interface';

@Component({
  selector: 'app-comment-form',
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
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  @Input({ required: true }) post!: Post;
  @Output() closeDialog = new EventEmitter<void>();

  commentFormService: CommentFormService = inject(CommentFormService);

  commentContent: string = '';
  uploadedImages: { file: File; url: string }[] = [];
  errorMaxImages: boolean = false;
  isSubmitting: boolean = false;

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
