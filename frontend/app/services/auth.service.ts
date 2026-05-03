import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'instructor' | 'codeReviewer';
  activation_status: boolean;
  account_status: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  login(email: string, password: string): Observable<any> {
    return this.api.post(`/auth/signin`, { email, password }).pipe(
      tap((res: any) => this.saveSession(res, 'user'))
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.api.post(`/auth/signup`, { username, email, password }).pipe(
      tap((res: any) => this.saveSession(res, 'user'))
    );
  }

  instructorLogin(email: string, password: string): Observable<any> {
    return this.api.post(`/api/instructors/login`, { email, password }).pipe(
      tap((res: any) => this.saveSession(res, 'instructor'))
    );
  }

  reviewerLogin(email: string, password: string): Observable<any> {
    return this.api.post(`/api/reviewer/login`, { email, password }).pipe(
      tap((res: any) => this.saveSession(res, 'codeReviewer'))
    );
  }

  verifyEmail(otp: string): Observable<any> {
    return this.api.post(`/auth/verifyEmail`, { otp });
  }

  resendOTP(): Observable<any> {
    return this.api.post(`/auth/resendOTP`, {});
  }

  saveSession(res: any, fallbackRole: string): void {
    const token = res.accessToken ?? res.token ?? '';
    const refreshToken = res.refreshToken ?? '';

    // Store tokens in cookies (7 days)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    document.cookie = `token=${token};expires=${expiry.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken};expires=${expiry.toUTCString()};path=/;SameSite=Lax`;

    // Extract role and user from response (handle different backend shapes)
    const userObj = res.user ?? res.data ?? res;
    const role = userObj?.role ?? res.role ?? fallbackRole;
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(userObj));
  }

  logout(): void {
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    ['role', 'user'].forEach((k: string) => localStorage.removeItem(k));
  }

  isLoggedIn(): boolean { return !!this.getToken(); }

  getToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  getRole(): string {
    const user = this.getUser();
    if (user && (user as any).isSuperAdmin) {
      return 'superAdmin';
    }
    return localStorage.getItem('role') ?? 'guest';
  }

  getUser(): AuthUser | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isAdmin(): boolean { return this.getRole() === 'admin' || this.getRole() === 'superAdmin'; }
  isInstructor(): boolean { return this.getRole() === 'instructor'; }
  isReviewer(): boolean { return this.getRole() === 'codeReviewer'; }
}
