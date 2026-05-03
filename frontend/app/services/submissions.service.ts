import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Submission } from '../shared/models/submission.model';

/**
 * Backend mount: /api/submission  (submission.routes.js)
 * Backend response shapes:
 *   POST /submit                 → { message, data: Submission }
 *   POST /submit-challenge       → { message, data: Submission }
 *   GET  /                       → { message, data: Submission[] }
 *   GET  /:id                    → { message, data: Submission }
 *   GET  /challenge/:challengeId → { message, data: Submission[] }
 *   DELETE /:id                  → { message, data: null }
 */
@Injectable({ providedIn: 'root' })
export class SubmissionsService {
  private readonly base = '/api/submission';

  constructor(private api: ApiService) {}

  /**
   * ✅ Fixed: backend route is POST /submit (not /task or /submit-task)
   */
  submitTask(formData: FormData): Observable<any> {
    return this.api.upload(`${this.base}/submit`, formData);
  }

  /**
   * ✅ Fixed: backend route is POST /submit-challenge
   */
  submitChallenge(payload: FormData | any): Observable<any> {
    if (payload instanceof FormData) {
      return this.api.upload(`${this.base}/submit-challenge`, payload);
    }
    return this.api.post(`${this.base}/submit-challenge`, payload);
  }

  getUserSubmissions(): Observable<Submission[]> {
    return this.api.get<{ data: Submission[] }>(this.base).pipe(
      map(res => res.data)
    );
  }

  getSubmissionById(id: string): Observable<Submission> {
    return this.api.get<{ data: Submission }>(`${this.base}/${id}`).pipe(
      map(res => res.data)
    );
  }

  deleteSubmission(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  getSubmissionsByChallenge(challengeId: string): Observable<Submission[]> {
    return this.api.get<{ data: Submission[] }>(`${this.base}/challenge/${challengeId}`).pipe(
      map(res => res.data)
    );
  }

  /** CODE REVIEWER: Fetch all submissions with status === 'pending' */
  getPendingSubmissions(): Observable<any[]> {
    return this.api.get<{ data: any[] }>(`${this.base}/pending`).pipe(
      map(res => res.data)
    );
  }

  /** CODE REVIEWER: Accept or reject a submission */
  reviewSubmission(id: string, status: 'accepted' | 'rejected', reviewNote?: string): Observable<any> {
    return this.api.put(`${this.base}/${id}/review`, { status, reviewNote });
  }
}
