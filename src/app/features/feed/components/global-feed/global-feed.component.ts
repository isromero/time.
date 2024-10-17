import { Component, OnInit, inject } from '@angular/core';
import { PostComponent } from '@features/feed/components/post/post.component';
import { FeedService } from '@features/feed/feed.service';
import { Post } from '@shared/models/post.interface';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-feed',
  standalone: true,
  imports: [PostComponent, CommonModule],
  templateUrl: './global-feed.component.html',
})
export class GlobalFeedComponent implements OnInit {
  private feedService: FeedService = inject(FeedService);

  posts$: Observable<Post[]> = of([]);

  ngOnInit(): void {
    this.posts$ = this.feedService.getAllPosts();
  }
}
