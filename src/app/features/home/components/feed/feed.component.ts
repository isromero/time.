import { Component, OnInit, inject } from '@angular/core';
import { PostComponent } from './components/post/post.component';
import { FeedService } from './feed.service';
import { Post } from '@shared/models/post.interface';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  feedService: FeedService = inject(FeedService);

  posts: Post[] = [];

  ngOnInit(): void {
    this.feedService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error getting all posts:', error);
      },
    });
  }
}
