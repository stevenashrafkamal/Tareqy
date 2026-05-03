import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { User } from '../shared/models/user.model';
import { Track } from '../shared/models/track.model';
import { Submission } from '../shared/models/submission.model';
import { Instructor } from '../shared/models/instructor.model';

/**
 * AdminService — wraps all /api/admin endpoints.
 *
 * Every endpoint requires checkToken + checkAdmin middleware on the backend.
 * The changeRole endpoint additionally requires isSuperAdmin.
 *
 * Backend mount: /api/admin  (admin.route.js)
 *   GET    /api/admin/users
 *   PATCH  /api/admin/users/:id/ban
 *   PATCH  /api/admin/users/:id/activate
 *   PATCH  /api/admin/users/:id/role       (superAdmin only)
 *   POST   /api/admin/tracks
 *   DELETE /api/admin/tracks/:id
 *   GET    /api/admin/reports
 *   PATCH  /api/admin/reports/:id/resolve
 *   DELETE /api/admin/reviews/:id
 *   GET    /api/admin/submissions
 *   GET    /api/admin/instructors/pending
 *   PATCH  /api/admin/instructors/:id/approve
 *   PATCH  /api/admin/instructors/:id/reject
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly base = '/api/admin';

  constructor(private api: ApiService) {}

  // ── Users ─────────────────────────────────────────────────────────────────

  getUsers(): Observable<{ data: User[] }> {
    return this.api.get<{ data: User[] }>(`${this.base}/users`);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`${this.base}/users/${id}`);
  }

  activateUser(id: string): Observable<any> {
    return this.api.patch(`${this.base}/users/${id}/activate`, {});
  }

  /** Requires superAdmin role */
  changeUserRole(id: string, role: string): Observable<any> {
    return this.api.patch(`${this.base}/users/${id}/role`, { role });
  }

  // ── Tracks ────────────────────────────────────────────────────────────────

  createTrack(data: Partial<Track>): Observable<any> {
    return this.api.post(`${this.base}/tracks`, data);
  }

  deleteTrack(id: string): Observable<any> {
    return this.api.delete(`${this.base}/tracks/${id}`);
  }

  // ── Reports ───────────────────────────────────────────────────────────────

  getReports(): Observable<any> {
    return this.api.get(`${this.base}/reports`);
  }

  resolveReport(id: string): Observable<any> {
    return this.api.patch(`${this.base}/reports/${id}/resolve`, {});
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  deleteReview(id: string): Observable<any> {
    return this.api.delete(`${this.base}/reviews/${id}`);
  }

  // ── Submissions ───────────────────────────────────────────────────────────

  getSubmissions(): Observable<{ data: Submission[] }> {
    return this.api.get<{ data: Submission[] }>(`${this.base}/submissions`);
  }

  // ── Instructors ───────────────────────────────────────────────────────────

  getPendingInstructors(): Observable<{ data: Instructor[] }> {
    return this.api.get<{ data: Instructor[] }>(`${this.base}/instructors/pending`);
  }

  approveInstructor(id: string): Observable<any> {
    return this.api.patch(`${this.base}/instructors/${id}/approve`, {});
  }

  rejectInstructor(id: string): Observable<any> {
    return this.api.patch(`${this.base}/instructors/${id}/reject`, {});
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  getStats(): Observable<{ data: { totalUsers: number; totalTracks: number; pendingReports: number; pendingSubmissions: number; totalReviews: number } }> {
    return this.api.get(`${this.base}/stats`);
  }

  // ── Staff Creation ────────────────────────────────────────────────────────

  createStaff(payload: { username: string; email: string; password: string; role: 'admin' | 'codeReviewer' }): Observable<any> {
    return this.api.post(`${this.base}/create-staff`, payload);
  }
}
