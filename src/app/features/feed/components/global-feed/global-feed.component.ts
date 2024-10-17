import { Component, OnInit, inject } from '@angular/core';
import { PostComponent } from '@features/feed/components/post/post.component';
import { Post } from '@shared/models/post.interface';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostsService } from '@core/services/posts/posts.service';

@Component({
  selector: 'app-global-feed',
  standalone: true,
  imports: [PostComponent, CommonModule],
  templateUrl: './global-feed.component.html',
})
export class GlobalFeedComponent implements OnInit {
  private postsService: PostsService = inject(PostsService);

  posts$: Observable<Post[]> = of([]);

  ngOnInit(): void {
    this.posts$ = this.postsService.getPosts();
  }
}
