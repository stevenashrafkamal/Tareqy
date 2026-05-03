import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Level } from '../shared/models/level.model';
import { Step } from '../shared/models/step.model';

/**
 * Backend mount: /api/level  (level.routes.js)
 * Backend response shapes:
 *   GET /track/:trackId → { levels: Level[] }
 *   GET /:id            → { level: Level }
 *   GET /:levelId/steps → { steps: Step[] }
 */
@Injectable({ providedIn: 'root' })
export class LevelsService {
  private readonly base = '/api/level';

  constructor(private api: ApiService) {}

  createLevel(data: Partial<Level>): Observable<any> {
    return this.api.post(this.base, data);
  }

  /**
   * ✅ Fixed: was calling /api/level/track/:trackId with wrong URL.
   * Backend route is GET /track/:trackId → controller: getLevelsByTrack
   */
  getLevelsByTrack(trackId: string): Observable<Level[]> {
    return this.api.get<{ levels: Level[] }>(`${this.base}/track/${trackId}`).pipe(
      map(res => res.levels)
    );
  }

  getLevelById(id: string): Observable<Level> {
    return this.api.get<{ level: Level }>(`${this.base}/${id}`).pipe(
      map(res => res.level)
    );
  }

  updateLevel(id: string, data: Partial<Level>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteLevel(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  getLevelSteps(levelId: string): Observable<Step[]> {
    return this.api.get<{ steps: Step[] }>(`${this.base}/${levelId}/steps`).pipe(
      map(res => res.steps)
    );
  }
}
