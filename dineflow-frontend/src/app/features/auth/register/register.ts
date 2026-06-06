import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  showPassword = false;
  showConfirmPassword = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[6-9][0-9]{9}$/)
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request = {
      fullName: this.registerForm.value.fullName ?? '',
      email: this.registerForm.value.email ?? '',
      phone: this.registerForm.value.phone ?? '',
      password: this.registerForm.value.password ?? ''
    };

    this.authService.registerCustomer(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful. Please login.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 0) {
          this.errorMessage = 'Backend not reachable. Please check if backend is running.';
          return;
        }

        if (error.error?.message) {
          this.errorMessage = error.error.message;
          return;
        }

        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}