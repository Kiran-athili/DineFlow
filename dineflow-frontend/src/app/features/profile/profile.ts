import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthResponse } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profile?: AuthResponse;

  isLoadingProfile = false;
  isUpdatingProfile = false;
  isChangingPassword = false;

  showCurrentPassword = false;
  showNewPassword = false;

  errorMessage = '';
  successMessage = '';

  profileForm;
  passwordForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;

    this.authService.getProfile().subscribe({
      next: (response) => {
        this.profile = response;

        this.profileForm.patchValue({
          fullName: response.fullName,
          phone: ''
        });

        this.isLoadingProfile = false;
      },
      error: (error) => {
        this.isLoadingProfile = false;
        this.showError(error.error?.message || 'Failed to load profile');
      }
    });
  }

  updateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const request = {
      fullName: this.profileForm.value.fullName ?? '',
      phone: this.profileForm.value.phone ?? ''
    };

    this.isUpdatingProfile = true;

    this.authService.updateProfile(request).subscribe({
      next: (response) => {
        this.isUpdatingProfile = false;
        this.profile = response;

        const currentUser = this.tokenStorage.getUser();

        if (currentUser) {
          localStorage.setItem('dineflow_user', JSON.stringify({
            ...currentUser,
            fullName: response.fullName
          }));
        }

        this.showSuccess('Profile updated successfully');
      },
      error: (error) => {
        this.isUpdatingProfile = false;
        this.showError(error.error?.message || 'Failed to update profile');
      }
    });
  }

  changePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const request = {
      currentPassword: this.passwordForm.value.currentPassword ?? '',
      newPassword: this.passwordForm.value.newPassword ?? ''
    };

    this.isChangingPassword = true;

    this.authService.changePassword(request).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.showSuccess('Password changed successfully');
      },
      error: (error) => {
        this.isChangingPassword = false;
        this.showError(error.error?.message || error.error || 'Failed to change password');
      }
    });
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.clearMessagesAfterDelay();
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.clearMessagesAfterDelay();
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}