import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1>Security & Content Reports</h1>
      </header>

      <div class="table-card">
        <div class="loading-state" *ngIf="loading()">Loading reports...</div>
        
        <table class="admin-table" *ngIf="!loading()">
          <thead>
            <tr>
              <th>Report Details</th>
              <th>Reporter</th>
              <th>Target</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="reports().length === 0">
              <td colspan="5" class="empty-state">System secure — no reports found.</td>
            </tr>
            <tr *ngFor="let report of reports()">
              <td>
                <div class="reason-cell">
                  <strong>{{ report.reason || 'General Report' }}</strong>
                  <span>{{ (report.description | slice:0:50) + (report.description?.length > 50 ? '...' : '') }}</span>
                </div>
              </td>
              <td class="user-col">{{ getUserName(report) }}</td>
              <td><span class="badge target">{{ report.relatedTo || report.target_type }}</span></td>
              <td>
                <span [class]="'badge status ' + (report.status || 'pending')">
                   {{ report.status || 'Pending' }}
                </span>
              </td>
              <td>
                <button class="btn-read" (click)="openModal(report)">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div class="modal-overlay" *ngIf="selectedReport()" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        
        <div class="modal-header">
          <div>
            <h2>Reported: {{ selectedReport()!.reason || 'General Issue' }}</h2>
            <span [class]="'badge modal-status ' + (selectedReport()!.status || 'pending')">
              {{ selectedReport()!.status || 'Pending' }}
            </span>
          </div>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <div class="report-meta">
            <div class="meta-item">
              <strong>Submitted by:</strong> {{ getUserName(selectedReport()) }}
            </div>
            <div class="meta-item">
              <strong>Target Type:</strong> {{ selectedReport()!.relatedTo || selectedReport()!.target_type | uppercase }}
            </div>
            <div class="meta-item">
              <strong>Target ID:</strong> <span class="mono">{{ selectedReport()!.referenceId }}</span>
            </div>
            <div class="meta-item">
              <strong>Date:</strong> {{ selectedReport()!.createdAt | date:'longDate' }}
            </div>
          </div>

          <div class="full-text-area">
            <h3>Detailed Description</h3>
            <div class="text-box">
              {{ selectedReport()!.description || 'No detailed description provided by the reporter.' }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="action-group">
            <button class="btn-resolve" *ngIf="selectedReport()!.status !== 'resolved'" (click)="resolve(selectedReport()!._id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Resolve Report
            </button>
            <button class="btn-dismiss" (click)="deleteReport(selectedReport()!._id)">Dismiss & Delete</button>
          </div>
          <button class="btn-cancel" (click)="closeModal()">Close</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; animation: slide-up 0.4s ease; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #D4AF37; }
    
    .table-card { background: #0D1321; border-radius: 14px; border: 1px solid rgba(52,217,210,0.12); overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .loading-state, .empty-state { padding: 4rem; text-align: center; color: #5A5A8A; font-weight: 500; font-size: 1.1rem; }
    
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { background: #111827; padding: 1.15rem 1.25rem; border-bottom: 2px solid rgba(52,217,210,0.12); font-weight: 700; color: #5A5A8A; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .admin-table td { padding: 1.15rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.04); color: #C9D1D9; transition: background 0.18s; }
    .admin-table tbody tr:hover td { background: rgba(52,217,210,0.04); }
    
    .reason-cell strong { color: #fff; font-size: 0.95rem; display: block; margin-bottom: 0.25rem; }
    .reason-cell span { font-size: 0.85rem; color: #8B949E; }
    .user-col { color: #8B949E; font-weight: 500; font-size: 0.9rem; }
    
    .badge { padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; letter-spacing: 0.05em; }
    .status.pending { background: rgba(239,68,68,0.1); color: #EF4444; border-color: rgba(239,68,68,0.3); }
    .status.resolved { background: rgba(16,185,129,0.1); color: #10B981; border-color: rgba(16,185,129,0.3); }
    .target { background: rgba(56,189,248,0.1); color: #38BDF8; border-color: rgba(56,189,248,0.3); }
    
    .btn-read { background: rgba(52,217,210,0.1); border: 1px solid rgba(52,217,210,0.3); color: #34D9D2; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
    .btn-read:hover { background: rgba(52,217,210,0.22); }

    /* Modal Overlay */
    .modal-overlay { position: fixed; inset: 0; z-index: 600; background: rgba(7,11,20,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.15s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-box { background: #0D1321; border: 1px solid rgba(239,68,68,0.25); border-radius: 16px; width: 100%; max-width: 600px; box-shadow: 0 24px 80px rgba(0,0,0,0.6); animation: slideUp 0.2s ease; display: flex; flex-direction: column; overflow: hidden; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid rgba(52,217,210,0.12); }
    .modal-header h2 { margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 800; color: #fff; line-height: 1.3; }
    .modal-status { display: inline-block; padding: 0.2rem 0.6rem; font-size: 0.75rem; }
    
    .close-btn { background: none; border: none; color: #5A5A8A; font-size: 1.2rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; transition: color 0.18s, background 0.18s; }
    .close-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .modal-body { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .report-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: #070B14; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
    .meta-item { font-size: 0.85rem; color: #C9D1D9; }
    .meta-item strong { color: #8B949E; margin-right: 0.4rem; }
    .mono { font-family: monospace; color: #EF4444; }

    .full-text-area h3 { margin: 0 0 0.75rem 0; font-size: 0.95rem; color: #fff; }
    .text-box { background: #070B14; border: 1px solid rgba(239,68,68,0.15); border-radius: 10px; padding: 1.25rem; font-size: 0.95rem; line-height: 1.6; color: #C9D1D9; max-height: 250px; overflow-y: auto; white-space: pre-wrap; }

    .modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.75rem 1.75rem; }
    .action-group { display: flex; gap: 0.75rem; }
    .btn-resolve { display: flex; align-items: center; gap: 0.5rem; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #10B981; border-radius: 8px; padding: 0.6rem 1.25rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: background 0.18s; }
    .btn-resolve:hover { background: rgba(16,185,129,0.28); }
    .btn-dismiss { background: transparent; border: 1px solid rgba(239,68,68,0.4); color: #EF4444; border-radius: 8px; padding: 0.6rem 1.25rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.18s; }
    .btn-dismiss:hover { background: rgba(239,68,68,0.15); }
    
    .btn-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #C9D1D9; border-radius: 8px; padding: 0.6rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.18s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.1); }
  `]
})
export class AdminReportsComponent implements OnInit {
  reports = signal<any[]>([]);
  loading = signal(true);
  selectedReport = signal<any>(null);

  constructor(private adminService: AdminService, private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading.set(true);
    this.adminService.getReports().subscribe({
      next: (res) => {
        this.reports.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal(report: any) { this.selectedReport.set(report); }
  closeModal() { this.selectedReport.set(null); }

  resolve(id: string) {
    this.adminService.resolveReport(id).subscribe(() => {
      this.closeModal();
      this.loadReports();
    });
  }

  deleteReport(id: string) {
    if(confirm('Dismissing this report deletes it permanently. Proceed?')) {
      this.feedbackService.deleteReport(id).subscribe(() => {
        this.closeModal();
        this.loadReports();
      });
    }
  }

  getUserName(report: any): string {
    if (!report?.user) return 'Anonymous System/User';
    return report.user.username || report.user.email || 'Anonymous';
  }
}
