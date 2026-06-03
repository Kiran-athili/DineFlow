import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  forgotForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const request = {
      email: this.forgotForm.value.email ?? ''
    };

    this.isLoading = true;

    this.authService.forgotPassword(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Reset token has been sent to your registered email.';
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
        return parsedError.message || 'Failed to generate reset token';
      } catch {
        return error.error;
      }
    }

    return 'Failed to generate reset token';
  }
}