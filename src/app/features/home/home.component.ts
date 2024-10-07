import { Component } from '@angular/core';
import { PostFormComponent } from './components/post-form/post-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
