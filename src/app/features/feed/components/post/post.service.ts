import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { LikedPost } from '@shared/models/likedPost.interface';
import { Post } from '@shared/models/post.interface';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  storage: Storage = inject(Storage);
  firestore: Firestore = inject(Firestore);

  getImageDownloadUrl(imageRef: string): Observable<string> {
    const postImageRef = ref(this.storage, imageRef);
    return from(getDownloadURL(postImageRef)).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getUserInfo(userId: string): Observable<User> {
    const userDoc = doc(this.firestore, 'users', userId);
    return from(getDoc(userDoc)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return {
            uid: snapshot.id,
            ...snapshot.data(),
          } as User;
        } else {
          throw new Error('User not found');
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  likePost(post: Post, userId: string): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}`,
      `posts/${post.id}`
    );
    const userLikedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    return from(
      updateDoc(postDoc, {
        likeCount: increment(1),
      })
    ).pipe(
      switchMap(() =>
        addDoc(userLikedPostsCollection, {
          postRef: postDoc,
          createdAt: new Date(),
        })
      ),
      map(() => {})
    );
  }

  unlikePost(post: Post, userId: string): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}`,
      `posts/${post.id}`
    );
    const userLikedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    // TODO: Gestionar el borrado del documento de likedPosts
    /* const query = query(
      userLikedPostsCollection,
      where('postRef', '==', postDoc.id)
    ); */

    return from(
      updateDoc(postDoc, {
        likeCount: increment(-1),
      })
    ).pipe(
      switchMap(() =>
        addDoc(userLikedPostsCollection, {
          postRef: postDoc,
          createdAt: new Date(),
        })
      ),
      map(() => {})
    );
  }
}
