import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  UserCredential,
  UserInfo,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { doc, setDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { User } from '@shared/models/user.interface';
import {
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  switchMap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  currentUser$: Observable<User | null> = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(
      switchMap((userCredential: UserCredential) => {
        const user = userCredential.user;
        return from(updateProfile(user, { displayName: username })).pipe(
          map(() => user)
        );
      }),
      switchMap((user: UserInfo) => {
        return from(
          this.firebaseAuth.currentUser?.reload() ?? Promise.resolve()
        ).pipe(map(() => user));
      }),
      mergeMap((user: UserInfo) => {
        const docRef = doc(this.firestore, 'users', user.uid);
        return from(
          setDoc(docRef, {
            uid: user.uid,
            photoURL: ref(this.storage, 'avatar-default.png').fullPath,
            bannerURL: '',
            email,
            username: user.displayName,
            createdAt: new Date(),
          } as User)
        ).pipe(map(() => {}));
      }),
      catchError((error) => throwError(() => error))
    );
  }

  login(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(
      map(() => {}),
      catchError((error) => throwError(() => error))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth)).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
