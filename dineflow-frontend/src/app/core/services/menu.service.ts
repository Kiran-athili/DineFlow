import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MenuCategory,
  MenuCategoryRequest,
  MenuItem,
  MenuItemRequest
} from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private readonly categoryUrl = `${environment.apiBaseUrl}/menu-categories`;
  private readonly itemUrl = `${environment.apiBaseUrl}/menu-items`;

  constructor(private http: HttpClient) {}

  createCategory(request: MenuCategoryRequest): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(this.categoryUrl, request);
  }

  getAllCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(this.categoryUrl);
  }

  getActiveCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.categoryUrl}/active`);
  }

  updateCategory(categoryId: number, request: MenuCategoryRequest): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(`${this.categoryUrl}/${categoryId}`, request);
  }

  deactivateCategory(categoryId: number): Observable<string> {
    return this.http.delete(`${this.categoryUrl}/${categoryId}`, {
      responseType: 'text'
    });
  }

  createItem(request: MenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.itemUrl, request);
  }

  getAllItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.itemUrl);
  }

  getAvailableItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.itemUrl}/available`);
  }

  updateItem(itemId: number, request: MenuItemRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.itemUrl}/${itemId}`, request);
  }

  updateAvailability(itemId: number, available: boolean): Observable<string> {
    return this.http.patch(`${this.itemUrl}/${itemId}/availability?available=${available}`, null, {
      responseType: 'text'
    });
  }

  updateCategoryStatus(categoryId: number, active: boolean): Observable<string> {
  return this.http.patch(`${this.categoryUrl}/${categoryId}/status?active=${active}`, null, {
    responseType: 'text'
  });
}
}