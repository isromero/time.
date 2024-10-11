import { Component, inject } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = '';

  onSubmit() {
    if (this.loginForm.valid) {
      const rawForm = this.loginForm.getRawValue();
      this.authService.login(rawForm.email, rawForm.password).subscribe({
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
