import { Injectable, inject } from '@angular/core';
import { User } from '@shared/models/user.interface';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  concatMap,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  deleteObject,
  getDownloadURL,
  listAll,
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
          const photoURL$ = userData['photoURL']
            ? from(getDownloadURL(ref(this.storage, userData['photoURL'])))
            : of('');

          const bannerURL$ = userData['bannerURL']
            ? from(getDownloadURL(ref(this.storage, userData['bannerURL'])))
            : of('');

          return combineLatest([photoURL$, bannerURL$]).pipe(
            map(
              ([photoURL, bannerURL]) =>
                ({
                  uid: snapshot.id,
                  ...userData,
                  photoURL,
                  bannerURL,
                } as User)
            )
          );
        }
        throw new Error('User not found');
      }),
      catchError((error) => throwError(() => error))
    );
  }

  changeImage(
    image: File,
    userId: string,
    typeImage: string
  ): Observable<void> {
    const path = `users/${userId}/${typeImage}/${image.name}_${Date.now()}`;
    const storageRef = ref(this.storage, path);
    const folderRef = ref(this.storage, `users/${userId}/${typeImage}`);
    return from(listAll(folderRef)).pipe(
      concatMap(result => {
        // Delete all files in the folder before uploading the new one for optimization
        const deletePromises = result.items.map(item => deleteObject(item));
        return deletePromises.length > 0 ? 
          from(Promise.all(deletePromises)) : 
          of(null);
      }),
      concatMap(() => uploadBytes(storageRef, image)),
      concatMap(() => {
        const userDoc = doc(this.firestore, 'users', userId);
        return from(
          updateDoc(userDoc, {
            [typeImage]: path,
          })
        );
      }),
      concatMap(() => this.getUser(userId)),
      map((user) => this.userSubject.next(user)),
      catchError((error) => throwError(() => error))
    );
  }
}
