import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordRequest,
  CustomerRegisterRequest,
  LoginRequest,
  LoginResponse,
  StaffResponse,
  UpdateProfileRequest
} from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  registerCustomer(request: CustomerRegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register-customer`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        tap(response => {
          this.tokenStorage.saveLogin(response);
        })
      );
  }

  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/profile`);
  }

  updateProfile(request: UpdateProfileRequest): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.baseUrl}/profile`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.baseUrl}/change-password`, request, {
      responseType: 'text'
    });
  }

  forgotPassword(request: { email: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, request, {
      responseType: 'text'
    });
  }

  resetPassword(request: { resetToken: string; newPassword: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, request, {
      responseType: 'text'
    });
  }

  createStaff(request: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    roleName: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/admin/create-staff`, request);
  }

  getAllStaff(): Observable<StaffResponse[]> {
    return this.http.get<StaffResponse[]>(`${this.baseUrl}/admin/staff`);
  }

  logout(): void {
    this.tokenStorage.logout();
  }

  updateStaffStatus(userId: number, staffStatus: string): Observable<StaffResponse> {
  return this.http.patch<StaffResponse>(`${this.baseUrl}/admin/staff/${userId}/status`, {
    staffStatus
  });
}
}