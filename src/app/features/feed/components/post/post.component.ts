import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@shared/models/post.interface';
import {
  HlmAvatarComponent,
  HlmAvatarImageDirective,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/ui-avatar-helm';
import { Observable, forkJoin, of, from, map } from 'rxjs';

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
import { ActivatedRoute, Router } from '@angular/router';

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
  // We need to use set to check if the post has changed, for updating the like status
  @Input() set post(value: Post) {
    if (
      this._post?.id !== value.id ||
      this._post?.authorId !== value.authorId
    ) {
      this._post = value;
      this.isLikedSignal.set(false);
      this.isProcessingSignal.set(false);
      this.checkLikeStatus();
    } else {
      this._post = value;
    }
  }
  get post(): Post {
    return this._post;
  }
  private _post!: Post;
  @Input() isDetail: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  usersService: UsersService = inject(UsersService);
  postsService: PostsService = inject(PostsService);
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);

  avatarDownloadUrl$: Observable<string | null> = of(null);
  imageDownloadUrls$: Observable<(string | null)[]> = of([]);
  user$: Observable<User> = of();
  isLikedSignal = signal<boolean>(false);
  private isProcessingSignal = signal<boolean>(false);
  commentDialogState = signal<'open' | 'closed'>('closed');

  readonly isDisabled = computed(() => this.isProcessingSignal());

  ngOnInit(): void {
    this.imageDownloadUrls$ = this.getImageDownloadUrls();
    this.user$ = this.usersService.getUser(this.post.authorId);
  }

  private checkLikeStatus(): void {
    this.postsService
      .isPostLiked(this.post, this.authService.currentUserSignal()!.uid)
      .subscribe({
        next: (liked) => {
          this.isLikedSignal.set(liked);
        },
        error: (error) => {
          console.log('Error getting the like status:', error);
        },
      });
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
    if (this.isProcessingSignal()) return;
    this.isProcessingSignal.set(true);

    const currentUserId = this.authService.currentUserSignal()!.uid;

    if (this.isLikedSignal()) {
      this.postsService.unlikePost(this.post, currentUserId).subscribe({
        next: () => {
          this.isLikedSignal.set(false);
        },
        error: (error) => {
          console.log('Error unliking the post:', error);
        },
        complete: () => {
          this.isProcessingSignal.set(false);
        },
      });
    } else {
      this.postsService.likePost(this.post, currentUserId).subscribe({
        next: () => {
          this.isLikedSignal.set(true);
        },
        error: (error) => {
          console.log('Error liking the post:', error);
        },
        complete: () => {
          this.isProcessingSignal.set(false);
        },
      });
    }
  }

  openCommentDialog(event: MouseEvent): void {
    (event as PointerEvent).stopPropagation();
    this.commentDialogState.set('open');
  }

  closeCommentDialog(): void {
    this.commentDialogState.set('closed');
  }

  navigateToPostDetail(event: Event): Observable<void> {
    if (event.target && (event.target as HTMLElement).closest('.actions')) {
      return of();
    }
    return from(
      this.router.navigate(['posts', this.post.authorId, this.post.id])
    ).pipe(map(() => {}));
  }
}
