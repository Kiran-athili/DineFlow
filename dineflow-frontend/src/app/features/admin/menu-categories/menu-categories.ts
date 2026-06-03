import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuCategory } from '../../../core/models/menu.model';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-menu-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-categories.html',
  styleUrl: './menu-categories.css'
})
export class MenuCategories implements OnInit {

  categories: MenuCategory[] = [];
  selectedCategoryId: number | null = null;

  imagePreview = '';
  uploadedImageUrl = '';

  isLoading = false;
  isUploading = false;
  errorMessage = '';
  successMessage = '';

  categoryForm;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private fileUploadService: FileUploadService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  getFileUrl(path: string): string {
    if (!path) {
      return '';
    }

    if (path.startsWith('http')) {
      return path;
    }

    return `http://localhost:8080${path}`;
  }

  loadCategories(): void {
    this.isLoading = true;

    this.menuService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load categories');
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.imagePreview = URL.createObjectURL(file);
    this.isUploading = true;

    this.fileUploadService.uploadFile(file, 'categories').subscribe({
      next: (url) => {
        this.uploadedImageUrl = url;
        this.isUploading = false;
        this.showSuccess('Image uploaded successfully');
      },
      error: (error) => {
        this.isUploading = false;
        this.showError(error.error?.message || 'Image upload failed');
      }
    });
  }

  saveCategory(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const request = {
      categoryName: this.categoryForm.value.categoryName ?? '',
      description: this.categoryForm.value.description ?? '',
      imageUrl: this.uploadedImageUrl
    };

    if (this.selectedCategoryId) {
      this.menuService.updateCategory(this.selectedCategoryId, request).subscribe({
        next: () => {
          this.showSuccess('Category updated successfully');
          this.resetForm();
          this.loadCategories();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to update category');
        }
      });
    } else {
      this.menuService.createCategory(request).subscribe({
        next: () => {
          this.showSuccess('Category created successfully');
          this.resetForm();
          this.loadCategories();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to create category');
        }
      });
    }
  }

  editCategory(category: MenuCategory): void {
    this.selectedCategoryId = category.categoryId;
    this.uploadedImageUrl = category.imageUrl;
    this.imagePreview = this.getFileUrl(category.imageUrl);

    this.categoryForm.patchValue({
      categoryName: category.categoryName,
      description: category.description
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateCategoryStatus(category: MenuCategory): void {
    const newStatus = !category.isActive;

    const confirmMessage = newStatus
      ? 'Are you sure you want to activate this category?'
      : 'Are you sure you want to deactivate this category?';

    if (!confirm(confirmMessage)) {
      return;
    }

    this.menuService.updateCategoryStatus(category.categoryId, newStatus).subscribe({
      next: (message) => {
        this.showSuccess(message);
        this.loadCategories();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to update category status');
      }
    });
  }

  resetForm(): void {
    this.selectedCategoryId = null;
    this.uploadedImageUrl = '';
    this.imagePreview = '';

    this.categoryForm.reset({
      categoryName: '',
      description: ''
    });
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