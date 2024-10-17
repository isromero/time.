import { DocumentReference } from '@angular/fire/firestore';

export interface LikedPost {
  postRef: DocumentReference;
  createdAt: Date;
}
