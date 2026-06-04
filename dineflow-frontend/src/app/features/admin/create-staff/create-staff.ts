import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaffResponse } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-staff',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-staff.html',
  styleUrl: './create-staff.css'
})
export class CreateStaff implements OnInit {

  showPassword = false;
  isLoading = false;
  isLoadingStaff = false;

  errorMessage = '';
  successMessage = '';

  staffUsers: StaffResponse[] = [];
  filteredStaffUsers: StaffResponse[] = [];

  selectedRole = 'ALL';

  roles = [
    'ADMIN',
    'KITCHEN'
  ];

  filterRoles = [
    'ALL',
    'ADMIN',
    'KITCHEN'
  ];

  staffForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.staffForm = this.fb.group({
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

      roleName: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoadingStaff = true;

    this.authService.getAllStaff().subscribe({
      next: (response) => {
        this.staffUsers = response;
        this.applyRoleFilter(this.selectedRole);
        this.isLoadingStaff = false;
      },
      error: (error) => {
        this.isLoadingStaff = false;
        this.showError(error.error?.message || 'Failed to load staff users');
      }
    });
  }

  applyRoleFilter(role: string): void {
    this.selectedRole = role;

    if (role === 'ALL') {
      this.filteredStaffUsers = this.staffUsers;
      return;
    }

    this.filteredStaffUsers = this.staffUsers.filter(user => user.roleName === role);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  createStaff(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    const request = {
      fullName: this.staffForm.value.fullName ?? '',
      email: this.staffForm.value.email ?? '',
      phone: this.staffForm.value.phone ?? '',
      password: this.staffForm.value.password ?? '',
      roleName: this.staffForm.value.roleName ?? ''
    };

    this.isLoading = true;

    this.authService.createStaff(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess('Staff user created successfully');
        this.resetForm();
        this.loadStaff();
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to create staff user');
      }
    });
  }

  updateStaffStatus(user: StaffResponse, status: string): void {
    if (user.staffStatus === status) {
      return;
    }

    this.authService.updateStaffStatus(user.userId, status).subscribe({
      next: () => {
        this.showSuccess('Staff status updated successfully');
        this.loadStaff();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to update staff status');
      }
    });
  }

  resetForm(): void {
    this.staffForm.reset({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      roleName: ''
    });

    this.showPassword = false;
  }

  getStaffStatusClass(status?: string): string {
    if (status === 'ACTIVE') {
      return 'bg-success';
    }

    if (status === 'ON_LEAVE') {
      return 'bg-warning text-dark';
    }

    if (status === 'EXITED') {
      return 'bg-dark';
    }

    return 'bg-danger';
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