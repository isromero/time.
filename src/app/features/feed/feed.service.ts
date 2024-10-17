import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Post } from '@shared/models/post.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private firestore: Firestore = inject(Firestore);

  getAllPosts(): Observable<Post[]> {
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
}
