import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Post } from '@shared/models/post.interface';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private firestore: Firestore = inject(Firestore);

  getPosts(): Observable<Post[]> {
    const postsQuery = query(
      collectionGroup(this.firestore, 'posts'),
      orderBy('createdAt', 'desc')
    );

    // Create an observable that emits an array of Post objects, this is needed because
    // onSnapshot can't be used with from() directly, so we need to create a new observable
    // to handle a real time observable.
    return new Observable<Post[]>((observer) => {
      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Post;
        });

        observer.next(posts);
      });

      return unsubscribe;
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  likePost(post: Post, userId: string): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}/posts/${post.id}`
    );
    const userLikedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    return from(
      getDocs(query(userLikedPostsCollection, where('postId', '==', post.id)))
    ).pipe(
      switchMap((snapshot) => {
        if (snapshot.docs.length === 0) {
          return from(updateDoc(postDoc, { likes: increment(1) })).pipe(
            switchMap(() =>
              addDoc(userLikedPostsCollection, {
                postId: post.id,
                createdAt: new Date(),
              })
            )
          );
        } else {
          return of(undefined);
        }
      }),
      map(() => {}),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  unlikePost(post: Post, userId: string): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}/posts/${post.id}`
    );
    const likedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    return from(
      getDocs(query(likedPostsCollection, where('postId', '==', post.id)))
    ).pipe(
      switchMap((snapshot) => {
        if (snapshot.docs.length) {
          return deleteDoc(snapshot.docs[0].ref);
        } else {
          return of(undefined);
        }
      }),
      switchMap(() => {
        return from(
          updateDoc(postDoc, {
            likes: increment(-1),
          })
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deletePost(post: Post): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}/posts/${post.id}`
    );

    return from(deleteDoc(postDoc)).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  isPostLiked(post: Post, userId: string): Observable<boolean> {
    const likedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    return from(
      getDocs(query(likedPostsCollection, where('postId', '==', post.id)))
    ).pipe(
      map((snapshot) => {
        return snapshot.docs.length > 0;
      })
    );
  }
}
