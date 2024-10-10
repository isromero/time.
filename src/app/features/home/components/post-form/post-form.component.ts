import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { Component, inject } from '@angular/core';
import { HlmAvatarComponent } from '@spartan-ng/ui-avatar-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '@shared/components/ui/icon.component';
import { FormsModule } from '@angular/forms';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '@spartan-ng/ui-tooltip-helm';
import { User } from '@shared/models/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    HlmAvatarComponent,
    HlmInputDirective,
    HlmButtonDirective,
    IconComponent,
    FormsModule,
    BrnTooltipContentDirective,
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  private firestore: Firestore = inject(Firestore);
  users$: Observable<User>;

  postContent: string = '';

  constructor() {
    // get a reference to the user-profile collection
    const userProfileCollection = collection(this.firestore, 'users');

    // get documents (data) from the collection using collectionData
    this.users$ = collectionData(userProfileCollection) as Observable<User>;

    console.log(
      this.users$.subscribe((users) => {
        console.log(users);
      })
    );
  }
}
