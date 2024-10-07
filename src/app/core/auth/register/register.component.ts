import { Component, inject } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HlmInputDirective, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder: FormBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }
}
