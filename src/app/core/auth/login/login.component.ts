import { Component, inject } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmInputDirective, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formBuilder: FormBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
