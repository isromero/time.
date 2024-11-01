import { Component, inject, OnInit } from '@angular/core';
import { PostComponent } from '@features/feed/components/post/post.component';
import { map, Observable, of } from 'rxjs';
import { IconComponent } from '@shared/components/ui/icon.component';
import { Post } from '@shared/models/post.interface';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostComponent, IconComponent, CommonModule],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent extends PostComponent implements OnInit {
  private location: Location = inject(Location);

  postComments$: Observable<Post[]> = of();

  override ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => {
          return {
            postId: params['postId'],
            authorId: params['authorId'],
          };
        })
      )
      .subscribe(({ postId, authorId }) => {
        this.postsService.getPost(postId, authorId).subscribe((post) => {
          this.post = post;
        });

        this.postComments$ = this.postsService.getPostComments(
          postId,
          authorId
        );
      });
  }

  navigateBack(): void {
    this.location.back();
  }
}
