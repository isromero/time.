import { Injectable, Signal, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { User } from '@shared/models/user.interface';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth: Auth = inject(Auth);
  user$: Observable<User | null> = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );

    // Convert the promise to an observable
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {}); // Do nothing on success

    // Convert the promise to an observable
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);

    // Convert the promise to an observable
    return from(promise);
  }
}
