import { Injectable, inject } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { Observable, catchError, from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private storage: Storage = inject(Storage);

  getImageDownloadUrl(imageRef: string): Observable<string> {
    const postImageRef = ref(this.storage, imageRef);
    return from(getDownloadURL(postImageRef)).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
