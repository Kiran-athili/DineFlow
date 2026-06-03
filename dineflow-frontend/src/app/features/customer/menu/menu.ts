import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuCategory, MenuItem } from '../../../core/models/menu.model';
import { RestaurantTable } from '../../../core/models/table.model';
import { MenuService } from '../../../core/services/menu.service';
import { OrderService } from '../../../core/services/order.service';
import { TableService } from '../../../core/services/table.service';
import { Router } from '@angular/router';

interface CartItem {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {

  categories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  availableTables: RestaurantTable[] = [];

  cartItems: CartItem[] = [];

  selectedCategoryId: number | null = null;
  selectedTableId: number | null = null;

  isLoading = false;
  isPlacingOrder = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private menuService: MenuService,
    private tableService: TableService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadCategories();
    this.loadMenuItems();
    this.loadAvailableTables();
  }

  loadCategories(): void {
    this.menuService.getActiveCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to load categories');
      }
    });
  }

  loadMenuItems(): void {
    this.isLoading = true;

    this.menuService.getAvailableItems().subscribe({
      next: (response) => {
        this.menuItems = response;
        this.filteredItems = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load menu items');
      }
    });
  }

  loadAvailableTables(): void {
    this.tableService.getAvailableTables().subscribe({
      next: (response) => {
        this.availableTables = response;
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to load available tables');
      }
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;

    if (categoryId === null) {
      this.filteredItems = this.menuItems;
      return;
    }

    this.filteredItems = this.menuItems.filter(
      item => item.category?.categoryId === categoryId
    );
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

  onTableChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTableId = value ? Number(value) : null;
  }

  addToCart(item: MenuItem): void {
    const existingItem = this.cartItems.find(cart => cart.itemId === item.itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl
      });
    }

    this.showSuccess(`${item.itemName} added to cart`);
  }

  increaseQuantity(item: CartItem): void {
    item.quantity += 1;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      return;
    }

    this.removeFromCart(item.itemId);
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.itemId !== itemId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getCartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  placeOrder(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedTableId) {
      this.showError('Please select a table');
      return;
    }

    if (this.cartItems.length === 0) {
      this.showError('Please add at least one item to cart');
      return;
    }

    const request = {
      tableId: this.selectedTableId,
      items: this.cartItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      }))
    };

    this.isPlacingOrder = true;

    this.orderService.placeOrder(request).subscribe({
      next: (response) => {
        this.isPlacingOrder = false;
        this.showSuccess(`Order #${response.orderId} placed successfully`);

        this.clearCart();
        this.selectedTableId = null;

        this.loadAvailableTables();
        setTimeout(() => {
         this.router.navigate(['/customer/my-orders']);
        }, 1000);
      },
      error: (error) => {
        this.isPlacingOrder = false;
        this.showError(error.error?.message || 'Failed to place order');
      }
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