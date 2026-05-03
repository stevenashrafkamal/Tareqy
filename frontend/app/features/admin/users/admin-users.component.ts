import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>User Management</h1>
        <button class="btn-add-staff" (click)="openModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Admin / Reviewer
        </button>
      </div>

      <!-- Success/Error banners -->
      <div class="banner success" *ngIf="successMsg()">{{ successMsg() }}</div>
      <div class="banner error"   *ngIf="errorMsg()">{{ errorMsg() }}</div>

      <!-- Users Table -->
      <div class="table-card">
        <div class="loading-row" *ngIf="loading()">Loading users…</div>
        <table class="admin-table" *ngIf="!loading()">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{ user.username }}</td>
              <td class="email-col">{{ user.email }}</td>
              <td><span [class]="'badge role role-' + user.role">{{ user.role }}</span></td>
              <td>
                <span [class]="'badge status status-' + (user.account_status || 'active')">
                  {{ user.account_status || 'active' }}
                </span>
              </td>
              <td class="actions">
                <button class="act delete" (click)="deleteUser(user._id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: text-bottom;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Add Staff Modal ─────────────────────────────────────────────── -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Create Staff Account</h2>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <div class="field">
            <label>Username</label>
            <input type="text" [(ngModel)]="form.username" placeholder="e.g. john_reviewer" class="input" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" placeholder="staff@example.com" class="input" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="form.password" placeholder="Min 8 characters" class="input" />
          </div>
          <div class="field">
            <label>Role</label>
            <select [(ngModel)]="form.role" class="input select">
              <option value="admin">Admin</option>
              <option value="codeReviewer">Code Reviewer</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" (click)="closeModal()">Cancel</button>
          <button class="btn-create" [disabled]="creating()" (click)="createStaff()">
            <span *ngIf="!creating()">Create Account</span>
            <span *ngIf="creating()" class="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; animation: slide-up 0.3s ease; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #D4AF37; }

    .btn-add-staff {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(52,217,210,0.1); border: 1px solid rgba(52,217,210,0.35);
      color: #34D9D2; border-radius: 8px; padding: 0.6rem 1.25rem;
      font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
    }
    .btn-add-staff:hover { background: rgba(52,217,210,0.22); }

    .banner { padding: 0.8rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.88rem; }
    .banner.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); color: #10B981; }
    .banner.error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.35); color: #EF4444; }

    .table-card { background: #0D1321; border: 1px solid rgba(52,217,210,0.12); border-radius: 14px; overflow: hidden; }
    .loading-row { padding: 2rem; text-align: center; color: #5A5A8A; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { background: #111827; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(52,217,210,0.12); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A8A; font-weight: 700; text-align: left; }
    .admin-table td { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.04); color: #C9D1D9; font-size: 0.9rem; }
    .admin-table tbody tr:last-child td { border-bottom: none; }
    .admin-table tbody tr:hover td { background: rgba(52,217,210,0.04); }
    .email-col { color: #5A5A8A !important; }

    .badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; }
    .role-admin, .role-superAdmin { background: rgba(212,175,55,0.12); color: #D4AF37; border: 1px solid rgba(212,175,55,0.3); }
    .role-user { background: rgba(90,90,138,0.15); color: #5A5A8A; border: 1px solid rgba(90,90,138,0.3); }
    .role-codeReviewer { background: rgba(56,189,248,0.12); color: #38BDF8; border: 1px solid rgba(56,189,248,0.3); }
    .status-active { background: rgba(16,185,129,0.12); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
    .status-banned { background: rgba(239,68,68,0.12); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }

    .actions { display: flex; gap: 0.5rem; }
    .act { background: none; border: none; cursor: pointer; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; transition: opacity 0.18s; display: flex; align-items: center; justify-content: center; }
    .act.delete { color: #EF4444; } .act.delete:hover { opacity: 0.7; }
    .act.activate { color: #10B981; } .act.activate:hover { opacity: 0.7; }

    /* ── Modal ─────────────────────────────────────────────────────────── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 600;
      background: rgba(7,11,20,0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 1.5rem;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-box {
      background: #0D1321; border: 1px solid rgba(52,217,210,0.25);
      border-radius: 16px; width: 100%; max-width: 460px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid rgba(52,217,210,0.12); }
    .modal-header h2 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #fff; }
    .close-btn { background: none; border: none; color: #5A5A8A; font-size: 1rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; transition: color 0.18s, background 0.18s; }
    .close-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .modal-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { font-size: 0.82rem; font-weight: 600; color: #8B949E; }
    .input {
      background: #070B14; border: 1px solid rgba(52,217,210,0.2);
      border-radius: 8px; color: #C9D1D9; padding: 0.7rem 1rem;
      font-size: 0.88rem; outline: none; font-family: inherit; transition: border-color 0.18s; width: 100%; box-sizing: border-box;
    }
    .input:focus { border-color: #34D9D2; }
    .select { cursor: pointer; }
    .select option { background: #0D1321; }

    .modal-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding: 1rem 1.5rem 1.5rem; }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #8B949E; border-radius: 8px; padding: 0.7rem; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: background 0.18s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.06); }
    .btn-create { background: rgba(52,217,210,0.15); border: 1px solid rgba(52,217,210,0.4); color: #34D9D2; border-radius: 8px; padding: 0.7rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: background 0.18s; display: flex; align-items: center; justify-content: center; }
    .btn-create:hover:not(:disabled) { background: rgba(52,217,210,0.28); }
    .btn-create:disabled { opacity: 0.55; cursor: not-allowed; }
    .spinner { width: 16px; height: 16px; border: 2.5px solid transparent; border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminUsersComponent implements OnInit {
  users   = signal<User[]>([]);
  loading = signal(true);

  showModal = signal(false);
  creating  = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  form = { username: '', email: '', password: '', role: 'codeReviewer' as 'admin' | 'codeReviewer' };

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (res) => { this.users.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you absolutely sure you want to permanently delete this user?')) return;
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        // Optimistically remove from list without refresh
        this.users.update(users => users.filter(u => u._id !== id));
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Failed to delete user.');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });
  }

  activateUser(id: string) {
    this.adminService.activateUser(id).subscribe(() => this.loadUsers());
  }

  openModal() {
    this.form = { username: '', email: '', password: '', role: 'codeReviewer' };
    this.successMsg.set('');
    this.errorMsg.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  createStaff() {
    const { username, email, password, role } = this.form;
    if (!username.trim() || !email.trim() || !password.trim()) {
      this.errorMsg.set('All fields are required.');
      return;
    }
    this.creating.set(true);
    this.errorMsg.set('');

    this.adminService.createStaff({ username, email, password, role }).subscribe({
      next: (res: any) => {
        this.creating.set(false);
        this.closeModal();
        this.successMsg.set(res.message || 'Staff account created successfully!');
        this.loadUsers();
        setTimeout(() => this.successMsg.set(''), 4000);
      },
      error: (err: any) => {
        this.creating.set(false);
        this.errorMsg.set(err?.error?.message || 'Failed to create staff. Are you a Super Admin?');
      }
    });
  }
}
