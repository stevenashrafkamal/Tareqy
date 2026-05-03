import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-shell">
      <!-- ── Sidebar ───────────────────────────────────────── -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Tareqy Admin</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Website
          </a>
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a routerLink="/admin/users" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Manage Users
          </a>
          <a routerLink="/admin/tracks" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Manage Tracks
          </a>
          <a routerLink="/admin/feedback" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Reviews
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Reports
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="admin-user">
            <div class="admin-avatar">A</div>
            <div class="admin-info">
              <span class="admin-name">Admin</span>
              <span class="admin-role">Administrator</span>
            </div>
          </div>
          <button (click)="logout()" class="btn-logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- ── Main Content ────────────────────────────────── -->
      <main class="admin-main">
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* ── Reset: ensure the admin layout sits on top and fills the viewport,
       completely independent of the main website navbar. ──────────────────── */
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 500;
    }

    .admin-shell {
      display: flex;
      height: 100%;
      width: 100%;
      background: #070B14;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }

    /* ── Sidebar ──────────────────────────────────────────────────────────── */
    .sidebar {
      width: 240px;
      background: #0D1321;
      border-right: 1px solid rgba(52, 217, 210, 0.12);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1.5rem 1.25rem;
      border-bottom: 1px solid rgba(52, 217, 210, 0.12);
      font-size: 1.1rem;
      font-weight: 800;
      color: #D4AF37;
      letter-spacing: 0.02em;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      color: #5A5A8A;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: background 0.18s, color 0.18s;
    }

    .sidebar-nav a:hover {
      background: rgba(52, 217, 210, 0.08);
      color: #C9D1D9;
    }

    .sidebar-nav a.active {
      background: rgba(212, 175, 55, 0.12);
      color: #D4AF37;
      border-left: 3px solid #D4AF37;
    }

    .sidebar-footer {
      padding: 1rem 1.25rem 1.25rem;
      border-top: 1px solid rgba(52, 217, 210, 0.12);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .admin-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .admin-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1D3A5F, #34D9D2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      font-size: 0.95rem;
    }

    .admin-info {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .admin-name { color: #C9D1D9; font-weight: 600; font-size: 0.87rem; }
    .admin-role { color: #5A5A8A; font-size: 0.75rem; }

    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #EF4444;
      border-radius: 8px;
      padding: 0.6rem;
      font-size: 0.83rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s;
    }
    .btn-logout:hover { background: rgba(239, 68, 68, 0.2); }

    /* ── Main ─────────────────────────────────────────────────────────────── */
    .admin-main {
      flex: 1;
      overflow-y: auto;
      background: #070B14;
    }

    .content-area {
      padding: 2rem 2.5rem;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
