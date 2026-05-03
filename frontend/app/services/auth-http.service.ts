import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { AuthService, AuthUser } from './auth.service';

/**
 * Auth HTTP service — login/register/verify calls.
 * Session management (token save/clear) lives in AuthService.
 *
 * Backend mount: /auth  (users.router.js)
 *   POST /auth/signup
 *   POST /auth/signin
 *   GET  /auth/verify/:token
 *   GET  /auth/me
 */
@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  private readonly base = '/auth';

  constructor(private api: ApiService, private auth: AuthService) {}

  login(email: string, password: string): Observable<any> {
    return this.api.post(`${this.base}/signin`, { email, password }).pipe(
      tap((res: any) => this.auth.saveSession(res, 'user'))
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.api.post(`${this.base}/signup`, { username, email, password }).pipe(
      tap((res: any) => this.auth.saveSession(res, 'user'))
    );
  }

  getMe(): Observable<AuthUser> {
    return this.api.get<AuthUser>(`${this.base}/me`);
  }

  verifyEmailToken(token: string): Observable<any> {
    return this.api.get(`${this.base}/verify/${token}`);
  }

  addAdmin(data: { username: string; email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/add-admin`, data);
  }
}
