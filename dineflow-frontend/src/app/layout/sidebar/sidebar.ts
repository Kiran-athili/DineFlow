import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() isOpen = true;

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  get role(): string | null {
    return this.tokenStorage.getRole();
  }

  logout(): void {
    this.tokenStorage.logout();
    this.router.navigate(['/login']);
  }
}