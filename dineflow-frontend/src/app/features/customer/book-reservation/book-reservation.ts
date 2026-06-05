import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from '../../../core/models/menu.model';
import { RestaurantTable } from '../../../core/models/table.model';
import { MenuService } from '../../../core/services/menu.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { environment } from '../../../../environments/environment';

interface ReservationCartItem {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-book-reservation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-reservation.html',
  styleUrl: './book-reservation.css'
})
export class BookReservation implements OnInit {

  tables: RestaurantTable[] = [];
  menuItems: MenuItem[] = [];
  cartItems: ReservationCartItem[] = [];

  isLoading = false;
  isBooking = false;
  isLoadingTables = false;

  errorMessage = '';
  successMessage = '';
  tableMessage = 'Please select reservation date, time, and guest count to view available tables.';

  minDate = new Date().toISOString().slice(0, 10);

  reservationForm;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private reservationService: ReservationService,
    private router: Router
  ) {
    this.reservationForm = this.fb.group({
      tableId: ['', Validators.required],
      reservationDate: ['', Validators.required],
      reservationTime: ['', Validators.required],
      guestCount: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadData(): void {
    this.loadAvailableTablesForReservation();
    this.loadMenuItems();
  }

  loadAvailableTablesForReservation(): void {
    const reservationDate = this.reservationForm.value.reservationDate ?? '';
    let reservationTime = this.reservationForm.value.reservationTime ?? '';
    const guestCount = Number(this.reservationForm.value.guestCount);

    this.tables = [];
    this.reservationForm.patchValue({ tableId: '' }, { emitEvent: false });

    if (!reservationDate || !reservationTime || !guestCount || guestCount <= 0) {
      this.tableMessage = 'Please select reservation date, time, and guest count to view available tables.';
      return;
    }

    if (reservationTime.length === 5) {
      reservationTime = `${reservationTime}:00`;
    }

    this.isLoadingTables = true;
    this.tableMessage = '';

    this.reservationService.getAvailableTablesForReservation(
      reservationDate,
      reservationTime,
      guestCount
    ).subscribe({
      next: (response) => {
        this.tables = response;
        this.isLoadingTables = false;

        if (this.tables.length === 0) {
          this.tableMessage = 'No tables available for the selected date and time.';
        }
      },
      error: (error) => {
        this.isLoadingTables = false;
        this.tableMessage = error.error?.message || 'Failed to load available tables.';
      }
    });
  }

  loadMenuItems(): void {
    this.isLoading = true;

    this.menuService.getAvailableItems().subscribe({
      next: (response) => {
        this.menuItems = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load menu items');
      }
    });
  }

  addToCart(item: MenuItem): void {
    const existing = this.cartItems.find(cart => cart.itemId === item.itemId);

    if (existing) {
      existing.quantity += 1;
      return;
    }

    this.cartItems.push({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl
    });
  }

  increaseQuantity(item: ReservationCartItem): void {
    item.quantity += 1;
  }

  decreaseQuantity(item: ReservationCartItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      return;
    }

    this.removeItem(item.itemId);
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.itemId !== itemId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalAmount(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  bookReservation(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const rawTime = this.reservationForm.value.reservationTime ?? '';
    const formattedTime = rawTime.length === 5 ? `${rawTime}:00` : rawTime;

    const request = {
      tableId: Number(this.reservationForm.value.tableId),
      reservationDate: this.reservationForm.value.reservationDate ?? '',
      reservationTime: formattedTime,
      guestCount: Number(this.reservationForm.value.guestCount),
      items: this.cartItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      }))
    };

    this.isBooking = true;

    this.reservationService.createReservation(request).subscribe({
      next: (response) => {
        this.isBooking = false;
        this.showSuccess(`Reservation #${response.reservationId} booked successfully`);

        setTimeout(() => {
          this.router.navigate(['/customer/my-reservations']);
        }, 1200);
      },
      error: (error) => {
        this.isBooking = false;
        this.showError(error.error?.message || 'Failed to book reservation');
      }
    });
  }

  getFileUrl(fileUrl?: string): string {
    if (!fileUrl) {
      return '';
    }

    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }

    const serverUrl = environment.apiBaseUrl.replace('/api', '');
    return `${serverUrl}${fileUrl}`;
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