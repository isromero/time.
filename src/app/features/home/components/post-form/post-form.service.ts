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
        authorId: currentUser.uid,
        postContent: postContent,
        imageUrls: [],
        createdAt: new Date(),
      };

      const uploadImages$ =
        images.length > 0
          ? this.uploadImages(newPost, images) // Subir imágenes si existen
          : of(undefined); // Si no hay imágenes, emitir un observable vacío

      // Nos aseguramos de que las imágenes se suben correctamente antes de agregar el post
      return uploadImages$.pipe(
        concatMap(() => from(addDoc(userPostsRef, newPost))),
        map(() => {}),
        catchError((error) => {
          return from(Promise.reject(error));
        })
      );
    } else {
      return from(Promise.reject(new Error('No user is currently logged in.')));
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
        return from(Promise.reject(error));
      })
    );
  }
}
