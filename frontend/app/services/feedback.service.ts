import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Review } from '../shared/models/review.model';
import { Report } from '../shared/models/report.model';

/**
 * FeedbackService — wraps both the Reviews and Reports APIs.
 *
 * Reviews:  GET/POST  /api/reviews  |  PUT/DELETE /api/reviews/:id
 * Reports:  POST      /api/reports  |  GET/PATCH/DELETE /api/reports/:id  (GET list = admin)
 *
 * The /feedback umbrella route also exists on the backend but these endpoints
 * are now accessible directly at /api/reviews and /api/reports for clean REST URLs.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly reviewBase = '/api/reviews';
  private readonly reportBase = '/api/reports';

  constructor(private api: ApiService) {}

  // ── Reviews ───────────────────────────────────────────────────────────────

  addReview(data: Partial<Review>): Observable<any> {
    return this.api.post(this.reviewBase, data);
  }

  getReviews(filters?: { relatedTo?: string; referenceId?: string }): Observable<{ results: number; data: Review[] }> {
    return this.api.get<{ results: number; data: Review[] }>(this.reviewBase, filters as any);
  }

  updateReview(id: string, data: Partial<Review>): Observable<any> {
    return this.api.put(`${this.reviewBase}/${id}`, data);
  }

  deleteReview(id: string): Observable<any> {
    return this.api.delete(`${this.reviewBase}/${id}`);
  }

  // ── Reports ───────────────────────────────────────────────────────────────

  createReport(data: Partial<Report>): Observable<any> {
    return this.api.post(this.reportBase, data);
  }

  /** Admin only */
  getAllReports(filters?: { status?: string; relatedTo?: string }): Observable<{ results: number; data: Report[] }> {
    return this.api.get<{ results: number; data: Report[] }>(this.reportBase, filters as any);
  }

  /** Admin only */
  updateReportStatus(id: string, status: 'pending' | 'resolved'): Observable<any> {
    return this.api.patch(`${this.reportBase}/${id}`, { status });
  }

  /** Admin only */
  deleteReport(id: string): Observable<any> {
    return this.api.delete(`${this.reportBase}/${id}`);
  }
}
