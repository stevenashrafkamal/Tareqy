import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Challenge } from '../shared/models/challenge.model';

/**
 * Backend mount: /api/challenge  (challenge.routes.js)
 * Backend response shapes:
 *   GET /track/:trackId   → { challenges: Challenge[] }
 *   GET /level/:levelId   → { challenges: Challenge[] }
 *   GET /step/:stepId     → { challenges: Challenge[] }
 *   GET /:id              → { challenge: Challenge }
 */
@Injectable({ providedIn: 'root' })
export class ChallengesService {
  private readonly base = '/api/challenge';

  constructor(private api: ApiService) {}

  createChallenge(data: Partial<Challenge>): Observable<any> {
    return this.api.post(this.base, data);
  }

  getChallengeById(id: string): Observable<Challenge> {
    return this.api.get<{ challenge: Challenge }>(`${this.base}/${id}`).pipe(
      map(res => res.challenge)
    );
  }

  /**
   * ✅ Fixed: was using query param `?track_id=` but backend route is GET /track/:trackId
   */
  getChallengesByTrack(trackId: string): Observable<Challenge[]> {
    return this.api.get<{ challenges: Challenge[] }>(`${this.base}/track/${trackId}`).pipe(
      map(res => res.challenges)
    );
  }

  getChallengesByLevel(levelId: string): Observable<Challenge[]> {
    return this.api.get<{ challenges: Challenge[] }>(`${this.base}/level/${levelId}`).pipe(
      map(res => res.challenges)
    );
  }

  getChallengesByStep(stepId: string): Observable<Challenge[]> {
    return this.api.get<{ challenges: Challenge[] }>(`${this.base}/step/${stepId}`).pipe(
      map(res => res.challenges)
    );
  }

  updateChallenge(id: string, data: Partial<Challenge>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteChallenge(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  /**
   * ✅ Fixed: backend route is PUT /:id/reviewer (not PATCH /:id/assign-reviewer)
   */
  assignReviewer(challengeId: string, reviewerId: string): Observable<any> {
    return this.api.put(`${this.base}/${challengeId}/reviewer`, { reviewer_id: reviewerId });
  }
}
