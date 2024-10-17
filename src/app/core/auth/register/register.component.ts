import { Component, inject } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HlmInputDirective,
    ReactiveFormsModule,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

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
