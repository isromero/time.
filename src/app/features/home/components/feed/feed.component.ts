import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { PostComponent } from './components/post/post.component';
import { FeedService } from './feed.service';
import { Post } from '@shared/models/post.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  private feedService: FeedService = inject(FeedService);
  private postsSubscription!: Subscription;

  posts: Post[] = [];

  ngOnInit(): void {
    this.postsSubscription = this.feedService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error getting all posts:', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
