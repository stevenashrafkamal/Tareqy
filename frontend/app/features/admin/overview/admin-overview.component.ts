import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <span class="live-badge">● Live Data</span>
      </div>

      <!-- Loading skeleton -->
      <div class="stats-grid" *ngIf="loading()">
        <div class="stat-card skeleton" *ngFor="let i of [1,2,3,4,5]"></div>
      </div>

      <!-- Real Stats -->
      <div class="stats-grid" *ngIf="!loading() && stats()">
        <div class="stat-card">
          <div class="stat-icon users">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-body">
            <h3>Total Users</h3>
            <p class="number">{{ stats()!.totalUsers | number }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon tracks">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div class="stat-body">
            <h3>Active Tracks</h3>
            <p class="number">{{ stats()!.totalTracks | number }}</p>
          </div>
        </div>

        <div class="stat-card highlight">
          <div class="stat-icon reports">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-body">
            <h3>Pending Reports</h3>
            <p class="number">{{ stats()!.pendingReports | number }}</p>
            <span class="trend neg" *ngIf="stats()!.pendingReports > 0">Action required</span>
            <span class="trend pos" *ngIf="stats()!.pendingReports === 0">All clear ✓</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon subs">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div class="stat-body">
            <h3>Pending Submissions</h3>
            <p class="number">{{ stats()!.pendingSubmissions | number }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon reviews">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="stat-body">
            <h3>Total Reviews</h3>
            <p class="number">{{ stats()!.totalReviews | number }}</p>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div class="error-banner" *ngIf="!loading() && error()">
        ⚠️ {{ error() }}
      </div>

      <!-- System Status panel -->
      <div class="status-panel">
        <h2>System Status</h2>
        <div class="status-item">
          <span>Backend Server</span>
          <span class="badge online">Online</span>
        </div>
        <div class="status-item">
          <span>Database</span>
          <span class="badge online">Connected</span>
        </div>
        <div class="status-item">
          <span>Code Reviewer Portal</span>
          <a routerLink="/code-reviewer" class="badge link">Open Portal →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview { display: flex; flex-direction: column; gap: 1.75rem; }

    .page-header { display: flex; align-items: center; gap: 1rem; }
    .page-header h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #D4AF37; }
    .live-badge { font-size: 0.78rem; font-weight: 700; color: #10B981; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 999px; padding: 0.2rem 0.7rem; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }

    .stat-card {
      background: #0D1321;
      border: 1px solid rgba(52,217,210,0.12);
      border-radius: 14px;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover { border-color: rgba(52,217,210,0.3); box-shadow: 0 0 20px rgba(52,217,210,0.06); }
    .stat-card.highlight { border-color: rgba(212,175,55,0.25); }

    .stat-card.skeleton {
      height: 100px;
      background: linear-gradient(90deg, #111827 25%, #1c2a3a 50%, #111827 75%);
      background-size: 200%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon.users    { background: rgba(52,217,210,0.12); color: #34D9D2; }
    .stat-icon.tracks   { background: rgba(212,175,55,0.12); color: #D4AF37; }
    .stat-icon.reports  { background: rgba(239,68,68,0.12);  color: #EF4444; }
    .stat-icon.subs     { background: rgba(56,189,248,0.12); color: #38BDF8; }
    .stat-icon.reviews  { background: rgba(167,139,250,0.12);color: #A78BFA; }

    .stat-body { display: flex; flex-direction: column; gap: 0.25rem; }
    .stat-body h3 { margin: 0; font-size: 0.78rem; color: #5A5A8A; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
    .number { margin: 0.25rem 0 0; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1; }
    .trend { font-size: 0.78rem; font-weight: 600; }
    .pos { color: #10B981; } .neg { color: #EF4444; }

    .error-banner { padding: 1rem 1.25rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #EF4444; border-radius: 10px; font-weight: 600; }

    .status-panel { background: #0D1321; border: 1px solid rgba(52,217,210,0.12); border-radius: 14px; padding: 1.5rem; }
    .status-panel h2 { margin: 0 0 1rem; font-size: 1.05rem; font-weight: 700; color: #C9D1D9; }
    .status-item { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); color: #8B949E; font-size: 0.9rem; }
    .status-item:last-child { border-bottom: none; }
    .badge { padding: 0.25rem 0.7rem; border-radius: 999px; font-size: 0.73rem; font-weight: 700; }
    .online { background: rgba(16,185,129,0.12); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
    .link { background: rgba(52,217,210,0.1); color: #34D9D2; border: 1px solid rgba(52,217,210,0.3); text-decoration: none; cursor: pointer; }
    .link:hover { background: rgba(52,217,210,0.2); }
  `]
})
export class AdminOverviewComponent implements OnInit {
  stats = signal<{ totalUsers: number; totalTracks: number; pendingReports: number; pendingSubmissions: number; totalReviews: number } | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (res) => { this.stats.set(res.data); this.loading.set(false); },
      error: (err) => {
        console.error('[AdminOverview] Failed to load stats:', err);
        this.error.set('Failed to load stats. Check your admin privileges and try again.');
        this.loading.set(false);
      }
    });
  }
}
