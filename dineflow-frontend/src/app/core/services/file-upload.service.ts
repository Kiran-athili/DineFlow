import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly baseUrl = `${environment.apiBaseUrl}/files`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder: 'categories' | 'menu' | 'banners'): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text'
    });
  }
}