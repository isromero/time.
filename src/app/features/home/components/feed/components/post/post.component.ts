import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@shared/models/post.interface';
import {
  HlmAvatarComponent,
  HlmAvatarImageDirective,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/ui-avatar-helm';
import { PostService } from './post.service';
import { Observable, catchError, combineLatest, of } from 'rxjs';

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
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  @Input() post!: Post;

  postService: PostService = inject(PostService);

  imageDownloadUrls$: Observable<(string | null)[]> = of([]);
  userInfo$: Observable<any> = of(null);

  ngOnInit(): void {
    this.imageDownloadUrls$ = this.getImageDownloadUrls();
    this.userInfo$ = this.postService.getUserInfo(this.post.authorId);
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
      const imageDownloadUrlObservables = this.post.imageUrls.map((imageRef) =>
        this.postService
          .getImageDownloadUrl(imageRef)
          .pipe(catchError(() => of(null)))
      );
      return combineLatest(imageDownloadUrlObservables);
    } else {
      return of([]);
    }
  }
}
