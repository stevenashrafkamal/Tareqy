import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { AuthService } from './auth.service';
import { CodeReviewer } from '../shared/models/code-reviewer.model';

/**
 * Backend mount: /api/reviewer  (codeReviewer.routes.js)
 *   POST   /api/reviewer/signup
 *   POST   /api/reviewer/login
 *   POST   /api/reviewer/verify-email
 *   POST   /api/reviewer/logout
 *   GET    /api/reviewer/profile
 *   PUT    /api/reviewer/profile
 *   PATCH  /api/reviewer/change-password
 *   PATCH  /api/reviewer/select-track
 *   PATCH  /api/reviewer/select-levels
 *   GET    /api/reviewer/:id
 *   GET    /api/reviewer/search
 *   PATCH  /api/reviewer/:id/activate
 *   PATCH  /api/reviewer/:id/deactivate
 *   DELETE /api/reviewer/profile
 */
@Injectable({ providedIn: 'root' })
export class CodeReviewerService {
  private readonly base = '/api/reviewer';

  constructor(private api: ApiService, private auth: AuthService) {}

  reviewerSignup(data: { username: string; email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/signup`, data);
  }

  reviewerLogin(data: { email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/login`, data).pipe(
      tap((res: any) => this.auth['saveSession'](res, 'codeReviewer'))
    );
  }

  verifyReviewerEmail(otp: string): Observable<any> {
    return this.api.post(`${this.base}/verify-email`, { otp });
  }

  logout(): Observable<any> {
    return this.api.post(`${this.base}/logout`, {});
  }

  getReviewerProfile(): Observable<CodeReviewer> {
    return this.api.get<CodeReviewer>(`${this.base}/profile`);
  }

  updateReviewerProfile(data: Partial<CodeReviewer>): Observable<any> {
    return this.api.put(`${this.base}/profile`, data);
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.api.patch(`${this.base}/change-password`, data);
  }

  selectTracks(track: string): Observable<any> {
    return this.api.patch(`${this.base}/select-track`, { selected_track: track });
  }

  selectLevels(levels: string[]): Observable<any> {
    return this.api.patch(`${this.base}/select-levels`, { selected_levels: levels });
  }

  getReviewerById(id: string): Observable<CodeReviewer> {
    return this.api.get<CodeReviewer>(`${this.base}/${id}`);
  }

  searchReviewers(query: string): Observable<CodeReviewer[]> {
    return this.api.get<CodeReviewer[]>(`${this.base}/search`, { q: query });
  }

  activateReviewer(id: string): Observable<any> {
    return this.api.patch(`${this.base}/${id}/activate`, {});
  }

  deactivateReviewer(id: string): Observable<any> {
    return this.api.patch(`${this.base}/${id}/deactivate`, {});
  }

  deleteReviewer(): Observable<any> {
    return this.api.delete(`${this.base}/profile`);
  }
}
