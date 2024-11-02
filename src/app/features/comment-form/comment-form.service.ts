import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '@core/auth/auth.service';
import { Observable, catchError, concatMap, from, of, throwError } from 'rxjs';
import { Post } from '@shared/models/post.interface';
import { PostFormService } from '@features/post-form/post-form.service';

@Injectable({
  providedIn: 'root',
})
export class CommentFormService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private postFormService: PostFormService = inject(PostFormService);

  createComment(
    post: Post,
    commentContent: string,
    images: { file: File; url: string }[] = []
  ): Observable<void> {
    if (!commentContent && images.length === 0) {
      return from(
        throwError(() => new Error('Post content or images must be provided.'))
      );
    }

    const currentUser = this.authService.currentUserSignal();
    if (currentUser) {
      // Reference to the original post
      const originalPostDoc = doc(
        this.firestore,
        `users/${post.authorId}/posts/${post.id}`
      );

      // Reference for creating a new post that is a comment
      const userPostsRef = collection(
        this.firestore,
        `users/${currentUser.uid}/posts`
      );

      const newPost: Post = {
        authorId: currentUser.uid,
        postContent: commentContent,
        imageUrls: [],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        isComment: true,
      };

      const uploadImages$ =
        images.length > 0
          ? this.postFormService.uploadImages(newPost, images)
          : of(undefined);

      return uploadImages$.pipe(
        // Create the new post
        concatMap(() => from(addDoc(userPostsRef, newPost))),
        // Create the comment taking the reference of the new post saving it in the original post and incrementing the comments count
        concatMap((postRef) => {
          const commentsRef = collection(
            this.firestore,
            `users/${post.authorId}/posts/${post.id}/comments`
          );

          return from(
            addDoc(commentsRef, {
              // Add the comment to the original post
              postId: postRef.id,
              authorId: currentUser.uid,
              createdAt: new Date(),
            })
          );
        }),
        concatMap(() =>
          from(updateDoc(originalPostDoc, { comments: increment(1) }))
        ),
        catchError((error) => throwError(() => error))
      );
    } else {
      return from(throwError(() => new Error('User is not authenticated.')));
    }
  }
}
