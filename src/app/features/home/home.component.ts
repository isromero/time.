import { Component } from '@angular/core';
import { PostFormComponent } from './components/post-form/post-form.component';
import { FeedComponent } from './components/feed/feed.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostFormComponent, FeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
