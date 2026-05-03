import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Centralized HTTP service for the Tareqy application.
 *
 * All feature services should inject ApiService instead of HttpClient directly.
 * This ensures every request goes through the single source-of-truth base URL
 * and benefits from any future middleware added here (caching, retries, etc.).
 *
 * Usage:
 *   this.api.get<Track[]>('/api/track')
 *   this.api.post<any>('/auth/login', { email, password })
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  /** Root server URL from environment — no trailing slash */
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── Read ─────────────────────────────────────────────────────────────────

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(`${this.base}${path}`, { params: httpParams });
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.base}${path}`, body);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`);
  }

  // ── File Upload ───────────────────────────────────────────────────────────

  /** Use this for multipart/form-data requests (file uploads). */
  upload<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, formData);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }
    return httpParams;
  }
}
