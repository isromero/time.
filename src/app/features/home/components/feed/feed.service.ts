import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Post } from '@shared/models/post.interface';
import { Observable, catchError, from } from 'rxjs';
import { User } from '@shared/models/user.interface';
import { mergeAll, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private firestore: Firestore = inject(Firestore);

  getAllPosts(): Observable<Post[]> {
    const usersCollectionRef = collection(this.firestore, 'users');
    return collectionData(usersCollectionRef).pipe(
      map((users: User[]) => users.map((user) => this.getUserPosts(user.uid))),
      mergeAll(), // flatten the array of observables
      mergeAll(), // flatten the array of posts
      catchError((error) => {
        return from(Promise.reject(error));
      })
    );
  }

  private getUserPosts(userId: string): Observable<Post[]> {
    const userPostsCollectionRef = collection(
      this.firestore,
      `users/${userId}/posts`
    );
    return collectionData(userPostsCollectionRef) as Observable<Post[]>;
  }
}
