import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubmissionsService } from '../../../services/submissions.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-code-reviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-reviewer.component.html',
  styleUrl: './code-reviewer.component.css'
})
export class CodeReviewerComponent implements OnInit {

  pendingSubmissions = signal<any[]>([]);
  selectedSubmission = signal<any>(null);
  isLoading          = signal(true);
  isReviewing        = signal(false);
  errorMessage       = signal('');
  successMessage     = signal('');
  reviewNote         = '';

  constructor(
    private submissionsService: SubmissionsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.submissionsService.getPendingSubmissions().subscribe({
      next: (subs) => {
        this.pendingSubmissions.set(subs || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[CodeReviewer] Failed to load submissions:', err);
        this.errorMessage.set('Failed to load pending submissions. Check your connection and try again.');
        this.isLoading.set(false);
      }
    });
  }

  openModal(submission: any): void {
    this.selectedSubmission.set(submission);
    this.reviewNote = '';
  }

  closeModal(): void {
    this.selectedSubmission.set(null);
    this.reviewNote = '';
  }

  review(status: 'accepted' | 'rejected'): void {
    const sub = this.selectedSubmission();
    if (!sub) return;

    this.isReviewing.set(true);

    this.submissionsService.reviewSubmission(sub._id, status, this.reviewNote).subscribe({
      next: () => {
        // Remove from pending list immediately (no refresh needed)
        this.pendingSubmissions.update(list => list.filter(s => s._id !== sub._id));
        this.successMessage.set(`Submission ${status === 'accepted' ? '✅ Accepted' : '❌ Rejected'} successfully.`);
        this.isReviewing.set(false);
        this.closeModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('[CodeReviewer] Review failed:', err);
        this.errorMessage.set('Review action failed. Please try again.');
        this.isReviewing.set(false);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  getStudentName(sub: any): string {
    return sub?.userId?.username || sub?.userId?.email || 'Unknown Student';
  }

  getChallengeName(sub: any): string {
    return sub?.challengeId?.title || sub?.challengeId?.description || 'Unnamed Challenge';
  }

  getSubmittedAt(sub: any): string {
    if (!sub?.createdAt) return '';
    return new Date(sub.createdAt).toLocaleString();
  }
}