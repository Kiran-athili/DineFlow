import { Injectable } from '@angular/core';
import { LoggedInUser, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private readonly TOKEN_KEY = 'dineflow_token';
  private readonly USER_KEY = 'dineflow_user';

  saveLogin(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: LoggedInUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): LoggedInUser | null {
    const userData = localStorage.getItem(this.USER_KEY);

    if (!userData) {
      return null;
    }

    return JSON.parse(userData) as LoggedInUser;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  getFullName(): string | null {
    return this.getUser()?.fullName ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}