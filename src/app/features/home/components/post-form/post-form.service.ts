import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { AuthService } from '@core/auth/auth.service';
import { Observable, catchError, from } from 'rxjs';
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
        Promise.reject(new Error('Post content or images are required.'))
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
        postContent: postContent,
        imageUrls: [],
        createdAt: new Date(),
      };

      if (images.length > 0) {
        this.uploadImages(newPost, images);
      }

      return from(addDoc(userPostsRef, newPost).then(() => {})).pipe(
        catchError((error) => {
          return Promise.reject(error);
        })
      );
    } else {
      return from(Promise.reject(new Error('No user is currently logged in.')));
    }
  }

  private uploadImages(
    newPost: Post,
    images: { file: File; url: string }[]
  ): void {
    for (const image of images) {
      const storageRef = ref(
        this.storage,
        `posts/${image.file.name}_${Date.now()}`
      );
      newPost.imageUrls?.push(storageRef.fullPath); // Get the full path for saving in the database

      uploadBytesResumable(storageRef, image.file).then(() => {});
    }
  }
}
