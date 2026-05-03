import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Resource } from '../shared/models/resource.model';

/**
 * Resources service.
 *
 * ⚠️ NOTE: No /api/resources route exists in the current Backend app.js.
 * This service is ready to connect once the backend route is registered.
 *
 * Expected backend mount (to be added): /api/resources
 */
@Injectable({ providedIn: 'root' })
export class ResourcesService {
  private readonly base = '/api/resources';

  constructor(private api: ApiService) {}

  createResource(data: Partial<Resource>): Observable<any> {
    return this.api.post(this.base, data);
  }

  getAllResources(): Observable<Resource[]> {
    return this.api.get<Resource[]>(this.base);
  }

  getResourceById(id: string): Observable<Resource> {
    return this.api.get<Resource>(`${this.base}/${id}`);
  }

  getResourcesByTrack(trackId: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(this.base, { track_id: trackId });
  }

  getResourcesByLevel(levelId: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(this.base, { level_id: levelId });
  }

  getResourcesByStep(stepId: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(this.base, { step_id: stepId });
  }

  updateResource(id: string, data: Partial<Resource>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteResource(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  searchResources(query: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(`${this.base}/search`, { q: query });
  }
}
