import { Injectable, inject } from '@angular/core';
import { User } from '@shared/models/user.interface';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: Firestore = inject(Firestore);

  getUser(userId: string): Observable<User> {
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
      catchError((error) => throwError(() => error))
    );
  }
}
