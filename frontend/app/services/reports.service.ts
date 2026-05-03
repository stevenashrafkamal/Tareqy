import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Report } from '../shared/models/report.model';

/**
 * Reports service.
 *
 * ⚠️ NOTE: No /api/reports route exists in the current Backend app.js.
 * This service is ready to connect once the backend route is registered.
 *
 * Expected backend mount (to be added): /api/reports
 */
@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly base = '/api/reports';

  constructor(private api: ApiService) {}

  createReport(data: Partial<Report>): Observable<any> {
    return this.api.post(this.base, data);
  }

  getAllReports(): Observable<Report[]> {
    return this.api.get<Report[]>(this.base);
  }

  getReportById(id: string): Observable<Report> {
    return this.api.get<Report>(`${this.base}/${id}`);
  }

  getReportsByTarget(targetType: string, targetId: string): Observable<Report[]> {
    return this.api.get<Report[]>(`${this.base}/target`, { target_type: targetType, target_id: targetId });
  }

  deleteReport(id: string): Observable<any> {
    return this.api.delete(`${this.base}/${id}`);
  }

  resolveReport(id: string): Observable<any> {
    return this.api.put(`${this.base}/${id}/resolve`, {});
  }
}
