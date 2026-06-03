import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestaurantTable } from '../../../core/models/table.model';
import { TableService } from '../../../core/services/table.service';

@Component({
  selector: 'app-tables',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css'
})
export class Tables implements OnInit {

  tables: RestaurantTable[] = [];
  selectedTableId: number | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  tableStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

  tableForm;

  constructor(
    private fb: FormBuilder,
    private tableService: TableService
  ) {
    this.tableForm = this.fb.group({
      tableNumber: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.isLoading = true;

    this.tableService.getAllTables().subscribe({
      next: (response) => {
        this.tables = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load tables');
      }
    });
  }

  saveTable(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    const request = {
      tableNumber: this.tableForm.value.tableNumber ?? '',
      capacity: Number(this.tableForm.value.capacity)
    };

    if (this.selectedTableId) {
      this.tableService.updateTable(this.selectedTableId, request).subscribe({
        next: () => {
          this.showSuccess('Table updated successfully');
          this.resetForm();
          this.loadTables();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to update table');
        }
      });
    } else {
      this.tableService.createTable(request).subscribe({
        next: () => {
          this.showSuccess('Table created successfully');
          this.resetForm();
          this.loadTables();
        },
        error: (error) => {
          this.showError(error.error?.message || 'Failed to create table');
        }
      });
    }
  }

  editTable(table: RestaurantTable): void {
    this.selectedTableId = table.tableId;

    this.tableForm.patchValue({
      tableNumber: table.tableNumber,
      capacity: table.capacity
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeStatus(table: RestaurantTable, status: string): void {
  console.log('Changing table status:', table.tableId, status);

  this.tableService.updateTableStatus(table.tableId, { status }).subscribe({
    next: (updatedTable) => {
      this.showSuccess('Table status updated successfully');

      this.tables = this.tables.map(t =>
        t.tableId === updatedTable.tableId ? updatedTable : t
      );
    },
    error: (error) => {
      console.log('TABLE STATUS ERROR:', error);
      this.showError(error.error?.message || 'Failed to update table status');
      this.loadTables();
    }
  });
}

  deleteTable(tableId: number): void {
    if (!confirm('Are you sure you want to delete this table?')) {
      return;
    }

    this.tableService.deleteTable(tableId).subscribe({
      next: () => {
        this.showSuccess('Table deleted successfully');
        this.loadTables();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to delete table');
      }
    });
  }

  resetForm(): void {
    this.selectedTableId = null;

    this.tableForm.reset({
      tableNumber: '',
      capacity: 1
    });
  }

  getStatusClass(status: string): string {
    if (status === 'AVAILABLE') {
      return 'bg-success';
    }

    if (status === 'OCCUPIED') {
      return 'bg-danger';
    }

    return 'bg-warning';
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