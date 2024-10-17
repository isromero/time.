import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
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
      updateDoc(postDoc, {
        likes: increment(1),
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
      `users/${post.authorId}/posts/${post.id}`
    );
    const likedPostsCollection = collection(
      this.firestore,
      `users/${userId}/likedPosts`
    );

    // TODO: Implement the deleteDoc successfully, query have to be changed
    return from(
      updateDoc(postDoc, {
        likes: increment(-1),
      })
    ).pipe(
      switchMap(() =>
        query(likedPostsCollection, where('postRef', '==', postDoc))
      ),
      switchMap((querySnapshot) => {
        const likedPostDoc = querySnapshot.docs[0];

        if (likedPostDoc) {
          return deleteDoc(likedPostDoc.ref);
        } else {
          return of(null);
        }
      }),
      map(() => {})
    );
  }
}
