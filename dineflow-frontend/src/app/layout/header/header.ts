import { Component, EventEmitter, Output } from '@angular/core';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Output() menuClick = new EventEmitter<void>();

  constructor(public tokenStorage: TokenStorageService) {}

  get fullName(): string {
    return this.tokenStorage.getFullName() || 'User';
  }

  get role(): string {
    return this.tokenStorage.getRole() || 'USER';
  }

  get initials(): string {
    return this.fullName.charAt(0).toUpperCase();
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }
}