import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Track } from '../shared/models/track.model';
import { Level } from '../shared/models/level.model';
import { Resource } from '../shared/models/resource.model';
import { Challenge } from '../shared/models/challenge.model';

/**
 * Backend mount: /api/track  (track.routes.js)
 * Backend response shapes:
 *   GET /          → { tracks: Track[] }
 *   GET /search    → { tracks: Track[] }
 *   GET /:id       → { track: Track }
 *   GET /:id/levels    → { levels: Level[] }
 *   GET /:id/compatible → { compatibleTracks: Track[] }
 */
@Injectable({ providedIn: 'root' })
export class TracksService {
  private readonly base = '/api/track';

  constructor(private api: ApiService) {}

  createTrack(data: Partial<Track>): Observable<any> {
    return this.api.post(this.base, data);
  }

  getAllTracks(): Observable<Track[]> {
    return this.api.get<{ tracks: Track[] }>(this.base).pipe(
      map(res => res.tracks)
    );
  }

  getTrackById(id: string): Observable<Track> {
    return this.api.get<{ track: Track }>(`${this.base}/${id}`).pipe(
      map(res => res.track)
    );
  }

  updateTrack(id: string, data: Partial<Track>): Observable<any> {
    return this.api.put(`${this.base}/${id}`, data);
  }

  deleteTrack(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  searchTracks(query: string, type?: string): Observable<Track[]> {
    const params: Record<string, string> = {};
    if (query) params['title'] = query;
    if (type)  params['type']  = type;
    return this.api.get<{ tracks: Track[] }>(`${this.base}/search`, params).pipe(
      map(res => res.tracks)
    );
  }

  getTrackLevels(trackId: string): Observable<Level[]> {
    return this.api.get<{ levels: Level[] }>(`${this.base}/${trackId}/levels`).pipe(
      map(res => res.levels)
    );
  }

  getCompatibleTracks(trackId: string): Observable<Track[]> {
    return this.api.get<{ compatibleTracks: Track[] }>(`${this.base}/${trackId}/compatible`).pipe(
      map(res => res.compatibleTracks)
    );
  }

  getTrackResources(trackId: string): Observable<Resource[]> {
    return this.api.get<Resource[]>(`${this.base}/${trackId}/resources`);
  }

  getTrackChallenges(trackId: string): Observable<Challenge[]> {
    return this.api.get<Challenge[]>(`${this.base}/${trackId}/challenges`);
  }
}
