import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { Observable, catchError, from, map } from 'rxjs';

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
        return from(Promise.reject(error));
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
        return from(Promise.reject(error));
      })
    );
  }
}
