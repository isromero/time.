import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  Firestore,
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
  catchError,
  combineLatest,
  from,
  map,
  Observable,
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
      where('isComment', '==', false),
      orderBy('createdAt', 'desc')
    );

    // Create an observable that emits an array of Post objects, this is needed because
    // onSnapshot can't be used with from() directly, so we need to create a new observable
    // to handle a real time observable.
    return new Observable<Post[]>((observer) => {
      return onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Post;
        });

        observer.next(posts);
      });
    }).pipe(catchError((error) => throwError(() => error)));
  }

  getPost(postId: string, userId: string): Observable<Post> {
    const postDoc = doc(this.firestore, `users/${userId}/posts/${postId}`);

    return new Observable<Post>((observer) => {
      return onSnapshot(postDoc, (snapshot) => {
        observer.next({
          id: snapshot.id,
          ...snapshot.data(),
        } as Post);
      });
    }).pipe(catchError((error) => throwError(() => error)));
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
              })
            )
          );
        }
        return throwError(() => new Error('Already liked'));
      }),
      map(() => {}),
      catchError((error) => throwError(() => error))
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
        if (snapshot.docs.length > 0) {
          return from(updateDoc(postDoc, { likes: increment(-1) })).pipe(
            switchMap(() => deleteDoc(snapshot.docs[0].ref))
          );
        }
        return throwError(() => new Error('Not liked'));
      }),
      map(() => {}),
      catchError((error) => throwError(() => error))
    );
  }

  deletePost(post: Post): Observable<void> {
    const postDoc = doc(
      this.firestore,
      `users/${post.authorId}/posts/${post.id}`
    );

    return from(deleteDoc(postDoc)).pipe(
      catchError((error) => throwError(() => error))
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
      map((snapshot) => snapshot.docs.length > 0),
      catchError((error) => throwError(() => error))
    );
  }

  getPostComments(postId: string, userId: string): Observable<Post[]> {
    interface CommentRef {
      postId: string;
      authorId: string;
    }

    const postCommentsQuery = query(
      collection(this.firestore, `users/${userId}/posts/${postId}/comments`),
      orderBy('createdAt', 'desc')
    );

    return new Observable<CommentRef[]>((observer) => {
      return onSnapshot(postCommentsQuery, (snapshot) => {
        const commentRefs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            postId: data['postId'],
            authorId: data['authorId'],
          } as CommentRef;
        });
        observer.next(commentRefs);
      });
    }).pipe(
      switchMap((commentRefs) =>
        commentRefs.length === 0
          ? of([])
          : combineLatest(
              commentRefs.map((ref) => this.getPost(ref.postId, ref.authorId))
            )
      ),
      catchError((error) => throwError(() => error))
    );
  }
}
