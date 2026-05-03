import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Step } from '../shared/models/step.model';
import { Resource } from '../shared/models/resource.model';
import { Challenge } from '../shared/models/challenge.model';

/**
 * Backend mount: /api/steps  (step.router.js)
 * Backend response shapes:
 *   GET /             → Step[]            (no envelope — returns array directly)
 *   GET /level/:levelId → Step[]           (no envelope — returns array directly)
 *   GET /:id          → Step              (no envelope — returns object directly)
 */
@Injectable({ providedIn: 'root' })
export class StepsService {
  private readonly base = '/api/steps';

  constructor(private api: ApiService) {}

  createStep(data: Partial<Step>): Observable<any> {
    return this.api.post(this.base, data);
  }

  /**
   * ✅ Fixed: was using query param ?level_id= but backend route is /level/:levelId (path param).
   * Backend returns Step[] directly (no envelope wrapper).
   */
  getStepsByLevel(levelId: string): Observable<Step[]> {
    return this.api.get<Step[]>(`${this.base}/level/${levelId}`);
  }

  getAllSteps(): Observable<Step[]> {
    return this.api.get<Step[]>(this.base);
  }

  getStepById(id: string): Observable<Step> {
    return this.api.get<Step>(`${this.base}/${id}`);
  }

  updateStep(id: string, data: Partial<Step>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteStep(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  getStepResources(stepId: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(`${this.base}/${stepId}/resources`);
  }

  getStepChallenges(stepId: string): Observable<Challenge[]> {
    return this.api.get<Challenge[]>(`${this.base}/${stepId}/challenges`);
  }
}
