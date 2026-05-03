import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../services/feedback.service';
import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1>Platform Reviews</h1>
      </header>

      <div class="loading-state" *ngIf="loading()">Loading reviews...</div>

      <div class="empty-state" *ngIf="!loading() && reviews().length === 0">
        No reviews available to display at this time.
      </div>

      <div class="reviews-grid" *ngIf="!loading() && reviews().length > 0">
        <div class="card" *ngFor="let review of reviews()">
          <div class="card-header">
            <div class="user-block">
              <div class="avatar">{{ getInitials(review) }}</div>
              <div class="user-details">
                <span class="user-name">{{ getUserName(review) }}</span>
                <span class="date">{{ review.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
            <button class="btn-delete" title="Delete Review" (click)="deleteReview(review._id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
          
          <div class="card-body">
            <div class="stars">{{ '⭐'.repeat(review.rating || 5) }}</div>
            <p class="snippet">"{{ (review.comment | slice:0:75) + (review.comment?.length > 75 ? '...' : '') }}"</p>
          </div>

          <div class="card-footer">
            <span class="target">{{ review.relatedTo | uppercase }}</span>
            <button class="btn-read" (click)="openModal(review)">Read Full</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div class="modal-overlay" *ngIf="selectedReview()" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-block">
            <h2>Detailed Review</h2>
            <div class="stars large">{{ '⭐'.repeat(selectedReview()!.rating || 5) }}</div>
          </div>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <div class="review-meta">
            <div class="meta-item">
              <strong>Submitter:</strong> {{ getUserName(selectedReview()) }}
            </div>
            <div class="meta-item">
              <strong>Target Type:</strong> {{ selectedReview()!.relatedTo | uppercase }}
            </div>
            <div class="meta-item">
              <strong>Target ID:</strong> <span class="mono">{{ selectedReview()!.referenceId }}</span>
            </div>
            <div class="meta-item">
              <strong>Date:</strong> {{ selectedReview()!.createdAt | date:'longDate' }}
            </div>
          </div>

          <div class="full-text-area">
            <h3>Review Comment</h3>
            <div class="text-box">
              {{ selectedReview()!.comment || 'No text provided.' }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-delete-full" (click)="deleteReview(selectedReview()!._id); closeModal()">Delete Review</button>
          <button class="btn-close-full" (click)="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; animation: slide-up 0.4s ease; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #D4AF37; }
    
    .loading-state, .empty-state { padding: 4rem; text-align: center; color: #5A5A8A; font-weight: 500; font-size: 1.1rem; }

    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
    .card { background: #0D1321; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(52,217,210,0.12); display: flex; flex-direction: column; gap: 1rem; transition: border-color 0.2s, box-shadow 0.2s; }
    .card:hover { border-color: rgba(52,217,210,0.3); box-shadow: 0 0 20px rgba(52,217,210,0.06); }
    
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .user-block { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1D3A5F, #34D9D2); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 0.9rem; }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
    .date { font-size: 0.75rem; color: #8B949E; }
    
    .btn-delete { background: none; border: none; color: #EF4444; cursor: pointer; opacity: 0.6; transition: opacity 0.2s, transform 0.2s; }
    .btn-delete:hover { opacity: 1; transform: scale(1.1); }
    
    .stars { margin-bottom: 0.4rem; font-size: 1rem; }
    .stars.large { font-size: 1.35rem; letter-spacing: 2px; }
    .snippet { margin: 0; color: #C9D1D9; font-size: 0.9rem; line-height: 1.5; font-style: italic; }
    
    .card-footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; }
    .target { background: rgba(56,189,248,0.1); padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid rgba(56,189,248,0.25); font-weight: 700; font-size: 0.72rem; color: #38BDF8; letter-spacing: 0.05em; }
    .btn-read { background: rgba(52,217,210,0.1); border: 1px solid rgba(52,217,210,0.3); color: #34D9D2; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-read:hover { background: rgba(52,217,210,0.22); }

    /* Modal Overlay aligned with Deep Ocean theme */
    .modal-overlay { position: fixed; inset: 0; z-index: 600; background: rgba(7,11,20,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.15s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-box { background: #0D1321; border: 1px solid rgba(52,217,210,0.25); border-radius: 16px; width: 100%; max-width: 550px; box-shadow: 0 24px 80px rgba(0,0,0,0.6); animation: slideUp 0.2s ease; display: flex; flex-direction: column; overflow: hidden; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid rgba(52,217,210,0.12); }
    .modal-title-block h2 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 800; color: #fff; }
    .close-btn { background: none; border: none; color: #5A5A8A; font-size: 1.2rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; transition: color 0.18s, background 0.18s; }
    .close-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .modal-body { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .review-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: #070B14; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
    .meta-item { font-size: 0.85rem; color: #C9D1D9; }
    .meta-item strong { color: #8B949E; margin-right: 0.4rem; }
    .mono { font-family: monospace; color: #34D9D2; }

    .full-text-area h3 { margin: 0 0 0.75rem 0; font-size: 0.95rem; color: #fff; }
    .text-box { background: #070B14; border: 1px solid rgba(52,217,210,0.15); border-radius: 10px; padding: 1.25rem; font-size: 0.95rem; line-height: 1.6; color: #C9D1D9; max-height: 250px; overflow-y: auto; white-space: pre-wrap; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.75rem 1.75rem; }
    .btn-close-full { background: rgba(52,217,210,0.15); border: 1px solid rgba(52,217,210,0.4); color: #34D9D2; border-radius: 8px; padding: 0.6rem 1.5rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: background 0.18s; }
    .btn-close-full:hover { background: rgba(52,217,210,0.28); }
    .btn-delete-full { background: transparent; border: 1px solid rgba(239,68,68,0.4); color: #EF4444; border-radius: 8px; padding: 0.6rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.18s; }
    .btn-delete-full:hover { background: rgba(239,68,68,0.15); }
  `]
})
export class AdminFeedbackComponent implements OnInit {
  reviews = signal<any[]>([]);
  loading = signal(true);
  selectedReview = signal<any>(null);

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    this.loading.set(true);
    this.feedbackService.getReviews().subscribe({
      next: (res) => {
        this.reviews.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal(review: any) { this.selectedReview.set(review); }
  closeModal() { this.selectedReview.set(null); }

  deleteReview(id: string) {
    if(confirm('Are you certain you want to delete this review?')) {
      this.feedbackService.deleteReview(id).subscribe(() => {
        this.loadFeedback();
      });
    }
  }

  getUserName(review: any): string {
    if (!review?.user) return 'Anonymous';
    return review.user.username || review.user.email || 'Anonymous';
  }

  getInitials(review: any): string {
    const name = this.getUserName(review);
    return name !== 'Anonymous' ? name.charAt(0).toUpperCase() : '?';
  }
}
