import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '@shared/models/user.interface';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth: Auth = inject(Auth);
  user$: Observable<User | null> = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  firestore = getFirestore();

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    const registerProcess = async (): Promise<void> => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.firebaseAuth,
          email,
          password
        );

        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        // Reload to make sure user data exists
        this.firebaseAuth.currentUser?.reload();

        // Save the new user to Firestore
        const docRef = doc(this.firestore, 'users', user.uid);
        setDoc(docRef, {
          uid: user.uid,
          email,
          username: user.displayName,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Convert the promise to an observable
    return from(registerProcess());
  }

  login(email: string, password: string): Observable<void> {
    const loginProcess = async (): Promise<void> => {
      try {
        await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Convert the promise to an observable
    return from(loginProcess());
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);

    // Convert the promise to an observable
    return from(promise);
  }
}
