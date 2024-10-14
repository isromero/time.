import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { Observable, catchError, from } from 'rxjs';

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

  /* getUsername(authorId: string): Observable<string> {} */
}
