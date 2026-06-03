import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  showPassword = false;
  isLoading = false;

  errorMessage = '';
  successMessage = '';

  resetForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      resetToken: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const request = {
      resetToken: this.resetForm.value.resetToken ?? '',
      newPassword: this.resetForm.value.newPassword ?? ''
    };

    this.isLoading = true;

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
  this.isLoading = false;
  this.errorMessage = this.extractErrorMessage(error);
}
    });
  }
  private extractErrorMessage(error: any): string {
  if (error.error?.message) {
    return error.error.message;
  }

  if (typeof error.error === 'string') {
    try {
      const parsedError = JSON.parse(error.error);
      return parsedError.message || 'Failed to reset password';
    } catch {
      return error.error;
    }
  }

  return 'Failed to reset password';
}
}