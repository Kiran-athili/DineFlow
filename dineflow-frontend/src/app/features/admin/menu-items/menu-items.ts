import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuCategory, MenuItem } from '../../../core/models/menu.model';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-menu-items',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.css'
})
export class MenuItems implements OnInit {

  categories: MenuCategory[] = [];
  items: MenuItem[] = [];

  selectedItemId: number | null = null;

  uploadedImageUrl = '';
  uploadedVideoUrl = '';
  imagePreview = '';
  videoPreview = '';

  isLoading = false;
  isUploadingImage = false;
  isUploadingVideo = false;

  errorMessage = '';
  successMessage = '';

  itemForm;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private fileUploadService: FileUploadService
  ) {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadItems();
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
    this.menuService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.filter(category => category.isActive);
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to load categories');
      }
    });
  }

  loadItems(): void {
    this.isLoading = true;

    this.menuService.getAllItems().subscribe({
      next: (response) => {
        this.items = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load menu items');
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
    this.isUploadingImage = true;

    this.fileUploadService.uploadFile(file, 'menu').subscribe({
      next: (url) => {
        this.uploadedImageUrl = url;
        this.isUploadingImage = false;
        this.showSuccess('Image uploaded successfully');
      },
      error: (error) => {
        this.isUploadingImage = false;
        this.showError(error.error?.message || 'Image upload failed');
      }
    });
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.videoPreview = URL.createObjectURL(file);
    this.isUploadingVideo = true;

    this.fileUploadService.uploadFile(file, 'menu').subscribe({
      next: (url) => {
        this.uploadedVideoUrl = url;
        this.isUploadingVideo = false;
        this.showSuccess('Video uploaded successfully');
      },
      error: (error) => {
        this.isUploadingVideo = false;
        this.showError(error.error?.message || 'Video upload failed');
      }
    });
  }

  saveItem(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const request = {
      itemName: this.itemForm.value.itemName ?? '',
      description: this.itemForm.value.description ?? '',
      price: Number(this.itemForm.value.price),
      imageUrl: this.uploadedImageUrl,
      videoUrl: this.uploadedVideoUrl,
      categoryId: Number(this.itemForm.value.categoryId)
    };

    if (this.selectedItemId) {
      this.menuService.updateItem(this.selectedItemId, request).subscribe({
        next: () => {
          this.showSuccess('Menu item updated successfully');
          this.resetForm();
          this.loadItems();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to update menu item');
        }
      });
    } else {
      this.menuService.createItem(request).subscribe({
        next: () => {
          this.showSuccess('Menu item created successfully');
          this.resetForm();
          this.loadItems();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to create menu item');
        }
      });
    }
  }

  editItem(item: MenuItem): void {
    this.selectedItemId = item.itemId;

    this.uploadedImageUrl = item.imageUrl;
    this.uploadedVideoUrl = item.videoUrl;

    this.imagePreview = this.getFileUrl(item.imageUrl);
    this.videoPreview = this.getFileUrl(item.videoUrl);

    this.itemForm.patchValue({
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      categoryId: String(item.category.categoryId)
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateAvailability(item: MenuItem): void {
    const newStatus = !item.isAvailable;

    this.menuService.updateAvailability(item.itemId, newStatus).subscribe({
      next: () => {
        this.showSuccess('Availability updated successfully');
        this.loadItems();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to update availability');
      }
    });
  }

  resetForm(): void {
    this.selectedItemId = null;

    this.uploadedImageUrl = '';
    this.uploadedVideoUrl = '';
    this.imagePreview = '';
    this.videoPreview = '';

    this.itemForm.reset({
      itemName: '',
      description: '',
      price: 0,
      categoryId: ''
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