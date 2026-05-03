import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Score } from '../shared/models/score.model';

/**
 * Backend mount: /scores  (scores.router.js)
 *   POST   /scores                             (admin only)
 *   PUT    /scores/:id                         (admin only)
 *   GET    /scores/submission/:submissionId
 *   GET    /scores/user/:userId
 *   GET    /scores/challenge/:challengeId
 *
 * ⚠️ FIX: old service used /api/score — backend mounts at /scores (plural, no /api prefix)
 */
@Injectable({ providedIn: 'root' })
export class ScoresService {
  private readonly base = '/scores';

  constructor(private api: ApiService) {}

  addScore(data: { challenge_id: string; user_id: string; score: number }): Observable<any> {
    return this.api.post(this.base, data);
  }

  updateScore(id: string, score: number): Observable<any> {
    return this.api.put(`${this.base}/${id}`, { score });
  }

  getScoreBySubmission(submissionId: string): Observable<Score> {
    return this.api.get<Score>(`${this.base}/submission/${submissionId}`);
  }

  getUserScores(userId: string): Observable<Score[]> {
    return this.api.get<Score[]>(`${this.base}/user/${userId}`);
  }

  getChallengeScores(challengeId: string): Observable<Score[]> {
    return this.api.get<Score[]>(`${this.base}/challenge/${challengeId}`);
  }
}
