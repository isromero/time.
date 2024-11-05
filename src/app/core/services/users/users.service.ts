import { Injectable, inject } from '@angular/core';
import { User } from '@shared/models/user.interface';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  catchError,
  concatMap,
  from,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  private userSubject = new BehaviorSubject({} as User);
  user$: Observable<User> = this.userSubject.asObservable();

  loadUser(userId: string): void {
    this.getUser(userId).subscribe((user) => this.userSubject.next(user));
  }

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

  editImage(image: File, userId: string): Observable<void> {
    const path = `users/${userId}/${image.name}_${Date.now()}`;
    const storageRef = ref(this.storage, path);
    return from(uploadBytes(storageRef, image)).pipe(
      concatMap(() => this.changeUserPhotoURL(path, userId)),
      concatMap(() => this.getUser(userId)),
      map((user) => this.userSubject.next(user)),
      catchError((error) => throwError(() => error))
    );
  }

  private changeUserPhotoURL(
    photoURL: string,
    userId: string
  ): Observable<void> {
    const userDoc = doc(this.firestore, 'users', userId);
    return from(
      updateDoc(userDoc, {
        photoURL,
      })
    );
  }
}
