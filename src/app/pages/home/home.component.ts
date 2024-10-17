import { Component } from '@angular/core';
import { PostFormComponent } from '@features/post-form/post-form.component';
import { GlobalFeedComponent } from '@features/feed/components/global-feed/global-feed.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostFormComponent, GlobalFeedComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
