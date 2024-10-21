import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { AuthService } from '@core/auth/auth.service';
import {
  Observable,
  catchError,
  concatMap,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Post } from '@shared/models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentFormService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private authService: AuthService = inject(AuthService);

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
      const userPostDoc = doc(
        this.firestore,
        `users/${currentUser.uid}/posts/${post.id}`
      );
      const userPostsRef = collection(
        this.firestore,
        `users/${currentUser.uid}/posts/${post.id}/comments`
      );

      const newPost: Post = {
        authorId: currentUser.uid,
        postContent: commentContent,
        imageUrls: [],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
      };

      const uploadImages$ =
        images.length > 0 ? this.uploadImages(newPost, images) : of(undefined);

      return uploadImages$.pipe(
        concatMap(() => from(addDoc(userPostsRef, newPost))),
        switchMap(() =>
          from(updateDoc(userPostDoc, { comments: increment(1) }))
        ),
        catchError((error) => throwError(() => error))
      );
    } else {
      return from(throwError(() => new Error('User is not authenticated.')));
    }
  }

  private uploadImages(
    newPost: Post,
    images: { file: File; url: string }[]
  ): Observable<void> {
    const uploadTasks = images.map((image) => {
      const storageRef = ref(
        this.storage,
        `posts/${image.file.name}_${Date.now()}`
      );
      newPost.imageUrls?.push(storageRef.fullPath);

      return from(uploadBytes(storageRef, image.file));
    });

    return forkJoin(uploadTasks).pipe(
      map(() => {}),
      catchError((error) => throwError(() => error))
    );
  }
}
