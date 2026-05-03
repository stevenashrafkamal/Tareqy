import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { AuthService } from './auth.service';
import { Instructor } from '../shared/models/instructor.model';

/**
 * Backend mount: /api/instructors  (instructor.router.js)
 */
@Injectable({ providedIn: 'root' })
export class InstructorService {
  private readonly base = '/api/instructors';

  constructor(private api: ApiService, private auth: AuthService) {}

  instructorSignup(data: { username: string; email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/signup`, data);
  }

  /**
   * ✅ Fixed: replaced bracket-notation hack this.auth['saveSession'] with
   * direct call this.auth.saveSession() — now that saveSession is public.
   */
  instructorLogin(data: { email: string; password: string }): Observable<any> {
    return this.api.post(`${this.base}/login`, data).pipe(
      tap((res: any) => this.auth.saveSession(res, 'instructor'))
    );
  }

  verifyInstructorEmail(otp: string): Observable<any> {
    return this.api.post(`${this.base}/verifyEmail`, { otp });
  }

  getInstructorProfile(): Observable<Instructor> {
    return this.api.get<Instructor>(`${this.base}/profile`);
  }

  updateInstructorProfile(data: Partial<Instructor>): Observable<any> {
    return this.api.put(`${this.base}/profile`, data);
  }

  uploadCV(file: FormData): Observable<any> {
    return this.api.upload(`${this.base}/uploadCV`, file);
  }

  selectTracks(tracks: string[]): Observable<any> {
    return this.api.put(`${this.base}/selectTracks`, { selected_tracks: tracks });
  }

  getInstructorById(id: string): Observable<Instructor> {
    return this.api.get<Instructor>(`${this.base}/${id}`);
  }

  searchInstructors(query: string): Observable<Instructor[]> {
    return this.api.get<Instructor[]>(`${this.base}/search`, { q: query });
  }

  activateInstructor(id: string): Observable<any> {
    return this.api.put(`${this.base}/${id}/activate`, {});
  }

  deactivateInstructor(id: string): Observable<any> {
    return this.api.put(`${this.base}/${id}/deactivate`, {});
  }

  deleteInstructor(): Observable<any> {
    return this.api.delete(`${this.base}/profile`);
  }
}
