import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { User } from '../shared/models/user.model';

/**
 * Backend mount: /auth  (users.router.js)
 *   POST   /auth/signup
 *   POST   /auth/signin
 *   GET    /auth/verify/:token
 *   GET    /auth/me
 *   GET    /auth/all            (admin only)
 *   POST   /auth/add-admin      (admin only)
 *   DELETE /auth/:id            (admin only)
 *   PUT    /auth/update         (multipart — profile image)
 *
 * ⚠️ FIX: old service used /api/users — backend mounts the user router at /auth
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = '/auth';

  constructor(private api: ApiService) {}

  signup(data: { username: string; email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/signin`, data);
  }

  getMe(): Observable<User> {
    return this.api.get<User>(`${this.base}/me`);
  }

  verifyEmailToken(token: string): Observable<any> {
    return this.api.get(`${this.base}/verify/${token}`);
  }

  /** Profile image upload — use FormData */
  updateUserProfile(formData: FormData): Observable<any> {
    return this.api.upload(`${this.base}/update`, formData);
  }

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(`${this.base}/all`);
  }

  addAdmin(data: { username: string; email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/add-admin`, data);
  }

  deleteUserById(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  activateUser(id: string): Observable<any> {
    return this.api.patch(`/api/admin/users/${id}/activate`, {});
  }

  deactivateUser(id: string): Observable<any> {
    return this.api.patch(`/api/admin/users/${id}/ban`, {});
  }
}
