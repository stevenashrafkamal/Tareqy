import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Task {
  _id: string;
  title: string;
  description: string;
  track_id?: string;
  level_id?: string;
  step_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * TasksService — wraps all /api/tasks endpoints.
 *
 * Backend mount: /api/tasks  (task.router.js)
 *   POST   /api/tasks
 *   GET    /api/tasks
 *   GET    /api/tasks/track/:trackId
 *   GET    /api/tasks/level/:levelId
 *   GET    /api/tasks/step/:stepId
 *   GET    /api/tasks/:id
 *   PUT    /api/tasks/:id
 *   DELETE /api/tasks/:id
 */
@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly base = '/api/tasks';

  constructor(private api: ApiService) {}

  createTask(data: Partial<Task>): Observable<any> {
    return this.api.post(this.base, data);
  }

  getAllTasks(): Observable<Task[]> {
    return this.api.get<Task[]>(this.base);
  }

  getTaskById(id: string): Observable<Task> {
    return this.api.get<Task>(`${this.base}/${id}`);
  }

  getTasksByTrack(trackId: string): Observable<Task[]> {
    return this.api.get<Task[]>(`${this.base}/track/${trackId}`);
  }

  getTasksByLevel(levelId: string): Observable<Task[]> {
    return this.api.get<Task[]>(`${this.base}/level/${levelId}`);
  }

  getTasksByStep(stepId: string): Observable<Task[]> {
    return this.api.get<Task[]>(`${this.base}/step/${stepId}`);
  }

  updateTask(id: string, data: Partial<Task>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }
}
