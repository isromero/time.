import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@shared/models/post.interface';
import {
  HlmAvatarComponent,
  HlmAvatarImageDirective,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/ui-avatar-helm';
import { Observable, forkJoin, of } from 'rxjs';

import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { IconComponent } from '@shared/components/ui/icon.component';
import { AuthService } from '@core/auth/auth.service';
import { PostsService } from '@core/services/posts/posts.service';
import { PostService } from './post.service';
import { UsersService } from '@core/services/users/users.service';
import { User } from '@shared/models/user.interface';
import { CommentFormComponent } from '@features/comment-form/comment-form.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    RelativeTimePipe,
    IconComponent,
    CommentFormComponent,
  ],
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  @Input({ required: true }) post!: Post;

  usersService: UsersService = inject(UsersService);
  postsService: PostsService = inject(PostsService);
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);

  imageDownloadUrls$: Observable<(string | null)[]> = of([]);
  user$: Observable<User> = of();
  isLiked: boolean = false;
  isLikeLoading: boolean = true;
  commentDialogState = signal<'open' | 'closed'>('closed');

  ngOnInit(): void {
    this.postsService
      .isPostLiked(this.post, this.authService.currentUserSignal()!.uid)
      .subscribe({
        next: (liked) => {
          this.isLiked = liked;
        },
        error: (error) => {
          console.log('Error getting the like status:', error);
        },
        complete: () => {
          this.isLikeLoading = false;
        },
      });
    this.imageDownloadUrls$ = this.getImageDownloadUrls();
    this.user$ = this.usersService.getUser(this.post.authorId);
  }

  getGridClass(count: number): string {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  }

  getImageDownloadUrls(): Observable<(string | null)[]> {
    if (this.post?.imageUrls && this.post.imageUrls.length > 0) {
      return forkJoin(
        this.post.imageUrls.map((imageRef) =>
          this.postService.getImageDownloadUrl(imageRef)
        )
      );
    } else {
      return of([]);
    }
  }

  toggleLike(): void {
    if (this.isLikeLoading) return;
    this.isLikeLoading = true;

    const currentUserId = this.authService.currentUserSignal()!.uid;

    if (this.isLiked) {
      this.isLiked = false;
      this.post.likes--;
      this.postsService.unlikePost(this.post, currentUserId).subscribe({
        error: (error) => {
          console.log('Error unliking the post:', error);
          this.isLiked = true;
          this.post.likes++;
        },
        complete: () => {
          this.isLikeLoading = false;
        },
      });
    } else {
      this.isLiked = true;
      this.post.likes++;
      this.postsService.likePost(this.post, currentUserId).subscribe({
        error: (error) => {
          this.isLiked = false;
          this.post.likes--;
        },
        complete: () => {
          this.isLikeLoading = false;
        },
      });
    }
  }

  openCommentDialog(): void {
    this.commentDialogState.set('open');
  }

  closeCommentDialog(): void {
    this.commentDialogState.set('closed');
  }
}
