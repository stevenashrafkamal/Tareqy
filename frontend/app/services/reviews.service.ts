import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Review } from '../shared/models/review.model';

/**
 * Reviews service.
 *
 * ⚠️ NOTE: No /api/reviews route exists in the current Backend app.js.
 * This service is structured and ready to connect once the backend route is added.
 * The base path below follows the project's naming convention.
 *
 * Expected backend mount (to be added): /api/reviews
 */
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly base = '/api/reviews';

  constructor(private api: ApiService) {}

  addReview(data: Partial<Review>): Observable<any> {
    return this.api.post(this.base, data);
  }

  updateReview(id: string, data: Partial<Review>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteReview(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  getReviewsByTarget(targetType: string, targetId: string): Observable<Review[]> {
    return this.api.get<Review[]>(`${this.base}/target`, { target_type: targetType, target_id: targetId });
  }

  getUserReviews(userId: string): Observable<Review[]> {
    return this.api.get<Review[]>(`${this.base}/user/${userId}`);
  }

  getAverageRating(targetType: string, targetId: string): Observable<{ average: number }> {
    return this.api.get<{ average: number }>(`${this.base}/average`, { target_type: targetType, target_id: targetId });
  }
}
