import { Component, inject } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HlmInputDirective, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  registerForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = '';

  onSubmit() {
    if (this.registerForm.valid) {
      const rawForm = this.registerForm.getRawValue();
      this.authService
        .register(rawForm.username, rawForm.email, rawForm.password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            this.errorMessage = error.code;
          },
        });
    }
  }
}
