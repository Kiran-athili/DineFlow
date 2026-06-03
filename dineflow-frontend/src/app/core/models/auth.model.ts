export interface CustomerRegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface LoggedInUser {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface StaffResponse {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  roleName: string;
  isActive: boolean;
  staffStatus: string;
  createdAt: string;
}