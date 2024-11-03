import { Injectable, inject } from '@angular/core';
import { User } from '@shared/models/user.interface';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  getUser(userId: string): Observable<User> {
    const userDoc = doc(this.firestore, 'users', userId);
    return from(getDoc(userDoc)).pipe(
      switchMap((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          if (userData['photoURL']) {
            const photoRef = ref(this.storage, userData['photoURL']);
            return from(getDownloadURL(photoRef)).pipe(
              map(
                (downloadUrl) =>
                  ({
                    uid: snapshot.id,
                    ...userData,
                    photoURL: downloadUrl,
                  } as User)
              )
            );
          }
          return from([
            {
              uid: snapshot.id,
              ...userData,
            } as User,
          ]);
        }
        throw new Error('User not found');
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
