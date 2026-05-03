import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Checkpoint } from '../shared/models/checkpoint.model';
import { AuthService } from './auth.service';

/**
 * Backend mount: /api/checkpoint  (checkpoint.routes.js)
 *   POST   /api/checkpoint
 *   PUT    /api/checkpoint/:id
 *   GET    /api/checkpoint
 *   GET    /api/checkpoint/track/:trackId
 *   DELETE /api/checkpoint/:id
 */
@Injectable({ providedIn: 'root' })
export class CheckpointService {
  private readonly base = '/api/checkpoint';

  constructor(private api: ApiService, private auth: AuthService) {}

  createCheckpoint(data: Partial<Checkpoint>): Observable<any> {
    return this.api.post(this.base, data);
  }

  updateCheckpoint(id: string, data: Partial<Checkpoint>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  getUserCheckpoints(): Observable<Checkpoint[]> {
    return this.api.get<Checkpoint[]>(this.base);
  }

  getCheckpointByTrack(trackId: string): Observable<Checkpoint> {
    return this.api.get<Checkpoint>(`${this.base}/track/${trackId}`);
  }

  deleteCheckpoint(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  getTrackProgress(trackId: string): string[] {
    const userId = this.auth.getUser()?._id || 'guest';
    const key = `track-progress-${userId}-${trackId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  saveTrackProgress(trackId: string, levelId: string): void {
    const userId = this.auth.getUser()?._id || 'guest';
    const key = `track-progress-${userId}-${trackId}`;
    const current = this.getTrackProgress(trackId);
    if (!current.includes(levelId)) {
      current.push(levelId);
      localStorage.setItem(key, JSON.stringify(current));
    }
  }

  getLevelProgress(levelId: string, trackId?: string, userIdArg?: string): number[] {
    const userId = userIdArg || this.auth.getUser()?._id || 'guest';
    const key = trackId 
      ? `level-progress-${userId}-${trackId}-${levelId}`
      : `level-progress-${userId}-${levelId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  saveStepToLevelProgress(levelId: string, stepId: number, trackId?: string, userIdArg?: string): void {
    const userId = userIdArg || this.auth.getUser()?._id || 'guest';
    const key = trackId
      ? `level-progress-${userId}-${trackId}-${levelId}`
      : `level-progress-${userId}-${levelId}`;
    const current = this.getLevelProgress(levelId, trackId, userId);
    if (!current.includes(stepId)) {
      current.push(stepId);
      localStorage.setItem(key, JSON.stringify(current));
    }
  }
}
