import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
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
  throwError,
} from 'rxjs';
import { Post } from '@shared/models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostFormService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private authService: AuthService = inject(AuthService);

  createPost(
    postContent: string,
    images: { file: File; url: string }[] = []
  ): Observable<void> {
    if (!postContent && images.length === 0) {
      return from(
        throwError(() => new Error('Post content or images must be provided.'))
      );
    }

    const currentUser = this.authService.currentUserSignal();
    if (currentUser) {
      const userPostsRef = collection(
        this.firestore,
        'users',
        currentUser.uid,
        'posts'
      );

      const newPost: Post = {
        authorId: currentUser.uid,
        postContent: postContent,
        imageUrls: [],
        likes: 0,
        createdAt: new Date(),
      };

      const uploadImages$ =
        images.length > 0
          ? this.uploadImages(newPost, images) // Upload images if there are any
          : of(undefined); // If there are no images, return an observable that emits undefined (void)

      // Upload images first, then add the post to the user's posts collection with the concatMap operator
      return uploadImages$.pipe(
        concatMap(() => from(addDoc(userPostsRef, newPost))),
        map(() => {}),
        catchError((error) => {
          return throwError(() => error);
        })
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
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
