import { Component, inject, OnInit } from '@angular/core';
import { PostComponent } from '@features/feed/components/post/post.component';
import { map, Observable, of, switchMap } from 'rxjs';
import { Post } from '@shared/models/post.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '@core/services/posts/posts.service';
import { GoBackComponent } from '@shared/components/go-back/go-back.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostComponent, CommonModule, GoBackComponent],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private postsService: PostsService = inject(PostsService);

  post$: Observable<Post> = of();
  postComments$: Observable<Post[]> = of();

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      map((params) => ({
        postId: params['postId'],
        authorId: params['authorId'],
      })),
      switchMap(({ postId, authorId }) =>
        this.postsService.getPost(postId, authorId)
      )
    );

    this.postComments$ = this.route.params.pipe(
      map((params) => ({
        postId: params['postId'],
        authorId: params['authorId'],
      })),
      switchMap(({ postId, authorId }) =>
        this.postsService.getPostComments(postId, authorId)
      )
    );
  }
}
